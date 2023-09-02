/*
 * @Author: zhangzhen
 * @Date: 2022-07-04 11:04:14
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-11-23 14:27:45
 *
 */
import {t} from 'i18next';
import moment from 'moment';

export const lastMonth = [
    moment().startOf('month').subtract(1, 'month'),
    moment().startOf('month').subtract(1, 'day'),
];
export const thisMonth = [moment().startOf('month'), moment()];
export const alarmDetail = [
    {
        name: t('告警内容'),
    },
    {
        name: t('告警对象名称'),
    },
    {
        name: t('告警类型'),
    },
    {
        name: t('告警等级'),
    },
    {
        name: t('告警产生时间'),
    },
    {
        name: t('告警原因'),
    },
]; // GE大于等于，LE小于等于 EQ等于
// 查询参数内容

export const formSubmitCondition = [
    {
        condition: 'LIKE',
        field: 'noticeContent',
        value: '',
    },
    {
        condition: 'EQ',
        field: 'noticeType',
        value: '',
    },
    {
        condition: 'GE',
        field: 'createTime',
    },
    {
        condition: 'LE',
        field: 'createTime',
        value: '',
    },
    {
        condition: 'EQ',
        field: 'noticeLevel',
        value: '',
    },
];
