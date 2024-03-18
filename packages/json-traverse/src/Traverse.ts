import { Node } from './Node';
import type { JSONObject, JSONValue } from './types';

export type TraverseCallback = (value: JSONValue, node: Node) => void;

export interface TraverseProps {
  /**
   * Flag indicating whether to check for circular references.
   *
   * @default false
   */
  checkCircular?: boolean;
}

/**
 * Represents a class for traversing a JSON object.
 *
 * The class provides methods for traversing a JSON object and executing a callback function for each element.
 *
 * @example
 *
 * const data = {
 *   person: {
 *     name: 'John',
 *     lastName: 'Smith',
 *     age: 38,
 *   },
 *   address: {
 *     streetName: 'Main St.',
 *     houseNumber: 82,
 *     city: 'New York',
 *   },
 * };
 *
 * const traverse = new Traverse(data);
 *
 * const updated = traverse.map((value, ctx) => {
 *   if (ctx.key === 'age' && typeof value === 'number') {
 *     ctx.update(value + 1);
 *   }
 * });
 *
 * @public
 */
export class Traverse {
  private readonly root: JSONObject;

  private readonly checkCircular: boolean;

  private readonly visited: Set<JSONValue> = new Set();

  /**
   * Constructs a new instance of the Traverse class.
   * @param root The root JSON object to traverse.
   * @param props Optional properties for traversal.
   * @throws Error if the root is not an object.
   */
  constructor(root: JSONObject, props?: TraverseProps) {
    if (!root || typeof root !== 'object') {
      throw new Error(`Expected root to be an object, got ${typeof root}`);
    }

    this.root = root;
    this.checkCircular = props?.checkCircular ?? false;
  }

  /**
   * Traverses the JSON object and executes a callback function for each element.
   * @param root The root JSON object to traverse.
   * @param callback The callback function to execute for each element.
   * @param immutable Flag indicating whether to use immutable traversal.
   * @returns The final node of the traversal.
   */
  private traverse(
    root: JSONObject,
    callback: TraverseCallback,
    immutable = false,
  ) {
    // Recursive walk function
    const recursiveWalk = (
      value: JSONValue,
      parent?: Node,
      key?: string | number,
    ) => {
      // Creates a new node for the current value and calls the callback
      const node = new Node(value, parent, key);
      callback(value, node);

      // The null check is for typesafety as isLeaf will return true for null
      if (node.isLeaf || node.value === null) {
        return node;
      }

      // Check for circular references if enabled
      if (this.checkCircular) {
        if (this.visited.has(node.value)) {
          return node;
        }

        this.visited.add(node.value);
      }

      // We have already checked the leaf/node condition, so we can safely traverse
      const ctxKeys: string[] = node.keys;
      const ctxKeysLength = ctxKeys.length;

      for (let i = 0; i < ctxKeysLength; i += 1) {
        const childKey = ctxKeys[i] as string;

        const child = node.value[
          childKey as keyof typeof node.value
        ] as JSONValue;

        // We call the recursive function with the child and its node
        recursiveWalk(child, node, childKey);
      }

      if (this.checkCircular) {
        this.visited.delete(node.value);
      }
      return node;
    };

    return recursiveWalk(immutable ? structuredClone(root) : root);
  }

  /**
   * Executes a callback function for each node in the tree and returns the original tree with any updates added (mutated).
   *
   * @param cb The callback function to execute for each element.
   * @returns A mutated version of the root object with any updates applied.
   */
  public forEach(cb: TraverseCallback): JSONValue {
    return this.traverse(this.root, cb, false).value;
  }

  /**
   * Executes a callback function for each node in the tree and returns a new tree with any updates added (immutable).
   *
   * @param cb The callback function to apply to each node.
   * @returns A new version of the root object with any updates applied.
   */
  public map(cb: TraverseCallback): JSONValue {
    return this.traverse(this.root, cb, true).value;
  }
}

/**
 * Creates a new instance of Traverse to traverse a JSON object.
 *
 * The instance is configured without circular reference checks by default.
 *
 * @param obj The JSON object to traverse.
 * @returns A new instance of Traverse.
 */
export const traverse = (obj: JSONObject) => new Traverse(obj);
