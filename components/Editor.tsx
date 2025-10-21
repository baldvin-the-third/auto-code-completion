import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { SuggestionPopover } from './SuggestionPopover';

interface EditorProps {
    code: string;
    onCodeChange: (code: string) => void;
    suggestions: string[];
    onAcceptSuggestion: (suggestion: string) => void;
    onDismissSuggestions: () => void;
    language: string;
    onRequestSuggestion: () => void;
}

const sharedEditorStyles: React.CSSProperties = {
    fontFamily: '"Fira Code", "Dank Mono", "Operator Mono", monospace',
    fontSize: '16px',
    lineHeight: '1.5',
    padding: '16px',
    whiteSpace: 'pre',
    wordWrap: 'normal',
    overflowWrap: 'normal',
    boxSizing: 'border-box', 
    border: 'none',
    outline: 'none',
};

export const Editor = forwardRef<HTMLTextAreaElement, EditorProps>(({ 
    code, 
    onCodeChange, 
    suggestions, 
    onAcceptSuggestion,
    onDismissSuggestions,
    onRequestSuggestion 
}, ref) => {
    const localTextareaRef = useRef<HTMLTextAreaElement>(null);
    const mirrorRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => localTextareaRef.current as HTMLTextAreaElement);

    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number } | null>(null);
    const showSuggestions = suggestions.length > 0;

    useEffect(() => {
        setActiveSuggestionIndex(0);
    }, [suggestions]);

    useEffect(() => {
        if (showSuggestions && localTextareaRef.current && mirrorRef.current) {
            const textarea = localTextareaRef.current;
            const mirror = mirrorRef.current;
            const style = window.getComputedStyle(textarea);

            mirror.style.width = style.width;
            mirror.style.font = style.font;
            mirror.style.letterSpacing = style.letterSpacing;
            mirror.style.padding = style.padding;
            
            const textUpToCursor = textarea.value.substring(0, textarea.selectionStart);
            mirror.textContent = textUpToCursor;

            const span = document.createElement('span');
            mirror.appendChild(span);

            const top = span.offsetTop - textarea.scrollTop;
            const left = span.offsetLeft - textarea.scrollLeft;
            
            const lh = parseFloat(style.lineHeight) || 24;
            setPopoverPosition({ top: top + lh, left: left });
            
            mirror.textContent = '';
        } else {
            setPopoverPosition(null);
        }
    }, [showSuggestions, code, suggestions]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const popover = document.getElementById('suggestion-popover');
            if (showSuggestions && !popover?.contains(event.target as Node)) {
                onDismissSuggestions();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showSuggestions, onDismissSuggestions]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const currentSuggestion = suggestions[activeSuggestionIndex];
        
        if (showSuggestions && currentSuggestion) {
            if (e.key === 'Tab') {
                e.preventDefault();
                onAcceptSuggestion(currentSuggestion);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveSuggestionIndex(prev => (prev + 1) % suggestions.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                onAcceptSuggestion(currentSuggestion);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onDismissSuggestions();
            }
        }
        
        if (e.ctrlKey && e.key === ' ') {
            e.preventDefault();
            onRequestSuggestion();
        }
    };

    const renderGhostText = () => {
        if (!showSuggestions || !localTextareaRef.current) return null;

        const currentSuggestion = suggestions[activeSuggestionIndex];
        if (!currentSuggestion) return null;

        const cursorPosition = localTextareaRef.current.selectionStart;
        const codeBeforeCursor = code.substring(0, cursorPosition);
        
        const lastWordMatch = codeBeforeCursor.match(/\b\w*$/);
        const replacementStart = lastWordMatch ? lastWordMatch.index! : cursorPosition;
        
        const codeBeforeTrigger = code.substring(0, replacementStart);
        const ghostContent = codeBeforeTrigger + currentSuggestion;

        return (
            <pre
                aria-hidden="true"
                className="absolute pointer-events-none"
                style={{
                    ...sharedEditorStyles,
                    top: 0,
                    left: 0,
                    zIndex: -1,
                    color: 'rgba(107, 114, 128, 0.5)',
                    overflow: 'hidden', // Prevent ghost text from wrapping weirdly
                }}
            >{ghostContent}</pre>
        );
    };

    return (
        <div className="relative w-full h-full">
            <div
                ref={mirrorRef}
                style={{
                    position: 'absolute',
                    whiteSpace: 'pre-wrap',
                    visibility: 'hidden',
                    pointerEvents: 'none',
                }}
            />
            <textarea
                ref={localTextareaRef}
                value={code}
                onChange={(e) => onCodeChange(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck="false"
                className="absolute inset-0 w-full h-full resize-none bg-transparent text-gray-200 caret-cyan-400 border-none outline-none overflow-auto"
                style={sharedEditorStyles}
            />
            {renderGhostText()}
            {showSuggestions && popoverPosition && (
                 <div id="suggestion-popover">
                    <SuggestionPopover
                        suggestions={suggestions}
                        activeSuggestionIndex={activeSuggestionIndex}
                        position={popoverPosition}
                        onSuggestionClick={(index) => onAcceptSuggestion(suggestions[index])}
                        onHover={(index) => setActiveSuggestionIndex(index)}
                    />
                 </div>
            )}
        </div>
    );
});