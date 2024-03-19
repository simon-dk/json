/* eslint-disable @typescript-eslint/no-unused-vars */
import { PathTransform } from '../src/PathTransform';
import type { SchemaObject } from '../src/types';

// helper types to test type inference
type Expect<T extends true> = T;
type ExpectNot<T extends false> = T;
type Satisfies<T, U> = T extends U ? true : false;
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
  const transformer = new PathTransform(schema);

  const result = transformer.transform(json);
  const book1 = result.books[0];
  const book2 = result.books[1];

  type Test1 = Expect<Equal<typeof book1, 'foo'>>;
  type Test2 = Expect<Equal<typeof book2, unknown>>;

  expect(book1).toEqual('foo');
  expect(book2).toEqual(result.books[1]);
});

it('should infer nested static properties', () => {
  const schema = {
    nested: { value: 'here', bicyclePrice: '$.store.bicycle.price' },
  } as const;
  const transformer = new PathTransform(schema);
  const expected = { nested: { value: 'here', bicyclePrice: 19.95 } };

  const result = transformer.transform(json);
  type Test1 = Expect<Equal<typeof result.nested.value, 'here'>>;
  type Test2 = Expect<Equal<typeof result.nested.bicyclePrice, unknown>>;

  expect(result).toEqual(expected);
});

it('should infer as strings when not using as const', () => {
  const schema = {
    nested: { value: 'here', bicyclePrice: '$.store.bicycle.price' },
  };
  const transformer = new PathTransform(schema);
  const expected = { nested: { value: 'here', bicyclePrice: 19.95 } };

  const result = transformer.transform(json);
  type Test1 = Expect<Equal<typeof result.nested.value, string>>;
  type Test2 = Expect<Equal<typeof result.nested.bicyclePrice, string>>;

  expect(result).toEqual(expected);
});

it('should add any key value when using a root key', () => {
  const schema = { $: '$', books: '$.store.book' } as const;
  const transformer = new PathTransform(schema);
  const expected = { ...json, books: json.store.book };

  const result = transformer.transform(json);

  type Test1 = ExpectNot<Equal<(typeof result)['$'], string>>;
  type Test2 = Expect<Equal<typeof result.$, unknown>>;
  type Test3 = Expect<Equal<typeof result.foo, unknown>>;
  type Test4 = Expect<Equal<typeof result.bar, unknown>>;

  expect(result).toEqual(expected);
});

it('should disallow schema with functions or bigint', () => {
  const schema1 = { foo: () => 1 };
  const schema2 = { foo: { bar: () => 1 } };
  const schema3 = { foo: 'bar', big: 1n };
  const schema4 = { foo: { bar: 1n } };

  type Test1 = ExpectNot<Satisfies<typeof schema1, SchemaObject>>;
  type Test2 = ExpectNot<Satisfies<typeof schema2, SchemaObject>>;
  type Test3 = ExpectNot<Satisfies<typeof schema3, SchemaObject>>;
  type Test4 = ExpectNot<Satisfies<typeof schema4, SchemaObject>>;

  expect(1).toEqual(1);
});

it('should not allow schema with dates or buffer', () => {
  const schema1 = { created: new Date('2024-01-01') };
  const schema2 = { buffer: Buffer.from('hello world') };

  type Test1 = ExpectNot<Satisfies<typeof schema1, SchemaObject>>;
  type Test2 = ExpectNot<Satisfies<typeof schema2, SchemaObject>>;

  expect(1).toEqual(1);
});

it('should  allow schema with null', () => {
  const schema = { empty: null };

  type Test = Expect<Satisfies<typeof schema, SchemaObject>>;

  expect(1).toEqual(1);
});
