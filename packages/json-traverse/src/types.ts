export type Primitives = string | number | boolean | null;

export type JSONValue =
  | Partial<{ [key: string]: JSONValue }>
  | JSONValue[]
  | Primitives
  | Date; // We extend to allow dates as this is a common use case

export type JSONObject = Partial<{ [key: string]: JSONValue }> | JSONValue[];
