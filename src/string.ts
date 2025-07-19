/**
 * Capitalize the first letter of a string.
 *
 * @example
 * ```ts
 * capitalize('hello world'); // 'Hello world'
 * ```
 */
export function capitalize<S extends string>(str: S): Capitalize<S> {
    return (
        !str ? '' : str[0].toUpperCase() + str.slice(1)
    ) as Capitalize<S>;
}

/**
 * Convert a string to camelCase.
 *
 * @example
 * ```ts
 * const result = camelCase('hello-world');
 * console.log(result); // 'helloWorld'
 * 
 * const fromSnake = camelCase('user_name_field');
 * console.log(fromSnake); // 'userNameField'
 * 
 * const fromSpaces = camelCase('My Super Title');
 * console.log(fromSpaces); // 'mySuperTitle'
 * ```
 */
export function camelCase<S extends string>(str: S): string {
    return str
        .trim()
        .replace(/[\s._-]+(.)/g, (_, char) => char.toUpperCase())
        .replace(/^([A-Z])/, (_, first) => first.toLowerCase());
}

/**
 * Split a string at the first occurrence of a separator.
 *
 * @example
 * ```ts
 * const [key, value] = splitFirst('key=value=more', '=');
 * console.log(key); // 'key'
 * console.log(value); // 'value=more'
 * ```
 */
export function splitFirst<A extends string, B extends string>(
    str: string,
    separator: string
): [A, B] {
    const separatorIndex = str.indexOf(separator);
    if (separatorIndex === -1) {
        return [str, ''] as [A, B];
    }
    return [str.slice(0, separatorIndex), str.slice(separatorIndex + separator.length)] as [A, B];
}

/**
 * Pad a number with leading zeros to reach a length.
 *
 * @example
 * ```ts
 * const padded = padZeros(42, 5);
 * console.log(padded); // '00042'
 * 
 * const time = padZeros(7, 2);
 * console.log(time); // '07'
 * 
 * const noChange = padZeros(12345, 3);
 * console.log(noChange); // '12345' (already longer than 3 digits)
 * ```
 */
export function padZeros(num: number, digits: number): string {
    const str = num.toString();
    return str.padStart(digits, '0');
}

/**
 * Generates a random string with customizable alphabet and optional prefix.
 *
 * @param size - The length of the random string to generate
 * @param alphabet - The character set to use ('letters', 'digits', or 'url')
 * @param prefix - Optional prefix to add before the random string
 * 
 * @example
 * ```ts
 * const id = generateId();
 * console.log(id); // 'x2v9b8f3k1m7n4q6' (16 chars, url-safe)
 * 
 * const shortId = generateId(8, 'letters');
 * console.log(shortId); // 'kqvwxyzr' (8 chars, letters only)
 * 
 * const numericCode = generateId(6, 'digits');
 * console.log(numericCode); // '473829'
 * 
 * const userToken = generateId(12, 'url', 'user');
 * console.log(userToken); // 'user-x7v2b9f8k1m3'
 * ```
 */
export function generateId(size = 16, alphabet: 'letters' | 'digits' | 'url' = 'url', prefix?: string): string {
    const dict =
        alphabet === 'digits'
            ? '2619834075'
            : alphabet === 'letters'
                ? 'useandompxbfghjklqvwyzrict'
                : 'useandom2619834075pxbfghjklqvwyzrict';
    const bytes = new Uint8Array(size);
    crypto.getRandomValues(bytes);
    let id = '';
    for (let i = 0; i < size; i++) {
        id += dict[bytes[i] % dict.length];
    }
    return prefix ? `${prefix}-${id}` : id;
}

/**
 * Break a string into lines not exceeding a max character limit.
 *
 * @example
 * ```ts
 * const text = 'This is a very long sentence that needs to be broken down into smaller lines';
 * const lines = wrapText(text, 20);
 * console.log(lines);
 * // [
 * //   'This is a very long',
 * //   'sentence that needs',
 * //   'to be broken down',
 * //   'into smaller lines'
 * // ]
 * 
 * const short = wrapText('one two three four five', 10);
 * console.log(short); // ['one two', 'three four', 'five']
 * ```
 */
export function wrapText(str: string, maxCharsPerLine: number): string[] {
    if (str === '') return [''];

    const words = str.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    for (const word of words) {
        if (currentLine.length + word.length + 1 <= maxCharsPerLine) {
            currentLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
}