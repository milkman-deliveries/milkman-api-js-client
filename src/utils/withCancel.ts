export const withCancel = async <T>(promise: Promise<T>, controller: AbortController) => {
  // @ts-ignore
  promise.cancel = () => controller.abort()
  return promise
}
