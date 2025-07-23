import { describe, expect, test } from 'vitest';
import { deepCopy, diffObjectsInArrays, includes, orderBy, randomItem, sample, shuffle, unique, uniqueBy } from '../src/array';

describe('array', () => {
    test('shuffle', () => {
        const arr = [1, 2, 3, 4];
        const shuffled = shuffle(arr);

        expect(shuffled).toHaveLength(arr.length);
        expect(shuffled.sort()).toEqual(arr.sort());
        expect(arr).toEqual([1, 2, 3, 4]); // Original unchanged
    });

    test('unique', () => {
        expect(unique([2, 1, 2])).toStrictEqual([2, 1]);
    });

    test('uniqueBy', () => {
        expect(uniqueBy([{ x: 1 }, { x: 2 }, { x: 1 }], 'x')).toStrictEqual([{ x: 1 }, { x: 2 }]);
        expect(uniqueBy([2.1, 1.2, 2.3], Math.floor)).toStrictEqual([2.1, 1.2]);
        expect(uniqueBy([{ y: undefined }, { y: null }, { y: 0 }, { y: '' }], 'y')).toStrictEqual([
            { y: undefined },
            { y: null },
            { y: 0 },
            { y: '' },
        ]);
    });

    test('orderBy', () => {
        const users = [
            { user: 'fred', age: 48 },
            { user: 'barney1', age: 34 },
            { user: 'fred', age: 40 },
            { user: 'barney2', age: 34 },
        ];
        expect(orderBy(users, ['user', 'age'], ['asc', 'desc'])).toStrictEqual([
            { user: 'barney1', age: 34 },
            { user: 'barney2', age: 34 },
            { user: 'fred', age: 48 },
            { user: 'fred', age: 40 },
        ]);
        expect(orderBy(users, ['user', 'age'], ['asc', 'asc'])).toStrictEqual([
            { user: 'barney1', age: 34 },
            { user: 'barney2', age: 34 },
            { user: 'fred', age: 40 },
            { user: 'fred', age: 48 },
        ]);
        expect(orderBy(users, ['age', 'user'], ['asc', 'desc'])).toStrictEqual([
            { user: 'barney2', age: 34 },
            { user: 'barney1', age: 34 },
            { user: 'fred', age: 40 },
            { user: 'fred', age: 48 },
        ]);
        expect(orderBy(users, ['age', 'user'], ['desc', 'asc'])).toStrictEqual([
            { user: 'fred', age: 48 },
            { user: 'fred', age: 40 },
            { user: 'barney1', age: 34 },
            { user: 'barney2', age: 34 },
        ]);
        const nested = [
            { user: 'fred', nested: { age: 48 } },
            { user: 'barney1', nested: { age: 34 } },
            { user: 'fred', nested: { age: 40 } },
            { user: 'barney2', nested: { age: 34 } },
        ];
        expect(orderBy(nested, [(item) => item.nested.age, 'user'], ['asc', 'desc'])).toStrictEqual([
            { user: 'barney2', nested: { age: 34 } },
            { user: 'barney1', nested: { age: 34 } },
            { user: 'fred', nested: { age: 40 } },
            { user: 'fred', nested: { age: 48 } },
        ]);
    });

    test('deepCopy', () => {
        const original = [{ a: 1 }, { b: 2 }, 'string', 42];
        const copied = deepCopy(original);

        expect(copied).toEqual(original);
        expect(copied).not.toBe(original);
        expect(copied[0]).not.toBe(original[0]); // Deep copy of objects
        expect(copied[1]).not.toBe(original[1]); // Deep copy of objects
        expect(copied[2]).toBe(original[2]); // Primitives are the same
        expect(copied[3]).toBe(original[3]); // Primitives are the same

        // Test with empty array
        expect(deepCopy([])).toEqual([]);

        // Test with nested objects
        const nested = [{ a: { b: 1 } }];
        const copiedNested = deepCopy(nested);
        expect(copiedNested).toEqual(nested);
        expect(copiedNested[0].a).not.toBe(nested[0].a);
    });

    test('sample', () => {
        const arr = [1, 2, 3, 4, 5];

        // Test single sample
        const singleSample = sample(arr, 1);
        expect(singleSample).toHaveLength(1);
        expect(arr).toContain(singleSample[0]);

        // Test multiple samples
        const multipleSamples = sample(arr, 3);
        expect(multipleSamples).toHaveLength(3);
        for (const item of multipleSamples) {
            expect(arr).toContain(item);
        }

        // Test default quantity
        const defaultSample = sample(arr);
        expect(defaultSample).toHaveLength(1);
        expect(arr).toContain(defaultSample[0]);

        // Test with empty array
        expect(sample([])).toHaveLength(1);
    });

    test('randomItem', () => {
        const arr = [1, 2, 3, 4, 5];

        // Test multiple calls to ensure randomness
        const results = new Set();
        for (let i = 0; i < 50; i++) {
            const item = randomItem(arr);
            expect(arr).toContain(item);
            results.add(item);
        }

        // Should get some variety over 50 calls
        expect(results.size).toBeGreaterThan(1);

        // Test single item array
        expect(randomItem([42])).toBe(42);
    });

    test('includes', () => {
        expect(includes(['a', 'b', 'c'], 'a')).toBe(true);
        expect(includes(['a', 'b', 'c'], 'd')).toBe(false);
        expect(includes([1, 2, 3], 1)).toBe(true);
        expect(includes([1, 2, 3], 4)).toBe(false);
        expect(includes([1, 'two', true, null], null)).toBe(true);
        expect(includes([1, 'two', true, null], false)).toBe(false);
    });

    test('diffObjectsInArrays', () => {
        // Items reordered
        const reorderResult = diffObjectsInArrays(
            [{ name: 'a' }, { name: 'b' }],
            [{ name: 'b' }, { name: 'a' }],
            ['name']
        );
        expect(reorderResult).toHaveLength(2);
        expect(reorderResult[0]).toEqual({
            previousItem: { name: 'b' },
            newItem: { name: 'b' },
            status: 'moved',
            previousIndex: 1,
            newIndex: 0
        });
        expect(reorderResult[1]).toEqual({
            previousItem: { name: 'a' },
            newItem: { name: 'a' },
            status: 'moved',
            previousIndex: 0,
            newIndex: 1
        });

        // Item added at end
        const addedLastResult = diffObjectsInArrays(
            [{ name: 'a' }],
            [{ name: 'a' }, { name: 'b' }],
            ['name']
        );
        expect(addedLastResult).toHaveLength(2);
        expect(addedLastResult[0]).toEqual({
            previousItem: { name: 'a' },
            newItem: { name: 'a' },
            status: 'equal',
            previousIndex: 0,
            newIndex: 0
        });
        expect(addedLastResult[1]).toEqual({
            previousItem: null,
            newItem: { name: 'b' },
            status: 'added',
            previousIndex: null,
            newIndex: 1
        });

        // Item added at beginning
        const addedFirstResult = diffObjectsInArrays(
            [{ name: 'b' }],
            [{ name: 'a' }, { name: 'b' }],
            ['name']
        );
        expect(addedFirstResult).toHaveLength(2);
        expect(addedFirstResult[0]).toEqual({
            previousItem: null,
            newItem: { name: 'a' },
            status: 'added',
            previousIndex: null,
            newIndex: 0
        });
        expect(addedFirstResult[1]).toEqual({
            previousItem: { name: 'b' },
            newItem: { name: 'b' },
            status: 'moved',
            previousIndex: 0,
            newIndex: 1
        });

        // Item deleted
        const deletedResult = diffObjectsInArrays(
            [{ name: 'a' }, { name: 'b' }],
            [{ name: 'a' }],
            ['name']
        );
        expect(deletedResult).toHaveLength(2);
        expect(deletedResult[0]).toEqual({
            previousItem: { name: 'a' },
            newItem: { name: 'a' },
            status: 'equal',
            previousIndex: 0,
            newIndex: 0
        });
        expect(deletedResult[1]).toEqual({
            previousItem: { name: 'b' },
            newItem: null,
            status: 'deleted',
            previousIndex: 1,
            newIndex: null
        });

        // Item updated using unique keys
        const updatedResult = diffObjectsInArrays(
            [{ id: 1, name: 'old' }, { id: 2, name: 'stable' }],
            [{ id: 1, name: 'new' }, { id: 2, name: 'stable' }],
            ['name'],
            ['id']
        );
        expect(updatedResult).toHaveLength(2);
        expect(updatedResult[0]).toEqual({
            previousItem: { id: 1, name: 'old' },
            newItem: { id: 1, name: 'new' },
            status: 'updated',
            previousIndex: 0,
            newIndex: 0
        });
        expect(updatedResult[1]).toEqual({
            previousItem: { id: 2, name: 'stable' },
            newItem: { id: 2, name: 'stable' },
            status: 'equal',
            previousIndex: 1,
            newIndex: 1
        });

        // Properties updated but not part of comparison keys
        const ignoredPropsResult = diffObjectsInArrays(
            [{ name: 'test', quantity: 1 }],
            [{ name: 'test', quantity: 2 }],
            ['name']
        );
        expect(ignoredPropsResult).toHaveLength(1);
        expect(ignoredPropsResult[0]).toEqual({
            previousItem: { name: 'test', quantity: 1 },
            newItem: { name: 'test', quantity: 2 },
            status: 'equal',
            previousIndex: 0,
            newIndex: 0
        });
    });
});
