import { ApiError, ApiErrorItem } from './ApiError'

describe('ApiErrorItem', () => {

  it('constructor', () => {
    const item = {
      type: 'test type',
      text: 'test text',
      field: 'test field',
      value: 'test value',
    }
    expect(new ApiErrorItem(item).type).toEqual(item.type)
    expect(new ApiErrorItem(item).text).toEqual(item.text)
    expect(new ApiErrorItem(item).field).toEqual(item.field)
    expect(new ApiErrorItem(item).value).toEqual(item.value)
    expect(new ApiErrorItem(item).category).toEqual(item.type)
  })

  it('category and reason', () => {
    const item = {
      type: 'TEST_CATEGORY__TEST_REASON',
    }
    expect(new ApiErrorItem(item).type).toEqual('TEST_CATEGORY__TEST_REASON')
    expect(new ApiErrorItem(item).category).toEqual('TEST_CATEGORY')
    expect(new ApiErrorItem(item).reason).toEqual('TEST_REASON')
  })

})

describe('ApiError', () => {

  it('constructor', () => {
    const httpStatus = 200
    const items = [
      { type: 'test type 1' },
      { type: 'test type 2' },
    ]
    const apiError = new ApiError(httpStatus, items)
    expect(apiError.status).toEqual(httpStatus)
    expect(apiError.items.length).toEqual(2)
    expect(apiError.items[0].type).toEqual('test type 1')
    expect(apiError.items[1].type).toEqual('test type 2')
  })

})
