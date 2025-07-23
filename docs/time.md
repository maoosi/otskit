[**otskit**](README.md)

***

[otskit](README.md) / time

## Contents

* [Functions](#functions)
  * [createPoller()](#createpoller)
  * [debounce()](#debounce)
  * [padToTwoDigits()](#padtotwodigits)
  * [timestamp()](#timestamp)
  * [toHoursAndMinutes()](#tohoursandminutes)

## Functions

### createPoller()

Creates a poller that repeatedly executes a function at specified intervals.
Supports pausing when the document is hidden and handles both sync and async functions.

#### Example

```ts
// Basic polling
const poller = createPoller(() => {
  console.log('Polling...');
}, { interval: 1000 });

poller.start();
// Will log 'Polling...' every 1000ms

poller.stop();
console.log(poller.isRunning()); // false

// Async polling with pause when hidden
const apiPoller = createPoller(async () => {
  const data = await fetch('/api/status');
  return data.json();
}, { 
  interval: 5000, 
  pauseWhenHidden: true 
});

apiPoller.start();
```

***

### debounce()

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

Get the current timestamp in milliseconds.

#### Example

```ts
timestamp(); // e.g. 1703123456789
```

***

### toHoursAndMinutes()

Convert minutes to hours and minutes.

#### Example

```ts
toHoursAndMinutes(150); // { hours: 2, minutes: 30, formatted: '2hrs 30min' }
```
