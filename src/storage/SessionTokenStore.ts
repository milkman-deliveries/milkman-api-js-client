import { TokenStore } from './TokenStore'

export class SessionTokenStore implements TokenStore {
  key: string

  constructor(key: string) {
    this.key = key
  }

  retrieve(): string {
    return sessionStorage.getItem(this.key)
  }

  store(value: string): void {
    sessionStorage.setItem(this.key, value)
  }
}
