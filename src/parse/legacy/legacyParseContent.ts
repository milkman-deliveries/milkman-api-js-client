import { ResponseHandler } from '../../fetch/types/ResponseHandler'

const malformedContentError = {
  errors: [{
    code: 2100
  }],
}

export const legacyParseContent: ResponseHandler<any, Response, object> = async (requestInfo, responseInfo) => {
  let data

  // try to parse JSON response.
  try {
    const json = await responseInfo.response.json()
    if (json.hasOwnProperty('result')) {
      data = json.result
    } else {
      data = malformedContentError
    }
  } catch (e) {
    data = malformedContentError
  }

  return { ...responseInfo, data }
}
