import { ApiSort } from './ApiSort'

describe('ApiSort', () => {

  it ('accept "ascending" rule', () => {
    const sort = new ApiSort()
    sort.asc('test')
    expect(sort.toString()).toEqual('sort=test:asc')
  })

  it ('accept "descending" rule', () => {
    const sort = new ApiSort()
    sort.desc('test')
    expect(sort.toString()).toEqual('sort=test:desc')
  })

  it ('accept multiple rules', () => {
    const sort = new ApiSort()
    sort.asc('aaa')
    sort.desc('bbb')
    expect(sort.toString()).toEqual('sort=aaa:asc,bbb:desc')
  })
})
