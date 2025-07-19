[**otskit**](README.md)

***

[otskit](README.md) / object

## Functions

### clearNull()

Defined in: [object.ts:135](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/object.ts#L135)

Remove null properties from an object (mutates original).

#### Example

```ts
const data = { name: 'John', age: null, email: undefined };
const cleaned = clearNull(data);
console.log(cleaned); // { name: 'John', email: undefined } (only null removed)
```

***

### clearNullish()

Defined in: [object.ts:118](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/object.ts#L118)

Remove null and undefined properties from an object (mutates original).

#### Example

```ts
const data = { name: 'John', age: null, email: undefined, active: true };
const cleaned = clearNullish(data);
console.log(cleaned); // { name: 'John', active: true }
```

***

### clearUndefined()

Defined in: [object.ts:101](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/object.ts#L101)

Remove undefined properties from an object (mutates original).

#### Example

```ts
const data = { name: 'John', age: undefined, email: 'john@example.com' };
const cleaned = clearUndefined(data);
console.log(cleaned); // { name: 'John', email: 'john@example.com' }
console.log(data === cleaned); // true (same object, mutated)
```

***

### clone()

Defined in: [object.ts:155](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/object.ts#L155)

Creates a deep copy of an object.

#### Example

```ts
const original = { user: { name: 'John', settings: { theme: 'dark' } } };
const copy = clone(original);

copy.user.name = 'Jane';
console.log(original.user.name); // 'John' (unchanged)
console.log(copy.user.name); // 'Jane'
```

***

### deepMerge()

Defined in: [object.ts:189](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/object.ts#L189)

Deeply merges multiple objects into a new object.

- Only plain objects are merged recursively.
- Non-plain objects (like Date, RegExp, Map, etc.) are cloned or overwritten.
- Arrays are replaced by default (optionally configurable).
- Primitives and functions are always overwritten.

Type-specific behaviour:
- `undefined` / `null` — replaces target
- Primitives (string, number, boolean) — replaces target
- `Array` — replaced (not merged)
- `Date` — cloned with `new Date(...)`
- `RegExp`, `Map`, `Set` — shallow cloned
- `Function`, `Promise`, `Symbol` — treated as-is (overwritten)
- Class instances — not merged, replaced as-is

#### Example

```ts
const defaults = { theme: 'light', features: { darkMode: false } };
const userPrefs = { features: { darkMode: true, notifications: true } };

const config = deepMerge(defaults, userPrefs);
console.log(config);
// {
//   theme: 'light',
//   features: { darkMode: true, notifications: true }
// }
```

***

### makeReadonly()

Defined in: [object.ts:233](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/object.ts#L233)

Creates a deeply immutable readonly copy of an object.

#### Example

```ts
const original = { name: 'John', age: 30 };
const readonly = makeReadonly(original);

// Attempting to modify readonly object will throw an error
readonly.name = 'Jane'; // Throws TypeError
```

***

### mapValues()

Defined in: [object.ts:212](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/object.ts#L212)

Transforms the values of an object using a mapping function or property key.

#### Example

```ts
const users = {
  user1: { name: 'John', age: 30 },
  user2: { name: 'Jane', age: 25 }
};

// Extract names
const names = mapValues(users, 'name');
console.log(names); // { user1: 'John', user2: 'Jane' }

// Transform with function
const ages = mapValues(users, user => user.age * 2);
console.log(ages); // { user1: 60, user2: 50 }
```

***

### omit()

Defined in: [object.ts:76](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/object.ts#L76)

Creates a new object excluding the specified keys from the source object.

#### Example

```ts
const user = { id: 1, name: 'John', email: 'john@example.com', password: 'secret' };
const safeUser = omit(user, ['password']);
console.log(safeUser); // { id: 1, name: 'John', email: 'john@example.com' }

const data = { a: 1, b: 2, c: undefined };
const cleaned = omit(data, ['b'], true);
console.log(cleaned); // { a: 1 } (both 'b' and undefined 'c' removed)
```

***

### pick()

Defined in: [object.ts:46](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/object.ts#L46)

Creates a new object containing only the specified keys from the source object.

#### Example

```ts
const user = { id: 1, name: 'John', email: 'john@example.com', password: 'secret' };
const publicUser = pick(user, ['id', 'name']);
console.log(publicUser); // { id: 1, name: 'John' }

// With undefined values
const data = { a: 1, b: undefined, c: 3 };
const withUndefined = pick(data, ['a', 'b', 'c']);
console.log(withUndefined); // { a: 1, b: undefined, c: 3 }

const withoutUndefined = pick(data, ['a', 'b', 'c'], true);
console.log(withoutUndefined); // { a: 1, c: 3 }
```

***

### traverse()

Defined in: [object.ts:279](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/object.ts#L279)

Recursively traverses an object, applying transformations to each key-value pair.
Creates a new copy with transformations applied.

#### Example

```ts
// Transform all string values to uppercase
const data = { name: 'john', nested: { title: 'mr' } };
const result = traverse(data, ({ key, value }) => {
  if (typeof value === 'string') {
    return { key, value: value.toUpperCase() };
  }
});
console.log(result); // { name: 'JOHN', nested: { title: 'MR' } }

// Rename keys
const renamed = traverse(data, ({ key, value }) => {
  if (key === 'name') {
    return { key: 'fullName', value };
  }
});
console.log(renamed); // { fullName: 'john', nested: { title: 'mr' } }

// Control traversal depth using TraverseNode
const shallow = traverse(data, ({ key, value }, node) => {
  if (key === 'nested') {
    node.ignoreChildren(); // Don't traverse into nested objects
  }
});

// Async transformation
const asyncResult = await traverse(data, async ({ key, value }) => {
  if (typeof value === 'string') {
    const processed = await someAsyncOperation(value);
    return { key, value: processed };
  }
});
```
