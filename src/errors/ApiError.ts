import { ApiResponseError } from '../fetch/types/ApiResponseError'

export const apiErrorItemTypeRegex = /(\w*)__(\w*)/

export class ApiErrorItem {
  type: string
  text?: string
  field?: string
  value?: any

  // derived from type
  category?: string
  reason?: string

  constructor(item: ApiResponseError) {
    this.type = item.type
    this.text = item.text
    this.field = item.field
    this.value = item.value

    const match = apiErrorItemTypeRegex.exec(item.type)
    this.category = match ? match[1] : item.type
    this.reason = match ? match[2] : null
  }
}

export class ApiError extends Error {
  status: number
  items: ApiErrorItem[]

  constructor(status: number, errors: ApiResponseError[] = []) {
    super(errors.length ? `${errors[0].type}: ${errors[0].text}` : '@milkman/api-js-client')
    this.status = status
    this.items = errors.map(err => new ApiErrorItem(err))
  }
}
