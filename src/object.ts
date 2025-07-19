import { isArray, isFunction, isPlainObject } from './is';

// Types
type MergeInsertions<T> = T extends object ? { [K in keyof T]: MergeInsertions<T[K]> } : T;

type DeepMerge<F, S> = MergeInsertions<{
	[K in keyof F | keyof S]: K extends keyof S & keyof F
	? DeepMerge<F[K], S[K]>
	: K extends keyof S
	? S[K]
	: K extends keyof F
	? F[K]
	: never;
}>;

type DeepReadonly<T> = T extends (...args: any[]) => any
	? T
	: T extends Array<infer U>
	? ReadonlyArray<DeepReadonly<U>>
	: T extends object
	? { readonly [K in keyof T]: DeepReadonly<T[K]> }
	: T;

/**
 * Creates a new object containing only the specified keys from the source object.
 *
 * @param obj - The object to pick from
 * @param keys - The keys to pick
 * @param omitUndefined - Whether to omit undefined values
 * 
 * @example
 * ```ts
 * const user = { id: 1, name: 'John', email: 'john@example.com', password: 'secret' };
 * const publicUser = pick(user, ['id', 'name']);
 * console.log(publicUser); // { id: 1, name: 'John' }
 * 
 * // With undefined values
 * const data = { a: 1, b: undefined, c: 3 };
 * const withUndefined = pick(data, ['a', 'b', 'c']);
 * console.log(withUndefined); // { a: 1, b: undefined, c: 3 }
 * 
 * const withoutUndefined = pick(data, ['a', 'b', 'c'], true);
 * console.log(withoutUndefined); // { a: 1, c: 3 }
 * ```
 */
export function pick<O extends object, T extends keyof O>(obj: O, keys: T[], omitUndefined = false) {
	return keys.reduce(
		(n, k) => {
			if (k in obj) {
				if (!omitUndefined || obj[k] !== undefined) n[k] = obj[k];
			}
			return n;
		},
		{} as Pick<O, T>,
	);
}

/**
 * Creates a new object excluding the specified keys from the source object.
 *
 * @param obj - The object to omit from
 * @param keys - The keys to omit
 * @param omitUndefined - Whether to omit undefined values
 * 
 * @example
 * ```ts
 * const user = { id: 1, name: 'John', email: 'john@example.com', password: 'secret' };
 * const safeUser = omit(user, ['password']);
 * console.log(safeUser); // { id: 1, name: 'John', email: 'john@example.com' }
 * 
 * const data = { a: 1, b: 2, c: undefined };
 * const cleaned = omit(data, ['b'], true);
 * console.log(cleaned); // { a: 1 } (both 'b' and undefined 'c' removed)
 * ```
 */
export function omit<O extends object, T extends keyof O>(obj: O, keys: T[], omitUndefined = false) {
	const objClone = clone(obj);

	return keys.reduce(
		(n, k) => {
			if (k in objClone) {
				if (!omitUndefined || obj[k] !== undefined) delete objClone[k];
			}
			return n;
		},
		objClone as Omit<O, T>,
	);
}

/**
 * Remove undefined properties from an object (mutates original).
 *
 * @example
 * ```ts
 * const data = { name: 'John', age: undefined, email: 'john@example.com' };
 * const cleaned = clearUndefined(data);
 * console.log(cleaned); // { name: 'John', email: 'john@example.com' }
 * console.log(data === cleaned); // true (same object, mutated)
 * ```
 */
export function clearUndefined<T extends object>(obj: T) {
	for (const key of Object.keys(obj)) {
		if ((obj as any)[key] === undefined) delete (obj as any)[key];
	}
	return obj as Partial<{ [K in keyof T]: Exclude<T[K], undefined> }>;
}

/**
 * Remove null and undefined properties from an object (mutates original).
 *
 * @example
 * ```ts
 * const data = { name: 'John', age: null, email: undefined, active: true };
 * const cleaned = clearNullish(data);
 * console.log(cleaned); // { name: 'John', active: true }
 * ```
 */
export function clearNullish<T extends object>(obj: T) {
	for (const key of Object.keys(obj)) {
		if ((obj as any)[key] === undefined || (obj as any)[key] === null) delete (obj as any)[key];
	}
	return obj as Partial<{ [K in keyof T]: NonNullable<T[K]> }>;
}

/**
 * Remove null properties from an object (mutates original).
 *
 * @example
 * ```ts
 * const data = { name: 'John', age: null, email: undefined };
 * const cleaned = clearNull(data);
 * console.log(cleaned); // { name: 'John', email: undefined } (only null removed)
 * ```
 */
export function clearNull<T extends object>(obj: T) {
	for (const key of Object.keys(obj)) {
		if ((obj as any)[key] === null) delete (obj as any)[key];
	}
	return obj as Partial<{ [K in keyof T]: Exclude<T[K], null> }>;
}

/**
 * Creates a deep copy of an object.
 * 
 * @example
 * ```ts
 * const original = { user: { name: 'John', settings: { theme: 'dark' } } };
 * const copy = clone(original);
 * 
 * copy.user.name = 'Jane';
 * console.log(original.user.name); // 'John' (unchanged)
 * console.log(copy.user.name); // 'Jane'
 * ```
 */
export function clone<T extends object = object>(obj: T): DeepMerge<object, T> {
	return cloneWithOriginalBehavior({} as object, obj);
}

/**
 * Deeply merges multiple objects into a new object.
 * 
 * - Only plain objects are merged recursively.
 * - Non-plain objects (like Date, RegExp, Map, etc.) are cloned or overwritten.
 * - Arrays are replaced by default (optionally configurable).
 * - Primitives and functions are always overwritten.
 * 
 * Type-specific behaviour:
 * - `undefined` / `null` — replaces target
 * - Primitives (string, number, boolean) — replaces target
 * - `Array` — replaced (not merged)
 * - `Date` — cloned with `new Date(...)`
 * - `RegExp`, `Map`, `Set` — shallow cloned
 * - `Function`, `Promise`, `Symbol` — treated as-is (overwritten)
 * - Class instances — not merged, replaced as-is
 * 
 * @example
 * ```ts
 * const defaults = { theme: 'light', features: { darkMode: false } };
 * const userPrefs = { features: { darkMode: true, notifications: true } };
 * 
 * const config = deepMerge(defaults, userPrefs);
 * console.log(config);
 * // {
 * //   theme: 'light',
 * //   features: { darkMode: true, notifications: true }
 * // }
 * ```
 */
export function deepMerge<T extends object = object>(...objects: T[]): DeepMerge<object, T> {
	return mergeWith({} as object, ...objects);
}

/**
 * Transforms the values of an object using a mapping function or property key.
 * 
 * @example
 * ```ts
 * const users = {
 *   user1: { name: 'John', age: 30 },
 *   user2: { name: 'Jane', age: 25 }
 * };
 * 
 * // Extract names
 * const names = mapValues(users, 'name');
 * console.log(names); // { user1: 'John', user2: 'Jane' }
 * 
 * // Transform with function
 * const ages = mapValues(users, user => user.age * 2);
 * console.log(ages); // { user1: 60, user2: 50 }
 * ```
 */
export function mapValues<K extends string, V, NV = V>(
	obj: Record<K, V>,
	iteratee: keyof V | ((value: V) => NV | undefined),
): Record<K, V> {
	return Object.fromEntries(
		Object.entries(obj).map(([k, v]) => (isFunction(iteratee) ? [k, iteratee(v as V)] : [k, (v as V)?.[iteratee]])),
	);
}

/**
 * Creates a deeply immutable readonly copy of an object.
 * 
 * @example
 * ```ts
 * const original = { name: 'John', age: 30 };
 * const readonly = makeReadonly(original);
 * 
 * // Attempting to modify readonly object will throw an error
 * readonly.name = 'Jane'; // Throws TypeError
 * ```
 */
export function makeReadonly<T extends object>(obj: T): DeepReadonly<DeepMerge<object, T>> {
	return deepFreeze(clone(obj));
}

/**
 * Recursively traverses an object, applying transformations to each key-value pair.
 * Creates a new copy with transformations applied.
 * 
 * @param obj - The object or array to traverse
 * @param fn - Transformation function that receives {key, value} and TraverseNode, returns {key, value} or undefined (no changes)
 * 
 * @example
 * ```ts
 * // Transform all string values to uppercase
 * const data = { name: 'john', nested: { title: 'mr' } };
 * const result = traverse(data, ({ key, value }) => {
 *   if (typeof value === 'string') {
 *     return { key, value: value.toUpperCase() };
 *   }
 * });
 * console.log(result); // { name: 'JOHN', nested: { title: 'MR' } }
 * 
 * // Rename keys
 * const renamed = traverse(data, ({ key, value }) => {
 *   if (key === 'name') {
 *     return { key: 'fullName', value };
 *   }
 * });
 * console.log(renamed); // { fullName: 'john', nested: { title: 'mr' } }
 * 
 * // Control traversal depth using TraverseNode
 * const shallow = traverse(data, ({ key, value }, node) => {
 *   if (key === 'nested') {
 *     node.ignoreChildren(); // Don't traverse into nested objects
 *   }
 * });
 * 
 * // Async transformation
 * const asyncResult = await traverse(data, async ({ key, value }) => {
 *   if (typeof value === 'string') {
 *     const processed = await someAsyncOperation(value);
 *     return { key, value: processed };
 *   }
 * });
 * ```
 */
export function traverse(
	obj: any,
	fn: (arg: { key: string; value: any }, node: TraverseNode) => { key: string; value: any } | undefined,
): any;
/**
 * @internal
 */
export function traverse(
	obj: any,
	fn: (
		arg: { key: string; value: any },
		node: TraverseNode,
	) => Promise<{ key: string; value: any }> | Promise<undefined>,
): Promise<any>;
export function traverse(
	obj: any,
	fn: (
		arg: { key: string; value: any },
		node: TraverseNode,
	) => { key: string; value: any } | Promise<{ key: string; value: any }> | undefined | Promise<undefined>,
): any | Promise<any> {
	// Test if the callback is async by calling it once and checking if it returns a Promise
	const testResult = fn({ key: 'test', value: 'test' }, new TraverseNode());
	const isAsync = testResult instanceof Promise;

	if (isAsync) {
		// Handle async case
		if (isArray(obj)) {
			return Promise.all(obj.map(async (value) => await traverseObject(value, fn)));
		}
		if (isPlainObject(obj)) {
			return traverseObject(obj, fn);
		}
		return obj;
	}

	// Handle sync case
	if (isArray(obj)) {
		return obj.map((value) => traverseObject(value, fn));
	}
	if (isPlainObject(obj)) {
		return traverseObject(obj, fn);
	}
	return obj;
}

// Helper functions

function deepFreeze<T>(obj: T): DeepReadonly<T> {
	Object.freeze(obj);
	for (const key of Object.getOwnPropertyNames(obj)) {
		const val = (obj as any)[key];
		if (
			typeof val === 'object' &&
			val !== null &&
			!Object.isFrozen(val)
		) {
			deepFreeze(val);
		}
	}
	return obj as DeepReadonly<T>;
}

function mergeWith<T extends object = object, S extends object = T>(target: T, ...sources: S[]): DeepMerge<T, S> {
	if (!sources.length) return target as any;

	const source = sources.shift();
	if (source === undefined) return target as any;

	if (isPlainObject(target) && isPlainObject(source)) {
		// Create a new object to avoid mutating the original
		const result = {} as any;

		// First, handle all keys from target
		for (const key of objectKeys(target)) {
			if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;

			const targetValue = (target as any)[key];
			result[key] = cloneValue(targetValue);
		}

		// Then, handle all keys from source (potentially overwriting target values)
		for (const key of objectKeys(source)) {
			if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;

			const sourceValue = (source as any)[key];
			const targetValue = result[key];

			// Handle null or undefined - always replace
			if (sourceValue === null || sourceValue === undefined) {
				result[key] = sourceValue;
			}
			// Handle arrays - replace, don't merge
			else if (Array.isArray(sourceValue)) {
				result[key] = [...sourceValue];
			}
			// Handle plain objects - merge recursively
			else if (isPlainObject(sourceValue)) {
				if (!isPlainObject(targetValue)) {
					result[key] = cloneValue(sourceValue);
				} else {
					result[key] = mergeWith(targetValue, sourceValue);
				}
			}
			// Handle all other values (primitives, functions, special objects)
			else {
				result[key] = cloneValue(sourceValue);
			}
		}

		return mergeWith(result as T, ...sources) as DeepMerge<T, S>;
	}

	return mergeWith(target, ...sources);
}

function cloneValue(value: any): any {
	// Handle null, undefined, primitives
	if (value === null || value === undefined || typeof value !== 'object') {
		return value;
	}

	// Handle arrays
	if (Array.isArray(value)) {
		return [...value];
	}

	// Handle functions (return as-is)
	if (isFunction(value)) {
		return value;
	}

	// Handle special objects (Date, RegExp, Map, Set)
	if (!isPlainObject(value)) {
		return cloneSpecialObject(value);
	}

	// Handle plain objects (create shallow clone)
	const cloned = {} as any;
	for (const key of Object.keys(value)) {
		cloned[key] = cloneValue((value as any)[key]);
	}
	return cloned;
}

function traverseObject(
	obj: any,
	fn: (
		arg: { key: string; value: any },
		node: TraverseNode,
	) => { key: string; value: any } | Promise<{ key: string; value: any }> | undefined | Promise<undefined>,
	node: TraverseNode = new TraverseNode(),
): any {
	const cloned = clone(obj);
	const result: any = {};
	const keys = Object.keys(cloned);

	// Process each key and collect results
	const processedEntries: Array<{ key: string; transformResult: any; currentNode: TraverseNode; originalValue: any }> =
		[];
	let hasAsyncResult = false;

	for (const key of keys) {
		const currentNode = new TraverseNode([...node._path, key]);
		const transformResult = fn({ key, value: cloned[key] }, currentNode);

		if (transformResult instanceof Promise) {
			hasAsyncResult = true;
		}

		processedEntries.push({ key, transformResult, currentNode, originalValue: cloned[key] });
	}

	// Process all entries using a single approach
	if (hasAsyncResult) {
		return processEntriesAsync(processedEntries, result, fn);
	}
	return processEntriesSync(processedEntries, result, fn);
}

async function processEntriesAsync(
	entries: Array<{ key: string; transformResult: any; currentNode: TraverseNode; originalValue: any }>,
	result: any,
	fn: (
		arg: { key: string; value: any },
		node: TraverseNode,
	) => { key: string; value: any } | Promise<{ key: string; value: any }> | undefined | Promise<undefined>,
): Promise<any> {
	for (const { key, transformResult, currentNode, originalValue } of entries) {
		const resolvedResult = await transformResult;
		const { newKey, newValue } = await processEntryCommon(key, resolvedResult, currentNode, originalValue, fn, true);
		result[newKey] = newValue;
	}
	return result;
}

function processEntriesSync(
	entries: Array<{ key: string; transformResult: any; currentNode: TraverseNode; originalValue: any }>,
	result: any,
	fn: (
		arg: { key: string; value: any },
		node: TraverseNode,
	) => { key: string; value: any } | Promise<{ key: string; value: any }> | undefined | Promise<undefined>,
): any {
	for (const { key, transformResult, currentNode, originalValue } of entries) {
		const { newKey, newValue } = processEntryCommon(key, transformResult, currentNode, originalValue, fn);
		result[newKey] = newValue;
	}
	return result;
}

function processEntryCommon(
	key: string,
	resolvedResult: any,
	currentNode: TraverseNode,
	originalValue: any,
	fn: (
		arg: { key: string; value: any },
		node: TraverseNode,
	) => { key: string; value: any } | Promise<{ key: string; value: any }> | undefined | Promise<undefined>,
	isAsync = false,
): any {
	// If function returns undefined, use original key and value (no modifications)
	let newKey: string;
	let newValue: any;
	if (resolvedResult === undefined) {
		newKey = key;
		newValue = originalValue;
	} else {
		({ key: newKey, value: newValue } = resolvedResult);
	}

	// Recursively process nested objects and arrays if not ignored
	if (newValue && !currentNode._ignoreChildren) {
		if (isPlainObject(newValue)) {
			const result = traverseObject(newValue, fn, currentNode);
			if (isAsync) {
				return Promise.resolve(result).then((resolvedValue) => ({ newKey, newValue: resolvedValue }));
			}
			newValue = result;
		} else if (isArray(newValue)) {
			if (isAsync) {
				return processArrayAsync(newValue, currentNode, fn).then((processedArray) => ({
					newKey,
					newValue: processedArray,
				}));
			}
			for (let idx = 0; idx < newValue.length; idx++) {
				if (newValue[idx] && isPlainObject(newValue[idx])) {
					const childNode = new TraverseNode([...currentNode._path, idx]);
					newValue[idx] = traverseObject(newValue[idx], fn, childNode);
				}
			}
		}
	}

	return { newKey, newValue };
}

async function processArrayAsync(
	array: any[],
	currentNode: TraverseNode,
	fn: (
		arg: { key: string; value: any },
		node: TraverseNode,
	) => { key: string; value: any } | Promise<{ key: string; value: any }> | undefined | Promise<undefined>,
): Promise<any[]> {
	for (let idx = 0; idx < array.length; idx++) {
		if (array[idx] && isPlainObject(array[idx])) {
			const childNode = new TraverseNode([...currentNode._path, idx]);
			array[idx] = await traverseObject(array[idx], fn, childNode);
		}
	}
	return array;
}

/**
 * Provides navigation and control information during object traversal.
 */
class TraverseNode {
	public _path: (string | number)[];
	public _ignoreChildren: boolean;

	constructor(path: (string | number)[] = [], ignoreChildren = false) {
		this._path = path;
		this._ignoreChildren = ignoreChildren;
	}

	/**
	 * Prevents recursive traversal of child nodes for this specific node.
	 * 
	 * @example
	 * ```ts
	 * traverse(data, ({ key, value }, node) => {
	 *   if (key === 'sensitiveData') {
	 *     node.ignoreChildren(); // Don't traverse into this object
	 *   }
	 * });
	 * ```
	 */
	ignoreChildren(): void {
		this._ignoreChildren = true;
	}

	/**
	 * Returns the current path as an array of keys/indices.
	 * 
	 * @example
	 * ```ts
	 * const data = { users: [{ name: 'John' }] };
	 * traverse(data, ({ key, value }, node) => {
	 *   console.log(node.getPath()); 
	 *   // First call: []
	 *   // Second call: ['users']
	 *   // Third call: ['users', 0]
	 *   // Fourth call: ['users', 0, 'name']
	 * });
	 * ```
	 */
	getPath(): (string | number)[] {
		return this._path;
	}
}

function objectKeys<T extends object>(obj: T) {
	return Object.keys(obj) as Array<`${keyof T & (string | number | boolean | null | undefined)}`>;
}

function cloneSpecialObject(obj: any): any {
	// Clone Date objects
	if (obj instanceof Date) {
		return new Date(obj.getTime());
	}
	// Clone RegExp objects
	if (obj instanceof RegExp) {
		return new RegExp(obj.source, obj.flags);
	}
	// Clone Map objects
	if (obj instanceof Map) {
		return new Map(obj);
	}
	// Clone Set objects
	if (obj instanceof Set) {
		return new Set(obj);
	}
	// For other objects (Functions, Promises, Symbols, class instances), return as-is
	return obj;
}

function isMergableObject(item: any): item is object {
	return isPlainObject(item) && !Array.isArray(item);
}

function cloneWithOriginalBehavior<T extends object = object, S extends object = T>(target: T, source: S): DeepMerge<T, S> {
	if (Array.isArray(target) && Array.isArray(source)) target.push(...source);

	if (isMergableObject(target) && isMergableObject(source)) {
		for (const key of objectKeys(source)) {
			if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;

			// @ts-expect-error
			if (Array.isArray(source[key])) {
				// @ts-expect-error
				if (!target[key])
					// @ts-expect-error
					target[key] = [];

				// @ts-expect-error
				cloneWithOriginalBehavior(target[key], source[key]);
			}
			// @ts-expect-error
			else if (isMergableObject(source[key])) {
				// @ts-expect-error
				if (!target[key])
					// @ts-expect-error
					target[key] = {};

				// @ts-expect-error
				cloneWithOriginalBehavior(target[key], source[key]);
			} else {
				// @ts-expect-error
				target[key] = source[key];
			}
		}
	}

	return target as DeepMerge<T, S>;
}
