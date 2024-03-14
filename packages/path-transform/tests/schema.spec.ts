import { transform } from '../src/PathTransform';

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

  const expected = { ...json, newKey: 'bar' };
  const result = transform({ json, schema });
  expect(result).toEqual(expected);
});

it('should add a nested key', () => {
  const schema = {
    $: '$',
    school: { address: '$.address.street', phone: '555-111-222' },
  };

  const expected = {
    ...json,
    school: { address: json.address.street, phone: '555-111-222' },
  };
  const result = transform({ json, schema });
  expect(result).toEqual(expected);
});

it('should add a key in an array', () => {
  const schema = { books: ['foo', '$.books'] };

  const expected = { books: ['foo', json.books] };
  const result = transform({ json, schema });
  expect(result).toEqual(expected);
});

it('should add a key in an object in an array', () => {
  const schema = { books: [{ foo: 'bar' }, '$..books'] };

  const expected = { books: [{ foo: 'bar' }, json.books] };
  const result = transform({ json, schema });
  expect(result).toEqual(expected);
});

it('should get value from circular reference', () => {
  const circularJson: Record<string, unknown> = json;
  circularJson.circle = json;

  const schema = {
    street: '$.address.street',
    circle: '$.circle.address.street',
  };

  const expected = { street: json.address.street, circle: json.address.street };
  const result = transform({ json: circularJson, schema });
  expect(result).toEqual(expected);
});

it('should return undefined if no value exists', () => {
  const schema = { city: '$.address.city' };

  const expected = { city: undefined };
  const result = transform({ json, schema });
  expect(result).toEqual(expected);
});

it('should return an item if wrap is false', () => {
  const schema = { street: '$.address.street' };

  const expected = { street: json.address.street };
  const transformedData = transform({ json, schema, wrap: false });
  expect(transformedData).toEqual(expected);
});

it('should return an array if wrap is true', () => {
  const schema = { street: '$.address.street' };

  const expected = { street: [json.address.street] };
  const transformedData = transform({ json, schema, wrap: true });
  expect(transformedData).toEqual(expected);
});
