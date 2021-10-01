import { chunks } from './chunks'

const source = Array(100)
  .fill(0)
  .map((el,idx) => idx)

describe('chunks', () => {

  it('returns a single chunk if a 0 or negative chunk size is specified', () => {
    expect(chunks(source, 0)).toEqual([source])
    expect(chunks(source, -10)).toEqual([source])
  })

  it('returns a single chunk if the chunk size is greater than the source', () => {
    expect(chunks(source, 100)).toEqual([source])
    expect(chunks(source, 5000)).toEqual([source])
  })

  it('split in chunks of equal size', () => {
    const res = chunks(source, 10)
    expect(res.length).toEqual(10)
    res.forEach(chunk => {
      expect(chunk.length).toEqual(10)
    })

    const res2 = chunks(source, 7)
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
