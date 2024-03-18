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

it('should keep the original structure and add a key', () => {
  const schema = { $: '$', newKey: 'bar' };
  const transformer = new PathTransform(schema);

  const expected = { ...json, newKey: 'bar' };
  const result = transformer.transform(json);
  expect(result).toEqual(expected);
});

it('should add a nested key', () => {
  const schema = {
    $: '$',
    school: { address: '$.address.street', phone: '555-111-222' },
  };
  const transformer = new PathTransform(schema);

  const expected = {
    ...json,
    school: { address: json.address.street, phone: '555-111-222' },
  };
  const result = transformer.transform(json);
  expect(result).toEqual(expected);
});

it('should add a key in an array', () => {
  const schema = { books: ['foo', '$.books'] };
  const transformer = new PathTransform(schema);

  const expected = { books: ['foo', json.books] };
  const result = transformer.transform(json);
  expect(result).toEqual(expected);
});

it('should add a key in an object in an array', () => {
  const schema = { books: [{ foo: 'bar' }, '$..books'] };
  const transformer = new PathTransform(schema);

  const expected = { books: [{ foo: 'bar' }, json.books] };
  const result = transformer.transform(json);
  expect(result).toEqual(expected);
});

it('should get value from circular reference', () => {
  const circularJson: Record<string, unknown> = json;
  circularJson.circle = json;

  const schema = {
    street: '$.address.street',
    circle: '$.circle.address.street',
  };
  const transformer = new PathTransform(schema);

  const expected = { street: json.address.street, circle: json.address.street };
  const result = transformer.transform(circularJson);
  expect(result).toEqual(expected);
});

it('should return undefined if no value exists', () => {
  const schema = { city: '$.address.city' };
  const transformer = new PathTransform(schema);

  const expected = { city: undefined };
  const result = transformer.transform(json);
  expect(result).toEqual(expected);
});

it('should return an item if wrap is false', () => {
  const schema = { street: '$.address.street' };
  const transformer = new PathTransform(schema, { wrap: false });

  const expected = { street: json.address.street };
  const result = transformer.transform(json);
  expect(result).toEqual(expected);
});

it('should return an array if wrap is true', () => {
  const schema = { street: '$.address.street' };
  const transformer = new PathTransform(schema, { wrap: true });

  const expected = { street: [json.address.street] };
  const result = transformer.transform(json);
  expect(result).toEqual(expected);
});
