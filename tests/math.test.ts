import { describe, expect, test } from 'vitest';
import { clamp, random, round } from '../src/math';

describe('math', () => {
    test('random', () => {
        // Test range
        const min = 1;
        const max = 10;
        for (let i = 0; i < 100; i++) {
            const result = random(min, max);
            expect(result).toBeGreaterThanOrEqual(min);
            expect(result).toBeLessThanOrEqual(max);
            expect(result % 1).toBe(0); // Check if integer
        }

        // Test same min/max
        expect(random(5, 5)).toBe(5);

        // Test negative numbers
        const negResult = random(-10, -5);
        expect(negResult).toBeGreaterThanOrEqual(-10);
        expect(negResult).toBeLessThanOrEqual(-5);
    });

    test('clamp', () => {
        expect(clamp(5, 0, 10)).toBe(5);
        expect(clamp(-5, 0, 10)).toBe(0);
        expect(clamp(15, 0, 10)).toBe(10);
        expect(clamp(0, 0, 10)).toBe(0);
        expect(clamp(10, 0, 10)).toBe(10);
        expect(clamp(5, 5, 5)).toBe(5);
        expect(clamp(-10, -5, -1)).toBe(-5);
        expect(clamp(10, -5, -1)).toBe(-1);
    });

    test('round', () => {
        // biome-ignore lint/suspicious/noApproximativeNumericConstant: needed for testing
        const pi = 3.14159;
        // biome-ignore lint/suspicious/noApproximativeNumericConstant: needed for testing
        const pi3 = 3.142;

        // Default rounding
        expect(round(pi)).toBe(3);
        expect(round(pi, 2)).toBe(3.14);
        expect(round(pi, 3)).toBe(pi3);

        // Round up
        expect(round(pi, 2, 'up')).toBe(3.15);
        expect(round(3.1, 2, 'up')).toBe(3.1);
        expect(round(3.001, 2, 'up')).toBe(3.01);

        // Round down
        expect(round(pi, 2, 'down')).toBe(3.14);
        expect(round(3.19, 2, 'down')).toBe(3.19);
        expect(round(3.199, 2, 'down')).toBe(3.19);

        // Negative numbers
        expect(round(-pi, 2)).toBe(-3.14);
        expect(round(-pi, 2, 'up')).toBe(-3.14);
        expect(round(-pi, 2, 'down')).toBe(-3.15);

        // Zero digits
        expect(round(3.7, 0)).toBe(4);
        expect(round(3.7, 0, 'down')).toBe(3);
        expect(round(3.7, 0, 'up')).toBe(4);
    });
});
