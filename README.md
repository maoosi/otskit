# otskit 🪛

**Opinionated collection of TypeScript utility functions.**

- Strictly typed
- No external dependencies
- Fully tested — drop in and bundle what you need

> ✱ Not a published package — just a bunch of personal utils you’re welcome to copy into your codebase.

## Installation

Copy a specific module into your project using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit maoosi/otskit/src/string.ts otskit/string.ts
```

Or clone the full source:

```bash
npx degit maoosi/otskit/src otskit
```

Replace the destination folder as needed.

## Module Dependencies

Some modules depend on others. If copying individually, include their dependencies:

- `array.ts` → depends on: `is.ts`, `object.ts`
- `object.ts` → depends on: `is.ts`

Relative imports (e.g. `./is`) require keeping the folder structure intact.

## Usage

```ts
import { [functionName] } from 'otskit/[module]'
```

## Documentation

See [Documentation](docs/README.md) for a full list of modules and functions with examples.
Auto-generated with [TypeDoc](https://typedoc.org).

## Inspirations

Some utilities are inspired by or adapted from:

- <https://github.com/antfu/utils> (MIT License)
- <https://github.com/sindresorhus/debounce> (MIT License)

## License

MIT
