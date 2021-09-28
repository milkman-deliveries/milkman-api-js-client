import { LegacyApiQuery } from './LegacyApiQuery'

describe('ApiQuery', () => {

  describe('generic rule type', () => {

    it ('accept string values', () => {
      const api1 = new LegacyApiQuery()
      api1.addRule('test', 'string')
      expect(api1.toString()).toEqual('{"test":"string"}')

      const api2 = new LegacyApiQuery()
      api2.addRule('test', 'this is a more complex string')
      expect(api2.toString()).toEqual('{"test":"this is a more complex string"}')
    })

    it ('accept numeric values', () => {
      const api1 = new LegacyApiQuery()
      api1.addRule('test', 123)
      expect(api1.toString()).toEqual('{"test":123}')

      const api2 = new LegacyApiQuery()
      api2.addRule('test', 123.456)
      expect(api2.toString()).toEqual('{"test":123.456}')
    })

    it ('accept boolean values', () => {
      const api1 = new LegacyApiQuery()
      api1.addRule('test', true)
      expect(api1.toString()).toEqual('{"test":true}')

      const api2 = new LegacyApiQuery()
      api2.addRule('test', false)
      expect(api2.toString()).toEqual('{"test":false}')
    })

    it ('accept array values', () => {
      const api = new LegacyApiQuery()
      api.addRule('test', ['string', 123, true, 123.45])
      expect(api.toString()).toEqual('{"test":["string",123,true,123.45]}')
    })

    it ('accept object values', () => {
      const api = new LegacyApiQuery()
      api.addRule('test', { aaa: 'string', bbb: 123, ccc: true, ddd: 123.45})
      expect(api.toString()).toEqual('{"test":{"aaa":"string","bbb":123,"ccc":true,"ddd":123.45}}')
    })

    it ('accept empty value', () => {
      const api = new LegacyApiQuery()
      api.addRule('test')
      expect(api.toString()).toEqual('{"test":""}')
    })
  })

  describe('common rules', () => {

    it ('can add an "equal" rule', () => {
      const api = new LegacyApiQuery()
      api.eq('value')
      expect(api.toString()).toEqual('{"$eq":"value"}')
    })

    it ('can add a "not equal" rule', () => {
      const api = new LegacyApiQuery()
      api.ne('value')
      expect(api.toString()).toEqual('{"$ne":"value"}')
    })

    it ('can add a "greater than" rule', () => {
      const api = new LegacyApiQuery()
      api.gt('value')
      expect(api.toString()).toEqual('{"$gt":"value"}')
    })

    it ('can add a "greater than or equal" rule', () => {
      const api = new LegacyApiQuery()
      api.gte('value')
      expect(api.toString()).toEqual('{"$gte":"value"}')
    })

    it ('can add a "less than" rule', () => {
      const api = new LegacyApiQuery()
      api.lt('value')
      expect(api.toString()).toEqual('{"$lt":"value"}')
    })

    it ('can add a "less than or equal" rule', () => {
      const api = new LegacyApiQuery()
      api.lte('value')
      expect(api.toString()).toEqual('{"$lte":"value"}')
    })

    it ('can add a "inside" rule', () => {
      const api = new LegacyApiQuery()
      api.in(['v1', 'v2', 'v3'])
      expect(api.toString()).toEqual('{"$in":["v1","v2","v3"]}')
    })
  })
})
