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

export interface TokenStore {
    getToken(): string
    saveToken(value: string): void
}

export class DefaultSessionTokenStore implements TokenStore {
    getToken(): string {
        return retrieveSessionToken()
    }

    saveToken(value: string) {
        storeSessionToken(value)
    }
}

export class DefaultIdTokenStore implements TokenStore {
    getToken(): string {
        return retrieveIdToken()
    }
    saveToken(value: string) {
        storeIdToken(value)
    }
}
export class DefaultRefreshTokenStore implements TokenStore {
    getToken(): string {
        return retrieveRefreshToken()
    }
    saveToken(value: string) {
        storeRefreshToken(value)
    }
}
