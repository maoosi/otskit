[**otskit**](README.md)

***

[otskit](README.md) / promise

## Contents

* [Functions](#functions)
  * [sleep()](#sleep)
  * [tryCatch()](#trycatch)
  * [withTimeout()](#withtimeout)

## Functions

### sleep()

Pause for a set number of milliseconds.

#### Example

```ts
console.log('Starting...');
await sleep(1000);
console.log('1 second later');
```

***

### tryCatch()

Wraps functions, promises, or async functions to handle errors gracefully.
Returns a tuple \[result, error] instead of throwing.

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

***

### withTimeout()

Adds a timeout to any Promise with optional fallback handling.

#### Example

```ts
// Basic timeout with default 5 second limit
const result = await withTimeout(fetch('/api/slow-endpoint'));

// Custom timeout duration
const quickResult = await withTimeout(
  someSlowOperation(),
  { timeoutMs: 1000 }
);

// Fallback value on timeout
const dataWithFallback = await withTimeout(
  fetchUserData(),
  {
    timeoutMs: 3000,
    onTimeout: { id: 0, name: 'Guest User' }
  }
);

// Fallback function (can be async)
const dynamicFallback = await withTimeout(
  apiCall(),
  {
    timeoutMs: 2000,
    onTimeout: async () => await getCachedData(),
    onTimeoutEffect: () => console.log('API timeout, using cache')
  }
);

// Database query with timeout
const users = await withTimeout(
  db.users.findMany(),
  {
    timeoutMs: 10000,
    onTimeout: [],
    onTimeoutEffect: () => metrics.increment('db.timeout')
  }
);
```
