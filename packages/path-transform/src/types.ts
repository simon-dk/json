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
 * Otherwise, it returns the original type.
 */
export type DeepIfStartsWithDollar<T> = T extends string
  ? IfStartsWithDollar<T>
  : T extends Array<infer U>
    ? DeepIfStartsWithDollar<U>[]
    : T extends object
      ? { [K in keyof T]: DeepIfStartsWithDollar<T[K]> }
      : T;
