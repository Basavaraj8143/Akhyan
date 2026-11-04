// TypeScript Reference Solution: Generic Utilities
// This solution implements reusable generic utility functions

/**
 * Returns the first element of an array, or undefined if the array is empty.
 */
function first<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[0] : undefined;
}

/**
 * Returns the last element of an array, or undefined if the array is empty.
 */
function last<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[array.length - 1] : undefined;
}

/**
 * Transforms the values of an object using a mapper function, preserving keys.
 */
function mapObject<K extends string | number | symbol, V, U>(
  obj: Record<K, V>,
  mapper: (value: V, key: K) => U
): Record<K, U> {
  const result: Record<K, U> = {} as Record<K, U>;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = mapper(obj[key], key);
    }
  }
  return result;
}

/**
 * Extracts an array of values for a specific property from an array of objects.
 */
function pluck<T, K extends keyof T>(array: T[], key: K): T[K][] {
  return array.map((item: T) => item[key]);
}

/**
 * Combines two arrays into an array of pairs.
 * If arrays have different lengths, only pair up to the shorter length.
 */
function zip<T, U>(arr1: T[], arr2: U[]): [T, U][] {
  const minLength = Math.min(arr1.length, arr2.length);
  const result: [T, U][] = [];
  for (let i = 0; i < minLength; i++) {
    result.push([arr1[i], arr2[i]]);
  }
  return result;
}

// Example usage (for testing):

// first<T>
// console.log(first([1, 2, 3])); // 1
// console.log(first(["a", "b", "c"])); // "a"
// console.log(first<number[]>([])); // undefined

// last<T>
// console.log(last([1, 2, 3])); // 3
// console.log(last(["a", "b", "c"])); // "c"
// console.log(last<number[]>([])); // undefined

// mapObject<K, V, U>
// const scores = { alice: 85, bob: 92, charlie: 78 };
// const passed = mapObject(scores, (score, name) => score >= 80);
// console.log(passed); // { alice: true, bob: true, charlie: false }

// pluck<T, K>
// const users = [
//   { id: 1, name: "Alice", age: 25 },
//   { id: 2, name: "Bob", age: 30 },
//   { id: 3, name: "Charlie", age: 35 }
// ];
// console.log(pluck(users, "name")); // ["Alice", "Bob", "Charlie"]
// console.log(pluck(users, "age")); // [25, 30, 35]

// zip<T, U>
// console.log(zip([1, 2, 3], ["a", "b", "c"])); // [[1, "a"], [2, "b"], [3, "c"]]
// console.log(zip([1, 2], ["a", "b", "c"])); // [[1, "a"], [2, "b"]]
// console.log(zip([1, 2, 3], ["a"])); // [[1, "a"]]
