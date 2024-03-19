/**
 * Checks if a type is a string and starts with a dollar sign ($).
 * @returns If the type starts with a dollar sign, returns `unknown`. Otherwise, returns the original type.
 */
export type IfStartsWithDollar<T> = T extends `$${string}` ? unknown : T;

/**
 * Transforms the given type `T` by checking if any string property starts with a dollar sign ($).
 * If it does, it applies the `IfStartsWithDollar` type to that property.
 * If `T` is an array, it recursively applies the `DeepIfStartsWithDollar` type to each element.
 * If `T` is an object, it recursively applies the `DeepIfStartsWithDollar` type to each property.
 * If `K` is "$", all key/values can potentially be present in the object, so it returns `any`.
 * Otherwise, it returns the original type.
 */
export type DeepIfStartsWithDollar<T> = T extends string
  ? IfStartsWithDollar<T>
  : T extends Array<infer U>
    ? DeepIfStartsWithDollar<U>[]
    : T extends object
      ? {
          [K in keyof T as K extends '$'
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              any
            : K]: DeepIfStartsWithDollar<T[K]>;
        }
      : T;

// we use Readonly and ReadonlyArray to allow the use of "as const" in the schema
export type AllowedPrimitives = string | number | boolean | null | undefined;

export type Values =
  | AllowedPrimitives
  | { readonly [k: string]: Values }
  | ReadonlyArray<Values>;

/**
 * Represents a schema object used for transformation.
 *
 * By using "as const" you can infer the resulting structure. Values that start with "$" are treated as "unknown" and are not inferred.
 */
export type SchemaObject = { [key: string]: Values } | ReadonlyArray<Values>;

/**
 * Represents a function that transforms a JSON object.
 *
 * @param json The JSON object to transform.
 * @returns The transformed JSON object.
 */
export type TransformFn<T extends SchemaObject> = (
  json: object,
) => DeepIfStartsWithDollar<T>;
