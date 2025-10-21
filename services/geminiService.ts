interface SuggestionRule {
    trigger: RegExp;
    suggestions: (match: RegExpExecArray, context: { codeBeforeCursor: string }) => string[];
}

interface LanguageRules {
    [language: string]: SuggestionRule[];
}

const isInsideClass = (code: string) => /class\s.*?\{[^{}]*$/.test(code.replace(/\n/g, ' '));

const jsSuggestions: SuggestionRule[] = [
    // Keywords & Statements
    { trigger: /\b(f|fu|fun|func|funct|functi|functio|function)$/, suggestions: () => ['function name(params) {\n  \n}'] },
    { trigger: /\b(c|co|con|cons|const)$/, suggestions: () => ['const name = value;'] },
    { trigger: /\b(l|le|let)$/, suggestions: () => ['let name = value;'] },
    { trigger: /\b(i|if)$/, suggestions: () => ['if (condition) {\n  \n}'] },
    { trigger: /\b(e|el|els|else)$/, suggestions: () => ['else {\n  \n}', 'else if (condition) {\n  \n}'] },
    { trigger: /\b(f|fo|for)$/, suggestions: () => ['for (let i = 0; i < array.length; i++) {\n  \n}', 'for (const item of iterable) {\n  \n}', 'for (const key in object) {\n  \n}'] },
    { trigger: /\b(w|wh|whi|whil|while)$/, suggestions: () => ['while (condition) {\n  \n}'] },
    { trigger: /\b(s|sw|swi|swit|switc|switch)$/, suggestions: () => ['switch (expression) {\n  case value:\n    \n    break;\n  default:\n    \n}'] },
    { trigger: /\b(t|tr|try)$/, suggestions: () => ['try {\n  \n} catch (error) {\n  console.error(error);\n}'] },
    { trigger: /\b(cl|cla|clas|class)$/, suggestions: () => ['class MyClass {\n  constructor() {\n    \n  }\n}'] },
    { trigger: /\b(a|as|asy|asyn|async)$/, suggestions: () => ['async function name(params) {\n  \n}'] },
    { trigger: /\b(aw|awa|awai|await)$/, suggestions: () => ['await promise;'] },
    { trigger: /\b(r|re|ret|retu|retur|return)$/, suggestions: () => ['return result;'] },
    { trigger: /\b(imp|impo|impor|import)$/, suggestions: () => ['import moduleName from "module";'] },
    { trigger: /\b(exp|expo|expor|export)$/, suggestions: () => ['export default name;'] },

    // Console methods
    { trigger: /console\.(l|lo|log)$/, suggestions: () => ['log();'] },
    { trigger: /console\.(e|er|err|erro|error)$/, suggestions: () => ['error();'] },
    { trigger: /console\.(w|wa|war|warn)$/, suggestions: () => ['warn();'] },
    { trigger: /console\.(t|ta|tab|tabl|table)$/, suggestions: () => ['table();'] },
    
    // Common patterns & APIs
    { trigger: /\b(setT|setTi|setTim|setTime|setTimeo|setTimeou|setTimeout)$/, suggestions: () => ['setTimeout(() => {\n  \n}, 1000);'] },
    { trigger: /\b(setI|setIn|setInt|setInte|setInter|setInterv|setInterva|setInterval)$/, suggestions: () => ['setInterval(() => {\n  \n}, 1000);'] },
    { trigger: /\b(fet|fetc|fetch)$/, suggestions: () => ['fetch("URL")\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error("Error:", error));'] },
    { trigger: /document\.querySelector$/, suggestions: () => ['querySelector("selector")'] },
    { trigger: /addEventListener$/, suggestions: () => ['addEventListener("event", (e) => {\n  \n});'] },
    { trigger: /\.map$/, suggestions: () => ['map((element, index) => {\n  \n})'] },
    { trigger: /\.filter$/, suggestions: () => ['filter((element) => {\n  \n})'] },
    { trigger: /\.reduce$/, suggestions: () => ['reduce((accumulator, currentValue) => {\n  \n}, initialValue)'] },
    { trigger: /\.forEach$/, suggestions: () => ['forEach((element) => {\n  \n})'] },
    { trigger: /Promise\.all$/, suggestions: () => ['Promise.all(iterable);'] },
    { trigger: /JSON\.stringify$/, suggestions: () => ['JSON.stringify(object);'] },
    { trigger: /JSON\.parse$/, suggestions: () => ['JSON.parse(string);'] },

    // Contextual: Class methods
    { trigger: /\b(c|co|con|cons|const|constr|constru|construc|construct|constructo|constructor)$/, suggestions: (m, {codeBeforeCursor}) => isInsideClass(codeBeforeCursor) ? ['constructor(params) {\n  \n}'] : [] },
    { trigger: /\b(m|me|met|meth|metho|method)$/, suggestions: (m, {codeBeforeCursor}) => isInsideClass(codeBeforeCursor) ? ['methodName(params) {\n  \n}'] : [] },

    // Algorithm snippets
    { trigger: /\b(binarySearch)$/, suggestions: () => ['function binarySearch(arr, element) {\n  let low = 0;\n  let high = arr.length - 1;\n  while (low <= high) {\n    const mid = Math.floor((low + high) / 2);\n    if (arr[mid] === element) return mid;\n    if (arr[mid] < element) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}'] },
    { trigger: /\b(quickSort)$/, suggestions: () => ['function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[arr.length - 1];\n  const left = [];\n  const right = [];\n  for (let i = 0; i < arr.length - 1; i++) {\n    arr[i] < pivot ? left.push(arr[i]) : right.push(arr[i]);\n  }\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}'] },
];

const pythonSuggestions: SuggestionRule[] = [
    { trigger: /\b(d|de|def)$/, suggestions: () => ['def function_name(params):\n    pass'] },
    { trigger: /\b(i|if)$/, suggestions: () => ['if condition:\n    pass'] },
    { trigger: /\b(el|eli|elif)$/, suggestions: () => ['elif condition:\n    pass'] },
    { trigger: /\b(el|els|else)$/, suggestions: () => ['else:\n    pass'] },
    { trigger: /\b(f|fo|for)$/, suggestions: () => ['for item in iterable:\n    pass'] },
    { trigger: /\b(w|wh|whi|whil|while)$/, suggestions: () => ['while condition:\n    pass'] },
    { trigger: /\b(t|tr|try)$/, suggestions: () => ['try:\n    pass\nexcept Exception as e:\n    print(e)'] },
    { trigger: /\b(c|cl|cla|clas|class)$/, suggestions: () => ['class MyClass:\n    def __init__(self):\n        pass'] },
    { trigger: /\b(im|imp|impo|impor|import)$/, suggestions: () => ['import module'] },
    { trigger: /\b(fr|fro|from)$/, suggestions: () => ['from module import name'] },
    { trigger: /\b(l|la|lam|lamb|lambd|lambda)$/, suggestions: () => ['lambda arguments: expression'] },
    { trigger: /with open$/, suggestions: () => ['with open("file.txt", "r") as f:\n    content = f.read()'] },
    { trigger: /\[x for x in/, suggestions: () => ['[x for x in iterable if condition]'] },
    { trigger: /\{k:v for/, suggestions: () => ['{k: v for k, v in iterable}'] },
    { trigger: /\b(bubbleSort)$/, suggestions: () => ['def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr'] },
    { trigger: /\b(mergeSort)$/, suggestions: () => ['def merge_sort(arr):\n    if len(arr) > 1:\n        mid = len(arr) // 2\n        L = arr[:mid]\n        R = arr[mid:]\n        merge_sort(L)\n        merge_sort(R)\n        i = j = k = 0\n        while i < len(L) and j < len(R):\n            if L[i] < R[j]:\n                arr[k] = L[i]\n                i += 1\n            else:\n                arr[k] = R[j]\n                j += 1\n            k += 1\n        while i < len(L):\n            arr[k] = L[i]\n            i += 1\n            k += 1\n        while j < len(R):\n            arr[k] = R[j]\n            j += 1\n            k += 1\n    return arr'] },
];

const rules: LanguageRules = {
    javascript: jsSuggestions,
    typescript: jsSuggestions, // TypeScript inherits JS rules
    python: pythonSuggestions,
    java: [
        { trigger: /\b(p|pu|pub|publ|publi|public)$/, suggestions: () => ['public '] },
        { trigger: /\b(s|st|sta|stat|stati|static)$/, suggestions: () => ['static '] },
        { trigger: /\b(v|vo|voi|void)$/, suggestions: () => ['void '] },
        { trigger: /\b(c|cl|cla|clas|class)$/, suggestions: () => ['class MyClass {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}'] },
        { trigger: /System\.out\.(p|pr|pri|prin|print|printl|println)$/, suggestions: () => ['println("");'] },
        { trigger: /\b(f|fo|for)$/, suggestions: () => ['for (int i = 0; i < n; i++) {\n  \n}', 'for (String s : array) {\n  \n}'] },
        { trigger: /\b(try)$/, suggestions: () => ['try {\n  \n} catch (Exception e) {\n  e.printStackTrace();\n}'] },
    ],
    rust: [
         { trigger: /\b(f|fn)$/, suggestions: () => ['fn main() {\n    \n}'] },
         { trigger: /\b(l|le|let)$/, suggestions: () => ['let mut name = value;'] },
         { trigger: /\b(i|if)$/, suggestions: () => ['if condition {\n    \n}'] },
         { trigger: /\b(f|fo|for)$/, suggestions: () => ['for item in iterator {\n    \n}'] },
         { trigger: /\b(m|ma|mat|matc|match)$/, suggestions: () => ['match value {\n    pattern => code,\n    _ => default_code,\n}'] },
         { trigger: /\b(st|str|stru|struc|struct)$/, suggestions: () => ['struct MyStruct {\n    field: type,\n}'] },
         { trigger: /\b(p|pr|pri|prin|print|printl|println!)$/, suggestions: () => ['println!("");'] },
    ],
};

/**
 * Provides local, rule-based code suggestions.
 * This is a fast and effective engine that suggests code from small completions to large algorithms based on context.
 * It does not use an external API.
 */
export const getSuggestion = async (codeBeforeCursor: string, language: string): Promise<string[]> => {
    if (!codeBeforeCursor.trim()) {
        return Promise.resolve([]);
    }

    const relevantRules = rules[language] || [];
    const lines = codeBeforeCursor.split('\n');
    const lastLine = lines[lines.length - 1];
    const trimmedLastLine = lastLine.trim();

    if (!trimmedLastLine) {
        return Promise.resolve([]);
    }
    
    let matchingSuggestions: string[] = [];
    
    // Rule-based suggestions
    for (const rule of relevantRules) {
        const match = rule.trigger.exec(trimmedLastLine);
        if (match) {
            const suggestions = rule.suggestions(match, { codeBeforeCursor });
            matchingSuggestions.push(...suggestions);
        }
    }
    
    // Simple word completion from the document itself for variable names etc.
    const wordsInCode = codeBeforeCursor.match(/\b(\w{3,})\b/g) || [];
    const uniqueWords = [...new Set(wordsInCode)];
    const lastWordMatch = trimmedLastLine.match(/\b(\w+)$/);

    if (lastWordMatch) {
        const lastWord = lastWordMatch[1];
        for (const word of uniqueWords) {
            if (word.startsWith(lastWord) && word !== lastWord && !matchingSuggestions.some(s => s.startsWith(word))) {
                matchingSuggestions.push(word);
            }
        }
    }

    const finalSuggestions = [...new Set(matchingSuggestions)];
    return Promise.resolve(finalSuggestions.slice(0, 10)); // Limit to 10 suggestions
};