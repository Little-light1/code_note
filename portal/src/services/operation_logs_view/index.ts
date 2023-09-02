/*
 * @Author: Tomato.Bei
 * @Date: 2022-09-06 17:07:21
 * @Last Modified by:   Tomato.Bei
 * @Last Modified time: 2022-09-06 17:07:21
 */
import request, {prefix} from '../common';

export const getOpnLog = (data: object) =>
    request<any>({
        url: prefix('/aapp/log/getOpnLog'),
        method: 'post',
        data,
    });
export const getlogExcel = (data: any) =>
    request<any>({
        url: prefix('/aapp/log/exportOpnLog'),
        method: 'post',
        responseType: 'blob',
        data,
    });
export const saveBatchOpnLog = (data: any) =>
    request<any>({
        url: prefix('/aapp/log/saveBatchOpnLog'),
        method: 'post',
        data,
        showError: false,
    });
