const stringify = (v: any) => Object.prototype.toString.call(v);

/**
 * Check if a value is defined (not undefined).
 *
 * @example
 * ```ts
 * const value: string | undefined = getValue();
 * 
 * if (isDefined(value)) {
 *   // TypeScript now knows value is string, not undefined
 *   console.log(value.toUpperCase());
 * }
 * 
 * // Useful for filtering arrays
 * const items = [1, undefined, 3, undefined, 5];
 * const defined = items.filter(isDefined);
 * console.log(defined); // [1, 3, 5]
 * ```
 */
export const isDefined = <T = any>(val?: T): val is T => typeof val !== 'undefined';

/**
 * Check if a value is a boolean.
 *
 * @example
 * ```ts
 * const input: unknown = true;
 * 
 * if (isBoolean(input)) {
 *   // TypeScript knows input is boolean
 *   console.log(input ? 'yes' : 'no');
 * }
 * 
 * // Runtime type checking
 * console.log(isBoolean(true));   // true
 * console.log(isBoolean(false));  // true
 * console.log(isBoolean('true')); // false
 * console.log(isBoolean(1));      // false
 * ```
 */
export const isBoolean = (val: any): val is boolean => typeof val === 'boolean';

/**
 * Check if a value is a function.
 *
 * @example
 * ```ts
 * const callback: unknown = () => console.log('hello');
 * 
 * if (isFunction(callback)) {
 *   // TypeScript knows callback is a function
 *   callback(); // Safe to call
 * }
 * 
 * // Check different function types
 * console.log(isFunction(() => {}));           // true
 * console.log(isFunction(function() {}));      // true
 * console.log(isFunction(async () => {}));     // true
 * console.log(isFunction(class {}));           // true
 * console.log(isFunction('function'));         // false
 * ```
 */
// biome-ignore lint/complexity/noBannedTypes: T extends Function is necessary here
export const isFunction = <T extends Function>(val: any): val is T => typeof val === 'function';

/**
 * Check if a value is a number.
 *
 * @example
 * ```ts
 * const input: unknown = 42;
 * 
 * if (isNumber(input)) {
 *   // TypeScript knows input is number
 *   console.log(input.toFixed(2)); // '42.00'
 * }
 * 
 * // Runtime validation
 * console.log(isNumber(42));      // true
 * console.log(isNumber(3.14));    // true
 * console.log(isNumber(NaN));     // true (NaN is of type number)
 * console.log(isNumber('42'));    // false
 * console.log(isNumber(null));    // false
 * ```
 */
export const isNumber = (val: any): val is number => typeof val === 'number';

/**
 * Check if a value is a string.
 *
 * @example
 * ```ts
 * const input: unknown = 'hello world';
 * 
 * if (isString(input)) {
 *   // TypeScript knows input is string
 *   console.log(input.toUpperCase()); // 'HELLO WORLD'
 * }
 * 
 * // Useful for filtering mixed arrays
 * const mixed = [1, 'hello', true, 'world', null];
 * const strings = mixed.filter(isString);
 * console.log(strings); // ['hello', 'world']
 * ```
 */
export const isString = (val: unknown): val is string => typeof val === 'string';

/**
 * Check if a value is a plain object (not array, null, class instances, or other types).
 *
 * @example
 * ```ts
 * const data: unknown = { name: 'John', age: 30 };
 * 
 * if (isPlainObject(data)) {
 *   // TypeScript knows data is object
 *   console.log(Object.keys(data)); // ['name', 'age']
 * }
 * 
 * // Distinguishes plain objects from other types
 * console.log(isPlainObject({}));              // true
 * console.log(isPlainObject({ a: 1 }));        // true
 * console.log(isPlainObject([]));              // false (array)
 * console.log(isPlainObject(null));            // false (null)
 * console.log(isPlainObject(new Date()));      // false (Date object)
 * console.log(isPlainObject(/regex/));         // false (RegExp)
 * console.log(isPlainObject(new MyClass()));   // false (class instance)
 * ```
 */
export const isPlainObject = (val: any): val is object => {
	if (stringify(val) !== '[object Object]') return false;

	// Check if it's a plain object (created by Object literal {} or new Object())
	const proto = Object.getPrototypeOf(val);
	return proto === null || proto === Object.prototype || Object.getPrototypeOf(proto) === null;
};

/**
 * Check if a value is undefined.
 *
 * @example
 * ```ts
 * const value: string | undefined = getValue();
 * 
 * if (isUndefined(value)) {
 *   console.log('Value is not set');
 * } else {
 *   // TypeScript knows value is string
 *   console.log(value.length);
 * }
 * 
 * // Runtime checks
 * console.log(isUndefined(undefined)); // true
 * console.log(isUndefined(null));      // false
 * console.log(isUndefined(''));        // false
 * console.log(isUndefined(0));         // false
 * ```
 */
export const isUndefined = (val: any): val is undefined => stringify(val) === '[object Undefined]';

/**
 * Check if a value is null.
 *
 * @example
 * ```ts
 * const value: string | null = getValue();
 * 
 * if (isNull(value)) {
 *   console.log('Value is null');
 * } else {
 *   // TypeScript knows value is string
 *   console.log(value.toUpperCase());
 * }
 * 
 * // Runtime checks
 * console.log(isNull(null));       // true
 * console.log(isNull(undefined));  // false
 * console.log(isNull(''));         // false
 * console.log(isNull(0));          // false
 * ```
 */
export const isNull = (val: any): val is null => stringify(val) === '[object Null]';

/**
 * Check if a value is a regular expression.
 *
 * @example
 * ```ts
 * const pattern: unknown = /\d+/g;
 * 
 * if (isRegExp(pattern)) {
 *   // TypeScript knows pattern is RegExp
 *   const matches = 'abc123def456'.match(pattern);
 *   console.log(matches); // ['123', '456']
 * }
 * 
 * // Runtime checks
 * console.log(isRegExp(/test/));           // true
 * console.log(isRegExp(new RegExp('a')));  // true
 * console.log(isRegExp('/pattern/'));      // false (string)
 * console.log(isRegExp({}));               // false
 * ```
 */
export const isRegExp = (val: any): val is RegExp => stringify(val) === '[object RegExp]';

/**
 * Check if a value is a Date object.
 *
 * @example
 * ```ts
 * const timestamp: unknown = new Date();
 * 
 * if (isDate(timestamp)) {
 *   // TypeScript knows timestamp is Date
 *   console.log(timestamp.getFullYear()); // 2023
 * }
 * 
 * // Runtime checks
 * console.log(isDate(new Date()));         // true
 * console.log(isDate('2023-01-01'));       // false (string)
 * console.log(isDate(1672531200000));      // false (number)
 * console.log(isDate(new Date('invalid'))); // true (but invalid date)
 * ```
 */
export const isDate = (val: any): val is Date => stringify(val) === '[object Date]';

/**
 * Check if a value is an array.
 *
 * @example
 * ```ts
 * const data: unknown = [1, 2, 3];
 * 
 * if (isArray(data)) {
 *   // TypeScript knows data is array
 *   console.log(data.length); // 3
 *   data.push(4); // Safe to use array methods
 * }
 * 
 * // Runtime checks
 * console.log(isArray([]));           // true
 * console.log(isArray([1, 2, 3]));    // true
 * console.log(isArray('array'));      // false
 * console.log(isArray({ 0: 'a', 1: 'b', length: 2 })); // false (array-like object)
 * ```
 */
export const isArray = (val: any): val is any[] => Array.isArray(val);

/**
 * Check if a value is an Error object.
 *
 * @example
 * ```ts
 * const error: unknown = new Error('Something went wrong');
 * 
 * if (isError(error)) {
 *   // TypeScript knows error is Error
 *   console.log(error.message); // 'Something went wrong'
 *   console.log(error.stack);   // Stack trace
 * }
 * 
 * // Runtime checks
 * console.log(isError(new Error()));        // true
 * console.log(isError(new TypeError()));    // true
 * console.log(isError(new RangeError()));   // true
 * console.log(isError('Error message'));    // false
 * console.log(isError({ message: 'error' })); // false
 * ```
 */
export const isError = (val: any): val is Error => stringify(val) === '[object Error]';

/**
 * Checks if a string is a valid URL with http or https protocol.
 * 
 * @example
 * ```ts
 * const userInput = 'https://example.com';
 * 
 * if (isUrl(userInput)) {
 *   // Safe to use as URL
 *   fetch(userInput).then(response => {
 *     console.log('Valid URL, request sent');
 *   });
 * }
 * 
 * // Runtime checks
 * console.log(isUrl('https://example.com'));    // true
 * console.log(isUrl('http://localhost:3000'));  // true
 * console.log(isUrl('ftp://files.example.com')); // false (not http/https)
 * console.log(isUrl('example.com'));            // false (no protocol)
 * console.log(isUrl('not a url'));              // false
 * console.log(isUrl('mailto:test@example.com')); // false (different protocol)
 * ```
 */
export function isUrl(string: string): boolean {
	let url: URL;
	try {
		url = new URL(string);
	} catch (_) {
		return false;
	}
	return url.protocol === 'http:' || url.protocol === 'https:';
}
