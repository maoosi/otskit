import { describe, expect, test } from 'vitest';
import { camelCase, capitalize, generateId, padZeros, splitFirst, wrapText } from '../src/string';

describe('string', () => {
    test('capitalize', () => {
        expect(capitalize('hello World')).toEqual('Hello World');
        expect(capitalize('123')).toEqual('123');
        expect(capitalize('中国')).toEqual('中国');
        expect(capitalize('āÁĂÀ')).toEqual('ĀÁĂÀ');
        expect(capitalize('\a')).toEqual('A');
        expect(capitalize('')).toEqual('');
        expect(capitalize('a')).toEqual('A');
        expect(capitalize('HELLO')).toEqual('HELLO');
    });

    test('camelCase', () => {
        expect(camelCase('hello_world')).toEqual('helloWorld');
        expect(camelCase('hello-world')).toEqual('helloWorld');
        expect(camelCase('hello world')).toEqual('helloWorld');
        expect(camelCase('helloWorld')).toEqual('helloWorld');
    });

    test('splitFirst', () => {
        expect(splitFirst('hello-world-test', '-')).toEqual(['hello', 'world-test']);
        expect(splitFirst('no-separator', '|')).toEqual(['no-separator', '']);
        expect(splitFirst('', '-')).toEqual(['', '']);
        expect(splitFirst('start-', '-')).toEqual(['start', '']);
        expect(splitFirst('-end', '-')).toEqual(['', 'end']);
        expect(splitFirst('multiple::colons::here', '::')).toEqual(['multiple', 'colons::here']);
    });

    test('padZeros', () => {
        expect(padZeros(5, 3)).toBe('005');
        expect(padZeros(42, 4)).toBe('0042');
        expect(padZeros(123, 2)).toBe('123');
        expect(padZeros(0, 3)).toBe('000');
        expect(padZeros(999, 3)).toBe('999');
        expect(padZeros(1, 1)).toBe('1');
        expect(padZeros(10, 5)).toBe('00010');
    });

    test('generateId', () => {
        expect(generateId()).toHaveLength(16);
        expect(generateId(8)).toHaveLength(8);
        expect(/^[0-9]+$/.test(generateId(10, 'digits'))).toBe(true);
        expect(/^[a-z]+$/.test(generateId(10, 'letters'))).toBe(true);
        expect(/^[a-z0-9]+$/.test(generateId(10, 'url'))).toBe(true);

        const ids = new Set([...Array(50)].map(() => generateId()));
        expect(ids.size).toBe(50);
    });

    test('wrapText', () => {
        expect(wrapText('hello world', 20)).toEqual(['hello world']);
        expect(wrapText('hello world', 5)).toEqual(['hello', 'world']);
        expect(wrapText('hello world test', 11)).toEqual(['hello world', 'test']);
        expect(wrapText('a b c d e f', 5)).toEqual(['a b c', 'd e f']);
        expect(wrapText('', 10)).toEqual(['']);
        expect(wrapText('word', 10)).toEqual(['word']);
        expect(wrapText('verylongwordthatexceedslimit', 10)).toEqual(['verylongwordthatexceedslimit']);
        expect(wrapText('one two three four five', 10)).toEqual(['one two', 'three four', 'five']);
    });
});
