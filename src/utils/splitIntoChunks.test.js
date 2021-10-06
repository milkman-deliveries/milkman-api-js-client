import { splitIntoChunks } from './splitIntoChunks'

const source = Array(100)
  .fill(0)
  .map((el,idx) => idx)

describe('splitIntoChunks', () => {

  it('returns a single chunk if a 0 or negative chunk size is specified', () => {
    expect(splitIntoChunks(source, 0)).toEqual([source])
    expect(splitIntoChunks(source, -10)).toEqual([source])
  })

  it('returns a single chunk if the chunk size is greater than the source', () => {
    expect(splitIntoChunks(source, 100)).toEqual([source])
    expect(splitIntoChunks(source, 5000)).toEqual([source])
  })

  it('split in splitIntoChunks of equal size', () => {
    const res = splitIntoChunks(source, 10)
    expect(res.length).toEqual(10)
    res.forEach(chunk => {
      expect(chunk.length).toEqual(10)
    })

    const res2 = splitIntoChunks(source, 7)
    expect(res2.length).toEqual(Math.ceil(100 / 7))
    res2.forEach((chunk, i) => {
      if (i < res2.length - 1) {
        expect(chunk.length).toEqual(7)
      } else {
        expect(chunk.length).toEqual(100 % 7)
      }
    })
  })
})
