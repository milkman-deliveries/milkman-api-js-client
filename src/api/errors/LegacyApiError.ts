export class LegacyApiErrorItem {
  code: number
  text?: string
  field?: string
  value?: any

  constructor(item: any) {
    this.code = item.code
    this.text = item.text
    this.field = item.field
    this.value = item.value
  }
}

export class LegacyApiError extends Error {
  status: number
  items: LegacyApiErrorItem[]

  constructor(status: number, errors: LegacyApiErrorItem[] = []) {
    super(errors.length ? `${errors[0].code}: ${errors[0].text}` : 'milkman-api-js-client')
    this.status = status
    this.items = errors
  }
}
