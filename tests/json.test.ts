import { describe, expect, test } from 'vitest';
import { SafeJSON } from '../src/json';

describe('json', () => {
    test('parse', () => {
        const json = { a: 'foo', b: 'bar' };
        expect(SafeJSON.parse(JSON.stringify(json))).toStrictEqual(json);
        expect(SafeJSON.parse(JSON.stringify(undefined))).toStrictEqual(undefined);
        expect(SafeJSON.parse(JSON.stringify(() => null))).toStrictEqual(undefined);
        expect(SafeJSON.parse(JSON.stringify(undefined), { fallback: json })).toStrictEqual(json);
        expect(SafeJSON.parse(JSON.stringify(undefined), { fallback: null })).toStrictEqual(null);
        expect(() => SafeJSON.parse(JSON.stringify(undefined), { fallback: new Error('Issue') })).toThrowError('Issue');
    });

    test('stringify', () => {
        const json = { a: 'foo', b: 'bar', date: new Date() };
        expect(SafeJSON.stringify(json, { pretty: true })).toStrictEqual(JSON.stringify(json, null, 2));
        expect(SafeJSON.stringify(undefined)).toStrictEqual(undefined);
        expect(SafeJSON.stringify(() => null)).toStrictEqual(undefined);
        expect(SafeJSON.stringify(undefined, { fallback: JSON.stringify(json) })).toStrictEqual(JSON.stringify(json));
        expect(() => SafeJSON.stringify(undefined, { fallback: new Error('Issue') })).toThrowError('Issue');
    });
});
