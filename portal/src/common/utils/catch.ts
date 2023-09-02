type ErrorCapturedReturn<ReturnType> = [any | null, ReturnType];
/**
 * try..catch优化
 * @param asyncFunc
 * @returns
 */

export async function errorCaptured<ReturnType>(asyncFunc: () => Promise<ErrorCapturedReturn<ReturnType>>) {
  try {
    const response = await asyncFunc();
    return [null, response];
  } catch (e) {
    return [e, null];
  }
}