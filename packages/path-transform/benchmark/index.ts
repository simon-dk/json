// eslint-disable-next-line import/no-extraneous-dependencies
import { Suite } from 'benchmark';

import { PathTransform } from '../src/PathTransform';

const suite = new Suite();

const json = {
  store: {
    book: [
      {
        category: 'reference',
        author: 'Nigel Rees',
        title: 'Sayings of the Century',
        price: 8.95,
      },
      {
        category: 'fiction',
        author: 'Evelyn Waugh',
        title: 'Sword of Honour',
        price: 12.99,
      },
      {
        category: 'fiction',
        author: 'Herman Melville',
        title: 'Moby Dick',
        isbn: '0-553-21311-3',
        price: 8.99,
      },
      {
        category: 'fiction',
        author: 'J. R. R. Tolkien',
        title: 'The Lord of the Rings',
        isbn: '0-395-19395-8',
        price: 22.99,
      },
    ],
    bicycle: {
      color: 'red',
      price: 19.95,
    },
  },
};

const schemas = {
  root: { $: '$' },
  allAuthors: { authors: '$..author' },
  allAuthorsDot: {
    authors: '$.store.book[*].author',
  },

  addKey: {
    id: '<some-id>',
    authors: '$.store.book[*].author',
    titles: '$.store.book[*].title',
    data: '$',
  },
};

// add benchmark for each schema
Object.entries(schemas).forEach(([key, schema]) => {
  const transformer = new PathTransform(schema).compile();
  suite.add(key, () => {
    transformer(json);
  });
});

suite
  .on('cycle', (event: Event) => {
    console.log(String(event.target));
  })
  .on('complete', () => {
    console.log(`\nFastest is ${suite.filter('fastest').map('name')} `);
  })
  .run();

// root x 4,907,733 ops/sec ±0.20% (99 runs sampled)
// allAuthors x 479,267 ops/sec ±0.35% (100 runs sampled)
// allAuthorsDot x 1,007,505 ops/sec ±1.30% (96 runs sampled)
// addKey x 449,904 ops/sec ±0.76% (96 runs sampled)

// Fastest is root
// 2024-03-18: Tested on M1 MacBook Air 2020 (16GB RAM)
