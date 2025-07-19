type SafeJsonParseResult<U> = U extends undefined ? object | any[] | undefined : U;
type SafeJsonStringifyResult<U> = U extends undefined ? string | undefined : U;

/**
 * Safely parses a JSON string without throwing errors.
 *
 * @param str - The JSON string to parse
 * @param options - Configuration options
 * @param options.fallback - Value to return on failure, or Error to throw
 * @param options.reviver - Function to transform values during parsing
 * 
 * @example
 * ```ts
 * // Basic usage with fallback
 * const result = parse('{"name": "John"}', { fallback: {} });
 * console.log(result); // { name: "John" }
 * 
 * // Invalid JSON returns fallback
 * const invalid = parse('invalid json', { fallback: null });
 * console.log(invalid); // null
 * 
 * // Throw error on invalid JSON
 * try {
 *   parse('invalid', { fallback: new Error('Invalid JSON') });
 * } catch (error) {
 *   console.log(error.message); // 'Invalid JSON'
 * }
 * 
 * // Using reviver function
 * const withReviver = parse('{"date": "2023-01-01"}', {
 *   fallback: {},
 *   reviver: (key, value) => {
 *     if (key === 'date') return new Date(value);
 *     return value;
 *   }
 * });
 * console.log(withReviver.date instanceof Date); // true
 * ```
 */
export function parse<U = undefined>(
	str: string | null | undefined,
	options?: {
		fallback?: U;
		reviver?: (key: string, value: any) => any;
	}
): SafeJsonParseResult<U> {
	try {
		return JSON.parse(str ?? '', options?.reviver) as SafeJsonParseResult<U>;
	} catch {
		if (options?.fallback instanceof Error) throw options.fallback;
		return options?.fallback as SafeJsonParseResult<U>;
	}
}

/**
 * Safely converts objects and arrays to JSON strings without throwing errors.
 *
 * @param value - The object or array to stringify
 * @param options - Configuration options
 * @param options.fallback - Value to return on failure, or Error to throw
 * @param options.pretty - Whether to format with 2-space indentation
 * @param options.replacer - Function to transform values during stringification
 * 
 * @example
 * ```ts
 * // Basic usage
 * const json = stringify({ name: 'John', age: 30 });
 * console.log(json); // '{"name":"John","age":30}'
 * 
 * // Pretty formatting
 * const pretty = stringify({ name: 'John' }, { pretty: true });
 * console.log(pretty);
 * // {
 * //   "name": "John"
 * // }
 * 
 * // Fallback for invalid values
 * const invalid = stringify(undefined, { fallback: '{}' });
 * console.log(invalid); // '{}'
 * 
 * // Throw error on failure
 * try {
 *   stringify(BigInt(123), { fallback: new Error('Cannot stringify BigInt') });
 * } catch (error) {
 *   console.log(error.message); // 'Cannot stringify BigInt'
 * }
 * 
 * // Using replacer function
 * const filtered = stringify(
 *   { name: 'John', password: 'secret', age: 30 },
 *   {
 *     replacer: (key, value) => {
 *       if (key === 'password') return undefined; // Exclude sensitive data
 *       return value;
 *     }
 *   }
 * );
 * console.log(filtered); // '{"name":"John","age":30}'
 * ```
 */
export function stringify<U = undefined>(
	value: unknown,
	options?: {
		fallback?: U;
		pretty?: boolean;
		replacer?: (key: string, value: any) => any;
	}
): SafeJsonStringifyResult<U> {
	try {
		if (typeof value !== 'object' || value === null) throw new Error('Not an object or array');
		return JSON.stringify(value, options?.replacer, options?.pretty ? 2 : undefined) as SafeJsonStringifyResult<U>;
	} catch {
		if (options?.fallback instanceof Error) throw options.fallback;
		return options?.fallback as SafeJsonStringifyResult<U>;
	}
}

/**
 * Drop-in replacement for JSON with safe error handling.
 * 
 * @example
 * ```ts
 * // Use as a direct replacement for JSON
 * const data = SafeJSON.parse('{"valid": true}', { fallback: {} });
 * const json = SafeJSON.stringify(data, { pretty: true });
 * 
 * // No more try/catch blocks needed
 * const config = SafeJSON.parse(userInput, { 
 *   fallback: { theme: 'default' } 
 * });
 * 
 * // Perfect for API responses
 * const response = await fetch('/api/data');
 * const text = await response.text();
 * const apiData = SafeJSON.parse(text, { 
 *   fallback: { error: 'Invalid response' } 
 * });
 * ```
 */
export const SafeJSON = { parse, stringify };