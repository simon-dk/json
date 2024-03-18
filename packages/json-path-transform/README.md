# @json/path-transform

Transforms JSON objects using a path-based approach.

## Description

This package provides a simple way to transform JSON objects using a path-based approach.

The purpose is to make it possible to write declarative transformations for json objects, hence make it useable in a configuration file or from user inputs.

## Installation

Using npm

```bash
npm install @json/path-transform
```

Using yarn

```bash
yarn add @json/path-transform
```

Using pnpm

```bash
pnpm add @json/path-transform
```

## Usage

The schema defines the transformation rules. The keys are the target keys and the values are the paths to the source keys.

```typescript
import { PathTransform } from '@json/path-transform';

const schema = {
  name: '$.user.name',
  age: '$.user.age',
};

const data = {
  user: {
    name: 'John Doe',
    age: 30,
  },
};

const transformer = new PathTransform(schema).compile();

console.log(transformer(data)); // { name: 'John Doe', age: 30 }

```

## Syntax

The JSONPath syntax is used to define the paths. The package uses the `jsonpath-plus` package under the hood to resolve the paths.

Exmaples can be found at [https://goessner.net/articles/JsonPath/](https://goessner.net/articles/JsonPath/).

### Root ($) key

The root key can be used to define the root of the object at any given depth. This copies the main object to that level.

```typescript
import { PathTransform } from '@json/path-transform';

const schema = {
  $: '$.user',
};

const data = {
  user: {
    name: 'John Doe',
    age: 30,
  },
};

const transformer = new PathTransform(schema).compile();

console.log(transformer(data)); // { name: 'John Doe', age: 30 }
```

## Performance

The performance is dependant on the complexity of the schema and the size of the data. The package makes a AOT compilation of the schema to make the transformation as fast as possible, and uses `jsonpath-plus` package under to hood to resolve results from each path.

On a M1 Macbook Air (16GB RAM) we can expect the following performance as seen under the `benchmark` folder.

| Test Name       | ops/sec      | Confidence Interval |
|-----------------|--------------|---------------------|
| root            | 4,907,733    | ±0.20%              |
| allAuthors      | 479,267      | ±0.35%              |
| allAuthorsDot   | 1,007,505    | ±1.30%              |
| addKey          | 449,904      | ±0.76%              |
