import { LegacyApiQuery } from './LegacyApiQuery'

describe('ApiQuery', () => {

  let query
  beforeEach(() => {
    query = new LegacyApiQuery()
  })

  describe('generic rule type', () => {

    it('accept string values', () => {
      query.addRule('field', 'operator', 'value')
      expect(query.toString()).toEqual('query={"field":{"operator":"value"}}')
    })

    it('accept numeric values', () => {
      query.addRule('field', 'operator', 123)
      expect(query.toString()).toEqual('query={"field":{"operator":123}}')
    })

    it('accept numeric values (with decimals)', () => {
      query.addRule('field', 'operator', 123.45)
      expect(query.toString()).toEqual('query={"field":{"operator":123.45}}')
    })

    it('accept numeric values (with decimals)', () => {
      query.addRule('field', 'operator', true)
      expect(query.toString()).toEqual('query={"field":{"operator":true}}')
    })

    it('accept array values', () => {
      query.addRule('field', 'operator', ['string', 123, true, 123.45])
      expect(query.toString()).toEqual('query={"field":{"operator":["string",123,true,123.45]}}')
    })

    it('accept object values', () => {
      query.addRule('field', 'operator', { aaa: 'string', bbb: 123, ccc: true, ddd: 123.45 })
      expect(query.toString()).toEqual('query={"field":{"operator":{"aaa":"string","bbb":123,"ccc":true,"ddd":123.45}}}')
    })

    it('accept empty value', () => {
      const api = new LegacyApiQuery()
      api.addRule('field', 'operator')
      expect(api.toString()).toEqual('query={"field":{"operator":""}}')
    })
  })

  describe('common rules', () => {

    it('can add an "equal" rule', () => {
      const api = new LegacyApiQuery()
      api.eq('field', 'value')
      expect(api.toString()).toEqual('query={"field":{"$eq":"value"}}')
    })

    it('can add a "not equal" rule', () => {
      const api = new LegacyApiQuery()
      api.ne('field', 'value')
      expect(api.toString()).toEqual('query={"field":{"$ne":"value"}}')
    })

    it('can add a "greater than" rule', () => {
      const api = new LegacyApiQuery()
      api.gt('field', 'value')
      expect(api.toString()).toEqual('query={"field":{"$gt":"value"}}')
    })

    it('can add a "greater than or equal" rule', () => {
      const api = new LegacyApiQuery()
      api.gte('field', 'value')
      expect(api.toString()).toEqual('query={"field":{"$gte":"value"}}')
    })

    it('can add a "less than" rule', () => {
      const api = new LegacyApiQuery()
      api.lt('field', 'value')
      expect(api.toString()).toEqual('query={"field":{"$lt":"value"}}')
    })

    it('can add a "less than or equal" rule', () => {
      const api = new LegacyApiQuery()
      api.lte('field', 'value')
      expect(api.toString()).toEqual('query={"field":{"$lte":"value"}}')
    })

    it('can add a "inside" rule', () => {
      const api = new LegacyApiQuery()
      api.in('field', ['v1', 'v2', 'v3'])
      expect(api.toString()).toEqual('query={"field":{"$in":["v1","v2","v3"]}}')
    })
  })
})
