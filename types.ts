
export interface KSAInput {
  task: string;
  knowledge: string;
  skills: string;
  abilities: string;
}

export interface MasteryInput {
  behaviors: Record<string, boolean>;
  custom: string;
}

export interface LearningPhase {
  title: string;
  description: string;
  activities: string[];
}

export interface LearningPlan {
  masteryStandard: string;
  learningObjective: string;
  learningPath: {
    phase1: LearningPhase;
    phase2: LearningPhase;
    phase3: LearningPhase;
  };
}
