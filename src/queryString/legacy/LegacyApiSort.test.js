import { LegacyApiSort } from './LegacyApiSort'

describe('ApiSort', () => {

  it ('accept "ascending" rule', () => {
    const sort = new LegacyApiSort()
    sort.asc('test')
    expect(sort.toString()).toEqual('{"test":1}')
  })

  it ('accept "descending" rule', () => {
    const sort = new LegacyApiSort()
    sort.desc('test')
    expect(sort.toString()).toEqual('{"test":0}')
  })

  it ('accept multiple rules', () => {
    const sort = new LegacyApiSort()
    sort.asc('aaa')
    sort.desc('bbb')
    expect(sort.toString()).toEqual('{"aaa":1,"bbb":0}')
  })
})
