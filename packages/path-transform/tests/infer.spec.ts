/* eslint-disable @typescript-eslint/no-unused-vars */
import { transform } from '../src/PathTransform';

// helper functions to test type inference
type Expect<T extends true> = T;

type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

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

it('should be able to infer static propeties', () => {
  const schema = { books: ['foo', '$.store.books'] } as const;
  const result = transform({ json, schema });
  const book1 = result.books[0];
  const book2 = result.books[1];

  type Book1Test = Expect<Equal<typeof book1, 'foo'>>;
  type Book2Test = Expect<Equal<typeof book2, unknown>>;

  expect(book1).toEqual('foo');
  expect(book2).toEqual(result.books[1]);
});

it('should infer nested static properties', () => {
  const schema = {
    nested: { value: 'here', bicyclePrice: '$.store.bicycle.price' },
  } as const;

  const expected = { nested: { value: 'here', bicyclePrice: 19.95 } };
  const result = transform({ json, schema });

  type Book1Test = Expect<Equal<typeof result.nested.value, 'here'>>;
  type Book2Test = Expect<Equal<typeof result.nested.bicyclePrice, unknown>>;

  expect(result).toEqual(expected);
});
