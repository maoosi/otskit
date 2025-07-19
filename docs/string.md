[**otskit**](README.md)

***

[otskit](README.md) / string

## Functions

### camelCase()

Defined in: [string.ts:30](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/string.ts#L30)

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

Defined in: [string.ts:9](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/string.ts#L9)

Capitalize the first letter of a string.

#### Example

```ts
capitalize('hello world'); // 'Hello world'
```

***

### generateId()

Defined in: [string.ts:100](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/string.ts#L100)

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

Defined in: [string.ts:73](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/string.ts#L73)

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

Defined in: [string.ts:47](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/string.ts#L47)

Split a string at the first occurrence of a separator.

#### Example

```ts
const [key, value] = splitFirst('key=value=more', '=');
console.log(key); // 'key'
console.log(value); // 'value=more'
```

***

### wrapText()

Defined in: [string.ts:135](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/string.ts#L135)

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
