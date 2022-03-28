import { LegacyApiResponseError } from '../../fetch/types/LegacyApiResponseData'

export class LegacyApiError extends Error {
  status: number
  items: LegacyApiResponseError[]

  constructor(status: number, errors: LegacyApiResponseError[] = []) {
    super(errors.length ? `${errors[0].code}: ${errors[0].message}` : '@milkman/api-js-client')
    this.status = status
    this.items = errors
  }
}
