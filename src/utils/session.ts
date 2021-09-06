import 'isomorphic-fetch'

export const COGNITO_ID_TOKEN_KEY = 'MILMAN_COGNITO_ID_TOKEN'
export const COGNITO_REFRESH_TOKEN_KEY = 'MILMAN_COGNITO_REFRESH_TOKEN'
// export const SESSION_TOKEN_KEY = 'MILKMAN_SESSION_TOKEN' // not used in new paradigm
// export const REFRESH_TOKEN_KEY = 'MILKMAN_REFRESH_TOKEN' // not used in new paradigm

// export const retrieveSession = (): string => (
//   sessionStorage.getItem(SESSION_TOKEN_KEY)
// )

export const retrieveIdToken = (): string => (
  sessionStorage.getItem(COGNITO_ID_TOKEN_KEY)
)
