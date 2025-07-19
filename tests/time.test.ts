import { describe, expect, test, vi } from 'vitest';
import { debounce, padToTwoDigits, timestamp, toHoursAndMinutes } from '../src/time';

describe('time', () => {
    test('timestamp', () => {
        const before = Date.now();
        const result = timestamp();
        const after = Date.now();

        expect(result).toBeGreaterThanOrEqual(before);
        expect(result).toBeLessThanOrEqual(after);
        expect(Number.isInteger(result)).toBe(true);
    });

    test('toHoursAndMinutes', () => {
        // Test whole hours
        expect(toHoursAndMinutes(120)).toEqual({
            hours: 2,
            minutes: 0,
            formatted: '2hrs',
        });

        // Test minutes only
        expect(toHoursAndMinutes(45)).toEqual({
            hours: 0,
            minutes: 45,
            formatted: '45min',
        });

        // Test hours and minutes
        expect(toHoursAndMinutes(135)).toEqual({
            hours: 2,
            minutes: 15,
            formatted: '2hrs 15min',
        });

        // Test zero
        expect(toHoursAndMinutes(0)).toEqual({
            hours: 0,
            minutes: 0,
            formatted: '',
        });

        // Test single minute
        expect(toHoursAndMinutes(1)).toEqual({
            hours: 0,
            minutes: 1,
            formatted: '1min',
        });

        // Test single hour
        expect(toHoursAndMinutes(60)).toEqual({
            hours: 1,
            minutes: 0,
            formatted: '1hrs',
        });

        // Test large numbers
        expect(toHoursAndMinutes(1440)).toEqual({
            hours: 24,
            minutes: 0,
            formatted: '24hrs',
        });
    });

    test('padToTwoDigits', () => {
        expect(padToTwoDigits(0)).toBe('00');
        expect(padToTwoDigits(5)).toBe('05');
        expect(padToTwoDigits(10)).toBe('10');
        expect(padToTwoDigits(99)).toBe('99');
        expect(padToTwoDigits(100)).toBe('100');
        expect(padToTwoDigits(1)).toBe('01');
        expect(padToTwoDigits(42)).toBe('42');
    });

    test('debounce', () => {
        vi.useFakeTimers();

        const mockFn = vi.fn();
        const debouncedFn = debounce(mockFn, 100);

        debouncedFn('arg1');
        debouncedFn('arg2');
        expect(mockFn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(100);
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith('arg2');

        vi.restoreAllMocks();
    });

    test('debounce with immediate option', () => {
        vi.useFakeTimers();

        const mockFn = vi.fn();
        const debouncedFn = debounce(mockFn, 100, { immediate: true });

        debouncedFn('immediate');
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith('immediate');

        debouncedFn('delayed');
        vi.advanceTimersByTime(100);
        expect(mockFn).toHaveBeenCalledTimes(1);

        vi.restoreAllMocks();
    });

    test('debounce clear and trigger', () => {
        vi.useFakeTimers();

        const mockFn = vi.fn();
        const debouncedFn = debounce(mockFn, 100);

        debouncedFn('test');
        debouncedFn.clear();
        vi.advanceTimersByTime(100);
        expect(mockFn).not.toHaveBeenCalled();

        debouncedFn('trigger');
        debouncedFn.trigger();
        expect(mockFn).toHaveBeenCalledWith('trigger');

        vi.restoreAllMocks();
    });
});
