import React, { useState, useEffect, useRef } from 'react';
import { Editor } from './components/Editor';
import { Header } from './components/Header';
import { OutputPanel } from './components/OutputPanel';
import { ChatPanel } from './components/ChatPanel';
import { getSuggestion } from './services/geminiService';
import { executeCode } from './services/compilerService';
import { SUPPORTED_LANGUAGES } from './constants';
import type { Language, ExecutionOutput, ChatMessage } from './types';
import { SnippetsPanel } from './components/SnippetsPanel';
import { GoogleGenAI, Chat } from '@google/genai';
import { TerminalIcon } from './components/icons/TerminalIcon';
import { MessageSquareIcon } from './components/icons/MessageSquareIcon';
import { useDebounce } from './hooks/useDebounce';

const App: React.FC = () => {
    const [code, setCode] = useState<string>(SUPPORTED_LANGUAGES[0].initialCode);
    const [language, setLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoadingSuggestion, setIsLoadingSuggestion] = useState<boolean>(false);
    
    const [output, setOutput] = useState<ExecutionOutput | null>(null);
    const [isExecuting, setIsExecuting] = useState<boolean>(false);

    const [isSnippetsOpen, setIsSnippetsOpen] = useState<boolean>(true);
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const debouncedCode = useDebounce(code, 500);

    const [activeTab, setActiveTab] = useState<'output' | 'chat'>('output');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
    const chatRef = useRef<Chat | null>(null);

     useEffect(() => {
        if (process.env.API_KEY) {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                history: [],
            });
            setChatHistory([{ role: 'model', text: 'Hello! How can I help you with your code today?' }]);
        } else {
            setChatHistory([{ role: 'model', text: 'API key is not configured. Chat is disabled.' }]);
        }
    }, []);

    const handleLanguageChange = (langIdentifier: string) => {
        const newLang = SUPPORTED_LANGUAGES.find(l => l.identifier === langIdentifier);
        if (newLang) {
            setLanguage(newLang);
            setCode(newLang.initialCode);
            setOutput(null);
            setSuggestions([]);
        }
    };

    const handleRunCode = async () => {
        setIsExecuting(true);
        setOutput(null);
        setSuggestions([]);
        setActiveTab('output');
        try {
            const result = await executeCode(code, language.pistonIdentifier, language.pistonVersion);
            setOutput(result);
        } catch (error) {
            console.error("Execution failed:", error);
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
            setOutput({ stdout: '', stderr: `Failed to execute code. ${errorMessage}` });
        } finally {
            setIsExecuting(false);
        }
    };

    const handleRequestSuggestion = async () => {
        const editor = editorRef.current;
        if (!editor || !editor.value.trim()) {
            setSuggestions([]);
            return;
        }

        setIsLoadingSuggestion(true);
        try {
            const codeToSuggest = editor.value.substring(0, editor.selectionStart);
            const newSuggestions = await getSuggestion(codeToSuggest, language.identifier);
            setSuggestions(newSuggestions);
        } catch (error)
        {
            console.error("Failed to fetch suggestion:", error);
            setSuggestions([]);
        } finally
        {
            setIsLoadingSuggestion(false);
        }
    };
    
    const handleAcceptSuggestion = (suggestionToAccept: string) => {
        const editor = editorRef.current;
        if (!editor) return;

        const cursorPosition = editor.selectionStart;
        const codeBeforeCursor = editor.value.substring(0, cursorPosition);
        const codeAfterCursor = editor.value.substring(cursorPosition);

        // Find the start of the word/trigger right before the cursor
        const lastWordMatch = codeBeforeCursor.match(/\b\w*$/);
        const replacementStart = lastWordMatch ? lastWordMatch.index! : cursorPosition;

        const newCode = editor.value.substring(0, replacementStart) + suggestionToAccept + codeAfterCursor;
        
        setCode(newCode);

        // We need to manually focus and set the cursor position after the state update
        setTimeout(() => {
            if (editorRef.current) {
                editorRef.current.focus();
                const newCursorPosition = replacementStart + suggestionToAccept.length;
                editorRef.current.selectionStart = editorRef.current.selectionEnd = newCursorPosition;
            }
        }, 0);
    };

    const handleDismissSuggestions = () => {
        setSuggestions([]);
    };

    const handleInsertSnippet = (snippetCode: string) => {
        const editor = editorRef.current;
        if (!editor) return;

        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        
        const newCode = code.substring(0, start) + snippetCode + code.substring(end);
        setCode(newCode);

        setTimeout(() => {
            editor.focus();
            const newCursorPosition = start + snippetCode.length;
            editor.selectionStart = editor.selectionEnd = newCursorPosition;
        }, 0);
    };

    const handleSendMessage = async (message: string) => {
        if (!chatRef.current || !process.env.API_KEY) return;

        setIsChatLoading(true);
        const userMessage: ChatMessage = { role: 'user', text: message };
        setChatHistory(prev => [...prev, userMessage]);

        try {
            const result = await chatRef.current.sendMessage(message);
            const modelMessage: ChatMessage = { role: 'model', text: result.text };
            setChatHistory(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: ChatMessage = { role: 'model', text: "Sorry, I encountered an error. Please try again." };
            setChatHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsChatLoading(false);
        }
    };

    useEffect(() => {
        setSuggestions([]);
    }, [code]);
    
    useEffect(() => {
        const performAutomaticSuggestion = async () => {
            if (
                debouncedCode.trim() &&
                !isLoadingSuggestion &&
                !suggestions.length &&
                editorRef.current
            ) {
                const editor = editorRef.current;
                if (editor.selectionStart === editor.value.length && editor.selectionStart > 0) {
                     await handleRequestSuggestion();
                }
            }
        };

        performAutomaticSuggestion();
    }, [debouncedCode]);

    return (
        <div className="flex flex-col h-screen bg-gray-900 font-mono">
            <Header 
                language={language}
                onLanguageChange={handleLanguageChange}
                onRun={handleRunCode}
                isExecuting={isExecuting}
            />
            <main className="flex flex-1 overflow-hidden p-4 gap-4">
                <SnippetsPanel
                    isOpen={isSnippetsOpen}
                    setIsOpen={setIsSnippetsOpen}
                    languageIdentifier={language.identifier}
                    onInsertSnippet={handleInsertSnippet}
                />
                <div className="flex-1 flex flex-col bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="flex-1 relative">
                        <Editor
                            ref={editorRef}
                            code={code}
                            onCodeChange={setCode}
                            suggestions={suggestions}
                            onAcceptSuggestion={handleAcceptSuggestion}
                            onDismissSuggestions={handleDismissSuggestions}
                            language={language.identifier}
                            onRequestSuggestion={handleRequestSuggestion}
                        />
                    </div>
                    <div className="flex items-center justify-between px-4 py-1 bg-gray-700 border-t border-gray-600 text-xs text-gray-400">
                        <div>
                            <span>{language.name}</span>
                        </div>
                        <div>
                           <span>Local suggestions enabled</span>
                        </div>
                    </div>
                </div>
                <div className="w-1/3 flex flex-col bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="flex border-b border-gray-700">
                        <button
                            onClick={() => setActiveTab('output')}
                            className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-medium transition-colors ${
                                activeTab === 'output'
                                    ? 'bg-gray-800 text-cyan-400'
                                    : 'bg-gray-750 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            <TerminalIcon className="h-5 w-5" />
                            Output
                        </button>
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-medium transition-colors ${
                                activeTab === 'chat'
                                    ? 'bg-gray-800 text-cyan-400'
                                    : 'bg-gray-750 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            <MessageSquareIcon className="h-5 w-5" />
                            Chat
                        </button>
                    </div>
                    <div className="flex-1 overflow-auto">
                         {activeTab === 'output' ? (
                            <OutputPanel output={output} isExecuting={isExecuting} />
                        ) : (
                            <ChatPanel 
                                messages={chatHistory}
                                onSendMessage={handleSendMessage}
                                isLoading={isChatLoading}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;