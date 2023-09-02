import {LazyLoader} from '@gwaapp/ease';
import i18nJson from './i18n.json';

const component = LazyLoader(() => import('./view'));
export const key = 'account';
export const title = '企业账户管理';
export const route = {
    key,
    title,
    path: '/account',
    component,
    exact: false,
};
export const reducers = {
    // 查询name保存
    searchName: {
        initialState: '',
    },
    pageSize: {
        initialState: 20,
    },
    page: {
        initialState: 1,
    },
    tableDataSource: {
        initialState: [],
    },
    total: {
        initialState: 1,
    },
    isTableLoading: {
        initialState: false,
    },
    appServiceData: {
        initialState: [],
    },
};
export const i18n = i18nJson;
export default component;
