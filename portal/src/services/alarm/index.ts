/*
 * @Author: zhangzhen
 * @Date: 2022-07-25 09:10:38
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-07-27 17:03:21
 *
 */
import request, {prefix} from '../common'; // 告警详情查看

export const getAlarmDetail = <T>(data: any) =>
    request<T>({
        url: prefix(`/aappNotice/${data.noticeId}`),
        method: 'get',
    }); // 获取告警总数

export const getAlarmTotalCount = () =>
    request({
        url: prefix('/aappNotice/getNoticeNums'),
        method: 'get',
    }); // 获取 应用，应用告警跳转地址，数量

export const getAlarmProductNums = () =>
    request({
        url: prefix('/aappNotice/getProductNoticeNums'),
        method: 'get',
    }); // 获取告警列表

export const getAlarmList = <T>(data: any) =>
    request<T>({
        url: prefix('/aappNotice/page'),
        method: 'post',
        data,
    }); // 应用告警配置

export const setAlarmProductConfig = (data: {}) =>
    request({
        url: prefix('/aappNotice/noticeConfig'),
        method: 'post',
        data,
    }); // 获取应用告警配置

export const getAlarmProductConfig = () =>
    request<any[]>({
        url: prefix('/aappNotice/noticeConfig'),
        method: 'get',
    }); // 告警处理

export const alarmDeal = (data: {}) =>
    request<boolean>({
        url: prefix('/aappNotice/deal'),
        method: 'post',
        data,
    });
