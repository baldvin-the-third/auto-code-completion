import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { SendIcon } from './icons/SendIcon';

interface ChatPanelProps {
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
    isLoading: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, isLoading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-800">
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-prose rounded-lg px-4 py-2 ${
                                msg.role === 'user'
                                    ? 'bg-cyan-600 text-white'
                                    : 'bg-gray-700 text-gray-200'
                            }`}
                        >
                            <pre className="whitespace-pre-wrap font-sans text-sm">{msg.text}</pre>
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-prose rounded-lg px-4 py-2 bg-gray-700 text-gray-200">
                            <div className="flex items-center gap-2">
                                <SpinnerIcon className="h-4 w-4" />
                                <span>Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-3 border-t border-gray-700">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask Gemini a question..."
                        rows={1}
                        className="flex-1 resize-none bg-gray-700 text-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                        disabled={isLoading}
                        aria-label="Chat input"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                        aria-label="Send message"
                    >
                        <SendIcon className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};
