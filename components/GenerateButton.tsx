import React from 'react';
import { RightArrowIcon, LoaderIcon } from './icons';

interface GenerateButtonProps {
    onClick: () => void;
    isLoading: boolean;
    disabled: boolean;
    label: string;
    loadingLabel?: string;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, isLoading, disabled, label, loadingLabel = "Generating..." }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="flex-grow w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 border-2 border-portal-primary text-lg font-bold rounded-lg text-portal-primary bg-white hover:bg-portal-primary/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-portal-primary transition-colors disabled:border-slate-300 disabled:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed"
        >
            {isLoading ? (
                <>
                    <LoaderIcon className="w-6 h-6 animate-spin" />
                    <span>{loadingLabel}</span>
                </>
            ) : (
                <>
                    <span>{label}</span>
                    <RightArrowIcon className="w-5 h-5" /> 
                </>
            )}
        </button>
    );
}