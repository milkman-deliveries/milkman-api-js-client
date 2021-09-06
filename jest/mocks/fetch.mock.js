const identityFn = (...args) => args

export const mockFetch = (implementation = identityFn) => (
  jest
    .spyOn(global, 'fetch')
    .mockImplementation((...args) => (
      Promise.resolve(implementation(...args))
    ))
)
