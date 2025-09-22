
import { GoogleGenAI, Type } from '@google/genai';
import type { KSAInput, MasteryInput, LearningPlan } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    masteryStandard: {
      type: Type.STRING,
      description: "A summary of the selected and custom mastery behaviors, written as a cohesive standard."
    },
    learningObjective: {
      type: Type.STRING,
      description: "A formal learning objective following the 'Performance, Condition, Criterion' model."
    },
    learningPath: {
      type: Type.OBJECT,
      properties: {
        phase1: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            activities: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        },
        phase2: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            activities: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        },
        phase3: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            activities: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    }
  }
};


const buildPrompt = (ksa: KSAInput, mastery: MasteryInput): string => {
  const selectedBehaviors = Object.entries(mastery.behaviors)
    .filter(([, isSelected]) => isSelected)
    .map(([behavior]) => behavior)
    .join(', ');

  const customBehavior = mastery.custom ? ` and exhibit the following: ${mastery.custom}` : '';

  return `
    As an expert instructional designer, create a learning plan based on the following inputs.

    **Task Details (KSA Framework):**
    - **Task:** ${ksa.task}
    - **Knowledge (The 'Why'):** ${ksa.knowledge}
    - **Skills (The 'How-To'):** ${ksa.skills}
    - **Abilities (Performance Standard):** ${ksa.abilities}

    **Desired Mastery Standard:**
    - A masterful employee will demonstrate: ${selectedBehaviors}${customBehavior}.

    **Instructions:**
    1.  **Mastery Standard:** Based on the desired mastery behaviors, synthesize them into a concise, well-written paragraph describing the ideal performance standard.
    2.  **Learning Objective:** Generate a single, formal learning objective using the "Performance, Condition, Criterion" model.
        - **Performance:** The task itself.
        - **Condition:** The context, tools, and circumstances (derived from 'Skills').
        - **Criterion:** The standard for success (derived from 'Abilities' and 'Knowledge').
    3.  **Learning Path:** Generate a three-phase blended learning plan.
        - **Phase 1 (Foundational Knowledge):** Suggest 3-4 activities targeting the 'Knowledge' component. Examples: eLearning, reading docs, watching videos.
        - **Phase 2 (Procedural Skills):** Suggest 3-4 activities targeting the 'Skills' component. Examples: Demo videos, simulations, workshops.
        - **Phase 3 (Integrated Application & Mastery):** Suggest 3-4 activities targeting the 'Abilities' component to help the learner apply their knowledge and skills to meet the performance standard. Examples: Scenario-based practice, assessments, mentoring.

    Provide the output in the specified JSON format.
  `;
};

export const generateLearningPlan = async (ksa: KSAInput, mastery: MasteryInput): Promise<LearningPlan> => {
  const prompt = buildPrompt(ksa, mastery);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as LearningPlan;

  } catch (error) {
    console.error("Error generating learning plan from Gemini:", error);
    throw new Error("Failed to parse or receive response from AI model.");
  }
};

const suggestionSchema = {
    type: Type.OBJECT,
    properties: {
      knowledge: { type: Type.STRING, description: "A concise suggestion for the 'Knowledge' (the 'why') component. Should be a single, well-formed phrase or sentence." },
      skills: { type: Type.STRING, description: "A concise suggestion for the 'Skills' (the 'how-to') component. Should be a single, well-formed phrase or sentence." },
      abilities: { type: Type.STRING, description: "A concise suggestion for the 'Abilities' (performance standard) component. Should be a single, well-formed phrase or sentence." },
    },
};

const buildSuggestionPrompt = (task: string, fieldsToSuggest: Array<'knowledge' | 'skills' | 'abilities'>): string => {
    return `
      As an expert instructional designer, your task is to brainstorm the components of a job task using the KSA (Knowledge, Skills, Abilities) framework.

      **Task:** ${task}

      Based on this task, provide a single, concise, and highly relevant suggestion for each of the following empty components. Your suggestions should be phrased as if a user is filling out a form.

      **Components to Suggest:**
      ${fieldsToSuggest.map(f => `- ${f.charAt(0).toUpperCase() + f.slice(1)}`).join('\n')}

      **Instructions:**
      - For **Knowledge**, suggest the conceptual information needed (policies, rules, the "why").
      - For **Skills**, suggest a key step-by-step, observable action (the "how-to").
      - For **Abilities**, suggest a measurable criterion for success (speed, accuracy, quality).

      Provide ONLY the suggestions for the requested components in the specified JSON format. Do not provide suggestions for components that were not requested.
    `;
};

export const generateKsaSuggestions = async (task: string, fieldsToSuggest: Array<'knowledge' | 'skills' | 'abilities'>): Promise<Partial<KSAInput>> => {
    if (fieldsToSuggest.length === 0) {
        return {};
    }

    const prompt = buildSuggestionPrompt(task, fieldsToSuggest);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: suggestionSchema,
                temperature: 0.6,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Partial<KSAInput>;

    } catch (error) {
        console.error("Error generating KSA suggestions from Gemini:", error);
        throw new Error("Failed to parse or receive suggestion response from AI model.");
    }
};
