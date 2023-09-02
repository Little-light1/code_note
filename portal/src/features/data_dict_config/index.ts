import {LazyLoader} from '@gwaapp/ease';
import i18nJson from './i18n.json';

const component = LazyLoader(() => import('./view'));
export const key = 'dataDictConfig';
export const title = '数据字典配置';
export const route = {
    key,
    title,
    path: '/dataDictConfig',
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
};
export const i18n = i18nJson;
export default component;
