import 'isomorphic-fetch'
import { clearTimeout } from 'timers'
import { retrieveRefreshToken, storeIdToken, storeRefreshToken } from '../utils/session'

export const COGNITO_ENDPOINT = 'https://auth.milkmantechnologies.com/'
export const COGNITO_TOKEN_TIMEOUT = 55 * 60 * 1000 // 55 minutes

export enum AuthenticationMethod {
  USER_PASSWORD = 'USER_PASSWORD_AUTH',
  REFRESH_TOKEN = 'REFRESH_TOKEN_AUTH'
}

export interface ApiAuthConfig {
  application: string
  clientId: string
  automaticRefresh?: boolean
  refreshTimeoutMs?: number
}

export class ApiAuth {
  application: string
  clientId: string
  automaticRefresh: boolean
  refreshTimeoutMs: number
  sessionTimeout: NodeJS.Timeout

  constructor(config: ApiAuthConfig) {
    this.application = config.application
    this.clientId = config.clientId
    this.automaticRefresh = config.automaticRefresh || false
    this.refreshTimeoutMs = config.refreshTimeoutMs || COGNITO_TOKEN_TIMEOUT
  }

  /**
   * Compose the url for Cognito authentication.
   */
  get authUrl() {
    return `${COGNITO_ENDPOINT}${this.application}/login`
  }

  /**
   * Calls Cognito, asking for ID token and refresh Token.
   */
  cognitoLogin(username: string, password: string) {
    return fetch(this.authUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json'
      },
      body: JSON.stringify({
        ClientId: this.clientId,
        AuthFlow: AuthenticationMethod.USER_PASSWORD,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        }
      })
    })
  }

  /**
   * Calls Cognito, asking for a new ID token.
   */
  cognitoRefresh() {
    return fetch(this.authUrl, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: JSON.stringify({
        ClientId: this.clientId,
        AuthFlow: AuthenticationMethod.REFRESH_TOKEN,
        AuthParameters: {
          REFRESH_TOKEN: retrieveRefreshToken(),
        }
      })
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
    const { AuthenticationResult, error } = await this.cognitoLogin(username, password).then(res => res.json())
    if (error || !AuthenticationResult) {
      return Promise.reject(error)
    }
    const { IdToken, RefreshToken } = AuthenticationResult
    storeIdToken(IdToken)
    storeRefreshToken(RefreshToken)

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
    const { AuthenticationResult, error } = await this.cognitoRefresh().then(res => res.json())
    if (error || !AuthenticationResult) {
      return Promise.reject(error)
    }
    const { IdToken } = AuthenticationResult
    storeIdToken(IdToken)

    if (this.automaticRefresh) {
      this.scheduleAutomaticRefresh()
    }

    return Promise.resolve(true)
  }
}
