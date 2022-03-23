import { ApiErrorCategory } from '../errors/ApiErrorCategory'
import { ResponseHandler } from '../fetch/types/ResponseHandler'

const malformedContentError = {
  errors: [{
    type: ApiErrorCategory.MALFORMED,
  }],
}

export const parseContent: ResponseHandler<any, Response, object> = async (requestInfo, responseInfo) => {
  let data

  // try to parse JSON response.
  const bodyText = await responseInfo.response.text()
  if (bodyText) {
    try {
      data = JSON.parse(bodyText)
    } catch (e) {
      data = malformedContentError
    }
  }

  return { ...responseInfo, data }
}
