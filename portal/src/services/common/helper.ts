import { notification } from 'antd';
import { AxiosResponse } from 'axios';
import { StandardResponse } from './types';
type ErrorCapturedReturn<ReturnType> = [any | null, ReturnType | undefined | null, StandardResponse<ReturnType> | null];
/**
 * try..catch优化
 * @param asyncFunc
 * @returns
 */

export async function errorFetchCaptured<ReturnType = any>(asyncFunc: () => Promise<AxiosResponse<StandardResponse<ReturnType>>>, name = '', showError = true): Promise<ErrorCapturedReturn<ReturnType>> {
  try {
    const response = await asyncFunc();
    const {
      data: axiosData
    } = response;
    const {
      code,
      msg,
      data
    } = axiosData;

    if (code === '200') {
      return [null, data, axiosData];
    }

    if (showError) {
      notification.error({
        message: `业务出错:${name}`,
        description: msg || ''
      });
    }

    return [msg, data, axiosData];
  } catch (e) {
    return [e, null, null];
  }
}