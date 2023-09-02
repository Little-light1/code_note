/*
 * @Author: Tomato.Bei
 * @Date: 2022-09-06 17:06:50
 * @Last Modified by:   Tomato.Bei
 * @Last Modified time: 2022-09-06 17:06:50
 */
import request, {prefix} from '../common';

export const getAbnormalLogList = (data: object) =>
    request<any>({
        url: prefix('/aapp/log/getExcLog'),
        method: 'post',
        data,
    });
export const getlogExcel = (data: any) =>
    request<any>({
        url: prefix('/aapp/log/exportExcLog'),
        method: 'post',
        responseType: 'blob',
        data,
    });
export const logUnAuthError = (url: string) =>
    request<any>({
        url: prefix('/aapp/log/unAuth'),
        method: 'get',
        params: {
            url,
        },
    });
