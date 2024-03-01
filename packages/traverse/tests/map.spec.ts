import { traverse } from '../src/Traverse';

describe('map', () => {
  it('should create a new object', () => {
    const object = {
      title: 'title',
    };

    // eslint-disable-next-line array-callback-return
    const res = traverse(object).map(() => {});

    expect(res).toEqual(object);
    expect(res).not.toBe(object);
  });

  it('should return a new object', () => {
    const object = {
      title: 'title',
    };

    const res = traverse(object).map((value, ctx) => {
      if (ctx.key === 'title') {
        ctx.update('new title');
      }
      return value;
    });

    expect(object).toEqual({ title: 'title' });
    expect(res).toEqual({ title: 'new title' });
    expect(res).not.toBe(object);
  });

  it('should traverse a large object and update all year values', () => {
    const object = {
      title: 'title',
      year: 2021,
      nested: {
        year: 2021,
        deep: {
          year: 2021,
        },
      },
      arr: [
        {
          year: 2021,
        },
        {
          year: 2021,
        },
      ],
    };

    const res = traverse(object).map((value, ctx) => {
      if (ctx.key === 'year' && typeof value === 'number') {
        ctx.update(value + 1);
      }
      return value;
    });

    expect(res).toEqual({
      title: 'title',
      year: 2022,
      nested: {
        year: 2022,
        deep: {
          year: 2022,
        },
      },
      arr: [
        {
          year: 2022,
        },
        {
          year: 2022,
        },
      ],
    });
  });
});
