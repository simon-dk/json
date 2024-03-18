import { Node } from '../src/Node';

describe('Node', () => {
  it('should correctly initialize a root node', () => {
    const node = new Node({ key: 'value' });

    expect(node.value).toEqual({ key: 'value' });
    expect(node.parent).toBeUndefined();
    expect(node.key).toBeUndefined();
    expect(node.isRoot).toBe(true);
    expect(node.isLeaf).toBe(false);
  });

  it('should correctly initialize a child node', () => {
    const rootNode = new Node({ key: 'value' });
    const childNode = new Node('value', rootNode, 'key');

    expect(childNode.value).toBe('value');
    expect(childNode.parent).toBe(rootNode);
    expect(childNode.key).toBe('key');
    expect(childNode.isRoot).toBe(false);
    expect(childNode.isLeaf).toBe(true);
  });

  it('should correctly compute the path of a node', () => {
    const rootNode = new Node({ parent: { child: 'value' } });
    const parentNode = new Node({ child: 'value' }, rootNode, 'parent');
    const childNode = new Node('value', parentNode, 'child');

    expect(childNode.path).toEqual(['parent', 'child']);
  });

  it('should correctly update the value of a node', () => {
    const rootNode = new Node({ key: 'oldValue' });
    const childNode = new Node('oldValue', rootNode, 'key');

    childNode.update('newValue');

    expect(childNode.value).toBe('newValue');
    expect(rootNode.value).toEqual({ key: 'newValue' });
  });

  it('update should mutate the original object', () => {
    const object = { key: 'oldValue' };

    const rootNode = new Node(object);
    const childNode = new Node('oldValue', rootNode, 'key');

    childNode.update('newValue');

    expect(childNode.value).toBe('newValue');
    expect(rootNode.value).toEqual({ key: 'newValue' });
    expect(object).toEqual({ key: 'newValue' });
  });

  it('should correctly compute the keys of a node', () => {
    const node = new Node({ key1: 'value1', key2: 'value2' });
    expect(node.keys).toEqual(['key1', 'key2']);
  });

  it('should correctly compute the level of a node', () => {
    const rootNode = new Node({ parent: { child: 'value' } });
    const parentNode = new Node({ child: 'value' }, rootNode, 'parent');
    const childNode = new Node('value', parentNode, 'child');
    expect(childNode.level).toBe(2);
  });
});
