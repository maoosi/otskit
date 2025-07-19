/**
 * Get the current timestamp in milliseconds.
 *
 * @example
 * ```ts
 * timestamp(); // e.g. 1703123456789
 * ```
 */
export const timestamp = () => +Date.now();

/**
 * Convert minutes to hours and minutes.
 *
 * @example
 * ```ts
 * toHoursAndMinutes(150); // { hours: 2, minutes: 30, formatted: '2hrs 30min' }
 * ```
 */
export function toHoursAndMinutes(minutes: number): { hours: number; minutes: number; formatted: string } {
    const duration = {
        hours: Math.floor(minutes / 60),
        minutes: minutes % 60,
    };
    return {
        hours: duration.hours,
        minutes: duration.minutes,
        formatted: [
            duration.hours > 0 ? `${duration.hours}hrs` : null,
            duration.minutes > 0 ? `${duration.minutes}min` : null,
        ]
            .filter(Boolean)
            .join(' '),
    };
}

/**
 * Pad a number to two digits with leading zero if needed.
 *
 * @example
 * ```ts
 * const hour = padToTwoDigits(7);
 * console.log(hour); // '07'
 *
 * // Format date components
 * const day = padToTwoDigits(5);
 * const month = padToTwoDigits(12);
 * const dateString = `${day}/${month}/2023`;
 * console.log(dateString); // '05/12/2023'
 * ```
 */
export function padToTwoDigits(value: number): string {
    return value.toString().padStart(2, '0');
}

/**
 * Ignores repeated calls and only runs the function after a pause.
 *
 * @example
 * ```ts
 * const debouncedFunc = debounce(() => {
 *   console.log('Function called');
 * }, 1000, { immediate: true });
 *
 * debouncedFunc(); // Function called immediately, then 1000ms later
 * ```
 */
export function debounce<T>(
    func: (...args: T[]) => void,
    waitInMs = 250,
    options?: {
        immediate?: boolean,
    },
): {
    (...args: T[]): void;
    clear: () => void;
    trigger: () => void;
} {
    const { immediate = false } = options || {};

    let storedContext: any;
    let storedArguments: any;
    let timeoutId: any;
    let timestamp: any;
    let result: any;

    function run() {
        const callContext = storedContext;
        const callArguments = storedArguments;
        storedContext = undefined;
        storedArguments = undefined;
        result = func.apply(callContext, callArguments);
        return result;
    }

    function later() {
        const last = Date.now() - timestamp;

        if (last < waitInMs && last >= 0) {
            timeoutId = setTimeout(later, waitInMs - last);
        } else {
            timeoutId = undefined;

            if (!immediate) {
                result = run();
            }
        }
    }

    const debounced = function (this: any, ...args: T[]) {
        if (
            storedContext
            && this !== storedContext
            && Object.getPrototypeOf(this) === Object.getPrototypeOf(storedContext)
        ) {
            throw new Error('Debounced method called with different contexts of the same prototype.');
        }

        storedContext = this;
        storedArguments = args;
        timestamp = Date.now();

        const callNow = immediate && !timeoutId;

        if (!timeoutId) {
            timeoutId = setTimeout(later, waitInMs);
        }

        if (callNow) {
            result = run();
        }

        return result;
    };

    Object.defineProperty(debounced, 'isPending', {
        get() {
            return timeoutId !== undefined;
        },
    });

    debounced.clear = () => {
        if (!timeoutId) {
            return;
        }
        clearTimeout(timeoutId);
        timeoutId = undefined;
    };

    debounced.trigger = () => {
        result = run();
        debounced.clear();
    };

    return debounced;
}