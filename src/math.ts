/**
 * Get a random integer between min and max (inclusive).
 *
 * @example
 * ```ts
 * const dice = random(1, 6);
 * console.log(dice); // Random number between 1 and 6 (e.g., 4)
 * 
 * const percentage = random(0, 100);
 * console.log(percentage); // Random number between 0 and 100 (e.g., 73)
 * 
 * const negativeRange = random(-10, 10);
 * console.log(negativeRange); // Random number between -10 and 10 (e.g., -3)
 * ```
 */
export function random(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Constrains a number to be within the specified range.
 *
 * @param n - The number to clamp
 * @param min - The minimum allowed value
 * @param max - The maximum allowed value
 * 
 * @example
 * ```ts
 * const volume = clamp(150, 0, 100);
 * console.log(volume); // 100 (clamped to max)
 * 
 * const temperature = clamp(-5, 0, 30);
 * console.log(temperature); // 0 (clamped to min)
 * 
 * const normal = clamp(15, 0, 30);
 * console.log(normal); // 15 (within range, unchanged)
 * 
 * // Useful for UI constraints
 * const opacity = clamp(userInput, 0, 1);
 * ```
 */
export function clamp(n: number, min: number, max: number) {
	return Math.min(max, Math.max(min, n));
}

/**
 * Rounds a number to the specified number of decimal places.
 *
 * @param number - The number to round
 * @param digits - The number of decimal places (default: 0)
 * @param method - The rounding method: 'auto' (default), 'up', or 'down'
 * 
 * @example
 * ```ts
 * // Basic rounding
 * const price = round(19.567, 2);
 * console.log(price); // 19.57
 * 
 * // Round to whole numbers
 * const count = round(12.7);
 * console.log(count); // 13
 * 
 * // Always round up
 * const ceiling = round(12.1, 0, 'up');
 * console.log(ceiling); // 13
 * 
 * // Always round down
 * const floor = round(12.9, 0, 'down');
 * console.log(floor); // 12
 * ```
 */
export function round(number: number, digits = 0, method: 'auto' | 'up' | 'down' = 'auto'): number {
	const factor = 10 ** digits;

	switch (method) {
		case 'up':
			return Math.ceil(number * factor) / factor;
		case 'down':
			return Math.floor(number * factor) / factor;
		default:
			return Math.round(number * factor) / factor;
	}
}
