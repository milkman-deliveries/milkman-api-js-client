import 'isomorphic-fetch'
import { ApiClient } from '../../api/ApiClient'
import { storeSessionToken } from '../sessionStorage'

export interface LegacyApiAuthConfig {
  baseUrl?: string
}

export interface LegacyLoginParams extends Map<string, any> {
  username?: string
  password?: string
}

export class LegacyApiAuth {
  baseUrl: string

  constructor(config: LegacyApiAuthConfig) {
    this.baseUrl = config.baseUrl || '/'
  }

  /** Calls POST /milkman/login, retrieving Milkman session token. */
  _login(params: LegacyLoginParams): Promise<string> {
    const client = new ApiClient({ baseUrl: this.baseUrl })
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

    storeSessionToken(session)
    return Promise.resolve(true)
  }
}
