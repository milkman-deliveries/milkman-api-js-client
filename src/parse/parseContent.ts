import { ApiErrorCategory } from '../errors/ApiErrorCategory'
import { ResponseHandler } from '../fetch/types/ResponseHandler'

const malformedContentError = {
  errors: [{
    type: ApiErrorCategory.MALFORMED,
  }],
}

export const parseContent: ResponseHandler<any, Response, object> = async (info) => {
  let responseData

  // try to parse JSON response.
  const bodyText = await info.response.text()
  if (bodyText) {
    try {
      responseData = JSON.parse(bodyText)
    } catch (e) {
      responseData = malformedContentError
    }
  }

  return { ...info, responseData }
}
