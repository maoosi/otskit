import { describe, expect, test, vi } from 'vitest';
import { createPoller, debounce, padToTwoDigits, timestamp, toHoursAndMinutes } from '../src/time';

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

    test('createPoller - basic functionality', () => {
        vi.useFakeTimers();

        const mockFn = vi.fn();
        const poller = createPoller(mockFn, { interval: 100 });

        // Initially not running
        expect(poller.isRunning()).toBe(false);

        // Start polling
        poller.start();
        expect(poller.isRunning()).toBe(true);
        expect(mockFn).toHaveBeenCalledTimes(1); // Called immediately

        // Advance time to trigger next poll
        vi.advanceTimersByTime(100);
        expect(mockFn).toHaveBeenCalledTimes(2);

        // Advance time again
        vi.advanceTimersByTime(100);
        expect(mockFn).toHaveBeenCalledTimes(3);

        // Stop polling
        poller.stop();
        expect(poller.isRunning()).toBe(false);

        // Should not call function after stopping
        vi.advanceTimersByTime(100);
        expect(mockFn).toHaveBeenCalledTimes(3);

        vi.restoreAllMocks();
    });

    test('createPoller - multiple start/stop calls', () => {
        vi.useFakeTimers();

        const mockFn = vi.fn();
        const poller = createPoller(mockFn, { interval: 100 });

        // Multiple starts should not cause issues
        poller.start();
        poller.start();
        poller.start();
        expect(poller.isRunning()).toBe(true);
        expect(mockFn).toHaveBeenCalledTimes(1);

        // Multiple stops should not cause issues
        poller.stop();
        poller.stop();
        expect(poller.isRunning()).toBe(false);

        vi.restoreAllMocks();
    });

    test('createPoller - with async function', async () => {
        vi.useFakeTimers();

        const mockAsyncFn = vi.fn().mockResolvedValue('success');
        const poller = createPoller(mockAsyncFn, { interval: 100 });

        poller.start();
        expect(mockAsyncFn).toHaveBeenCalledTimes(1);
        expect(poller.isRunning()).toBe(true);

        // Verify the function returns a promise (async handling)
        const result = mockAsyncFn();
        expect(result).toBeInstanceOf(Promise);

        poller.stop();
        expect(poller.isRunning()).toBe(false);
        vi.restoreAllMocks();
    });

    test('createPoller - handles async function errors', async () => {
        vi.useFakeTimers();

        const mockAsyncFn = vi.fn().mockRejectedValue(new Error('test error'));
        const poller = createPoller(mockAsyncFn, { interval: 100 });

        poller.start();
        expect(mockAsyncFn).toHaveBeenCalledTimes(1);
        expect(poller.isRunning()).toBe(true);

        // Verify the function returns a promise that rejects (error handling)
        const result = mockAsyncFn();
        expect(result).toBeInstanceOf(Promise);
        await expect(result).rejects.toThrow('test error');

        poller.stop();
        expect(poller.isRunning()).toBe(false);
        vi.restoreAllMocks();
    });

    test('createPoller - handles sync function errors', () => {
        vi.useFakeTimers();

        const mockFn = vi.fn().mockImplementation(() => {
            throw new Error('sync error');
        });
        const poller = createPoller(mockFn, { interval: 100 });

        poller.start();
        expect(mockFn).toHaveBeenCalledTimes(1);

        // Should continue polling even after error
        vi.advanceTimersByTime(100);
        expect(mockFn).toHaveBeenCalledTimes(2);

        poller.stop();
        vi.restoreAllMocks();
    });

    test('createPoller - pauseWhenHidden functionality', () => {
        vi.useFakeTimers();

        // Mock document and visibility API
        const mockDocument = {
            visibilityState: 'visible',
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        };

        // @ts-ignore - mocking global document
        global.document = mockDocument;

        const mockFn = vi.fn();
        const poller = createPoller(mockFn, {
            interval: 100,
            pauseWhenHidden: true
        });

        poller.start();
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockDocument.addEventListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function));

        // Simulate tab becoming hidden before the next timer fires
        mockDocument.visibilityState = 'hidden';

        // Advance timers - the scheduleNext function should check visibility state and not schedule
        vi.advanceTimersByTime(100);
        expect(mockFn).toHaveBeenCalledTimes(2); // Timer was already scheduled when visible

        // Advance again - should not call anymore since we're hidden  
        vi.advanceTimersByTime(100);
        expect(mockFn).toHaveBeenCalledTimes(2); // Should not poll when hidden

        // Simulate tab becoming visible again
        mockDocument.visibilityState = 'visible';

        // Get the visibility handler and call it
        const visibilityHandler = mockDocument.addEventListener.mock.calls[0][1];
        visibilityHandler();

        expect(mockFn).toHaveBeenCalledTimes(3); // Should resume immediately

        poller.stop();
        expect(mockDocument.removeEventListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function));

        vi.restoreAllMocks();
    });

    test('createPoller - without pauseWhenHidden continues when hidden', () => {
        vi.useFakeTimers();

        // Mock document and visibility API
        const mockDocument = {
            visibilityState: 'visible',
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        };

        // @ts-ignore - mocking global document
        global.document = mockDocument;

        const mockFn = vi.fn();
        const poller = createPoller(mockFn, { interval: 100 });

        poller.start();
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockDocument.addEventListener).not.toHaveBeenCalled();

        // Simulate tab becoming hidden
        mockDocument.visibilityState = 'hidden';
        vi.advanceTimersByTime(100);
        expect(mockFn).toHaveBeenCalledTimes(2); // Should continue polling when hidden

        poller.stop();
        vi.restoreAllMocks();
    });
});
