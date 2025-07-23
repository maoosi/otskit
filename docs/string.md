[**otskit**](README.md)

***

[otskit](README.md) / string

## Contents

* [Functions](#functions)
  * [camelCase()](#camelcase)
  * [capitalize()](#capitalize)
  * [generateId()](#generateid)
  * [padZeros()](#padzeros)
  * [splitFirst()](#splitfirst)
  * [wrapText()](#wraptext)

## Functions

### camelCase()

Convert a string to camelCase.

#### Example

```ts
const result = camelCase('hello-world');
console.log(result); // 'helloWorld'

const fromSnake = camelCase('user_name_field');
console.log(fromSnake); // 'userNameField'

const fromSpaces = camelCase('My Super Title');
console.log(fromSpaces); // 'mySuperTitle'
```

***

### capitalize()

Capitalize the first letter of a string.

#### Example

```ts
capitalize('hello world'); // 'Hello world'
```

***

### generateId()

Generates a random string with customizable alphabet and optional prefix.

#### Example

```ts
const id = generateId();
console.log(id); // 'x2v9b8f3k1m7n4q6' (16 chars, url-safe)

const shortId = generateId(8, 'letters');
console.log(shortId); // 'kqvwxyzr' (8 chars, letters only)

const numericCode = generateId(6, 'digits');
console.log(numericCode); // '473829'

const userToken = generateId(12, 'url', 'user');
console.log(userToken); // 'user-x7v2b9f8k1m3'
```

***

### padZeros()

Pad a number with leading zeros to reach a length.

#### Example

```ts
const padded = padZeros(42, 5);
console.log(padded); // '00042'

const time = padZeros(7, 2);
console.log(time); // '07'

const noChange = padZeros(12345, 3);
console.log(noChange); // '12345' (already longer than 3 digits)
```

***

### splitFirst()

Split a string at the first occurrence of a separator.

#### Example

```ts
const [key, value] = splitFirst('key=value=more', '=');
console.log(key); // 'key'
console.log(value); // 'value=more'
```

***

### wrapText()

Break a string into lines not exceeding a max character limit.

#### Example

```ts
const text = 'This is a very long sentence that needs to be broken down into smaller lines';
const lines = wrapText(text, 20);
console.log(lines);
// [
//   'This is a very long',
//   'sentence that needs',
//   'to be broken down',
//   'into smaller lines'
// ]

const short = wrapText('one two three four five', 10);
console.log(short); // ['one two', 'three four', 'five']
```
