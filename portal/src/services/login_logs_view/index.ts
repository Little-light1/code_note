/*
 * @Author: Tomato.Bei
 * @Date: 2022-09-06 17:07:06
 * @Last Modified by:   Tomato.Bei
 * @Last Modified time: 2022-09-06 17:07:06
 */
import request, {prefix} from '../common';

export const getLoginLogList = (data: object) =>
    request<any>({
        url: prefix('/aapp/log/getLoginLog'),
        method: 'post',
        data,
    });
export const getlogExcel = (data: any) =>
    request<any>({
        url: prefix('/aapp/log/exportLoginLog'),
        method: 'post',
        responseType: 'blob',
        data,
    });
