import { Traverse } from '../src/Traverse';

describe('circular', () => {
  let traverse: Traverse;

  it('should stack overflow if checkCircular is set to false', () => {
    const cb = jest.fn();
    const object = {
      foo: 'bar',
      bar: null as null | object,
    };

    object.bar = object;

    traverse = new Traverse(object, { checkCircular: false });
    expect(() => traverse.forEach(cb)).toThrow();
  });

  it('should not stack overflow if checkCircular is set to true', () => {
    const cb = jest.fn();
    const object = {
      foo: 'bar',
      bar: null as null | object,
    };

    object.bar = object;

    traverse = new Traverse(object, { checkCircular: true });
    expect(() => traverse.forEach(cb)).not.toThrow();
  });

  it('should traverse all nodes excluding the circular reference', () => {
    const cb = jest.fn();
    const object = {
      foo: 'bar',
      bar: null as null | object,
    };

    object.bar = object;

    traverse = new Traverse(object, { checkCircular: true });
    traverse.forEach(cb);

    expect(cb).toHaveBeenCalledTimes(3);
  });
});
