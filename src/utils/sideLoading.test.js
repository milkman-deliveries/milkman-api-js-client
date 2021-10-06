import { getAllIds, mapById, selectByIds } from './sideLoading'

const ids = Array(100)
  .fill(0)
  .map((el, idx) => idx)

const source = ids
  .map((el,idx) => ({
    id: idx,
    otherId: idx + 1,
    name: `Name ${idx}`
  }))

describe('getAllIds', () => {

  it('return empty array with empty source', () => {
    expect(getAllIds([])).toEqual([])
  })

  it('return the list of the ids', () => {
    expect(getAllIds(source)).toEqual(ids)
  })

  it('return the list of the otherIds', () => {
    const expected = ids.map(i => i + 1)
    expect(getAllIds(source, 'otherId')).toEqual(expected)
  })
})

describe('mapById', () => {

  it('return empty map with empty source', () => {
    expect(mapById([])).toEqual({})
  })

  it('return entities mapped by id', () => {
    const expected = {}
    source.forEach(el => {
      expected[el.id] = el
    })
    expect(mapById(source)).toEqual(expected)
  })

  it('return entities mapped by otherId', () => {
    const expected = {}
    source.forEach(el => {
      expected[el.otherId] = el
    })
    expect(mapById(source, 'otherId')).toEqual(expected)
  })
})

describe('selectByIds', () => {

  it('return empty map with empty source', () => {
    const mapped = mapById(source)
    expect(selectByIds(mapped, [10, 15, 95])).toEqual([
      mapped[10],
      mapped[15],
      mapped[95],
    ])
  })
})
