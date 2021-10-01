import { allIds, byId, selectIds } from './sideLoading'

const ids = Array(100)
  .fill(0)
  .map((el, idx) => idx)

const source = ids
  .map((el,idx) => ({
    id: idx,
    otherId: idx + 1,
    name: `Name ${idx}`
  }))

describe('allIds', () => {

  it('return empty array with empty source', () => {
    expect(allIds([])).toEqual([])
  })

  it('return the list of the ids', () => {
    expect(allIds(source)).toEqual(ids)
  })

  it('return the list of the otherIds', () => {
    const expected = ids.map(i => i + 1)
    expect(allIds(source, 'otherId')).toEqual(expected)
  })
})

describe('byId', () => {

  it('return empty map with empty source', () => {
    expect(byId([])).toEqual({})
  })

  it('return entities mapped by id', () => {
    const expected = {}
    source.forEach(el => {
      expected[el.id] = el
    })
    expect(byId(source)).toEqual(expected)
  })

  it('return entities mapped by otherId', () => {
    const expected = {}
    source.forEach(el => {
      expected[el.otherId] = el
    })
    expect(byId(source, 'otherId')).toEqual(expected)
  })
})

describe('selectIds', () => {

  it('return empty map with empty source', () => {
    const mapped = byId(source)
    expect(selectIds(mapped, [10, 15, 95])).toEqual([
      mapped[10],
      mapped[15],
      mapped[95],
    ])
  })
})
