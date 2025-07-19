import { describe, expect, test } from 'vitest';
import {
    clearNull,
    clearNullish,
    clearUndefined,
    clone,
    deepMerge,
    makeReadonly,
    mapValues,
    omit,
    pick,
    traverse,
} from '../src/object';

describe('object', () => {
    test('clone', () => {
        // Basic cloning
        const obj1 = { a: ['A', 'B'] };
        expect(clone(obj1)).toStrictEqual({ a: ['A', 'B'] });
        expect(clone(obj1)).not.toBe(obj1);

        // Deep copy behavior - nested objects
        const deepObj = {
            user: { name: 'John', details: { age: 30, preferences: { theme: 'dark' } } },
            items: ['item1', 'item2'], // Use primitive arrays for clone test
            config: { features: { notifications: true, sound: false } },
            metadata: { tags: ['tag1', 'tag2'], count: 5 },
        };
        const clonedDeep = clone(deepObj);

        expect(clonedDeep).toStrictEqual(deepObj);
        expect(clonedDeep).not.toBe(deepObj);
        expect(clonedDeep.user).not.toBe(deepObj.user);
        expect(clonedDeep.user.details).not.toBe(deepObj.user.details);
        expect(clonedDeep.user.details.preferences).not.toBe(deepObj.user.details.preferences);
        expect(clonedDeep.items).not.toBe(deepObj.items);
        expect(clonedDeep.config).not.toBe(deepObj.config);
        expect(clonedDeep.metadata).not.toBe(deepObj.metadata);
        expect(clonedDeep.metadata.tags).not.toBe(deepObj.metadata.tags);

        // Verify deep changes don't affect original
        clonedDeep.user.name = 'Jane';
        clonedDeep.user.details.age = 31;
        clonedDeep.items.push('newItem');
        clonedDeep.metadata.tags.push('newTag');
        clonedDeep.config.features.notifications = false;

        expect(deepObj.user.name).toBe('John');
        expect(deepObj.user.details.age).toBe(30);
        expect(deepObj.items).toStrictEqual(['item1', 'item2']);
        expect(deepObj.metadata.tags).toStrictEqual(['tag1', 'tag2']);
        expect(deepObj.config.features.notifications).toBe(true);

        // Function preservation
        const func = () => 'test result';
        const withFunction = {
            getValue: func,
            data: { count: 1 },
            nested: { fn: () => 'nested' },
        };
        const clonedWithFunction = clone(withFunction);

        expect(clonedWithFunction.getValue).toBe(func);
        expect((clonedWithFunction.getValue as any)()).toBe('test result');
        expect((clonedWithFunction.nested.fn as any)()).toBe('nested');
        expect(clonedWithFunction.data).not.toBe(withFunction.data);

        // Non-plain objects preservation (copied by reference)
        const date = new Date('2023-01-01');
        const regex = /test/gi;
        const withSpecialObjects = {
            created: date,
            pattern: regex,
            data: { timestamp: date },
        };
        const clonedSpecial = clone(withSpecialObjects);

        expect(clonedSpecial.created).toEqual(date);
        expect(clonedSpecial.created).toBe(date); // Non-plain objects are copied by reference
        expect(clonedSpecial.pattern).toEqual(regex);
        expect(clonedSpecial.pattern).toBe(regex); // Non-plain objects are copied by reference
        expect(clonedSpecial.data.timestamp).toEqual(date);
        expect(clonedSpecial.data.timestamp).toBe(date); // Same reference
        expect(clonedSpecial.data).not.toBe(withSpecialObjects.data); // But containing object is cloned

        // Edge cases
        const edgeCases = {
            nullValue: null,
            undefinedValue: undefined,
            emptyObj: {},
            emptyArray: [],
            zero: 0,
            emptyString: '',
        };
        const clonedEdges = clone(edgeCases);

        expect(clonedEdges).toStrictEqual(edgeCases);
        expect(clonedEdges.emptyObj).not.toBe(edgeCases.emptyObj);
        expect(clonedEdges.emptyArray).not.toBe(edgeCases.emptyArray);
    });

    test('merge', () => {
        // Basic merging with array replacement (not concatenation)
        const obj0 = { a: ['A', 'B'] };
        const obj1 = clone(obj0);
        const obj2 = { a: ['C'], b: ['D'] };
        expect(deepMerge(obj1, obj2)).toStrictEqual({ a: ['C'], b: ['D'] });
        expect(obj1).toStrictEqual(obj0);

        // Deep merging behavior with arrays replaced
        const base = {
            user: { name: 'John', age: 30 },
            config: { theme: 'light', features: { notifications: true } },
            items: ['item1'],
        };
        const override = {
            user: { name: 'John', age: 31, email: 'john@example.com' },
            config: { theme: 'light', features: { notifications: false, sound: true } },
            items: ['item2'],
            newProp: 'new value',
        } as any;
        const merged = deepMerge(base, override);

        expect(merged).toStrictEqual({
            user: { name: 'John', age: 31, email: 'john@example.com' },
            config: { theme: 'light', features: { notifications: false, sound: true } },
            items: ['item2'], // Array replaced, not concatenated
            newProp: 'new value',
        });

        // Verify original objects unchanged
        expect(base.user.age).toBe(30);
        expect((base.config.features as any).sound).toBeUndefined();
        expect(base.items).toStrictEqual(['item1']);

        // Multiple object merging
        const mergeObj1 = { a: 1, nested: { x: 1 } };
        const mergeObj2 = { b: 2, nested: { y: 2 } } as any;
        const mergeObj3 = { c: 3, nested: { z: 3 } } as any;
        const multiMerged = deepMerge(mergeObj1, mergeObj2, mergeObj3);

        expect(multiMerged).toStrictEqual({
            a: 1,
            b: 2,
            c: 3,
            nested: { x: 1, y: 2, z: 3 },
        });

        // Function preservation in merge (functions are overwritten)
        const func1 = () => 'func1';
        const func2 = () => 'func2';
        const withFunctions1 = {
            fn: func1,
            data: { count: 1 },
        };
        const withFunctions2 = {
            fn: func2,
            data: { count: 2, name: 'test' },
            newFn: () => 'new',
        } as any;
        const mergedFunctions = deepMerge(withFunctions1, withFunctions2);

        expect(mergedFunctions.fn).toBe(func2); // Later function overrides
        expect((mergedFunctions.fn as any)()).toBe('func2');
        expect((mergedFunctions as any).newFn()).toBe('new');
        expect(mergedFunctions.data).toStrictEqual({ count: 2, name: 'test' });

        // Special objects - Date, RegExp, Map, Set should be cloned
        const date1 = new Date('2023-01-01');
        const date2 = new Date('2023-12-31');
        const regex1 = /test/i;
        const regex2 = /pattern/g;
        const map1 = new Map([['key1', 'value1']]);
        const map2 = new Map([['key2', 'value2']]);
        const set1 = new Set(['a', 'b']);
        const set2 = new Set(['c', 'd']);

        const withSpecial1 = {
            created: date1,
            pattern: regex1,
            mapData: map1,
            setData: set1,
            config: { nested: true },
        };
        const withSpecial2 = {
            updated: date2,
            pattern: regex2,
            mapData: map2,
            setData: set2,
            config: { enabled: true },
        } as any;
        const mergedSpecial = deepMerge(withSpecial1, withSpecial2);

        // Date should be cloned (new instance with same value)
        expect((mergedSpecial as any).created).toEqual(date1);
        expect((mergedSpecial as any).created).not.toBe(date1);
        expect((mergedSpecial as any).updated).toEqual(date2);
        expect((mergedSpecial as any).updated).not.toBe(date2);

        // RegExp should be cloned
        expect((mergedSpecial as any).pattern).toEqual(regex2);
        expect((mergedSpecial as any).pattern).not.toBe(regex2);

        // Map should be cloned
        expect((mergedSpecial as any).mapData).toEqual(map2);
        expect((mergedSpecial as any).mapData).not.toBe(map2);

        // Set should be cloned
        expect((mergedSpecial as any).setData).toEqual(set2);
        expect((mergedSpecial as any).setData).not.toBe(set2);

        // Plain objects should still be merged
        expect((mergedSpecial as any).config).toStrictEqual({ nested: true, enabled: true });

        // Edge cases with null/undefined
        const withNulls1 = { a: 1, b: null, c: undefined };
        const withNulls2 = { b: 2, c: 3, d: null } as any;
        const mergedNulls = deepMerge(withNulls1, withNulls2);

        expect(mergedNulls).toStrictEqual({ a: 1, b: 2, c: 3, d: null });

        // Empty object merging
        const empty = {};
        const nonEmpty = { a: 1, b: { c: 2 } };
        expect(deepMerge(empty, nonEmpty)).toStrictEqual(nonEmpty);
        expect(deepMerge(nonEmpty, empty)).toStrictEqual(nonEmpty);

        // Class instances should be replaced as-is (not merged)
        class TestClass {
            constructor(public value: string) { }
        }
        const instance1 = new TestClass('test1');
        const instance2 = new TestClass('test2');

        const withClasses1 = { data: { instance: instance1, other: 'value1' } };
        const withClasses2 = { data: { instance: instance2, other: 'value2' } } as any;
        const mergedClasses = deepMerge(withClasses1, withClasses2);

        expect((mergedClasses as any).data.instance).toBe(instance2); // Class instance replaced, not cloned
        expect((mergedClasses as any).data.other).toBe('value2');

        // Arrays in nested objects should also be replaced
        const nestedArrays1 = {
            config: { items: ['a', 'b'], settings: { list: [1, 2] } },
        };
        const nestedArrays2 = {
            config: { items: ['c'], settings: { list: [3, 4, 5], enabled: true } },
        } as any;
        const mergedArrays = deepMerge(nestedArrays1, nestedArrays2);

        expect(mergedArrays).toStrictEqual({
            config: {
                items: ['c'], // Replaced, not concatenated
                settings: {
                    list: [3, 4, 5], // Replaced, not concatenated
                    enabled: true,
                },
            },
        });
    });

    test('objectOmit', () => {
        const obj = { a: ['C'], b: ['D'] };
        expect(omit(obj, ['b'])).toStrictEqual({ a: ['C'] });
        expect(obj).toStrictEqual({ a: ['C'], b: ['D'] });
    });

    test('objectPick', () => {
        const obj = { a: ['C'], b: ['D'] };
        expect(pick(obj, ['b'])).toStrictEqual({ b: ['D'] });
        expect(obj).toStrictEqual({ a: ['C'], b: ['D'] });
    });

    test('mapValues', () => {
        const users = {
            fred: { user: 'fred', age: 40 },
            pebbles: { user: 'pebbles', age: 1 },
        };
        expect(mapValues(users, (o) => o.age)).toStrictEqual({ fred: 40, pebbles: 1 });
        expect(mapValues(users, 'age')).toStrictEqual({ fred: 40, pebbles: 1 });
    });

    test('clearUndefined', () => {
        const obj = { a: 1, b: undefined, c: 'hello', d: undefined, e: null };
        const result = clearUndefined(obj);

        expect(result).toStrictEqual({ a: 1, c: 'hello', e: null });
        expect(result).toBe(obj); // Should mutate original object
        expect('b' in result).toBe(false);
        expect('d' in result).toBe(false);
    });

    test('clearNullOrUndefined', () => {
        const obj = { a: 1, b: undefined, c: 'hello', d: null, e: 0, f: '' };
        const result = clearNullish(obj);

        expect(result).toStrictEqual({ a: 1, c: 'hello', e: 0, f: '' });
        expect(result).toBe(obj); // Should mutate original object
        expect('b' in result).toBe(false);
        expect('d' in result).toBe(false);
    });

    test('clearNullables', () => {
        const obj = { a: 1, b: undefined, c: 'hello', d: null, e: 0, f: '' };
        const result = clearNull(obj);

        expect(result).toStrictEqual({ a: 1, b: undefined, c: 'hello', e: 0, f: '' });
        expect(result).toBe(obj); // Should mutate original object
        expect('d' in result).toBe(false);
        expect('b' in result).toBe(true); // undefined should remain
    });

    test('traverse', () => {
        // Basic value transformation
        const obj = { a: 1, b: { _type: 'old', nested: { _type: 'old' } } };
        const result = traverse(obj, ({ key, value }) => {
            if (key === '_type') value = 'new';
            return { key, value };
        });

        expect(result.b._type).toBe('new');
        expect(result.b.nested._type).toBe('new');
        expect(obj).not.toBe(result);

        // Key renaming and ignoreChildren
        const complexObj = {
            data: {
                oldKey: 'value1',
                nested: { oldKey: 'value2', deep: { oldKey: 'value3' } },
                skipMe: { oldKey: 'shouldNotChange' },
            },
        };
        const renamedResult = traverse(complexObj, ({ key, value }, node) => {
            if (key === 'oldKey') key = 'newKey';
            if (key === 'skipMe') node.ignoreChildren();
            return { key, value };
        });

        expect(renamedResult.data.newKey).toBe('value1');
        expect(renamedResult.data.nested.newKey).toBe('value2');
        expect(renamedResult.data.nested.deep.newKey).toBe('value3');
        expect(renamedResult.data.skipMe.oldKey).toBe('shouldNotChange'); // Should not be renamed

        // Special types (Date, function) preservation
        const date = new Date('2023-01-01');
        const func = () => 'test';
        const specialObj = { date, func, normal: 'string' };
        const specialResult = traverse(specialObj, ({ key, value }) => {
            return { key, value };
        });

        expect(specialResult.date).toEqual(date);
        expect(specialResult.func).toBe(func);
        expect(specialResult.normal).toBe('string');
    });

    test('traverse async', async () => {
        const obj = { a: 1, b: { _type: 'old', nested: { _type: 'old' } } };
        const result = await traverse(obj, async ({ key, value }) => {
            if (key === '_type') value = 'new';
            return { key, value };
        });

        expect(result.b._type).toBe('new');
        expect(result.b.nested._type).toBe('new');
        expect(obj).not.toBe(result);
    });

    test('makeReadonly', () => {
        // Test with simple object
        const simple = { name: 'John', age: 30 };
        const readonlySimple = makeReadonly(simple);

        expect(readonlySimple).toStrictEqual(simple);
        expect(readonlySimple).not.toBe(simple);

        // Test immutability of simple properties
        expect(() => {
            (readonlySimple as any).name = 'Jane';
        }).toThrow();

        expect(() => {
            (readonlySimple as any).newProp = 'new';
        }).toThrow();

        // Test with nested object
        const nested = {
            user: { name: 'John', details: { age: 30, active: true } },
            items: ['item1', 'item2'],
            config: { theme: 'dark', features: { notifications: true } },
        };
        const readonlyNested = makeReadonly(nested);

        expect(readonlyNested).toStrictEqual(nested);
        expect(readonlyNested).not.toBe(nested);

        // Test deep immutability - nested objects
        expect(() => {
            (readonlyNested as any).user.name = 'Jane';
        }).toThrow();

        expect(() => {
            (readonlyNested as any).user.details.age = 31;
        }).toThrow();

        expect(() => {
            (readonlyNested as any).config.features.notifications = false;
        }).toThrow();

        // Test deep immutability - arrays
        expect(() => {
            (readonlyNested as any).items.push('item3');
        }).toThrow();

        expect(() => {
            (readonlyNested as any).items[0] = 'modified';
        }).toThrow();

        // Test that original object remains unchanged and mutable
        nested.user.name = 'Modified';
        nested.items.push('new item');
        expect(nested.user.name).toBe('Modified');
        expect(nested.items).toHaveLength(3);
        expect(readonlyNested.user.name).toBe('John');
        expect(readonlyNested.items).toHaveLength(2);

        // Test with functions (should remain unchanged)
        const withFunction = {
            getValue: () => 'test',
            data: { count: 1 },
        };
        const readonlyWithFunction = makeReadonly(withFunction);

        expect((readonlyWithFunction as any).getValue()).toBe('test');
        expect(() => {
            (readonlyWithFunction as any).data.count = 2;
        }).toThrow();
    });
});
