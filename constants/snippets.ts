interface Snippet {
    title: string;
    code: string;
}

interface SnippetsCollection {
    [language: string]: Snippet[];
}

export const SNIPPETS: SnippetsCollection = {
    python: [
        {
            title: 'For Loop',
            code: 'for i in range(10):\n    print(i)',
        },
        {
            title: 'List Comprehension w/ If',
            code: 'squares = [x**2 for x in range(10) if x % 2 == 0]',
        },
        {
            title: 'Read File',
            code: 'with open("file.txt", "r") as f:\n    content = f.read()\n    print(content)',
        },
        {
            title: 'Class Definition',
            code: 'class MyClass:\n    def __init__(self, name):\n        self.name = name\n\n    def greet(self):\n        print(f"Hello, {self.name}")\n\nobj = MyClass("World")\nobj.greet()',
        },
        {
            title: 'API Request (requests)',
            code: 'import requests\n\ntry:\n    response = requests.get("https://api.example.com/data")\n    response.raise_for_status() # Raises an HTTPError for bad responses\n    data = response.json()\n    print(data)\nexcept requests.exceptions.RequestException as e:\n    print(f"An error occurred: {e}")',
        }
    ],
    javascript: [
        {
            title: 'Fetch API',
            code: 'fetch("https://api.example.com/data")\n    .then(response => response.json())\n    .then(data => console.log(data))\n    .catch(error => console.error("Error:", error));',
        },
        {
            title: 'Array Map',
            code: 'const newArray = oldArray.map(item => item * 2);',
        },
        {
            title: 'Array Reduce',
            code: 'const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);',
        },
        {
            title: 'Async Function',
            code: 'async function fetchData() {\n    try {\n        const response = await fetch("https://api.example.com/data");\n        const data = await response.json();\n        console.log(data);\n    } catch (error) {\n        console.error("Error fetching data:", error);\n    }\n}\n\nfetchData();',
        },
        {
            title: 'Class Definition',
            code: 'class Person {\n    constructor(name) {\n        this.name = name;\n    }\n\n    greet() {\n        console.log(`Hello, my name is ${this.name}`);\n    }\n}\n\nconst person1 = new Person("Alex");\nperson1.greet();'
        }
    ],
    typescript: [
        {
            title: 'Interface Definition',
            code: 'interface User {\n    id: number;\n    name: string;\n    email?: string;\n}',
        },
        {
            title: 'Generic Function',
            code: 'function identity<T>(arg: T): T {\n    return arg;\n}',
        },
        {
            title: 'Type Guard',
            code: 'function isString(value: unknown): value is string {\n    return typeof value === "string";\n}',
        },
        {
            title: 'Readonly Properties',
            code: 'interface Point {\n    readonly x: number;\n    readonly y: number;\n}'
        },
        {
            title: 'Class with Typing',
            code: 'class Greeter {\n    greeting: string;\n\n    constructor(message: string) {\n        this.greeting = message;\n    }\n\n    greet(): string {\n        return "Hello, " + this.greeting;\n    }\n}\n\nlet greeter = new Greeter("world");',
        },
    ],
    java: [
        {
            title: 'ArrayList',
            code: 'import java.util.ArrayList;\n\nArrayList<String> cars = new ArrayList<String>();\ncars.add("Volvo");\ncars.add("BMW");\ncars.add("Ford");\nSystem.out.println(cars);'
        },
        {
            title: 'HashMap',
            code: 'import java.util.HashMap;\n\nHashMap<String, String> capitalCities = new HashMap<String, String>();\ncapitalCities.put("England", "London");\ncapitalCities.put("Germany", "Berlin");\nSystem.out.println(capitalCities);'
        },
        {
            title: 'File I/O (Write)',
            code: 'import java.io.FileWriter;\nimport java.io.IOException;\n\ntry {\n  FileWriter myWriter = new FileWriter("filename.txt");\n  myWriter.write("Files in Java might be tricky, but it is fun enough!");\n  myWriter.close();\n  System.out.println("Successfully wrote to the file.");\n} catch (IOException e) {\n  System.out.println("An error occurred.");\n  e.printStackTrace();\n}'
        }
    ],
    rust: [
        {
            title: 'Vector Loop',
            code: 'let v = vec![10, 20, 30];\nfor i in &v {\n    println!("{}", i);\n}'
        },
        {
            title: 'Match Expression',
            code: 'let number = 13;\nmatch number {\n    1 => println!("One!"),\n    2 | 3 | 5 | 7 | 11 => println!("This is a prime"),\n    13..=19 => println!("A teen"),\n    _ => println!("Ain\\\'t special"),\n}'
        },
        {
            title: 'Struct Definition',
            code: 'struct User {\n    username: String,\n    email: String,\n    active: bool,\n}\n\nlet user1 = User {\n    email: String::from("someone@example.com"),\n    username: String::from("someusername123"),\n    active: true,\n};'
        }
    ]
};