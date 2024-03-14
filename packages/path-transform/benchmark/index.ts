// eslint-disable-next-line import/no-extraneous-dependencies
import { Suite } from 'benchmark';

import { transform } from '../src/PathTransform';

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

suite.add('no transform', () => {
  transform({ json, schema: { $: '$' } });
});

suite.add('all authors (double-dot)', () => {
  transform({ json, schema: { authors: '$..author' } });
});

suite.add('all authors (dot-notation)', () => {
  transform({ json, schema: { authors: '$.store.book[*].author' } });
});

suite.add('add key', () => {
  transform({
    json,
    schema: {
      id: '<some-id>',
      authors: '$.store.book[*].author',
      titles: '$.store.book[*].title',
      data: '$',
    },
  });
});

suite
  .on('cycle', (event: Event) => {
    console.log(String(event.target));
  })
  .on('complete', () => {
    console.log(`Fastest is ${suite.filter('fastest').map('name')} `);
  })
  .run({ async: true });

// no transform x 908,917 ops/sec ±0.24% (99 runs sampled)
// all authors (double-dot) x 324,658 ops/sec ±0.84% (90 runs sampled)
// all authors dot-notation x 489,046 ops/sec ±1.94% (94 runs sampled)
// add keys x 222,762 ops/sec ±0.93% (95 runs sampled)
// Fastest is no transform

// 2024-03-14: Tested on M1 MacBook Air 2020 (16GB RAM)
