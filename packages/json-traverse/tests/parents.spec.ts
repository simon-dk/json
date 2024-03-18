import type { Node } from '../src/Node';
import { traverse } from '../src/Traverse';

describe('parents', () => {
  it('should contain correct parent structure', () => {
    const data = {
      name: 'John',
      address: {
        streetName: 'Main St.',
        houseNumber: 82,
      },
      kids: [{ name: 'Jack' }],
    };

    const parents: Array<Node | undefined> = [];

    traverse(data).forEach((value, ctx) => {
      parents.push(ctx.parent);
    });

    expect(parents.length).toBe(8);
    expect(parents[0]).toBeUndefined();
    expect(parents[1]?.value).toBe(data);
    expect(parents[2]?.value).toBe(data);
    expect(parents[3]?.value).toBe(data.address);
    expect(parents[4]?.value).toBe(data.address);
    expect(parents[5]?.value).toBe(data);
    expect(parents[6]?.value).toBe(data.kids);
    expect(parents[7]?.value).toBe(data.kids[0]);
  });

  it('should contain correct parent structure for maps', () => {
    const data = {
      name: 'John',
      address: {
        streetName: 'Main St.',
        houseNumber: 82,
      },
      kids: [{ name: 'Jack' }],
    };

    const parents: Array<Node | undefined> = [];
    const keys: Array<string | number | undefined> = [];
    const paths: Array<string | number>[] = [];

    // eslint-disable-next-line array-callback-return
    traverse(data).map((value, ctx) => {
      parents.push(ctx.parent);
      keys.push(ctx.key);
      paths.push(ctx.path);
    });

    // Map should clone the data
    expect(parents.length).toBe(8);
    expect(parents[0]).toBeUndefined();
    expect(parents[1]?.value).not.toBe(data);
    expect(parents[2]?.value).not.toBe(data);
    expect(parents[3]?.value).not.toBe(data.address);
    expect(parents[4]?.value).not.toBe(data.address);
    expect(parents[5]?.value).not.toBe(data);
    expect(parents[6]?.value).not.toBe(data.kids);
    expect(parents[7]?.value).not.toBe(data.kids[0]);

    // Data should still equal
    expect(parents.length).toBe(8);
    expect(parents[0]).toBeUndefined();
    expect(parents[1]?.value).toEqual(data);
    expect(parents[2]?.value).toEqual(data);
    expect(parents[3]?.value).toEqual(data.address);
    expect(parents[4]?.value).toEqual(data.address);
    expect(parents[5]?.value).toEqual(data);
    expect(parents[6]?.value).toEqual(data.kids);
    expect(parents[7]?.value).toEqual(data.kids[0]);
  });
});
