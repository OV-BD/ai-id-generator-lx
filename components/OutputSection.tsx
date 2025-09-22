import React from 'react';
import type { LearningPlan, MasteryInput, LearningPhase } from '../types';
import { TargetIcon, PathIcon, CheckCircleIcon, BookIcon, SkillIcon, MasteryIcon } from './icons';

interface OutputCardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const OutputCard: React.FC<OutputCardProps> = ({ title, icon, children }) => (
    <div className="bg-portal-surface p-6 rounded-xl border border-portal-border shadow-sm h-full">
        <div className="flex items-center gap-3">
            {icon}
            <h3 className="text-xl font-bold text-portal-dark">{title}</h3>
        </div>
        <div className="mt-4 text-portal-text space-y-2">
            {children}
        </div>
    </div>
);

interface LearningPathCardProps {
    phase: LearningPhase;
    phaseNumber: number;
    icon: React.ReactNode;
}

const LearningPathPhaseCard: React.FC<LearningPathCardProps> = ({ phase, phaseNumber, icon }) => (
    <div>
        <div className="flex items-center gap-3">
            {icon}
            <h4 className="text-lg font-semibold text-portal-dark">{`Phase ${phaseNumber}: ${phase.title}`}</h4>
        </div>
        <p className="mt-1 ml-9 text-sm">{phase.description}</p>
        <ul className="mt-3 ml-9 list-disc list-inside space-y-1 text-sm">
            {phase.activities.map((activity, index) => (
                <li key={index}>{activity}</li>
            ))}
        </ul>
    </div>
);


export const OutputSection: React.FC<{ learningPlan: LearningPlan; masteryInput: MasteryInput; }> = ({ learningPlan, masteryInput }) => {
    
    const selectedBehaviors = Object.entries(masteryInput.behaviors)
        .filter(([, isSelected]) => isSelected)
        .map(([behavior]) => behavior);

    return (
        <div className="space-y-8">
            <OutputCard title="Mastery Standard" icon={<CheckCircleIcon className="w-7 h-7 text-portal-success" />}>
                <p className='text-base text-portal-dark'>{learningPlan.masteryStandard}</p>
            </OutputCard>

            <OutputCard title="Learning Objective" icon={<TargetIcon className="w-7 h-7 text-portal-primary" />}>
                <p className="text-base text-portal-dark font-medium italic">"{learningPlan.learningObjective}"</p>
            </OutputCard>

            <OutputCard title="Recommended Learning Path" icon={<PathIcon className="w-7 h-7 text-portal-primary" />}>
                <div className="space-y-6">
                    <LearningPathPhaseCard phase={learningPlan.learningPath.phase1} phaseNumber={1} icon={<BookIcon className="w-6 h-6 text-portal-primary" />} />
                    <LearningPathPhaseCard phase={learningPlan.learningPath.phase2} phaseNumber={2} icon={<SkillIcon className="w-6 h-6 text-portal-primary" />} />
                    <LearningPathPhaseCard phase={learningPlan.learningPath.phase3} phaseNumber={3} icon={<MasteryIcon className="w-6 h-6 text-portal-primary" />} />
                </div>
            </OutputCard>
        </div>
    );
};