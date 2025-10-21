
import type { ExecutionOutput } from '../types';

const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

/**
 * Executes code using the Piston API.
 * @param code The source code to execute.
 * @param language The language identifier for Piston.
 * @param version The language version for Piston.
 * @returns A promise that resolves to the execution output.
 */
export const executeCode = async (code: string, language: string, version: string): Promise<ExecutionOutput> => {
    console.log(`Executing ${language} v${version} code...`);

    try {
        const response = await fetch(PISTON_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                language: language,
                version: version,
                files: [
                    {
                        content: code,
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response.' }));
            const errorMessage = errorData.message || `API request failed with status ${response.status}`;
            console.error('Piston API Error:', errorMessage);
            return {
                stdout: '',
                stderr: `API Error: ${errorMessage}`,
            };
        }

        const data = await response.json();

        // Piston API returns 'run' for successful execution, or 'compile' if there's a compile error
        const result = data.run || data.compile || {};
        
        return {
            stdout: result.stdout || '',
            stderr: result.stderr || '',
        };

    } catch (error) {
        console.error('Failed to connect to compiler service:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown network error occurred.';
        return {
            stdout: '',
            stderr: `Network Error: Could not connect to the code execution service. ${errorMessage}`,
        };
    }
};
