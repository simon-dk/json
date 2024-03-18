import { PathTransform } from '../src/PathTransform';

describe('simple arrays', () => {
  const json = [
    { title: 'book1', author: 'author1' },
    { title: 'book2', author: 'author2' },
  ];

  it('should return the same json', () => {
    const schema = { books: '$' };
    const transformer = new PathTransform(schema);

    const expected = { books: json };
    const result = transformer.transform(json);
    expect(result).toEqual(expected);
  });

  it('should return the first item', () => {
    const schema = { book: '$.[0]' };
    const transformer = new PathTransform(schema);

    const expected = { book: json[0] };
    const result = transformer.transform(json);
    expect(result).toEqual(expected);
  });

  it('should return all titles', () => {
    const schema = { titles: '$..title' };
    const transformer = new PathTransform(schema);

    const expected = { titles: json.map((item) => item.title) };
    const result = transformer.transform(json);
    expect(result).toEqual(expected);
  });
});
