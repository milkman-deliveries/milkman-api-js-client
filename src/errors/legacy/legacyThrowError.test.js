import { legacyThrowError } from './legacyThrowError'

describe('legacyThrowError', () => {

  const createResponseInfo = (data, init) => {
    const response = new Response(JSON.stringify(data), init)
    return { response, data }
  }

  it('throw a generic error if response ok is set to false', async () => {
    const info = createResponseInfo({}, { status: 400 })

    expect.assertions(3);
    try {
      await legacyThrowError(undefined, info)
    } catch(e) {
      expect(e).toEqual(new Error('@milkman/api-js-client'))
      expect(e.status).toEqual(400)
      expect(e.items).toEqual([])
    }
  })

  it('throw a generic error if response contains the errors property', async () => {
    const info = createResponseInfo({ errors: [] })

    expect.assertions(3);
    try {
      await legacyThrowError(undefined, info)
    } catch(e) {
      expect(e).toEqual(new Error('@milkman/api-js-client'))
      expect(e.status).toEqual(200)
      expect(e.items).toEqual([])
    }
  })

  it('throw a generic error if response has success property set to false', async () => {
    const info = createResponseInfo({ success: false })

    expect.assertions(3);
    try {
      await legacyThrowError(undefined, info)
    } catch(e) {
      expect(e).toEqual(new Error('@milkman/api-js-client'))
      expect(e.status).toEqual(200)
      expect(e.items).toEqual([])
    }
  })

  it('throw a specific error if response contains an error item', async () => {
    const responseData = {
      errors: [{ code: 'foo', message: 'error description' }]
    }
    const info = createResponseInfo(responseData)

    expect.assertions(5);
    try {
      await legacyThrowError(undefined, info)
    } catch(e) {
      expect(e).toEqual(new Error('foo: error description'))
      expect(e.status).toEqual(200)
      expect(e.items.length).toEqual(1)
      expect(e.items[0].code).toEqual('foo')
      expect(e.items[0].message).toEqual('error description')
    }
  })

  it('throw a specific error if response contains many error items', async () => {
    const responseData = {
      errors: [
        { code: 'foo123', message: 'error description 123' },
        { code: 'foo456', message: 'error description 456' },
      ]
    }
    const info = createResponseInfo(responseData)

    expect.assertions(7);
    try {
      await legacyThrowError(undefined, info)
    } catch(e) {
      expect(e).toEqual(new Error('foo123: error description 123'))
      expect(e.status).toEqual(200)
      expect(e.items.length).toEqual(2)
      expect(e.items[0].code).toEqual('foo123')
      expect(e.items[0].message).toEqual('error description 123')
      expect(e.items[1].code).toEqual('foo456')
      expect(e.items[1].message).toEqual('error description 456')
    }
  })

  it('does not throw any error if response is ok', async () => {
    const info = createResponseInfo({ success: true })
    const handledInfo = await legacyThrowError(undefined, info)
    expect(handledInfo).toEqual(info)
  })
})
