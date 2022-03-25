import 'isomorphic-fetch'
import { legacyThrowError } from '../../errors/legacy/legacyThrowError'
import { ApiFetcher } from '../../fetch/ApiFetcher'
import { legacyParseContent } from '../../parse/legacy/legacyParseContent'
import { TokenStore } from '../../storage/TokenStore'
import { LegacyApiResponseResult } from '../../fetch/types/LegacyApiResponseData'

export const LEGACY_SESSION_TOKEN_KEY = 'MILKMAN_LEGACY_SESSION_TOKEN_KEY'

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

  get authUrl() {
    return `${this.baseUrl}/milkman/login`
  }

  /** Calls POST /milkman/login, retrieving Milkman session token. */
  _login(params: LegacyLoginParams): Promise<string> {
    const client = new ApiFetcher({ baseUrl: this.baseUrl, responseHandlers: [legacyParseContent, legacyThrowError] })
    return client.POST<LegacyLoginParams, LegacyApiResponseResult>('/milkman/login', params)
      .then((data) => data?.session)
  }

  async login(params: LegacyLoginParams): Promise<boolean> {
    const session = await this._login(params)
      .catch(() => Promise.reject())

    this.sessionTokenStore.store(session)
    return Promise.resolve(true)
  }
}
