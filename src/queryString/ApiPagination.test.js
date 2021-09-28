import { ApiPagination } from './ApiPagination'

describe('ApiPagination', () => {

  it ('first page', () => {
    const pagination = new ApiPagination(50)
    expect(pagination.toString()).toEqual('skip=0&limit=50')
  })

  it ('next pages', () => {
    const pagination = new ApiPagination(50)
    pagination.setPage(4)
    expect(pagination.toString()).toEqual('skip=150&limit=50')
    pagination.setPage(5)
    expect(pagination.toString()).toEqual('skip=200&limit=50')
  })
})
