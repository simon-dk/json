import { traverse } from '../src/Traverse';

describe('simple', () => {
  it('should traverse a simple object', () => {
    const data = {
      name: 'John',
      age: 38,
      phone: '123-456-7890',
    };

    const callback = jest.fn();
    traverse(data).forEach(callback);
    expect(callback).toHaveBeenCalledTimes(4);
  });
});
