import { PathTransform } from '../src/PathTransform';

const json = {
  store: {
    book: [
      {
        category: 'reference',
        author: 'Nigel Rees',
        title: 'Sayings of the Century',
        price: 8.95,
      },
      {
        category: 'fiction',
        author: 'Evelyn Waugh',
        title: 'Sword of Honour',
        price: 12.99,
      },
      {
        category: 'fiction',
        author: 'Herman Melville',
        title: 'Moby Dick',
        isbn: '0-553-21311-3',
        price: 8.99,
      },
      {
        category: 'fiction',
        author: 'J. R. R. Tolkien',
        title: 'The Lord of the Rings',
        isbn: '0-395-19395-8',
        price: 22.99,
      },
    ],
    bicycle: {
      color: 'red',
      price: 19.95,
    },
  },
};

describe('store example', () => {
  it('should get all authors', () => {
    const schema = { authors: '$.store.book[*].author' };
    const transformer = new PathTransform(schema);

    const expected = { authors: json.store.book.map((b) => b.author) };
    const result = transformer.transform(json);
    expect(result).toEqual(expected);
  });

  it('should get all authors by double-dot', () => {
    const schema = { authors: '$..author' };
    const transformer = new PathTransform(schema);

    const expected = { authors: json.store.book.map((b) => b.author) };
    const result = transformer.transform(json);
    expect(result).toEqual(expected);
  });

  it('should get all things in the store', () => {
    const schema = { items: '$.store.*' };
    const transformer = new PathTransform(schema);

    const expected = { items: [[...json.store.book], json.store.bicycle] };
    const result = transformer.transform(json);
    expect(result).toEqual(expected);
  });

  it('should get all prices in the store in a single array', () => {
    const schema = { prices: '$.store..price' };
    const transformer = new PathTransform(schema);

    const expected = {
      prices: json.store.book
        .map((b) => b.price)
        .concat(json.store.bicycle.price),
    };
    const result = transformer.transform(json);
    expect(result).toEqual(expected);
  });

  it('should get the third book returned in an array expression', () => {
    const schema = { book: '$..book[2]' };
    const transformer = new PathTransform(schema);

    const expected = { book: [json.store.book[2]] };
    const result = transformer.transform(json);
    expect(result).toEqual(expected);
  });

  it('should get the last book using a logical expression', () => {
    const schema = { book: '$..book[(@.length-1)]' };
    const transformer = new PathTransform(schema);

    const expected = { book: [json.store.book[3]] };
    const result = transformer.transform(json);
    expect(result).toEqual(expected);
  });

  it('should get the last book returned in an array expression', () => {
    const schema = { book: '$..book[-1:]' };
    const transformer = new PathTransform(schema);

    const expected = { book: [json.store.book[3]] };
    const result = transformer.transform(json);
    expect(result).toEqual(expected);
  });

  it('should get the first two books', () => {
    const schema = { books: '$..book[:2]' };
    const transformer = new PathTransform(schema);

    const expected = { books: [json.store.book[0], json.store.book[1]] };
    const result = transformer.transform(json);
    expect(result).toEqual(expected);
  });

  it('should get all books with isbn number', () => {
    const schema = { books: '$..book[?(@.isbn)]' };
    const transformer = new PathTransform(schema);

    const expected = { books: [json.store.book[2], json.store.book[3]] };
    const result = transformer.transform(json);
    expect(result).toEqual(expected);
  });

  it('should get all books cheaper than 10', () => {
    const schema = { books: '$..book[?(@.price<10)]' };
    const transformer = new PathTransform(schema);

    const expected = { books: [json.store.book[0], json.store.book[2]] };
    const result = transformer.transform(json);
    expect(result).toEqual(expected);
  });

  it('should get all elements in XML document', () => {
    const schema = { elements: '$..*' };
    const transformer = new PathTransform(schema);

    const expected = {
      elements: [
        json.store,
        json.store.book,
        json.store.bicycle,
        json.store.book[0],
        json.store.book[1],
        json.store.book[2],
        json.store.book[3],
        ...Object.values(json.store.book[0] as object),
        ...Object.values(json.store.book[1] as object),
        ...Object.values(json.store.book[2] as object),
        ...Object.values(json.store.book[3] as object),
        json.store.bicycle.color,
        json.store.bicycle.price,
      ],
    };

    const result = transformer.transform(json);
    expect(result).toEqual(expected);
  });
});
