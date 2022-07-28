import sinon from "sinon"
import { ApiError } from "../errors/ApiError"
import { computeSkipValues, fetchAllPages } from "./fetchAllPages"

describe('computeSkipValues', () => {

  it('if count is less or equals to pageSize returns an empty array', () => {
    expect(computeSkipValues(123, 200)).toEqual([])
    expect(computeSkipValues(123, 123)).toEqual([])
  })

  it('if count is greater than pageSize returns an array of values', () => {
    expect(computeSkipValues(123, 50)).toEqual([50, 100])
    expect(computeSkipValues(123, 25)).toEqual([25, 50, 75, 100])
  })
})

describe('fetchAllPages', () => {

  it('if the response does not have the expected properties throw an error', async () => {
    const fooFetch = (res) => Promise.resolve(res)

    try {
      await fooFetch({})
    } catch (e) {
      expect(e).toEqual(new Error('@milkman/api-js-client'))
    }

    try {
      await fooFetch({ count: 123 })
    } catch (e) {
      expect(e).toEqual(new Error('@milkman/api-js-client'))
    }

    try {
      await fooFetch({ items: [] })
    } catch (e) {
      expect(e).toEqual(new Error('@milkman/api-js-client'))
    }
  })

  it('if the first calls failed throws an error', async () => {
    const fetchFactory = () => {
      return () => {
        throw new ApiError(400)
      }
    }

    const fooFetch = sinon.stub().callsFake(fetchFactory())

    try {
      await fetchAllPages(fooFetch)
    } catch (e) {
      expect(e).toEqual(new Error('@milkman/api-js-client'))
      expect(fooFetch.callCount).toEqual(1)
    }
  })

  it('if one of the parallel calls failed throws an error', async () => {
    const fetchFactory = () => {
      return (qs) => {
        const [, skip] = /skip=(\d+)/.exec(qs)
        const base = Number(skip)
        if (base === 0) return {
          count: 100,
          items: ['item 1', 'item 2', 'item 3']
        }
        throw new ApiError(400)
      }
    }

    const fooFetch = sinon.stub().callsFake(fetchFactory())

    try {
      await fetchAllPages(fooFetch)
    } catch (e) {
      expect(e).toEqual(new Error('@milkman/api-js-client'))
      expect(fooFetch.callCount).toEqual(2)
    }
  })

  it('if the response has the expected properties do all the calls', async () => {
    const fetchFactory = (count, pageSize) => (qs) => {
      const [, skip] = /skip=(\d+)/.exec(qs)
      const base = Number(skip)
      const size = Math.min(count - base, pageSize)
      return {
        count,
        items: Array(size).fill(0).map((e, i) => `item ${base + i}`),
      }
    }

    let fooFetch = sinon.stub().callsFake(fetchFactory(123, 200))
    let res = await fetchAllPages(fooFetch)
    expect(fooFetch.callCount).toEqual(1)
    expect(fooFetch.firstCall.args[0]).toEqual('skip=0')
    expect(res.length).toEqual(123)
    expect(res).toEqual(Array(123).fill(0).map((e, i) => `item ${i}`))

    fooFetch = sinon.stub().callsFake(fetchFactory(123, 100))
    res = await fetchAllPages(fooFetch)
    expect(fooFetch.callCount).toEqual(2)
    expect(fooFetch.firstCall.args[0]).toEqual('skip=0')
    expect(fooFetch.secondCall.args[0]).toEqual('skip=100')
    expect(res.length).toEqual(123)
    expect(res).toEqual(Array(123).fill(0).map((e, i) => `item ${i}`))

    fooFetch = sinon.stub().callsFake(fetchFactory(123, 25))
    res = await fetchAllPages(fooFetch)
    expect(fooFetch.callCount).toEqual(5)
    expect(fooFetch.firstCall.args[0]).toEqual('skip=0')
    expect(fooFetch.secondCall.args[0]).toEqual('skip=25')
    expect(fooFetch.thirdCall.args[0]).toEqual('skip=50')
    expect(fooFetch.getCall(3).args[0]).toEqual('skip=75')
    expect(fooFetch.getCall(4).args[0]).toEqual('skip=100')
    expect(res.length).toEqual(123)
    expect(res).toEqual(Array(123).fill(0).map((e, i) => `item ${i}`))

  })
})
