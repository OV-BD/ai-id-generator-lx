import React from 'react';
import type { MasteryInput } from '../types';

interface MasteryFormProps {
  mastery: MasteryInput;
  onChange: (updates: Partial<MasteryInput>) => void;
  behaviorsList: string[];
}

export const MasteryForm: React.FC<MasteryFormProps> = ({ mastery, onChange, behaviorsList }) => {
  
  const handleCheckboxChange = (behavior: string) => {
    const updatedBehaviors = {
      ...mastery.behaviors,
      [behavior]: !mastery.behaviors[behavior],
    };
    onChange({ behaviors: updatedBehaviors });
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ custom: e.target.value });
  };

  return (
    <div className="bg-portal-surface p-6 rounded-xl border border-portal-border shadow-sm space-y-4">
      <h2 className="text-2xl font-bold text-portal-dark">2. Define Mastery</h2>
      <div>
        <label className="text-lg font-semibold text-portal-dark">Select Observable Behaviors</label>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {behaviorsList.map((behavior) => (
            <div key={behavior} className="flex items-center">
              <input
                id={behavior}
                name={behavior}
                type="checkbox"
                checked={mastery.behaviors[behavior] || false}
                onChange={() => handleCheckboxChange(behavior)}
                className="h-4 w-4 rounded border-gray-300 text-portal-primary focus:ring-portal-primary"
              />
              <label htmlFor={behavior} className="ml-2 block text-sm font-medium text-portal-text">
                {behavior}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="custom-mastery" className="text-lg font-semibold text-portal-dark">
          Other/Custom Mastery Behaviors
        </label>
        <textarea
          id="custom-mastery"
          name="custom-mastery"
          rows={2}
          className="mt-2 w-full px-4 py-3 border border-portal-border rounded-lg shadow-sm focus:ring-2 focus:ring-portal-primary/50 focus:border-portal-primary transition-colors duration-200 bg-white"
          placeholder="e.g., Proactively suggests alternative solutions"
          value={mastery.custom}
          onChange={handleCustomChange}
        />
      </div>
    </div>
  );
};