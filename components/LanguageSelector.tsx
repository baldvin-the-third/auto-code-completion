
import React from 'react';
import type { Language } from '../types';

interface LanguageSelectorProps {
    languages: Language[];
    selectedLanguage: Language;
    onLanguageChange: (identifier: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ languages, selectedLanguage, onLanguageChange }) => {
    return (
        <select
            value={selectedLanguage.identifier}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
            {languages.map((lang) => (
                <option key={lang.identifier} value={lang.identifier}>
                    {lang.name}
                </option>
            ))}
        </select>
    );
};
