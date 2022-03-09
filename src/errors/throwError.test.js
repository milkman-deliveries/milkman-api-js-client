import { throwError } from './throwError'

describe('throwError', () => {

  const createResponseInfo = (data, init) => {
    const response = new Response(JSON.stringify(data), init)
    return { response, data }
  }

  it('throw a generic error if response ok is set to false', async () => {
    const responseData = {}
    const responseInfo = createResponseInfo(responseData, { status: 400 })

    expect.assertions(3);
    try {
      await throwError(undefined, responseInfo, undefined)
    } catch(e) {
      expect(e).toEqual(new Error('milkman-api-js-client'))
      expect(e.status).toEqual(400)
      expect(e.items).toEqual([])
    }
  })

  it('throw a generic error if response contains the errors property', async () => {
    const responseData = { errors: [] }
    const responseInfo = createResponseInfo(responseData)

    expect.assertions(3);
    try {
      await throwError(undefined, responseInfo, undefined)
    } catch(e) {
      expect(e).toEqual(new Error('milkman-api-js-client'))
      expect(e.status).toEqual(200)
      expect(e.items).toEqual([])
    }
  })

  it('throw a specific error if response contains an error item', async () => {
    const responseData = { errors: [{ type: 'foo', text: 'error description' }] }
    const responseInfo = createResponseInfo(responseData)

    expect.assertions(5);
    try {
      await throwError(undefined, responseInfo, undefined)
    } catch(e) {
      expect(e).toEqual(new Error('foo: error description'))
      expect(e.status).toEqual(200)
      expect(e.items.length).toEqual(1)
      expect(e.items[0].type).toEqual('foo')
      expect(e.items[0].text).toEqual('error description')
    }
  })

  it('throw a specific error if response contains many error items', async () => {
    const responseData = { errors: [
      { type: 'foo123', text: 'error description 123' },
      { type: 'foo456', text: 'error description 456' },
      ] }
    const responseInfo = createResponseInfo(responseData)

    expect.assertions(7);
    try {
      await throwError(undefined, responseInfo, undefined)
    } catch(e) {
      expect(e).toEqual(new Error('foo123: error description 123'))
      expect(e.status).toEqual(200)
      expect(e.items.length).toEqual(2)
      expect(e.items[0].type).toEqual('foo123')
      expect(e.items[0].text).toEqual('error description 123')
      expect(e.items[1].type).toEqual('foo456')
      expect(e.items[1].text).toEqual('error description 456')
    }
  })

  it('does not throw any error if response is ok', async () => {
    const responseInfo = createResponseInfo({})
    const handledInfo = await throwError(undefined, responseInfo, undefined)
    expect(handledInfo).toEqual(responseInfo)
  })
})
