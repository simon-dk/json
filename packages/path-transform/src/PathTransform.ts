import { traverse } from '@json/traverse';
import { JSONPath } from 'jsonpath-plus';

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
}

export class PathTransform {
  private schema: object;

  public readonly wrap: boolean;

  public readonly flatten: boolean;

  constructor(schema: object, props?: PathTransformProps) {
    this.schema = schema;
    this.wrap = props?.wrap ?? false;
    this.flatten = props?.flatten ?? false;
  }

  public transform(json: object) {
    // eslint-disable-next-line array-callback-return
    return traverse(this.schema).map((value, node) => {
      // We have encountered a json path expression
      if (typeof value === 'string' && value.startsWith('$')) {
        // Extract the value from the json object
        const result = JSONPath({
          json,
          path: value,
          wrap: this.wrap,
          flatten: this.flatten,
        });

        if (node.key !== '$') {
          // If not at a root path we update the node with the result
          node.update(result);
        } else {
          // For root expressions ("$") we merge the result with the root object

          // For type safety we need to check if the parent is an object
          if (!node.parent?.value || typeof node.parent.value !== 'object') {
            throw new Error('Invalid schema');
          }

          // We need to check if the parent has a "$" key
          if (!('$' in node.parent.value)) {
            throw new Error('Invalid schema');
          }

          // We remove the "$" key from the parent object and merge the result
          // eslint-disable-next-line no-param-reassign
          delete node.parent.value.$;

          // We try to merge when there is a single value, otherwise we assign the result
          if (Array.isArray(result) && result.length === 1) {
            Object.assign(node.parent.value, result[0]);
          } else {
            Object.assign(node.parent.value, result);
          }
        }
      }
    });
  }
}

/**
 * Creates a new instance of PathTransform to transform a JSON object.
 *
 * @param obj The JSON object to traverse.
 * @returns A new instance of Traverse.
 */
export interface TransformProps extends PathTransformProps {
  json: object;
  schema: object;
}
export const transform = (props: TransformProps) =>
  new PathTransform(props.schema, {
    wrap: props.wrap,
    flatten: props.flatten,
  }).transform(props.json);
