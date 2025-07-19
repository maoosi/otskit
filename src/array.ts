import { isFunction, isPlainObject } from './is';
import { clone } from './object';

// Types
type DiffStatus = 'moved' | 'added' | 'equal' | 'deleted' | 'updated';

interface Diff<P, N> {
	previousItem: P | null;
	newItem: N | null;
	status: DiffStatus;
	previousIndex: number | null;
	newIndex: number | null;
}

/**
 * Creates an array of shuffled values.
 * 
 * @example
 * ```ts
 * const arr = [1, 2, 3, 4, 5];
 * const shuffled = shuffle(arr);
 * console.log(shuffled); // [3, 1, 5, 2, 4]
 * ```
 */
export function shuffle<T>(array: readonly T[]): T[] {
	const arr = [...array];
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

/**
 * Creates a duplicate-free version of an array.
 * 
 * @example
 * ```ts
 * const arr = [1, 1, 3, 4, 5, 4];
 * const uniqueArray = unique(arr);
 * console.log(uniqueArray); // [1, 3, 4, 5]
 * ```
 */
export function unique<T>(array: readonly T[]): T[] {
	return Array.from(new Set(array));
}

/**
 * Creates a duplicate-free version of an array using a property or function to determine uniqueness.
 * 
 * @example
 * ```ts
 * const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }, { id: 1, name: 'John' }];
 * 
 * // Using a property
 * const uniqueUsers = uniqueBy(users, 'id');
 * console.log(uniqueUsers); // [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
 * 
 * // Using a function
 * const uniqueByName = uniqueBy(users, user => user.name.toLowerCase());
 * ```
 */
export function uniqueBy<T>(array: readonly T[], iteratee: keyof T | ((a: any) => any)): T[] {
	return array.reduce((acc: T[], cur: any) => {
		const computed = isFunction(iteratee);
		const index = acc.findIndex((item: any) =>
			computed
				? iteratee(item) === iteratee(cur)
				: typeof cur?.[iteratee] !== 'undefined' && item?.[iteratee] === cur?.[iteratee],
		);
		if (index === -1) acc.push(cur);
		return acc;
	}, []);
}

/**
 * Returns a sorted copy of an array using one or more properties or functions.
 * 
 * @example
 * ```ts
 * const users = [
 *   { name: 'John', age: 30 },
 *   { name: 'Jane', age: 25 },
 *   { name: 'Bob', age: 35 }
 * ];
 * 
 * // Sort by age ascending
 * const byAge = orderBy(users, 'age');
 * console.log(byAge); // [{ name: 'Jane', age: 25 }, { name: 'John', age: 30 }, { name: 'Bob', age: 35 }]
 * 
 * // Sort by multiple fields
 * const sorted = orderBy(users, ['age', 'name'], ['desc', 'asc']);
 * ```
 */
export function orderBy<T>(
	array: readonly T[],
	iteratee: (keyof T | ((a: T) => any)) | (keyof T | ((a: T) => any))[],
	order?: ('asc' | 'desc') | ('asc' | 'desc')[],
): T[] {
	const arr = deepCopy(array);
	const iterateeArr = Array.isArray(iteratee) ? iteratee : [iteratee];
	const orderArr = Array.isArray(order) ? order : [order];
	for (let i = iterateeArr.length - 1; i >= 0; i--) {
		arr.sort(sortBy<T>(iterateeArr[i], orderArr?.[i] || 'asc'));
	}
	return arr;
}

/**
 * Creates a deep copy of an array, recursively cloning any objects within it.
 * 
 * @example
 * ```ts
 * const users = [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }];
 * const copied = deepCopy(users);
 * copied[0].name = 'Johnny';
 * console.log(users[0].name); // 'John' (original unchanged)
 * console.log(copied[0].name); // 'Johnny'
 * ```
 */
export function deepCopy<T>(array: readonly T[]): T[] {
	return (array?.map((item) => (isPlainObject(item) ? clone(item) : item)) || []) as T[];
}

/**
 * Selects random items from an array.
 * 
 * @example
 * ```ts
 * const colors = ['red', 'blue', 'green', 'yellow'];
 * 
 * // Get one random item (returns array with single element)
 * const randomColor = sample(colors);
 * console.log(randomColor); // ['blue']
 * 
 * // Get multiple random items (with possible duplicates)
 * const randomColors = sample(colors, 3);
 * console.log(randomColors); // ['red', 'red', 'green']
 * ```
 */
export function sample<T>(array: T[], quantity?: number) {
	return Array.from({ length: quantity || 1 }, (_) => array[Math.round(Math.random() * (array.length - 1))]);
}

/**
 * Returns a single random item from an array.
 * 
 * @example
 * ```ts
 * const fruits = ['apple', 'banana', 'orange', 'grape'];
 * const randomFruit = randomItem(fruits);
 * console.log(randomFruit); // 'banana'
 * ```
 */
export function randomItem<T>(arr: T[]) {
	return sample(arr, 1)[0];
}

/**
 * Compares two arrays of objects and identifies what changed between them.
 * 
 * @param previousArray - The original array to compare from
 * @param newArray - The updated array to compare to
 * @param keysToCompare - Object properties to check for equality (default: all properties)
 * @param uniqueKeys - Properties that uniquely identify objects (for detecting moves/updates)
 * 
 * @example
 * ```ts
 * const oldUsers = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
 * const newUsers = [{ id: 2, name: 'Jane Smith' }, { id: 3, name: 'Bob' }];
 * 
 * const diffs = diffObjectsInArrays(oldUsers, newUsers, ['name'], ['id']);
 * 
 * console.log(diffs); // [
 * //   {
 * //     previousItem: { id: 2, name: 'Jane' },
 * //     newItem: { id: 2, name: 'Jane Smith' },
 * //     status: 'updated',
 * //     previousIndex: 1,
 * //     newIndex: 0
 * //   },
 * //   {
 * //     previousItem: null,
 * //     newItem: { id: 3, name: 'Bob' },
 * //     status: 'added',
 * //     previousIndex: null,
 * //     newIndex: 1
 * //   },
 * //   {
 * //     previousItem: { id: 1, name: 'John' },
 * //     newItem: null,
 * //     status: 'deleted',
 * //     previousIndex: 0,
 * //     newIndex: null
 * //   }
 * // ]
 * ```
 */
export function diffObjectsInArrays<T extends Record<string, any>[]>(
	previousArray: T,
	newArray: T,
	keysToCompare?: (keyof T[number])[],
	uniqueKeys?: (keyof T[number])[],
): Diff<T[number], T[number]>[] {
	const diffs: Diff<T[number], T[number]>[] = [];

	// Helper function to find object by keys in array
	const findObjByKey = (arr: T, objToFind: T[number], keys: (keyof T[number])[]) => {
		return arr.find((obj) => keys.every((key) => (obj as any)[key] === objToFind[key]));
	};

	// Helper function to determine if objects are equal based on keysToCompare
	const areObjectsEqual = (obj1: T[number], obj2: T[number], compareKeys: (keyof T[number])[]) => {
		return compareKeys.every((key) => obj1[key] === obj2[key]);
	};

	// Mark items in previous array that still exist in the new array
	const markedPreviousItems: boolean[] = new Array(previousArray.length).fill(false);

	// Check for added or updated items
	newArray.forEach((newItem, newIndex) => {
		const previousItem = uniqueKeys
			? findObjByKey(previousArray, newItem, uniqueKeys)
			: findObjByKey(previousArray, newItem, keysToCompare ?? Object.keys(newItem));

		if (!previousItem) {
			// Item added
			diffs.push({ previousItem: null, newItem, status: 'added', previousIndex: null, newIndex });
		} else {
			const previousIndex = previousArray.indexOf(previousItem);
			markedPreviousItems[previousIndex] = true;

			if (!areObjectsEqual(newItem, previousItem, keysToCompare ?? Object.keys(newItem))) {
				// With unique keys, and keysToCompare show differences => item updated
				diffs.push({ previousItem: previousItem, newItem, status: 'updated', previousIndex, newIndex });
			} else if (previousIndex !== newIndex) {
				// Item moved
				diffs.push({ previousItem: previousItem, newItem, status: 'moved', previousIndex, newIndex });
			} else {
				// Item unchanged
				diffs.push({ previousItem: previousItem, newItem, status: 'equal', previousIndex, newIndex });
			}
		}
	});

	// Check for deleted items
	markedPreviousItems.forEach((marked, index) => {
		if (!marked) {
			// Item deleted
			diffs.push({ previousItem: previousArray[index], newItem: null, status: 'deleted', previousIndex: index, newIndex: null });
		}
	});

	return diffs;
}

/**
 * Checks if an array contains a specific value with proper type narrowing.
 * 
 * @example
 * ```ts
 * const fruits = ['apple', 'banana', 'orange'] as const;
 * const input = 'apple';
 * 
 * if (includes(fruits, input)) {
 *   // TypeScript now knows input is 'apple' | 'banana' | 'orange'
 *   console.log(`Found fruit: ${input}`);
 * }
 * ```
 */
export function includes<T extends readonly any[] | Array<any>>(
	array: T,
	searchElement: any,
): searchElement is T[number] {
	return array.includes(searchElement);
}

// Helper function for sorting
function sortBy<T>(key: keyof T | ((a: T) => any), order: 'asc' | 'desc') {
	const gt = order === 'asc' ? 1 : -1;
	const lt = order === 'asc' ? -1 : 1;
	const fn = isFunction(key);
	return (a: T, b: T) => {
		const l = fn ? key(a) : a[key];
		const r = fn ? key(b) : b[key];
		return l > r ? gt : r > l ? lt : 0;
	};
}
