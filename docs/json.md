[**otskit**](README.md)

***

[otskit](README.md) / json

## Variables

### SafeJSON

> `const` **SafeJSON**: \{ `parse`: \<\>() => ; `stringify`: \<\>() => ; \}

Defined in: [json.ts:140](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/json.ts#L140)

Drop-in replacement for JSON with safe error handling.

#### Type declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| <a id="parse"></a> `parse()` | \<\>() => | [json.ts:140](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/json.ts#L140) |
| <a id="stringify"></a> `stringify()` | \<\>() => | [json.ts:140](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/json.ts#L140) |

#### Example

```ts
// Use as a direct replacement for JSON
const data = SafeJSON.parse('{"valid": true}', { fallback: {} });
const json = SafeJSON.stringify(data, { pretty: true });

// No more try/catch blocks needed
const config = SafeJSON.parse(userInput, { 
  fallback: { theme: 'default' } 
});

// Perfect for API responses
const response = await fetch('/api/data');
const text = await response.text();
const apiData = SafeJSON.parse(text, { 
  fallback: { error: 'Invalid response' } 
});
```

## Functions

### parse()

Defined in: [json.ts:40](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/json.ts#L40)

Safely parses a JSON string without throwing errors.

#### Example

```ts
// Basic usage with fallback
const result = parse('{"name": "John"}', { fallback: {} });
console.log(result); // { name: "John" }

// Invalid JSON returns fallback
const invalid = parse('invalid json', { fallback: null });
console.log(invalid); // null

// Throw error on invalid JSON
try {
  parse('invalid', { fallback: new Error('Invalid JSON') });
} catch (error) {
  console.log(error.message); // 'Invalid JSON'
}

// Using reviver function
const withReviver = parse('{"date": "2023-01-01"}', {
  fallback: {},
  reviver: (key, value) => {
    if (key === 'date') return new Date(value);
    return value;
  }
});
console.log(withReviver.date instanceof Date); // true
```

***

### stringify()

Defined in: [json.ts:101](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/json.ts#L101)

Safely converts objects and arrays to JSON strings without throwing errors.

#### Example

```ts
// Basic usage
const json = stringify({ name: 'John', age: 30 });
console.log(json); // '{"name":"John","age":30}'

// Pretty formatting
const pretty = stringify({ name: 'John' }, { pretty: true });
console.log(pretty);
// {
//   "name": "John"
// }

// Fallback for invalid values
const invalid = stringify(undefined, { fallback: '{}' });
console.log(invalid); // '{}'

// Throw error on failure
try {
  stringify(BigInt(123), { fallback: new Error('Cannot stringify BigInt') });
} catch (error) {
  console.log(error.message); // 'Cannot stringify BigInt'
}

// Using replacer function
const filtered = stringify(
  { name: 'John', password: 'secret', age: 30 },
  {
    replacer: (key, value) => {
      if (key === 'password') return undefined; // Exclude sensitive data
      return value;
    }
  }
);
console.log(filtered); // '{"name":"John","age":30}'
```
