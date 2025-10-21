import React from 'react';

interface SuggestionPopoverProps {
    suggestions: string[];
    activeSuggestionIndex: number;
    position: { top: number; left: number };
    onSuggestionClick: (index: number) => void;
    onHover: (index: number) => void;
}

export const SuggestionPopover: React.FC<SuggestionPopoverProps> = ({ 
    suggestions, 
    activeSuggestionIndex, 
    position, 
    onSuggestionClick,
    onHover
}) => {
    return (
        <div
            className="absolute z-10 w-max max-w-md bg-gray-700 border border-gray-600 rounded-md shadow-lg py-1"
            style={{ top: position.top, left: position.left }}
        >
            <ul className="max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                    <li key={index}>
                        <button
                            onClick={() => onSuggestionClick(index)}
                            onMouseMove={() => onHover(index)}
                            className={`w-full text-left px-3 py-1.5 text-sm whitespace-pre-wrap ${
                                index === activeSuggestionIndex 
                                ? 'bg-cyan-600 text-white' 
                                : 'text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {suggestion}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
