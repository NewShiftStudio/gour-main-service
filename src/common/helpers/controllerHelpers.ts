interface PaginationOptions {
  take?: number;
  skip?: number;
}
export function getPaginationOptions(
  offset?: string | number,
  length?: string | number,
): PaginationOptions {
  const result: PaginationOptions = {};

  if (Number.isFinite(+length)) {
    result.take = +length;
  }

  if (Number.isFinite(+offset)) {
    result.skip = +offset;
  }

  return result;
}
