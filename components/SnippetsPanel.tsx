import React from 'react';
import { SNIPPETS } from '../constants/snippets';
import { PanelLeftCloseIcon } from './icons/PanelLeftCloseIcon';
import { PanelLeftOpenIcon } from './icons/PanelLeftOpenIcon';


interface SnippetsPanelProps {
    languageIdentifier: string;
    onInsertSnippet: (code: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const SnippetsPanel: React.FC<SnippetsPanelProps> = ({ languageIdentifier, onInsertSnippet, isOpen, setIsOpen }) => {
    const snippetsForLanguage = SNIPPETS[languageIdentifier] || [];

    return (
        <div className={`flex flex-col bg-gray-800 rounded-lg shadow-lg h-full overflow-hidden transition-all duration-300 ${isOpen ? 'w-64' : 'w-14'}`}>
            <div className={`flex items-center p-3 border-b border-gray-700 ${isOpen ? 'justify-between' : 'justify-center'}`}>
                {isOpen && <h2 className="text-lg font-semibold text-gray-300">Snippets</h2>}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-1 text-gray-400 hover:bg-gray-700 rounded-md"
                    title={isOpen ? "Close Snippets" : "Open Snippets"}
                >
                    {isOpen ? <PanelLeftCloseIcon className="h-5 w-5" /> : <PanelLeftOpenIcon className="h-5 w-5" />}
                </button>
            </div>
            <div className="flex-1 p-2 overflow-auto">
                {isOpen && (
                    <>
                        {snippetsForLanguage.length > 0 ? (
                            <ul className="space-y-1">
                                {snippetsForLanguage.map((snippet) => (
                                    <li key={snippet.title}>
                                        <button
                                            onClick={() => onInsertSnippet(snippet.code)}
                                            className="w-full text-left px-3 py-2 text-sm text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
                                        >
                                            {snippet.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center text-sm text-gray-500 p-4">
                                No snippets for this language.
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};