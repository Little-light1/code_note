/*
 * @Author: gxn
 * @Date: 2022-04-04 17:17:44
 * @LastEditors: gxn
 * @LastEditTime: 2022-04-08 16:53:05
 * @Description: file content
 */
import request, {prefix} from '../common'; // 获取通知列表

export const getWaitDealPage = (args = {}) =>
    request<any[]>({
        url: prefix('/aapp/task/query'),
        method: 'post',
        ...args,
    });
