import 'isomorphic-fetch'
import { ApiFetch } from '../../api/ApiFetch'
import {TokenStore, storeSessionToken, retrieveSessionToken, DefaultSessionTokenStore} from '../sessionStorage'

export interface LegacyApiAuthConfig {
  baseUrl?: string
  store: TokenStore
}

export interface LegacyLoginParams extends Map<string, any> {
  username?: string
  password?: string
}

export class LegacyApiAuth {
  baseUrl: string
  tokenStore: TokenStore

  constructor(config: LegacyApiAuthConfig) {
    this.baseUrl = config.baseUrl || '/'
    this.tokenStore = config.store || new DefaultSessionTokenStore()
  }

  /** Calls POST /milkman/login, retrieving Milkman session token. */
  _login(params: LegacyLoginParams): Promise<string> {
    const client = new ApiFetch({ baseUrl: this.baseUrl })
    return client.POST('/milkman/login', params)
      .then(res => {
        if (res.ok) return res.json()
        throw new Error()
      })
      .then(({result}) => {
        if (result.success && result.session) return result.session
        throw new Error()
      })
  }

  async login(params: LegacyLoginParams): Promise<boolean> {
    const session = await this._login(params)
      .catch(() => Promise.reject())

    this.tokenStore.saveToken(session)
    return Promise.resolve(true)
  }
}
