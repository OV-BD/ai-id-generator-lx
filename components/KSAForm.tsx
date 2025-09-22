import React from 'react';
import type { KSAInput } from '../types';
import { InfoIcon } from './icons';

interface KSAFormProps {
  ksa: KSAInput;
  onChange: (field: keyof KSAInput, value: string) => void;
  suggestedFields: {
      knowledge: boolean;
      skills: boolean;
      abilities: boolean;
  };
}

interface FormFieldProps {
  id: keyof KSAInput;
  label: string;
  placeholder: string;
  tooltip: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isSuggested: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ id, label, placeholder, tooltip, value, onChange, isSuggested }) => (
  <div>
    <label htmlFor={id} className="flex items-center text-lg font-semibold text-portal-dark mb-2">
      {label}
      <div className="relative group ml-2">
        <InfoIcon className="w-5 h-5 text-portal-subtle cursor-help" />
        <div className="absolute bottom-full mb-2 w-64 bg-gray-800 text-white text-sm rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
          {tooltip}
        </div>
      </div>
    </label>
    <textarea
      id={id}
      name={id}
      rows={3}
      className={`w-full px-4 py-3 border border-portal-border rounded-lg shadow-sm focus:ring-2 focus:ring-portal-primary/50 focus:border-portal-primary transition-colors duration-200 ${isSuggested ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

export const KSAForm: React.FC<KSAFormProps> = ({ ksa, onChange, suggestedFields }) => {
  return (
    <div className="bg-portal-surface p-6 rounded-xl border border-portal-border shadow-sm space-y-6">
       <h2 className="text-2xl font-bold text-portal-dark">1. Deconstruct the Task (KSA)</h2>
      <FormField
        id="task"
        label="Task or Assignment"
        placeholder="e.g., Process a customer return in the POS system"
        tooltip="What is the specific job task the employee needs to perform?"
        value={ksa.task}
        onChange={(e) => onChange('task', e.target.value)}
        isSuggested={false}
      />
      <FormField
        id="knowledge"
        label="Knowledge (The 'Why')"
        placeholder="e.g., The company's official return policy, refund rules"
        tooltip="What conceptual information, policies, or principles are needed?"
        value={ksa.knowledge}
        onChange={(e) => onChange('knowledge', e.target.value)}
        isSuggested={suggestedFields.knowledge}
      />
      <FormField
        id="skills"
        label="Skills (The 'How-To')"
        placeholder="e.g., Step-by-step navigation in the POS software"
        tooltip="What are the step-by-step, observable actions required to do the task?"
        value={ksa.skills}
        onChange={(e) => onChange('skills', e.target.value)}
        isSuggested={suggestedFields.skills}
      />
      <FormField
        id="abilities"
        label="Abilities (Performance Standard)"
        placeholder="e.g., Must be completed in under 3 minutes with 100% accuracy"
        tooltip="What criteria define successful performance? (speed, accuracy, quality)"
        value={ksa.abilities}
        onChange={(e) => onChange('abilities', e.target.value)}
        isSuggested={suggestedFields.abilities}
      />
    </div>
  );
};