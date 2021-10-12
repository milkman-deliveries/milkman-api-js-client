import 'isomorphic-fetch'

export const COGNITO_ID_TOKEN_KEY = 'MILKMAN_COGNITO_ID_TOKEN'
export const COGNITO_REFRESH_TOKEN_KEY = 'MILKMAN_COGNITO_REFRESH_TOKEN'

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

// The following are methods used to store/retrieve the legacy session token.

export const SESSION_TOKEN_KEY = 'MILKMAN_SESSION_TOKEN_KEY'

export const retrieveSessionToken = (): string => (
  sessionStorage.getItem(SESSION_TOKEN_KEY)
)

export const storeSessionToken = (token: string): void => (
  sessionStorage.setItem(SESSION_TOKEN_KEY, token)
)
