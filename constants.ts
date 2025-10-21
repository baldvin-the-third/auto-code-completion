
import type { Language } from './types';

export const SUPPORTED_LANGUAGES: Language[] = [
    {
        identifier: 'python',
        name: 'Python',
        pistonIdentifier: 'python',
        pistonVersion: '3.10.0',
        initialCode: 'def hello_world():\n    print("Hello, World!")\n\nhello_world()',
    },
    {
        identifier: 'javascript',
        name: 'JavaScript',
        pistonIdentifier: 'javascript',
        pistonVersion: '18.15.0',
        initialCode: 'function greet() {\n    console.log("Hello, World!");\n}\ngreet();',
    },
    {
        identifier: 'typescript',
        name: 'TypeScript',
        pistonIdentifier: 'typescript',
        pistonVersion: '5.0.3',
        initialCode: 'function greet(name: string): void {\n    console.log(`Hello, ${name}!`);\n}\ngreet("World");',
    },
    {
        identifier: 'java',
        name: 'Java',
        pistonIdentifier: 'java',
        pistonVersion: '15.0.2',
        initialCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    },
    {
        identifier: 'rust',
        name: 'Rust',
        pistonIdentifier: 'rust',
        pistonVersion: '1.68.2',
        initialCode: 'fn main() {\n    println!("Hello, World!");\n}',
    },
];
