[**otskit**](README.md)

***

[otskit](README.md) / promise

## Functions

### sleep()

Defined in: [promise.ts:161](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/promise.ts#L161)

Pause for a set number of milliseconds.

#### Example

```ts
console.log('Starting...');
await sleep(1000);
console.log('1 second later');
```

***

### timeout()

Defined in: [promise.ts:55](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/promise.ts#L55)

Adds a timeout to any Promise with optional fallback handling.

#### Example

```ts
// Basic timeout with default 5 second limit
const result = await timeout(fetch('/api/slow-endpoint'));

// Custom timeout duration
const quickResult = await timeout(
  someSlowOperation(),
  { timeoutMs: 1000 }
);

// Fallback value on timeout
const dataWithFallback = await timeout(
  fetchUserData(),
  {
    timeoutMs: 3000,
    onTimeout: { id: 0, name: 'Guest User' }
  }
);

// Fallback function (can be async)
const dynamicFallback = await timeout(
  apiCall(),
  {
    timeoutMs: 2000,
    onTimeout: async () => await getCachedData(),
    onTimeoutEffect: () => console.log('API timeout, using cache')
  }
);

// Database query with timeout
const users = await timeout(
  db.users.findMany(),
  {
    timeoutMs: 10000,
    onTimeout: [],
    onTimeoutEffect: () => metrics.increment('db.timeout')
  }
);
```

***

### tryCatch()

Defined in: [promise.ts:125](https://github.com/floppyos/floppyos.com/blob/51c1deec67cf0359f780339b20284f48d889ab9b/shared/packages/otskit/src/promise.ts#L125)

Wraps functions, promises, or async functions to handle errors gracefully.
Returns a tuple [result, error] instead of throwing.

#### Example

```ts
// Handle async function errors
async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

const [user, error] = await tryCatch(() => fetchUser('123'));
if (error) {
  console.log('Failed to fetch user:', error);
} else {
  console.log('User:', user);
}

// Handle sync function errors
const [result, parseError] = tryCatch(() => JSON.parse(userInput));
if (parseError) {
  console.log('Invalid JSON');
} else {
  console.log('Parsed:', result);
}

// Perfect for API calls without try/catch blocks
const [posts, postsError] = await tryCatch(() => api.getPosts());
const [comments, commentsError] = await tryCatch(() => api.getComments());

if (postsError || commentsError) {
  return { error: 'Failed to load data' };
}

return { posts, comments };
```
