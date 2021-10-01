/**
 * Split list of elements into chunks of a specified size.
 * @param elements The list of elements to split.
 * @param chunkSize The maximum size of a chunk.
 */
export const chunks = <T>(elements: T[], chunkSize: number): T[][] => {
  if (chunkSize <= 0) return [elements]
  let i = 0
  let res = []
  while (i < elements.length) {
    res.push(elements.slice(i, i + chunkSize))
    i += chunkSize
  }
  return res
}
