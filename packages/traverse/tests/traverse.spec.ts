import { Traverse, traverse } from '../src/Traverse';

describe('first', () => {
  let root: object;

  beforeEach(() => {
    root = {
      a: 1,
      b: {
        c: 2,
        d: 3,
      },
      e: [4, 5, 6, { foo: 'bar' }],
    };
  });

  it('constructor should initialize correctly', () => {
    expect(traverse(root)).toBeInstanceOf(Traverse);
  });

  it('constructor should throw error for non-object root', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => new Traverse(null as unknown as object)).toThrow();
    expect(() => new Traverse('foo' as unknown as object)).toThrow();
    expect(() => traverse(null as unknown as object)).toThrow();
    expect(() => traverse('foo' as unknown as object)).toThrow();
  });

  it('forEach should traverse all nodes', () => {
    const callback = jest.fn();
    traverse(root).forEach(callback);
    expect(callback).toHaveBeenCalledTimes(11);
  });

  it('should correctly return root, nodes and leafs', () => {
    const roots: boolean[] = [];
    const nodes: boolean[] = [];
    const leaves: boolean[] = [];

    traverse(root).forEach((value, ctx) => {
      roots.push(ctx.isRoot);
      nodes.push(!ctx.isRoot && !ctx.isLeaf);
      leaves.push(ctx.isLeaf);
    });

    const rootCount = roots.filter(Boolean).length;
    const nodeCount = nodes.filter(Boolean).length;
    const leafCount = leaves.filter(Boolean).length;

    expect(rootCount).toBe(1);
    expect(nodeCount).toBe(3);
    expect(leafCount).toBe(7);
  });
});
