[**otskit**](README.md)

***

[otskit](README.md) / time

## Functions

### debounce()

Defined in: [time.ts:67](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/time.ts#L67)

Ignores repeated calls and only runs the function after a pause.

#### Example

```ts
const debouncedFunc = debounce(() => {
  console.log('Function called');
}, 1000, { immediate: true });

debouncedFunc(); // Function called immediately, then 1000ms later
```

***

### padToTwoDigits()

Defined in: [time.ts:51](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/time.ts#L51)

Pad a number to two digits with leading zero if needed.

#### Example

```ts
const hour = padToTwoDigits(7);
console.log(hour); // '07'

// Format date components
const day = padToTwoDigits(5);
const month = padToTwoDigits(12);
const dateString = `${day}/${month}/2023`;
console.log(dateString); // '05/12/2023'
```

***

### timestamp()

Defined in: [time.ts:9](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/time.ts#L9)

Get the current timestamp in milliseconds.

#### Example

```ts
timestamp(); // e.g. 1703123456789
```

***

### toHoursAndMinutes()

Defined in: [time.ts:19](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/time.ts#L19)

Convert minutes to hours and minutes.

#### Example

```ts
toHoursAndMinutes(150); // { hours: 2, minutes: 30, formatted: '2hrs 30min' }
```
