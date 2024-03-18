import { PathTransform } from '../src/PathTransform';

const json = {
  address: {
    street: 'Main St.',
    number: '555',
  },

  books: [
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
  ],
  bicycles: [
    {
      color: 'red',
      price: 19.95,
    },
    {
      color: 'blue',
      price: 16.95,
    },
  ],
};

it('should copy json to a lower level', () => {
  const schema = { foo: { $: '$' } };
  const transformer = new PathTransform(schema);

  const expected = { foo: json };
  const result = transformer.transform(json);
  expect(result).toEqual(expected);
  expect(result.foo).not.toBe(json);
});

it('should copy part of json to a lower level', () => {
  const schema = { foo: { $: '$.address' } };
  const transformer = new PathTransform(schema);

  const expected = { foo: json.address };
  const result = transformer.transform(json);
  expect(result).toEqual(expected);
  expect(result.foo).not.toBe(json.address);
});
