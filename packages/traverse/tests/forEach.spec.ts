import { traverse } from '../src/Traverse';

describe('forEach', () => {
  it('should create return the original object', () => {
    const object = {
      title: 'title',
    };

    // eslint-disable-next-line array-callback-return
    const res = traverse(object).forEach(() => {});

    expect(res).toEqual(object);
    expect(res).toBe(object);
  });

  it('should mutate the original object', () => {
    const object = {
      title: 'title',
    };

    const res = traverse(object).forEach((value, ctx) => {
      if (ctx.key === 'title') {
        ctx.update('new title');
      }
      return value;
    });

    expect(object).toEqual({ title: 'new title' });
    expect(res).toEqual({ title: 'new title' });
    expect(res).toBe(object);
  });
});
