import React from 'react';
import type { Language } from '../types';
import { LanguageSelector } from './LanguageSelector';
import { PlayIcon } from './icons/PlayIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { SUPPORTED_LANGUAGES } from '../constants';

interface HeaderProps {
    language: Language;
    onLanguageChange: (identifier: string) => void;
    onRun: () => void;
    isExecuting: boolean;
}

export const Header: React.FC<HeaderProps> = ({ language, onLanguageChange, onRun, isExecuting }) => {
    return (
        <header className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700 shadow-md">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-cyan-400">Intelligent Code Editor</h1>
            </div>
            <div className="flex items-center gap-4">
                <LanguageSelector 
                    languages={SUPPORTED_LANGUAGES}
                    selectedLanguage={language}
                    onLanguageChange={onLanguageChange}
                />
                <button 
                    onClick={onRun}
                    disabled={isExecuting}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {isExecuting ? <SpinnerIcon /> : <PlayIcon />}
                    {isExecuting ? 'Running...' : 'Run'}
                </button>
            </div>
        </header>
    );
};