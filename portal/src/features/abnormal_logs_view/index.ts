/*
 * @Author: Tomato.Bei
 * @Date: 2022-08-05 15:34:22
 * @Last Modified by: gongzunbao
 * @Last Modified time: 2023-06-25 11:26:52
 */
import {LazyLoader} from '@gwaapp/ease';
import {getDefaultTime} from './getTime';
import i18nJson from './i18n.json';

const component = LazyLoader(() => import('./view'));
const defaultTime = getDefaultTime.defaultTime();
export const key = 'abnormalLogsView';
export const title = '系统异常日志查看';
export const route = {
    key,
    title,
    path: '/abnormalLogsView',
    component,
    exact: false,
};
export const reducers = {
    listData: {
        initialState: [],
    },
    pagination: {
        initialState: {
            current: 1,
            pageSize: 20,
            total: 0,
        },
    },
    searchCondition: {
        initialState: {},
    },
    isListLoading: {
        initialState: false,
    },
    searchTime: {
        initialState: {
            startTime: defaultTime[0],
            endTime: defaultTime[1],
        },
    },
    changeTime: {
        initialState: {
            startTime: defaultTime[0],
            endTime: defaultTime[1],
        },
    },
    sortType: {
        initialState: {
            condition: 'ORDER_BY_DESC',
            field: 'opnTime',
        },
    },
};
export const i18n = i18nJson;
export default component;
