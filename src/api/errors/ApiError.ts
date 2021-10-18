export const apiErrorItemTypeRegex = /(\w*)__(\w*)/

export class ApiErrorItem {
  type: string
  text?: string
  field?: string
  value?: any

  // derived from type
  category?: string
  reason?: string

  constructor(item: any) {
    this.type = item.type
    this.text = item.text
    this.field = item.field
    this.value = item.value

    let match
    if ((match = apiErrorItemTypeRegex.test(item.type))) {
      this.category = match[1]
      this.reason = match[2]
    }
  }
}

export class ApiError extends Error {
  status: number
  items: ApiErrorItem[]

  constructor(status: number, errors: ApiErrorItem[] = []) {
    super(errors[0]?.text)
    this.status = status
    this.items = errors
  }
}
