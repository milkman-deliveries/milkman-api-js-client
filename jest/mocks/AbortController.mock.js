export const mockAbortController = (abort) => (
  jest
    .spyOn(global, 'AbortController')
    .mockImplementation(() => ({
      signal: 'foo signal',
      abort
    }))
)
