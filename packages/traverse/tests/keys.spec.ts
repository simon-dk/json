import { traverse } from '../src/Traverse';

describe('keys', () => {
  it('should contain correct keys', () => {
    const data = {
      name: 'John',
      address: {
        streetName: 'Main St.',
        houseNumber: 82,
      },
      kids: [{ name: 'Jack' }, 'test'],
    };

    const keys: Array<string | number | undefined> = [];

    traverse(data).forEach((value, ctx) => {
      keys.push(ctx.key);
    });

    expect(keys).toEqual([
      undefined,
      'name',
      'address',
      'streetName',
      'houseNumber',
      'kids',
      '0',
      'name',
      '1',
    ]);
  });
});
