[**otskit**](README.md)

***

[otskit](README.md) / array

## Functions

### deepCopy()

Defined in: [array.ts:121](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/array.ts#L121)

Creates a deep copy of an array, recursively cloning any objects within it.

#### Example

```ts
const users = [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }];
const copied = deepCopy(users);
copied[0].name = 'Johnny';
console.log(users[0].name); // 'John' (original unchanged)
console.log(copied[0].name); // 'Johnny'
```

***

### diffObjectsInArrays()

Defined in: [array.ts:199](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/array.ts#L199)

Compares two arrays of objects and identifies what changed between them.

#### Example

```ts
const oldUsers = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
const newUsers = [{ id: 2, name: 'Jane Smith' }, { id: 3, name: 'Bob' }];

const diffs = diffObjectsInArrays(oldUsers, newUsers, ['name'], ['id']);

console.log(diffs); // [
//   {
//     previousItem: { id: 2, name: 'Jane' },
//     newItem: { id: 2, name: 'Jane Smith' },
//     status: 'updated',
//     previousIndex: 1,
//     newIndex: 0
//   },
//   {
//     previousItem: null,
//     newItem: { id: 3, name: 'Bob' },
//     status: 'added',
//     previousIndex: null,
//     newIndex: 1
//   },
//   {
//     previousItem: { id: 1, name: 'John' },
//     newItem: null,
//     status: 'deleted',
//     previousIndex: 0,
//     newIndex: null
//   }
// ]
```

***

### includes()

Defined in: [array.ts:271](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/array.ts#L271)

Checks if an array contains a specific value with proper type narrowing.

#### Example

```ts
const fruits = ['apple', 'banana', 'orange'] as const;
const input = 'apple';

if (includes(fruits, input)) {
  // TypeScript now knows input is 'apple' | 'banana' | 'orange'
  console.log(`Found fruit: ${input}`);
}
```

***

### orderBy()

Defined in: [array.ts:95](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/array.ts#L95)

Returns a sorted copy of an array using one or more properties or functions.

#### Example

```ts
const users = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
  { name: 'Bob', age: 35 }
];

// Sort by age ascending
const byAge = orderBy(users, 'age');
console.log(byAge); // [{ name: 'Jane', age: 25 }, { name: 'John', age: 30 }, { name: 'Bob', age: 35 }]

// Sort by multiple fields
const sorted = orderBy(users, ['age', 'name'], ['desc', 'asc']);
```

***

### randomItem()

Defined in: [array.ts:155](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/array.ts#L155)

Returns a single random item from an array.

#### Example

```ts
const fruits = ['apple', 'banana', 'orange', 'grape'];
const randomFruit = randomItem(fruits);
console.log(randomFruit); // 'banana'
```

***

### sample()

Defined in: [array.ts:141](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/array.ts#L141)

Selects random items from an array.

#### Example

```ts
const colors = ['red', 'blue', 'green', 'yellow'];

// Get one random item (returns array with single element)
const randomColor = sample(colors);
console.log(randomColor); // ['blue']

// Get multiple random items (with possible duplicates)
const randomColors = sample(colors, 3);
console.log(randomColors); // ['red', 'red', 'green']
```

***

### shuffle()

Defined in: [array.ts:25](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/array.ts#L25)

Creates an array of shuffled values.

#### Example

```ts
const arr = [1, 2, 3, 4, 5];
const shuffled = shuffle(arr);
console.log(shuffled); // [3, 1, 5, 2, 4]
```

***

### unique()

Defined in: [array.ts:44](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/array.ts#L44)

Creates a duplicate-free version of an array.

#### Example

```ts
const arr = [1, 1, 3, 4, 5, 4];
const uniqueArray = unique(arr);
console.log(uniqueArray); // [1, 3, 4, 5]
```

***

### uniqueBy()

Defined in: [array.ts:63](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/array.ts#L63)

Creates a duplicate-free version of an array using a property or function to determine uniqueness.

#### Example

```ts
const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }, { id: 1, name: 'John' }];

// Using a property
const uniqueUsers = uniqueBy(users, 'id');
console.log(uniqueUsers); // [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]

// Using a function
const uniqueByName = uniqueBy(users, user => user.name.toLowerCase());
```
