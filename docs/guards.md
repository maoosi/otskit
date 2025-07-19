[**otskit**](README.md)

***

[otskit](README.md) / guards

## Functions

### isTruthy()

Defined in: [guards.ts:85](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/guards.ts#L85)

Filter out all falsy values (false, 0, '', null, undefined, NaN).

#### Example

```ts
// Filter array to keep only truthy values
const data = [1, 0, 'hello', '', true, false, null, undefined, NaN];
const truthy = data.filter(isTruthy);
console.log(truthy); // [1, 'hello', true]

// TypeScript type narrowing with union types
const value: string | number | null | undefined = getValue();
if (isTruthy(value)) {
  // TypeScript knows value is string | number (non-falsy)
  console.log(typeof value); // 'string' or 'number'
}
```

***

### notNull()

Defined in: [guards.ts:41](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/guards.ts#L41)

Filter out only null values specifically.

#### Example

```ts
// Filter array to remove only null values (keeps undefined)
const data = [1, null, 'hello', undefined, true];
const filtered = data.filter(notNull);
console.log(filtered); // [1, 'hello', undefined, true]

// TypeScript type narrowing  
const value: string | null = getValueOrNull();
if (notNull(value)) {
  // TypeScript knows value is string
  console.log(value.length);
}
```

***

### notNullish()

Defined in: [guards.ts:19](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/guards.ts#L19)

Filter out null and undefined values.

#### Example

```ts
// Filter array to remove null/undefined values
const data = [1, null, 'hello', undefined, true, 0];
const filtered = data.filter(notNullish);
console.log(filtered); // [1, 'hello', true, 0]

// TypeScript type narrowing
const value: string | null | undefined = getValue();
if (notNullish(value)) {
  // TypeScript knows value is string
  console.log(value.toUpperCase());
}
```

***

### notUndefined()

Defined in: [guards.ts:63](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/guards.ts#L63)

Filter out out undefined values specifically.

#### Example

```ts
// Filter array to remove only undefined values (keeps null)
const data = [1, null, 'hello', undefined, true];
const filtered = data.filter(notUndefined);
console.log(filtered); // [1, null, 'hello', true]

// TypeScript type narrowing
const value: string | undefined = getOptionalValue();
if (notUndefined(value)) {
  // TypeScript knows value is string
  console.log(value.trim());
}
```
