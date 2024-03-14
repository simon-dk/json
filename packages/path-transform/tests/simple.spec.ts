import { transform } from '../src/PathTransform';

describe('simple json structures', () => {
  const json = {
    foo: 'bar',
    baz: 123,
    address: { street: 'Center Square', no: 444 },
    address2: { street: 'Main Street', no: 555 },
  };

  it('should return the same json', () => {
    const schema = { foo: '$.foo', baz: '$.baz' };

    const expected = { foo: json.foo, baz: json.baz };
    const result = transform({ json, schema });
    expect(result).toEqual(expected);
  });

  it('should return the same json when using root', () => {
    const schema = { $: '$' };

    const expected = json;
    const result = transform({ json, schema });
    expect(result).toEqual(expected);
  });

  it('should return only the foo property', () => {
    const schema = { foo: '$.foo' };

    const expected = { foo: json.foo };
    const result = transform({ json, schema });
    expect(result).toEqual(expected);
  });

  it('should return an item if there are a single', () => {
    const schema = { street: '$.address.street' };

    const expected = { street: json.address.street };
    const transformedData = transform({ json, schema });
    expect(transformedData).toEqual(expected);
  });

  it('should return an array if there are multiple items', () => {
    const schema = { streets: '$..street' };

    const expected = { streets: [json.address.street, json.address2.street] };
    const transformedData = transform({ json, schema });
    expect(transformedData).toEqual(expected);
  });
});
