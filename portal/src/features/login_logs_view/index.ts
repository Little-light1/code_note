/*
 * @Author: Tomato.Bei
 * @Date: 2022-08-05 15:35:31
 * @Last Modified by: Tomato.Bei
 * @Last Modified time: 2022-08-12 13:13:23
 */
import {LazyLoader} from '@gwaapp/ease';
import {getDefaultTime} from './getTime';
import i18nJson from './i18n.json';

const component = LazyLoader(() => import('./view'));
const defaultTime = getDefaultTime.defaultTime();
export const key = 'loginLogsView';
export const title = '登录日志查看';
export const route = {
    key,
    title,
    path: '/loginLogsView',
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
            loginUser: '',
            loginType: '',
            loginName: '',
            loginIp: '',
            loginStatus: '',
        },
    },
    changeTime: {
        initialState: {
            startTime: defaultTime[0],
            endTime: defaultTime[1],
        },
    },
    searchTime: {
        initialState: {
            startTime: defaultTime[0],
            endTime: defaultTime[1],
        },
    },
    sortType: {
        initialState: {
            condition: 'ORDER_BY_DESC',
            field: 'loginTime',
        },
    },
    isListLoading: {
        initialState: false,
    },
};
export const i18n = i18nJson;
export default component;
