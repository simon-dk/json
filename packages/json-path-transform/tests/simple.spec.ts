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

  it('should keep the structure when mixing root with other paths', () => {
    const schema = { $: '$', street: '$.address.street' };
    const transformer = new PathTransform(schema);

    const expected = { ...json, street: json.address.street };
    const result = transformer.transform(json);
        
    // the object itself should be equal
    expect(result).toEqual(expected);

    // the order of the keys should remain the same
    expect(Object.keys(result)).toEqual(Object.keys(expected));
  });

  it('should preserve nested order when using root inside objects', () => {
    const schema = {
      foo: '$.foo',
      wrapper: {
        $: '$',
        street: '$.address.street',
      },
    };

    const transformer = new PathTransform(schema);

    const expected = {
      foo: json.foo,
      wrapper: { ...json, street: json.address.street },
    };

    const result = transformer.transform(json);

    

    expect(result).toEqual(expected);
    expect(Object.keys(result.wrapper)).toEqual(Object.keys(expected.wrapper));
  });
});
