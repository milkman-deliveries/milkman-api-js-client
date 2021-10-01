import { ApiPagination } from './ApiPagination'

describe('ApiPagination', () => {

  it('initial page size', () => {
    const pagination = new ApiPagination(50)
    expect(pagination.page(0)).toEqual('skip=0&limit=50')
    expect(pagination.page(3)).toEqual('skip=150&limit=50')
  })

  it('change page size', () => {
    const pagination = new ApiPagination(50)
    pagination.setPageSize(100)
    expect(pagination.page(3)).toEqual('skip=300&limit=100')
  })
})
