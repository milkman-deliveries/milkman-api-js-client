import { ApiErrorCategory } from '../errors/ApiErrorCategory'
import { parseContent } from './parseContent'

describe('parseContent', () => {

  const createResponseInfo = (body) => {
    const response = new Response(body)
    return { response, data: response }
  }

  it('parse JSON content (empty)', async () => {
    const responseData = '{}'
    const responseInfo = createResponseInfo(responseData)
    const handledInfo = await parseContent(undefined, responseInfo, undefined)
    expect(handledInfo.data).toEqual({})
  })

  it('parse JSON content (simple)', async () => {
    const responseData = '{"property":"value"}'
    const responseInfo = createResponseInfo(responseData)
    const handledInfo = await parseContent(undefined, responseInfo, undefined)
    expect(handledInfo.data).toEqual({ property: 'value' })
  })

  it('parse JSON content (complex)', async () => {
    const responseData = '{"property":"value", "other": { "active": true, "count": 123 }}'
    const responseInfo = createResponseInfo(responseData)
    const handledInfo = await parseContent(undefined, responseInfo, undefined)
    expect(handledInfo.data).toEqual({ property: 'value', other: { active: true, count: 123 } })
  })

  it('returns an error if content is not a valid JSON', async () => {
    const responseData = 'malformed content'
    const responseInfo = createResponseInfo(responseData)
    const handledInfo = await parseContent(undefined, responseInfo, undefined)
    expect(handledInfo.data).toEqual({ errors: [{ type: ApiErrorCategory.MALFORMED }] })
  })

})
