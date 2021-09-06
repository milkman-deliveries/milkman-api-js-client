/**
 * Split ids in chunks of a specified size.
 * @param ids The list of id to split in chunk.
 * @param chunkSize The maximum size of a chunk.
 */
export const chunks = (ids: (string | number)[], chunkSize: number): (string | number)[][] => {
  let i = 0
  let res = []
  while (i < ids.length) {
    res.push(ids.slice(i, chunkSize))
    i += chunkSize
  }
  return res
}
