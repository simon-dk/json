import { traverse } from '@json/traverse';
import { JSONPath } from 'jsonpath-plus';

import type { TransformFn } from './types';

export interface PathTransformProps {
  /**
   * If there is a single return value, decide if it should be wrapped in an array.
   *
   * Values extracted from root ("$") expressions are always merged with the root object.
   *
   * @default false
   */
  wrap?: boolean;
  /**
   * If values are multiple arrays, they are flattened to a single array.
   *
   * @default false
   */
  flatten?: boolean;

  /**
   * If true, the transformation function will be precompiled.
   *
   * @default true
   */
  precompile?: boolean;
}

export class PathTransform<T extends object> {
  /**
   * Represents the schema object used for transformation.
   *
   * By using "as const" you can infer the resulting structure. Values that start with "$" are treated as "unknown" and are not inferred.
   */
  private schema: T;

  public readonly wrap: boolean;

  public readonly flatten: boolean;

  private readonly jsonpath = JSONPath;

  private transformFn?: TransformFn<typeof this.schema>;

  constructor(schema: T, props?: PathTransformProps) {
    this.schema = schema;
    this.wrap = props?.wrap ?? false;
    this.flatten = props?.flatten ?? false;

    // precompile unless explicitly set to false
    if (props?.precompile !== false) {
      this.transformFn = this.compile();
    }
  }

  /**
   * Inspired by fastest-validator
   * https://github.com/icebob/fastest-validator/blob/master/lib/validator.js
   */
  public compile() {
    if (this.transformFn) {
      return this.transformFn;
    }

    const sourceCode: string[] = [];

    const inststructions: Array<{
      /**
       * The json path expression
       */
      expr: string;
      /**
       * The path from which we need to assign the result
       */
      path: string;
    }> = [];

    /**
     * traverse schema to generate a "skeleton" object, and at the same time
     * collect instructions for the json path transformation
     */
    // eslint-disable-next-line array-callback-return
    const skeleton = traverse(this.schema).map((value, node) => {
      // Encountered a json path expression
      if (typeof value === 'string' && value.startsWith('$')) {
        const { parent } = node;

        // construct the path as "[foo][bar][0][baz]" or "$" for root expressions
        const path = node.path
          .map((p) => (p === '$' ? p : `["${p}"]`))
          .join('');

        // collect the instruction
        inststructions.push({ expr: value, path });

        // set the leaf value to null for the skeleton object
        node.update(null);

        // If the expression is at the root, we delete the "$" key from the skeleton parent object
        if (node.key === '$') {
          // check if the parent is an object (type safety check for typescript)
          if (!parent?.value || typeof parent?.value !== 'object') {
            throw new Error(
              `Invalid schema: expected object, got ${typeof parent?.value} at ${node.parent?.stringPath}`,
            );
          }

          // check if the parent has a "$" key (type safety check for typescript)
          if (!('$' in parent.value)) {
            throw new Error(
              `Invalid schema: missing key "$" in parent object at ${node.parent?.stringPath}`,
            );
          }

          delete parent.value.$;
        }
      }
    });

    // We check if the schema is valid
    if (!skeleton || typeof skeleton !== 'object' || skeleton instanceof Date) {
      throw new Error('Invalid schema');
    }

    // Copy the skeleton object to sourceCode
    sourceCode.push(`var returnObject = ${JSON.stringify(skeleton)};`);

    // Generate sourceCode for each instruction set
    inststructions.forEach((instruction) => {
      // Handle expression saving to the root of the object
      if (instruction.path === '$') {
        // dont wrap results at root level
        sourceCode.push(
          `Object.assign(returnObject, this.jsonpath({json: value, path: "${instruction.expr}", wrap: false }));`,
        );
      } else {
        // If the path is not a root expression, we assign the result to the node
        sourceCode.push(
          `returnObject${instruction.path} = this.jsonpath({json: value, path: "${instruction.expr}", wrap: this.wrap, flatten: this.flatten});`,
        );
      }
    });

    sourceCode.push(`return returnObject;`);
    const src = sourceCode.join('\n');

    // eslint-disable-next-line no-new-func
    const compiledFn = new Function('value', src);
    const transformFn = (json: object) => compiledFn.call(this, json);

    return transformFn as TransformFn<typeof this.schema>;
  }

  public transform(json: object) {
    if (!this.transformFn) {
      this.transformFn = this.compile();
    }

    return this.transformFn(json);
  }

  // public transformLegacy(json: object) {
  //   // eslint-disable-next-line array-callback-return
  //   return traverse(this.schema).map((value, node) => {
  //     // We have encountered a json path expression
  //     if (typeof value === 'string' && value.startsWith('$')) {
  //       // We are not at the root
  //       if (node.key !== '$') {
  //         // Extract the value from the json object
  //         const result = JSONPath({
  //           json,
  //           path: value,
  //           wrap: this.wrap,
  //           flatten: this.flatten,
  //         });
  //         // If not at a root path we update the node with the result
  //         node.update(result);
  //       } else {
  //         // We are at the root

  //         // Extract the value from the json object with wrap set to false
  //         const result = JSONPath({ json, path: value, wrap: false });

  //         // For type safety we need to check if the parent is an object
  //         if (!node.parent?.value || typeof node.parent.value !== 'object') {
  //           throw new Error('Invalid schema');
  //         }

  //         // We need to check if the parent has a "$" key
  //         if (!('$' in node.parent.value)) {
  //           throw new Error('Invalid schema');
  //         }

  //         // We remove the "$" key from the parent object and merge the result
  //         // eslint-disable-next-line no-param-reassign
  //         delete node.parent.value.$;

  //         Object.assign(node.parent.value, result);
  //       }
  //     }
  //   }) as DeepIfStartsWithDollar<typeof this.schema>;
  // }
}
