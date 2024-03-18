import { PathTransform } from '../src/PathTransform';

describe('simple json structures', () => {
  const json = {
    foo: 'bar',
    baz: 123,
    address: { street: 'Center Square', no: 444 },
    address2: { street: 'Main Street', no: 555 },
  };

  it('should return the same json', () => {
    const schema = { foo: '$.foo', baz: '$.baz' };
    const transformer = new PathTransform(schema);

    const expected = { foo: json.foo, baz: json.baz };
    const result = transformer.transform(json);
    expect(result).toEqual(expected);
  });

  it('should return the same json when using root', () => {
    const schema = { $: '$' };
    const transformer = new PathTransform(schema);

    const expected = json;
    const result = transformer.transform(json);
    expect(result).toEqual(expected);
  });

  it('should return only the foo property', () => {
    const schema = { foo: '$.foo' };
    const transformer = new PathTransform(schema);

    const expected = { foo: json.foo };
    const result = transformer.transform(json);
    expect(result).toEqual(expected);
  });

  it('should return an item if there are a single', () => {
    const schema = { street: '$.address.street' };
    const transformer = new PathTransform(schema);

    const expected = { street: json.address.street };
    const result = transformer.transform(json);
    expect(result).toEqual(expected);
  });

  it('should return an array if there are multiple items', () => {
    const schema = { streets: '$..street' };
    const transformer = new PathTransform(schema);

    const expected = { streets: [json.address.street, json.address2.street] };
    const result = transformer.transform(json);
    expect(result).toEqual(expected);
  });
});
