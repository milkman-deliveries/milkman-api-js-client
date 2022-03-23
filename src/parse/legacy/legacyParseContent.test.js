import { legacyParseContent } from './legacyParseContent'

describe('legacyParseContent', () => {

  const createResponseInfo = (body) => {
    const response = new Response(body)
    return { response, data: response }
  }

  it('parse JSON content (empty)', async () => {
    const data = '{"result":{}}'
    const info = createResponseInfo(data)
    const handledInfo = await legacyParseContent(undefined, info)
    expect(handledInfo.data).toEqual({})
  })

  it('parse JSON content (simple)', async () => {
    const data = '{"result":{"property":"value"}}'
    const info = createResponseInfo(data)
    const handledInfo = await legacyParseContent(undefined, info)
    expect(handledInfo.data).toEqual({ property: 'value' })
  })

  it('parse JSON content (complex)', async () => {
    const data = '{"result":{"property":"value", "other": { "active": true, "count": 123 }}}'
    const info = createResponseInfo(data)
    const handledInfo = await legacyParseContent(undefined, info)
    expect(handledInfo.data).toEqual({ property: 'value', other: { active: true, count: 123 } })
  })

  it('returns an error if content is not a valid JSON', async () => {
    const data = 'malformed content'
    const info = createResponseInfo(data)
    const handledInfo = await legacyParseContent(undefined, info)
    expect(handledInfo.data).toEqual({ errors: [{ code: 2100 }] })
  })

  it('returns an error if content does not contains the result property', async () => {
    const data = '{}'
    const info = createResponseInfo(data)
    const handledInfo = await legacyParseContent(undefined, info)
    expect(handledInfo.data).toEqual({ errors: [{ code: 2100 }] })
  })

})
