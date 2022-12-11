type ArrayItemWithId = Array<{ id: string | number }>;
type ArrayDictionary<T extends ArrayItemWithId> = Record<
  T[number]['id'],
  T[number]
>;

/**
 * Convert from an Array with ids to an Object with key as id and values as array items
 * @function
 * @param {Array} arr Array of objects with id property
 */
export const arrayToDictionary = <A extends ArrayItemWithId>(arr: A) =>
  arr.reduce(
    (acc, curr) => ({ ...acc, [curr.id]: curr }),
    {} as ArrayDictionary<A>,
  );
