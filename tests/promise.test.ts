import { describe, expect, test } from 'vitest';
import { sleep, tryCatch, withTimeout } from '../src/promise';

describe('promise', () => {
    test('withTimeout - successful promise', async () => {
        const promise = Promise.resolve('success');
        const result = await withTimeout(promise, { timeoutMs: 100 });
        expect(result).toBe('success');
    });

    test('withTimeout - timeout with fallback value', async () => {
        const promise = new Promise((resolve) => setTimeout(() => resolve('late'), 200));
        const result = await withTimeout(promise, {
            timeoutMs: 100,
            onTimeout: 'fallback',
        });
        expect(result).toBe('fallback');
    });

    test('withTimeout - timeout with fallback function', async () => {
        const promise = new Promise((resolve) => setTimeout(() => resolve('late'), 200));
        const result = await withTimeout(promise, {
            timeoutMs: 100,
            onTimeout: () => 'function-fallback',
        });
        expect(result).toBe('function-fallback');
    });

    test('withTimeout - timeout with async fallback function', async () => {
        const promise = new Promise((resolve) => setTimeout(() => resolve('late'), 200));
        const result = await withTimeout(promise, {
            timeoutMs: 100,
            onTimeout: async () => 'async-fallback',
        });
        expect(result).toBe('async-fallback');
    });

    test('withTimeout - timeout effect is called', async () => {
        let effectCalled = false;
        const promise = new Promise((resolve) => setTimeout(() => resolve('late'), 200));

        await withTimeout(promise, {
            timeoutMs: 100,
            onTimeout: 'fallback',
            onTimeoutEffect: () => {
                effectCalled = true;
            },
        });

        expect(effectCalled).toBe(true);
    });

    test('tryCatch - successful sync function', () => {
        const fn = () => 'success';
        const result = tryCatch(fn);
        expect(result).toEqual(['success', null]);
    });

    test('tryCatch - failing sync function', () => {
        const fn = () => {
            throw new Error('sync error');
        };
        const result = tryCatch(fn);
        expect(result[0]).toBeUndefined();
        expect(result[1]).toBeInstanceOf(Error);
    });

    test('tryCatch - successful async function', async () => {
        const fn = async () => 'async success';
        const result = await tryCatch(fn);
        expect(result).toEqual(['async success', null]);
    });

    test('tryCatch - failing async function', async () => {
        const fn = async () => {
            throw new Error('async error');
        };
        const result = await tryCatch(fn);
        expect(result[0]).toBeUndefined();
        expect(result[1]).toBeInstanceOf(Error);
    });

    test('tryCatch - successful promise', async () => {
        const promise = Promise.resolve('promise success');
        const result = await tryCatch(promise);
        expect(result).toEqual(['promise success', null]);
    });

    test('tryCatch - failing promise', async () => {
        const promise = Promise.reject(new Error('promise error'));
        const result = await tryCatch(promise);
        expect(result[0]).toBeUndefined();
        expect(result[1]).toBeInstanceOf(Error);
    });

    test('tryCatch - sync function returning promise', async () => {
        const fn = () => Promise.resolve('sync->promise');
        const result = await tryCatch(fn);
        expect(result).toEqual(['sync->promise', null]);
    });

    test('sleep', async () => {
        const start = Date.now();
        await sleep(100);
        const end = Date.now();
        expect(end - start).toBeGreaterThanOrEqual(90); // Allow some tolerance
    });
});
