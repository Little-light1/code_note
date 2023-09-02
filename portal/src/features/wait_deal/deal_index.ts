/*
 * @Author: gxn
 * @Date: 2022-04-02 10:51:27
 * @LastEditors: gxn
 * @LastEditTime: 2022-04-30 13:32:47
 * @Description: noticeCenter Index
 */
import {LazyLoader} from '@gwaapp/ease';
import i18nJson from './i18n.json';

const component = LazyLoader(() => import('./view'));
export const key = 'waitDealHistory';
export const title = '已办任务';
export const route = {
    key,
    title,
    path: '/waitDealHistory',
    component,
    exact: true,
};
export const reducers = {
    dictTypeTree: {
        initialState: [],
    },
    dictTypeMap: {
        initialState: {},
    },
    dictTypeMapById: {
        initialState: {},
    },
    dictDataMapById: {
        initialState: {},
    },
    loading: {
        initialState: false,
    },
    expandedTreeKeys: {
        initialState: [],
    },
    selectedTreeNode: {
        initialState: null,
    },
    tableDataSource: {
        initialState: [],
    },
    isTableLoading: {
        initialState: false,
    },
    selectedRowKeys: {
        initialState: [],
    },
    pagination: {
        initialState: {
            pageNumber: 1,
            pageSize: 20,
            total: 0,
        },
    },
    searchParams: {
        initialState: {
            proCode: '',
            status: '1',
        },
    },
    noticeTypeList: {
        initialState: [],
    },
    waitDealTypeList: {
        initialState: [],
    },
};
export const i18n = i18nJson;
export default component;
