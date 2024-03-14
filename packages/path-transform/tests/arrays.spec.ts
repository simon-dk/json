import { transform } from '../src/PathTransform';

describe('simple arrays', () => {
  const json = [
    { title: 'book1', author: 'author1' },
    { title: 'book2', author: 'author2' },
  ];

  it('should return the same json', () => {
    const schema = { books: '$' };

    const expected = { books: json };
    const result = transform({ json, schema });
    expect(result).toEqual(expected);
  });

  it('should return the first item', () => {
    const schema = { book: '$.[0]' };

    const expected = { book: json[0] };
    const result = transform({ json, schema });
    expect(result).toEqual(expected);
  });

  it('should return all titles', () => {
    const schema = { titles: '$..title' };

    const expected = { titles: json.map((item) => item.title) };
    const result = transform({ json, schema });
    expect(result).toEqual(expected);
  });
});
