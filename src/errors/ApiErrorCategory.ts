export class ApiErrorCategory {
  static MALFORMED = 'MALFORMED' // 400 (Bad Request)
  static UNAUTHORIZED = 'UNAUTHORIZED' // 401 (Unauthorized)
  static FORBIDDEN = 'FORBIDDEN' // 403 (Forbidden)
  static NOT_FOUND = 'NOT_FOUND' // 404 (Not Found)
  static CONFLICT = 'CONFLICT' // 409 (Conflict)
  static VALIDATION = 'VALIDATION' // 422 (Unprocessable Entity)
}
