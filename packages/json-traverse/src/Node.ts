/* eslint-disable no-use-before-define */
import type { JSONObject, JSONValue } from './types';

/**
 * Represents a node in a linked list.
 *
 * The Node class is used by the Traverse class to traverse a JSON object. Each node contains a reference to its parent node, the key of the current node, and the value of the current node.
 *
 * It provides metadata about each Node, such as the path, level, keys, and whether it is a root or leaf node.
 * It also provides methods to update the value of the current node.
 */
export class Node {
  /**
   * The value of the current node.
   */
  public value: JSONValue;

  /**
   * The parent node of the current node.
   */
  public readonly parent?: Node;

  /**
   * The key of the current node.
   */
  public readonly key?: string | number;

  /**
   * Cached array of parent nodes ordered from root to leaf.
   */
  #parents?: Node[];

  /**
   * Cached array of the full path to the current node.
   */
  #path?: Array<string | number>;

  /**
   * Creates an array of parent nodes ordered from root to leaf.
   */
  private static parentsArrayFromLinkedList(node: Node) {
    const parents: Node[] = [];
    let currentNode = node;
    while (currentNode.parent) {
      parents.unshift(currentNode.parent); // We unshift to keep the order of the parents (root to leaf)
      currentNode = currentNode.parent;
    }
    return parents;
  }

  /**
   * Extracts the full path to the current node based on an array of all parent nodes.
   */
  private static pathFromParentsArray(nodes: Node[]) {
    const path: (string | number)[] = [];

    nodes.forEach((node) => {
      if (node.key) {
        path.push(node.key);
      }
    });

    return path;
  }

  static isObject(value?: JSONValue): value is JSONObject {
    return typeof value === 'object' && value !== null;
  }

  constructor(value: JSONValue, parent?: Node, key?: string | number) {
    this.value = value;
    this.parent = parent;
    this.key = key;
  }

  get parents() {
    if (!this.#parents) {
      this.#parents = Node.parentsArrayFromLinkedList(this);
    }

    return this.#parents;
  }

  get path() {
    if (!this.#parents) {
      this.#parents = Node.parentsArrayFromLinkedList(this);
    }

    if (this.#path) {
      return this.#path;
    }

    this.#path = Node.pathFromParentsArray(this.#parents);
    this.#path.push(this.key as string | number);

    return this.#path;
  }

  get stringPath() {
    return this.path.join('.');
  }

  get level() {
    return this.path.length;
  }

  get keys() {
    return Node.isObject(this.value) ? Object.keys(this.value) : [];
  }

  get isRoot() {
    return !this.parent;
  }

  get isLeaf() {
    return !Node.isObject(this.value) && !Array.isArray(this.value);
  }

  public update(value: JSONValue) {
    this.value = value;

    // Make sure that the parent node is an object
    if (!Node.isObject(this.parent?.value)) {
      return;
    }

    // Check added for type safety, the operations are similar
    if (Array.isArray(this.parent.value)) {
      this.parent.value[this.key as number] = value;
    } else {
      this.parent.value[this.key as string] = value;
    }
  }
}
