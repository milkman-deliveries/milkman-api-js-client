import { ApiErrorCategory } from '../errors/ApiErrorCategory'
import { parseContent } from './parseContent'

describe('parseContent', () => {

  const createResponseInfo = (body) => {
    const response = new Response(body)
    return { meta: {}, path: '/foo/path', method: 'GET', options: {}, response, data: response }
  }

  it('parse JSON content (empty)', async () => {
    const responseData = '{}'
    const info = createResponseInfo(responseData)
    const handledInfo = await parseContent(info, undefined)
    expect(handledInfo.responseData).toEqual({})
  })

  it('parse JSON content (simple)', async () => {
    const responseData = '{"property":"value"}'
    const info = createResponseInfo(responseData)
    const handledInfo = await parseContent(info, undefined)
    expect(handledInfo.responseData).toEqual({ property: 'value' })
  })

  it('parse JSON content (complex)', async () => {
    const responseData = '{"property":"value", "other": { "active": true, "count": 123 }}'
    const info = createResponseInfo(responseData)
    const handledInfo = await parseContent(info, undefined)
    expect(handledInfo.responseData).toEqual({ property: 'value', other: { active: true, count: 123 } })
  })

  it('returns an error if content is not a valid JSON', async () => {
    const responseData = 'malformed content'
    const info = createResponseInfo(responseData)
    const handledInfo = await parseContent(info, undefined)
    expect(handledInfo.responseData).toEqual({ errors: [{ type: ApiErrorCategory.MALFORMED }] })
  })

})
