import { traverse } from '../src/Traverse';

describe('paths', () => {
  it('should contain correct paths', () => {
    const data = {
      name: 'John',
      address: {
        streetName: 'Main St.',
        houseNumber: 82,
      },
      kids: [{ name: 'Jack' }, 'test'],
    };

    const paths: Array<string | number>[] = [];
    const stringPaths: Array<string> = [];

    traverse(data).forEach((value, ctx) => {
      paths.push(ctx.path);
      stringPaths.push(ctx.stringPath);
    });

    expect(paths).toEqual([
      [undefined],
      ['name'],
      ['address'],
      ['address', 'streetName'],
      ['address', 'houseNumber'],
      ['kids'],
      ['kids', '0'],
      ['kids', '0', 'name'],
      ['kids', '1'],
    ]);

    expect(stringPaths).toEqual([
      '',
      'name',
      'address',
      'address.streetName',
      'address.houseNumber',
      'kids',
      'kids.0',
      'kids.0.name',
      'kids.1',
    ]);
  });
});
