import { describe, expect, test } from 'vitest';
import {
    isArray,
    isBoolean,
    isDate,
    isDefined,
    isError,
    isFunction,
    isNull,
    isNumber,
    isPlainObject,
    isRegExp,
    isString,
    isUndefined,
    isUrl,
} from '../src/is';

describe('is', () => {
    test('isDef', () => {
        expect(isDefined(0)).toBe(true);
        expect(isDefined('')).toBe(true);
        expect(isDefined(false)).toBe(true);
        expect(isDefined(null)).toBe(true);
        expect(isDefined(undefined)).toBe(false);
    });

    test('isBoolean', () => {
        expect(isBoolean(true)).toBe(true);
        expect(isBoolean(false)).toBe(true);
        expect(isBoolean(0)).toBe(false);
        expect(isBoolean('')).toBe(false);
        expect(isBoolean(null)).toBe(false);
    });

    test('isFunction', () => {
        expect(isFunction(() => { })).toBe(true);
        expect(isFunction(() => { })).toBe(true);
        expect(isFunction(Array.isArray)).toBe(true);
        expect(isFunction({})).toBe(false);
        expect(isFunction(null)).toBe(false);
    });

    test('isNumber', () => {
        expect(isNumber(0)).toBe(true);
        expect(isNumber(42)).toBe(true);
        expect(isNumber(3.14)).toBe(true);
        expect(isNumber('42')).toBe(false);
        expect(isNumber(null)).toBe(false);
    });

    test('isString', () => {
        expect(isString('')).toBe(true);
        expect(isString('hello')).toBe(true);
        expect(isString(42)).toBe(false);
        expect(isString(null)).toBe(false);
    });

    test('isObject', () => {
        expect(isPlainObject({})).toBe(true);
        expect(isPlainObject([])).toBe(false);
        expect(isPlainObject(() => true)).toBe(false);
        expect(isPlainObject(null)).toBe(false);
        expect(isPlainObject(undefined)).toBe(false);
        expect(isPlainObject(new Date())).toBe(false);

        // Test class instances should return false
        class TestClass {
            constructor(public value: string) { }
        }
        expect(isPlainObject(new TestClass('test'))).toBe(false);

        // Test Object.create scenarios
        expect(isPlainObject(Object.create(null))).toBe(true); // null prototype
        expect(isPlainObject(Object.create(Object.prototype))).toBe(true); // Object.prototype
    });

    test('isUndefined', () => {
        expect(isUndefined(undefined)).toBe(true);
        expect(isUndefined(null)).toBe(false);
        expect(isUndefined(0)).toBe(false);
        expect(isUndefined('')).toBe(false);
    });

    test('isNull', () => {
        expect(isNull(null)).toBe(true);
        expect(isNull(undefined)).toBe(false);
        expect(isNull(0)).toBe(false);
        expect(isNull('')).toBe(false);
    });

    test('isRegExp', () => {
        expect(isRegExp(/test/)).toBe(true);
        expect(isRegExp(/test/)).toBe(true);
        expect(isRegExp('test')).toBe(false);
        expect(isRegExp({})).toBe(false);
    });

    test('isDate', () => {
        expect(isDate(new Date())).toBe(true);
        expect(isDate(Date.now())).toBe(false);
        expect(isDate('2023-01-01')).toBe(false);
        expect(isDate({})).toBe(false);
    });

    test('isArray', () => {
        expect(isArray([])).toBe(true);
        expect(isArray([1, 2, 3])).toBe(true);
        expect(isArray({})).toBe(false);
        expect(isArray(null)).toBe(false);
        expect(isArray(undefined)).toBe(false);
    });

    test('isError', () => {
        expect(isError(new Error())).toBe(true);
        expect(isError(new TypeError())).toBe(true);
        expect(isError({})).toBe(false);
        expect(isError('error')).toBe(false);
    });

    test('isUrl', () => {
        expect(isUrl('https://example.com')).toBe(true);
        expect(isUrl('http://example.com')).toBe(true);
        expect(isUrl('ftp://example.com')).toBe(false);
        expect(isUrl('not-a-url')).toBe(false);
        expect(isUrl('')).toBe(false);
        expect(isUrl('example.com')).toBe(false);
    });
});
