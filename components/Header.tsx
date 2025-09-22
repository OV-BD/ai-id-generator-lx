// Fix: Replaced placeholder text with a valid React component for the header, which resolves multiple import and syntax errors.
import React from 'react';
import { SparklesIcon } from './icons';

export const Header: React.FC = () => {
    return (
        <header className="text-center">
            <div className="inline-flex items-center gap-3 bg-portal-primary/10 text-portal-primary font-semibold px-4 py-2 rounded-full">
                <SparklesIcon className="w-5 h-5" />
                <span>AI-Powered Instructional Design</span>
            </div>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-portal-dark tracking-tight">
                Learning Plan Generator
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-portal-text">
                Quickly design effective learning plans for any job task. Just define the task using the KSA framework, specify mastery criteria, and let AI build a structured plan.
            </p>
        </header>
    );
};
