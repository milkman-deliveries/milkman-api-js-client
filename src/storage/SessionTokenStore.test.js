import Sinon from 'sinon'
import { SessionTokenStore } from './SessionTokenStore'

describe('SessionTokenStore', () => {

  beforeEach(() => {
    global.Storage.prototype.setItem = Sinon.mock()
    global.Storage.prototype.getItem = Sinon.mock()
  })

  it('stores key passed in constructor', () => {
    const key = 'foo token key'
    const tokenStore = new SessionTokenStore(key)
    expect(tokenStore.key).toEqual(key)
  })

  it('calls sessionStorage.getItem when retrieve is called', () => {
    const key = 'foo token key'
    const tokenStore = new SessionTokenStore(key)
    tokenStore.retrieve()
    expect(global.Storage.prototype.getItem.calledOnce).toBeTruthy()
    expect(global.Storage.prototype.getItem.firstCall.args).toEqual([key])
  })

  it('calls sessionStorage.setItem when store is called', () => {
    const key = 'foo token key'
    const value = 'foo token value'
    const tokenStore = new SessionTokenStore(key)
    tokenStore.store(value)
    expect(global.Storage.prototype.setItem.calledOnce).toBeTruthy()
    expect(global.Storage.prototype.setItem.firstCall.args).toEqual([key, value])
  })
})
