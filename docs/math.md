[**otskit**](README.md)

***

[otskit](README.md) / math

## Functions

### clamp()

Defined in: [math.ts:42](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/math.ts#L42)

Constrains a number to be within the specified range.

#### Example

```ts
const volume = clamp(150, 0, 100);
console.log(volume); // 100 (clamped to max)

const temperature = clamp(-5, 0, 30);
console.log(temperature); // 0 (clamped to min)

const normal = clamp(15, 0, 30);
console.log(normal); // 15 (within range, unchanged)

// Useful for UI constraints
const opacity = clamp(userInput, 0, 1);
```

***

### random()

Defined in: [math.ts:16](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/math.ts#L16)

Get a random integer between min and max (inclusive).

#### Example

```ts
const dice = random(1, 6);
console.log(dice); // Random number between 1 and 6 (e.g., 4)

const percentage = random(0, 100);
console.log(percentage); // Random number between 0 and 100 (e.g., 73)

const negativeRange = random(-10, 10);
console.log(negativeRange); // Random number between -10 and 10 (e.g., -3)
```

***

### round()

Defined in: [math.ts:72](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/math.ts#L72)

Rounds a number to the specified number of decimal places.

#### Example

```ts
// Basic rounding
const price = round(19.567, 2);
console.log(price); // 19.57

// Round to whole numbers
const count = round(12.7);
console.log(count); // 13

// Always round up
const ceiling = round(12.1, 0, 'up');
console.log(ceiling); // 13

// Always round down
const floor = round(12.9, 0, 'down');
console.log(floor); // 12
```
