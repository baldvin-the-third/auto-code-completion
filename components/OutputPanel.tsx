

import React from 'react';
import type { ExecutionOutput } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface OutputPanelProps {
    output: ExecutionOutput | null;
    isExecuting: boolean;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ output, isExecuting }) => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 p-4 overflow-auto">
                {isExecuting && (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <SpinnerIcon />
                        <span className="ml-2">Executing...</span>
                    </div>
                )}
                {!isExecuting && !output && (
                    <div className="text-gray-500">
                        Click "Run" to execute your code.
                    </div>
                )}
                {output && (
                    <div>
                        {output.stdout && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 mb-1">STDOUT:</h3>
                                <pre className="text-gray-200 whitespace-pre-wrap">{output.stdout}</pre>
                            </div>
                        )}
                        {output.stderr && (
                            <div className="mt-4">
                                <h3 className="text-sm font-bold text-red-500 mb-1">STDERR:</h3>
                                <pre className="text-red-400 whitespace-pre-wrap">{output.stderr}</pre>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};