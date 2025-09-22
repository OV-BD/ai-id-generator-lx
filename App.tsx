
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { KSAForm } from './components/KSAForm';
import { MasteryForm } from './components/MasteryForm';
import { GenerateButton } from './components/GenerateButton';
import { OutputSection } from './components/OutputSection';
import type { KSAInput, MasteryInput, LearningPlan } from './types';
import { MasteryBehaviors, initialMasteryBehaviors } from './constants';
import { generateLearningPlan, generateKsaSuggestions } from './services/geminiService';
import { TrashIcon } from './components/icons';

const App: React.FC = () => {
    const [ksa, setKsa] = useState<KSAInput>({ task: '', knowledge: '', skills: '', abilities: '' });
    const [mastery, setMastery] = useState<MasteryInput>({ behaviors: initialMasteryBehaviors, custom: '' });
    const [learningPlan, setLearningPlan] = useState<LearningPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [suggestedFields, setSuggestedFields] = useState({ knowledge: false, skills: false, abilities: false });
    const [debouncedTask, setDebouncedTask] = useState(ksa.task);

    const handleKsaChange = (field: keyof KSAInput, value: string) => {
        if (field === 'task') {
            // When the main task changes, clear previous KSA details to allow for new suggestions.
            setKsa({
                task: value,
                knowledge: '',
                skills: '',
                abilities: '',
            });
            // Also reset which fields were marked as 'suggested'.
            setSuggestedFields({ knowledge: false, skills: false, abilities: false });
        } else {
            // For other fields, just update the value and mark it as user-edited (not suggested).
            setKsa(prev => ({ ...prev, [field]: value }));
            if (field in suggestedFields) {
                setSuggestedFields(prev => ({ ...prev, [field as keyof typeof suggestedFields]: false }));
            }
        }
    };
    
    const handleClearAll = () => {
        setKsa({ task: '', knowledge: '', skills: '', abilities: '' });
        setMastery({ behaviors: initialMasteryBehaviors, custom: '' });
        setLearningPlan(null);
        setError(null);
        setSuggestedFields({ knowledge: false, skills: false, abilities: false });
    };

    const handleMasteryChange = (updates: Partial<MasteryInput>) => {
        setMastery(prev => ({ ...prev, ...updates }));
    };

    const handleGeneratePlan = async () => {
        setIsLoading(true);
        setError(null);
        setLearningPlan(null);

        try {
            const plan = await generateLearningPlan(ksa, mastery);
            setLearningPlan(plan);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedTask(ksa.task);
        }, 500); // 500ms debounce delay

        return () => {
            clearTimeout(handler);
        };
    }, [ksa.task]);

    const getSuggestions = useCallback(async () => {
        if (!debouncedTask.trim()) return;

        const fieldsToSuggest: Array<'knowledge' | 'skills' | 'abilities'> = [];
        if (!ksa.knowledge.trim()) fieldsToSuggest.push('knowledge');
        if (!ksa.skills.trim()) fieldsToSuggest.push('skills');
        if (!ksa.abilities.trim()) fieldsToSuggest.push('abilities');

        if (fieldsToSuggest.length === 0) return;

        try {
            const suggestions = await generateKsaSuggestions(debouncedTask, fieldsToSuggest);
            
            const ksaUpdates: Partial<KSAInput> = {};
            const suggestedFieldsUpdates = { ...suggestedFields };
            
            if (suggestions.knowledge && !ksa.knowledge.trim()) {
                ksaUpdates.knowledge = suggestions.knowledge;
                suggestedFieldsUpdates.knowledge = true;
            }
            if (suggestions.skills && !ksa.skills.trim()) {
                ksaUpdates.skills = suggestions.skills;
                suggestedFieldsUpdates.skills = true;
            }
            if (suggestions.abilities && !ksa.abilities.trim()) {
                ksaUpdates.abilities = suggestions.abilities;
                suggestedFieldsUpdates.abilities = true;
            }

            if (Object.keys(ksaUpdates).length > 0) {
              setKsa(prev => ({ ...prev, ...ksaUpdates }));
              setSuggestedFields(suggestedFieldsUpdates);
            }
        } catch (err) {
            console.error("Failed to fetch KSA suggestions:", err);
        }
    }, [debouncedTask, ksa.knowledge, ksa.skills, ksa.abilities, suggestedFields]);

    useEffect(() => {
        getSuggestions();
    }, [debouncedTask, getSuggestions]);

    const isGenerateDisabled = !ksa.task.trim() || !ksa.knowledge.trim() || !ksa.skills.trim() || !ksa.abilities.trim() || isLoading;
    const isClearable = ksa.task.trim() || ksa.knowledge.trim() || ksa.skills.trim() || ksa.abilities.trim() || mastery.custom.trim() || Object.values(mastery.behaviors).some(v => v);


    return (
        <div className="bg-portal-background min-h-screen font-sans text-portal-text">
            <main className="max-w-5xl mx-auto py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
                <Header />

                <div className="mt-12 space-y-8">
                    <KSAForm ksa={ksa} onChange={handleKsaChange} suggestedFields={suggestedFields} />
                    <MasteryForm mastery={mastery} onChange={handleMasteryChange} behaviorsList={MasteryBehaviors} />
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                    <GenerateButton
                        onClick={handleGeneratePlan}
                        isLoading={isLoading}
                        disabled={isGenerateDisabled}
                        label="Generate Plan"
                        loadingLabel="Designing Plan..."
                    />
                    {isClearable && (
                         <button
                            type="button"
                            onClick={handleClearAll}
                            className="flex items-center justify-center gap-2 text-sm font-medium text-portal-text hover:text-portal-dark transition-colors whitespace-nowrap px-4 py-2 rounded-lg border border-portal-border hover:bg-slate-100"
                            aria-label="Clear all fields"
                        >
                            <TrashIcon className="w-5 h-5" />
                            <span>Clear All</span>
                        </button>
                    )}
                </div>

                {error && (
                    <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {learningPlan && !isLoading && (
                    <div className="mt-12">
                         <h2 className="text-3xl font-bold text-portal-dark tracking-tight text-center mb-8">Your Custom Learning Plan</h2>
                        <OutputSection learningPlan={learningPlan} masteryInput={mastery} />
                    </div>
                )}
            </main>
             <footer className="text-center py-6">
                <p className="text-sm text-portal-subtle">Powered by Gemini</p>
            </footer>
        </div>
    );
};

export default App;
