[**otskit**](README.md)

***

[otskit](README.md) / math

## Contents

* [Functions](#functions)
  * [clamp()](#clamp)
  * [random()](#random)
  * [round()](#round)

## Functions

### clamp()

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
