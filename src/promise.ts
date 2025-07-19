// Types
type TryCatchReturn<T> = T extends Promise<infer U>
    ? Promise<[U | undefined, unknown | null]>
    : [T | undefined, unknown | null] | Promise<[T | undefined, unknown | null]>;

/**
 * Adds a timeout to any Promise with optional fallback handling.
 *
 * @param promise - The Promise to add timeout to
 * @param options.timeoutMs - Timeout duration in milliseconds (default: 5000)
 * @param options.onTimeout - Value or function to return when timeout occurs
 * @param options.onTimeoutEffect - Side effect to run when timeout occurs (e.g., logging)
 *
 * @example
 * ```ts
 * // Basic timeout with default 5 second limit
 * const result = await timeout(fetch('/api/slow-endpoint'));
 *
 * // Custom timeout duration
 * const quickResult = await timeout(
 *   someSlowOperation(),
 *   { timeoutMs: 1000 }
 * );
 *
 * // Fallback value on timeout
 * const dataWithFallback = await timeout(
 *   fetchUserData(),
 *   {
 *     timeoutMs: 3000,
 *     onTimeout: { id: 0, name: 'Guest User' }
 *   }
 * );
 *
 * // Fallback function (can be async)
 * const dynamicFallback = await timeout(
 *   apiCall(),
 *   {
 *     timeoutMs: 2000,
 *     onTimeout: async () => await getCachedData(),
 *     onTimeoutEffect: () => console.log('API timeout, using cache')
 *   }
 * );
 *
 * // Database query with timeout
 * const users = await timeout(
 *   db.users.findMany(),
 *   {
 *     timeoutMs: 10000,
 *     onTimeout: [],
 *     onTimeoutEffect: () => metrics.increment('db.timeout')
 *   }
 * );
 * ```
 */
export async function timeout<T>(
    promise: Promise<T>,
    options: {
        timeoutMs?: number;
        onTimeout?: T | (() => T | Promise<T>);
        onTimeoutEffect?: () => void;
    } = {},
): Promise<T> {
    const { timeoutMs = 5000, onTimeout, onTimeoutEffect } = options;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    // biome-ignore lint/suspicious/noAsyncPromiseExecutor: expected
    const timeoutPromise = new Promise<T>(async (resolve) => {
        timeoutId = setTimeout(async () => {
            onTimeoutEffect?.();

            if (typeof onTimeout === 'function') {
                resolve(await (onTimeout as () => T | Promise<T>)());
            } else {
                resolve(onTimeout as T);
            }
        }, timeoutMs);
    });

    try {
        return await Promise.race([promise, timeoutPromise]);
    } finally {
        clearTimeout(timeoutId);
    }
}

/**
 * Wraps functions, promises, or async functions to handle errors gracefully.
 * Returns a tuple [result, error] instead of throwing.
 *
 * @example
 * ```ts
 * // Handle async function errors
 * async function fetchUser(id: string) {
 *   const response = await fetch(`/api/users/${id}`);
 *   return response.json();
 * }
 *
 * const [user, error] = await tryCatch(() => fetchUser('123'));
 * if (error) {
 *   console.log('Failed to fetch user:', error);
 * } else {
 *   console.log('User:', user);
 * }
 *
 * // Handle sync function errors
 * const [result, parseError] = tryCatch(() => JSON.parse(userInput));
 * if (parseError) {
 *   console.log('Invalid JSON');
 * } else {
 *   console.log('Parsed:', result);
 * }
 *
 * // Perfect for API calls without try/catch blocks
 * const [posts, postsError] = await tryCatch(() => api.getPosts());
 * const [comments, commentsError] = await tryCatch(() => api.getComments());
 *
 * if (postsError || commentsError) {
 *   return { error: 'Failed to load data' };
 * }
 *
 * return { posts, comments };
 * ```
 */
export function tryCatch<T>(input: (() => T) | Promise<T>): TryCatchReturn<T> {
    const handleError = (err: unknown): [undefined, unknown] => [undefined, err];

    if (typeof input === 'function') {
        try {
            const result = (input as () => T)();
            // Check if the result of the function is a Promise
            if (result instanceof Promise) {
                return result
                    .then((r) => [r, null]) // If it resolves, return [value, null]
                    .catch(handleError) as TryCatchReturn<T>; // If it rejects, return [undefined, error] // Assert the final promise type
            }
            // If the function returned a value directly
            return [result, null] as TryCatchReturn<T>; // Assert the tuple type
        } catch (err) {
            // If the sync function throws
            return handleError(err) as TryCatchReturn<T>; // Assert the error tuple type
        }
    }

    // If the input was already a Promise
    return (input as Promise<T>)
        .then((r) => [r, null]) // If it resolves, return [value, null]
        .catch(handleError) as TryCatchReturn<T>; // If it rejects, return [undefined, error] // Assert the final promise type
}

/**
 * Pause for a set number of milliseconds.
 *
 * @example
 * ```ts
 * console.log('Starting...');
 * await sleep(1000);
 * console.log('1 second later');
 * ```
 */
export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
