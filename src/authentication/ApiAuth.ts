import 'isomorphic-fetch'
import { defaultHeaders } from '../utils/headers'
import {
  retrieveIdToken, retrieveRefreshToken, storeIdToken, storeRefreshToken, storeSessionToken,
} from './sessionStorage'

export const COGNITO_ENDPOINT = 'https://auth.milkmantechnologies.com/'
export const COGNITO_TOKEN_TIMEOUT = 55 * 60 * 1000 // 55 minutes

export enum AuthenticationMethod {
  USER_PASSWORD = 'USER_PASSWORD_AUTH',
  REFRESH_TOKEN = 'REFRESH_TOKEN_AUTH'
}

export interface CognitoAuthResponse {
  IdToken: string,
  RefreshToken: string
}

export interface ApiAuthConfig {
  application: string
  clientId: string
  automaticRefresh?: boolean
  refreshTimeoutMs?: number
  // legacy authentication
  useMilkmanSession: boolean
  milkmanBaseUrl?: string
}

export class ApiAuth {
  application: string
  clientId: string
  automaticRefresh: boolean
  refreshTimeoutMs: number
  // legacy authentication
  useMilkmanSession: boolean
  milkmanBaseUrl?: string

  sessionTimeout: NodeJS.Timeout

  constructor(config: ApiAuthConfig) {
    this.application = config.application
    this.clientId = config.clientId
    this.automaticRefresh = config.automaticRefresh || false
    this.refreshTimeoutMs = config.refreshTimeoutMs || COGNITO_TOKEN_TIMEOUT
    // legacy authentication
    this.useMilkmanSession = config.useMilkmanSession || false
    this.milkmanBaseUrl = config.milkmanBaseUrl || '/'
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
      headers: {Accept: 'application/json'},
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
      .then(({AuthenticationResult, error}) => {
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
      headers: {Accept: 'application/json'},
      body: JSON.stringify({
        ClientId: this.clientId,
        AuthFlow: AuthenticationMethod.REFRESH_TOKEN,
        AuthParameters: {
          REFRESH_TOKEN: retrieveRefreshToken(),
        },
      }),
    })
      .then(res => {
        if (res.ok) return res.json()
        throw new Error()
      })
      .then(({AuthenticationResult, error}) => {
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
        authorization: `Bearer ${retrieveIdToken()}`,
      },
    })
      .then(res => {
        if (res.ok) return res.json()
        throw new Error()
      })
      .then(({session}) => {
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
    const {IdToken, RefreshToken} = await this._cognitoLogin(username, password)
      .catch(() => Promise.reject())

    storeIdToken(IdToken)
    storeRefreshToken(RefreshToken)

    if (this.useMilkmanSession) {
      const session = await this._resolveUser()
        .catch(() => Promise.reject())

      storeSessionToken(session)
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
    const {IdToken} = await this._cognitoRefresh()
      .catch(() => Promise.reject())

    storeIdToken(IdToken)

    if (this.useMilkmanSession) {
      const session = await this._resolveUser()
        .catch(() => Promise.reject())

      storeSessionToken(session)
    }

    if (this.automaticRefresh) {
      this.scheduleAutomaticRefresh()
    }

    return Promise.resolve(true)
  }
}
