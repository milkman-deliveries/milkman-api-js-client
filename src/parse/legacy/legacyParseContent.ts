import { ResponseHandler } from '../../fetch/types/ResponseHandler'

const malformedContentError = {
  errors: [{
    code: 2100
  }],
}

export const legacyParseContent: ResponseHandler<any, Response, object> = async (info) => {
  let responseData

  // try to parse JSON response.
  try {
    const json = await info.response.json()
    if (json.hasOwnProperty('result')) {
      responseData = json.result
    } else {
      responseData = malformedContentError
    }
  } catch (e) {
    responseData = malformedContentError
  }

  return { ...info, responseData }
}
