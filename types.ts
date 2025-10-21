
export interface Language {
    identifier: string;
    name: string;
    pistonIdentifier: string;
    pistonVersion: string;
    initialCode: string;
}

export interface ExecutionOutput {
    stdout: string;
    stderr: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}
