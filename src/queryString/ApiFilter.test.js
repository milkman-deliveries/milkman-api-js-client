import { ApiFilter, ApiFilterOperator } from './ApiFilter'

describe('ApiFilter', () => {

  describe('generic rule type', () => {

    it('accept string values', () => {
      const api1 = new ApiFilter()
      api1.addRule('test', ApiFilterOperator.EQ, 'value')
      expect(api1.toString()).toEqual('test=value')

      const api2 = new ApiFilter()
      api2.addRule('test', ApiFilterOperator.EQ, 'this-is-a-more-complex-string')
      expect(api2.toString()).toEqual('test=this-is-a-more-complex-string')
    })

    it('accept numeric values', () => {
      const api1 = new ApiFilter()
      api1.addRule('test', ApiFilterOperator.EQ, 123)
      expect(api1.toString()).toEqual('test=123')

      const api2 = new ApiFilter()
      api2.addRule('test', ApiFilterOperator.EQ, 123.456)
      expect(api2.toString()).toEqual('test=123.456')
    })

    it('accept boolean values', () => {
      const api1 = new ApiFilter()
      api1.addRule('test', ApiFilterOperator.EQ, true)
      expect(api1.toString()).toEqual('test=true')

      const api2 = new ApiFilter()
      api2.addRule('test', ApiFilterOperator.EQ, false)
      expect(api2.toString()).toEqual('test=false')
    })

    it('accept array values', () => {
      const api = new ApiFilter()
      api.addRule('test', ApiFilterOperator.EQ, ['string', 123, true, 123.45])
      expect(api.toString()).toEqual('test=["string",123,true,123.45]')
    })

    it('accept object values', () => {
      const api = new ApiFilter()
      api.addRule('test', ApiFilterOperator.EQ, { aaa: 'string', bbb: 123, ccc: true, ddd: 123.45 })
      expect(api.toString()).toEqual('test={"aaa":"string","bbb":123,"ccc":true,"ddd":123.45}')
    })

    it('accept empty value', () => {
      const api = new ApiFilter()
      api.addRule('test', ApiFilterOperator.EQ)
      expect(api.toString()).toEqual('test=')
    })

    it('accept multiple rules', () => {
      const api = new ApiFilter()
      api.addRule('aaa', ApiFilterOperator.EQ, 10)
      api.addRule('bbb', ApiFilterOperator.EQ, 25)
      expect(api.toString()).toEqual('aaa=10&bbb=25')
    })

    it('accept multiple rules on the same field', () => {
      const api = new ApiFilter()
      api.addRule('test', ApiFilterOperator.GT, 10)
      api.addRule('test', ApiFilterOperator.LE, 25)
      expect(api.toString()).toEqual('test[gt]=10&test[le]=25')
    })
  })

  describe('common rules', () => {

    it('can add an "equal" rule', () => {
      const api = new ApiFilter()
      api.eq('test', 'value')
      expect(api.toString()).toEqual('test=value')
    })

    it('can add a "not equal" rule', () => {
      const api = new ApiFilter()
      api.ne('test', 'value')
      expect(api.toString()).toEqual('test[ne]=value')
    })

    it('can add a "greater than" rule', () => {
      const api = new ApiFilter()
      api.gt('test', 'value')
      expect(api.toString()).toEqual('test[gt]=value')
    })

    it('can add a "greater than or equal" rule', () => {
      const api = new ApiFilter()
      api.ge('test', 'value')
      expect(api.toString()).toEqual('test[ge]=value')
    })

    it('can add a "less than" rule', () => {
      const api = new ApiFilter()
      api.lt('test', 'value')
      expect(api.toString()).toEqual('test[lt]=value')
    })

    it('can add a "less than or equal" rule', () => {
      const api = new ApiFilter()
      api.le('test', 'value')
      expect(api.toString()).toEqual('test[le]=value')
    })

    it('can add a "inside" rule', () => {
      const api = new ApiFilter()
      api.in('test', ['v1', 'v2', 'v3'])
      expect(api.toString()).toEqual('test[in]=v1,v2,v3')
    })
  })
})
