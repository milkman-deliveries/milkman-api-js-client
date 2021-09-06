import 'isomorphic-fetch'

export const COGNITO_ID_TOKEN_KEY = 'MILMAN_COGNITO_ID_TOKEN'
export const COGNITO_REFRESH_TOKEN_KEY = 'MILMAN_COGNITO_REFRESH_TOKEN'

export const retrieveIdToken = (): string => (
  sessionStorage.getItem(COGNITO_ID_TOKEN_KEY)
)

export const storeIdToken = (token: string): void => (
  sessionStorage.setItem(COGNITO_ID_TOKEN_KEY, token)
)

export const retrieveRefreshToken = (): string => (
  sessionStorage.getItem(COGNITO_REFRESH_TOKEN_KEY)
)

export const storeRefreshToken = (token: string): void => (
  sessionStorage.setItem(COGNITO_REFRESH_TOKEN_KEY, token)
)
