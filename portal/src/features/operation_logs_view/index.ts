/*
 * @Author: Tomato.Bei
 * @Date: 2022-08-05 15:32:00
 * @Last Modified by: sun.t
 * @Last Modified time: 2022-08-09 09:30:24
 */
import {LazyLoader} from '@gwaapp/ease';
import {getDefaultTime} from './getTime';
import i18nJson from './i18n.json';

const component = LazyLoader(() => import('./view'));
const defaultTime = getDefaultTime.defaultTime();
export const key = 'operationLogsView';
export const title = '操作日志查看';
export const route = {
    key,
    title,
    path: '/operationLogsView',
    component,
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
        initialState: {
            busiType: '',
            opnBehavior: '',
        },
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
    busiTypeList: {
        initialState: [],
    },
    opnBehaviorList: {
        initialState: [],
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
