import 'isomorphic-fetch'
import { TokenStore } from '../storage/TokenStore'
import { defaultHeaders } from '../utils/defaultHeaders'

export const COGNITO_ENDPOINT = 'https://auth.milkmantechnologies.com/'
export const COGNITO_TOKEN_TIMEOUT = 55 * 60 * 1000 // 55 minutes

export const COGNITO_ID_TOKEN_KEY = 'MILKMAN_COGNITO_ID_TOKEN'
export const COGNITO_REFRESH_TOKEN_KEY = 'MILKMAN_COGNITO_REFRESH_TOKEN'

export enum AuthenticationMethod {
  USER_PASSWORD = 'USER_PASSWORD_AUTH',
  REFRESH_TOKEN = 'REFRESH_TOKEN_AUTH'
}

export interface CognitoAuthResponse {
  IdToken: string,
  RefreshToken: string
}

export interface ApiAuthConfig<T extends TokenStore> {
  application: string
  clientId: string
  automaticRefresh?: boolean
  refreshTimeoutMs?: number
  // tokens
  idTokenStore?: T,
  refreshTokenStore?: T
  // legacy authentication
  useMilkmanSession?: boolean
  milkmanBaseUrl?: string
  sessionTokenStore?: T
}

export class ApiAuth<T extends TokenStore> {
  application: string
  clientId: string
  automaticRefresh: boolean
  refreshTimeoutMs: number
  idTokenStore: T
  refreshTokenStore: T
  // legacy authentication
  useMilkmanSession: boolean
  milkmanBaseUrl?: string
  sessionTokenStore: T

  sessionTimeout: NodeJS.Timeout

  constructor(config: ApiAuthConfig<T>) {
    this.application = config.application
    this.clientId = config.clientId
    this.automaticRefresh = config.automaticRefresh || false
    this.refreshTimeoutMs = config.refreshTimeoutMs || COGNITO_TOKEN_TIMEOUT
    // tokens
    this.idTokenStore = config.idTokenStore
    this.refreshTokenStore = config.refreshTokenStore
    // legacy authentication
    this.useMilkmanSession = config.useMilkmanSession || false
    this.milkmanBaseUrl = config.milkmanBaseUrl || '/'
    this.sessionTokenStore = config.sessionTokenStore
  }

  get cognitoAuthUrl() {
    return `${COGNITO_ENDPOINT}${this.application}/login`
  }

  get milkmanResolveUserUrl() {
    return `${this.milkmanBaseUrl}/milkman/resolveUser`
  }

  /* API calls */

  /**
   * Calls Cognito, asking for ID token and refresh Token.
   */
  _cognitoLogin(username: string, password: string): Promise<CognitoAuthResponse> {
    return fetch(this.cognitoAuthUrl, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: JSON.stringify({
        ClientId: this.clientId,
        AuthFlow: AuthenticationMethod.USER_PASSWORD,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      }),
    })
      .then(res => {
        if (res.ok) return res.json()
        throw new Error()
      })
      .then(({ AuthenticationResult, error }) => {
        if (!error && AuthenticationResult) return AuthenticationResult
        throw new Error()
      })
  }

  /**
   * Calls Cognito, asking for a new ID token.
   */
  _cognitoRefresh(): Promise<CognitoAuthResponse> {
    return fetch(this.cognitoAuthUrl, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: JSON.stringify({
        ClientId: this.clientId,
        AuthFlow: AuthenticationMethod.REFRESH_TOKEN,
        AuthParameters: {
          REFRESH_TOKEN: this.refreshTokenStore.retrieve(),
        },
      }),
    })
      .then(res => {
        if (res.ok) return res.json()
        throw new Error()
      })
      .then(({ AuthenticationResult, error }) => {
        if (!error && AuthenticationResult) return AuthenticationResult
        throw new Error()
      })
  }

  /**
   * Calls POST /milkman/resolveUser, retrieving Milkman session token.
   */
  _resolveUser(): Promise<string> {
    return fetch(`${this.milkmanBaseUrl}/milkman/resolveUser?loginSource=Web&rememberMe=true`, {
      method: 'GET',
      headers: {
        ...defaultHeaders,
        authorization: `Bearer ${this.idTokenStore.retrieve()}`,
      },
    })
      .then(res => {
        if (res.ok) return res.json()
        throw new Error()
      })
      .then(({ session }) => {
        if (session) return session
        throw new Error()
      })
  }

  scheduleAutomaticRefresh() {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout)
    }
    this.sessionTimeout = setTimeout(() => {
      this.refresh()
    }, this.refreshTimeoutMs)
  }

  /**
   * Authenticate via Cognito and store ID and Refresh tokens in session storage.
   * Depending on the configuration, it can schedules an automatic authentication refresh.
   */
  async login(username: string, password: string): Promise<boolean> {
    const { IdToken, RefreshToken } = await this._cognitoLogin(username, password)
      .catch(() => Promise.reject())

    this.idTokenStore.store(IdToken)
    this.refreshTokenStore.store(RefreshToken)

    if (this.useMilkmanSession) {
      const session = await this._resolveUser()
        .catch(() => Promise.reject())

      this.sessionTokenStore.store(session)
    }

    if (this.automaticRefresh) {
      this.scheduleAutomaticRefresh()
    }

    return Promise.resolve(true)
  }

  /**
   * Refresh authentication via Cognito using the Refresh token,
   * then store the new ID token in session storage.
   */
  async refresh(): Promise<boolean> {
    const { IdToken } = await this._cognitoRefresh()
      .catch(() => Promise.reject())

    this.idTokenStore.store(IdToken)

    if (this.useMilkmanSession) {
      const session = await this._resolveUser()
        .catch(() => Promise.reject())

      this.sessionTokenStore.store(session)
    }

    if (this.automaticRefresh) {
      this.scheduleAutomaticRefresh()
    }

    return Promise.resolve(true)
  }
}
