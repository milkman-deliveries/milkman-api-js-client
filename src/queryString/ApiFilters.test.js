import { ApiFilters, ApiFilterOperator } from './ApiFilters'

describe('ApiFilters', () => {

  let filters
  beforeEach(() => {
    filters = new ApiFilters()
  })

  describe('generic rule type', () => {

    it('does not accept empty field', () => {
      filters.addFilter('')
      expect(JSON.stringify(filters)).toEqual('{}')
    })

    it('accepts field only', () => {
      filters.addFilter('field')
      expect(JSON.stringify(filters)).toEqual('{"field":""}')
    })

    it('accepts field and operator only', () => {
      filters.addFilter('field', 'operator')
      expect(JSON.stringify(filters)).toEqual('{"field(operator)":""}')
    })

    it('accepts field and value only', () => {
      filters.addFilter('field', undefined, 'value')
      expect(JSON.stringify(filters)).toEqual('{"field":"value"}')
    })

    it('accepts field, operator and value', () => {
      filters.addFilter('field', 'operator', 'value')
      expect(JSON.stringify(filters)).toEqual('{"field(operator)":"value"}')
    })

    it('accepts multiple filters', () => {
      filters.addFilter('field1', 'operator1', 'value1')
      filters.addFilter('field2', 'operator2', 'value2')
      expect(JSON.stringify(filters)).toEqual('{"field1(operator1)":"value1","field2(operator2)":"value2"}')
    })

    it('accepts multiple filters on the same field', () => {
      filters.addFilter('field', 'operator1', 'value1')
      filters.addFilter('field', 'operator2', 'value2')
      expect(JSON.stringify(filters)).toEqual('{"field(operator1)":"value1","field(operator2)":"value2"}')
    })

    it('overrides old filter if same field and operator are specified', () => {
      filters.addFilter('field', 'operator', 'old value')
      filters.addFilter('field', 'operator', 'new value')
      expect(JSON.stringify(filters)).toEqual('{"field(operator)":"new value"}')
    })

    it('accepts any string values', () => {
      filters.addFilter('field', ApiFilterOperator.EQ, 'abç°§é*|!£$%&/()=?^,.-')
      expect(JSON.stringify(filters)).toEqual('{"field":"abç°§é*|!£$%&/()=?^,.-"}')
    })

    it('accepts numeric values', () => {
      filters.addFilter('field', ApiFilterOperator.EQ, 123)
      expect(JSON.stringify(filters)).toEqual('{"field":123}')
    })

    it('accepts numeric values (with decimals)', () => {
      filters.addFilter('field', ApiFilterOperator.EQ, 123.456)
      expect(JSON.stringify(filters)).toEqual('{"field":123.456}')
    })

    it('accepts boolean values', () => {
      filters.addFilter('field1', ApiFilterOperator.EQ, true)
      filters.addFilter('field2', ApiFilterOperator.EQ, false)
      expect(JSON.stringify(filters)).toEqual('{"field1":true,"field2":false}')
    })

    it('accepts array values', () => {
      filters.addFilter('field', ApiFilterOperator.EQ, ['string', 123, true, 123.45])
      expect(JSON.stringify(filters)).toEqual('{"field":["string",123,true,123.45]}')
    })

    it('accepts object values', () => {
      filters.addFilter('field', ApiFilterOperator.EQ, { name: 'John', age: 23, authorized: true })
      expect(JSON.stringify(filters)).toEqual('{"field":{"name":"John","age":23,"authorized":true}}')
    })
  })

  describe('built-in operators', () => {

    it('"eq" (equals)', () => {
      filters.eq('field', 'value')
      expect(JSON.stringify(filters)).toEqual('{"field":"value"}')
    })

    it('"ne" (not equals)', () => {
      filters.ne('field', 'value')
      expect(JSON.stringify(filters)).toEqual('{"field(ne)":"value"}')
    })

    it('"gt" (greater than)', () => {
      filters.gt('field', 'value')
      expect(JSON.stringify(filters)).toEqual('{"field(gt)":"value"}')
    })

    it('"ge" (greater than or equal)', () => {
      filters.ge('field', 'value')
      expect(JSON.stringify(filters)).toEqual('{"field(ge)":"value"}')
    })

    it('"lt" (less than)', () => {
      filters.lt('field', 'value')
      expect(JSON.stringify(filters)).toEqual('{"field(lt)":"value"}')
    })

    it('"le" (less than or equal)', () => {
      filters.le('field', 'value')
      expect(JSON.stringify(filters)).toEqual('{"field(le)":"value"}')
    })

    it('"in" (inside a list of values)', () => {
      filters.in('field', ['value', 123, true])
      expect(JSON.stringify(filters)).toEqual('{"field(in)":["value",123,true]}')
    })
  })
  describe("known limitations", () => {
    it('does not accept filter named as ApiFilters class methods', () => {
      filters.eq('eq', 'value')
      filters.eq('addFilter', 'value')
      expect(JSON.stringify(filters)).toEqual('{}')
    })
  })
})
