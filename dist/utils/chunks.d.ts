/**
 * Split ids in chunks of a specified size.
 * @param ids The list of id to split in chunk.
 * @param chunkSize The maximum size of a chunk.
 */
export declare const chunks: (ids: (string | number)[], chunkSize: number) => (string | number)[][];
