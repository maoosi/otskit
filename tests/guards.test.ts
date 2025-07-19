import { describe, expect, test } from 'vitest';
import { isTruthy, notNull, notNullish, notUndefined } from '../src/guards';

describe('guards', () => {
    test('notNullish', () => {
        expect(notNullish(0)).toBe(true);
        expect(notNullish('')).toBe(true);
        expect(notNullish(false)).toBe(true);
        expect(notNullish([])).toBe(true);
        expect(notNullish({})).toBe(true);
        expect(notNullish(null)).toBe(false);
        expect(notNullish(undefined)).toBe(false);

        // Test array filtering
        const arr = [1, null, 2, undefined, 3];
        expect(arr.filter(notNullish)).toEqual([1, 2, 3]);
    });

    test('noNull', () => {
        expect(notNull(0)).toBe(true);
        expect(notNull('')).toBe(true);
        expect(notNull(false)).toBe(true);
        expect(notNull(undefined)).toBe(true);
        expect(notNull([])).toBe(true);
        expect(notNull({})).toBe(true);
        expect(notNull(null)).toBe(false);

        // Test array filtering
        const arr = [1, null, 2, 3];
        expect(arr.filter(notNull)).toEqual([1, 2, 3]);
    });

    test('notUndefined', () => {
        expect(notUndefined(0)).toBe(true);
        expect(notUndefined('')).toBe(true);
        expect(notUndefined(false)).toBe(true);
        expect(notUndefined(null)).toBe(true);
        expect(notUndefined([])).toBe(true);
        expect(notUndefined({})).toBe(true);
        expect(notUndefined(undefined)).toBe(false);

        // Test array filtering
        const arr = [1, undefined, 2, 3];
        expect(arr.filter(notUndefined)).toEqual([1, 2, 3]);
    });

    test('isTruthy', () => {
        expect(isTruthy(1)).toBe(true);
        expect(isTruthy('hello')).toBe(true);
        expect(isTruthy([])).toBe(true);
        expect(isTruthy({})).toBe(true);
        expect(isTruthy(true)).toBe(true);
        expect(isTruthy(0)).toBe(false);
        expect(isTruthy('')).toBe(false);
        expect(isTruthy(false)).toBe(false);
        expect(isTruthy(null)).toBe(false);
        expect(isTruthy(undefined)).toBe(false);

        // Test array filtering
        const arr = [1, 0, 'hello', '', true, false, null, undefined];
        expect(arr.filter(isTruthy)).toEqual([1, 'hello', true]);
    });
});
