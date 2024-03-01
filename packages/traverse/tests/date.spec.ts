import { traverse } from '../src/Traverse';

describe('date', () => {
  it('should traverse date', () => {
    const object = {
      date: new Date(),
      dateStr: '2021-08-01T00:00:00.000Z',
      age: 38,
    };

    const result: string[] = [];

    traverse(object).forEach((value) => {
      const type = (value instanceof Date && 'Date') || typeof value;
      result.push(type);
    });

    expect(result).toEqual(['object', 'Date', 'string', 'number']);
  });
});
