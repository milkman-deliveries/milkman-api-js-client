import 'isomorphic-fetch'
import { ApiFetch } from '../../fetch/ApiFetch'
import { TokenStore } from '../../storage/TokenStore'

export interface LegacyApiAuthConfig<T extends TokenStore> {
  baseUrl?: string
  sessionTokenStore: T
}

export interface LegacyLoginParams extends Map<string, any> {
  username?: string
  password?: string
  loginSource?: string
  rememberMe?: boolean
}

export class LegacyApiAuth<T extends TokenStore> {
  baseUrl: string
  sessionTokenStore: T

  constructor(config: LegacyApiAuthConfig<T>) {
    this.baseUrl = config.baseUrl || '/'
    this.sessionTokenStore = config.sessionTokenStore
  }

  /** Calls POST /milkman/login, retrieving Milkman session token. */
  _login(params: LegacyLoginParams): Promise<string> {
    const client = new ApiFetch({ baseUrl: this.baseUrl })
    return client.POST('/milkman/login', params)
      .then(res => {
        if (res.ok) return res.json()
        throw new Error(`${res.status} - ${res.statusText}`)
      })
      .then(({result}) => {
        if (result.success && result.session) return result.session
        throw new Error()
      })
  }

  async login(params: LegacyLoginParams): Promise<boolean> {
    const session = await this._login(params)
      .catch(() => Promise.reject())

    this.sessionTokenStore.store(session)
    return Promise.resolve(true)
  }
}
