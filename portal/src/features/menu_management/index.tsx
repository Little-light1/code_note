import {LazyLoader} from '@gwaapp/ease';
import i18nJson from './i18n.json';

const component = LazyLoader(() => import('./view'));
export const key = 'menuManagement';
export const title = '菜单管理';
export const route = {
    key,
    title,
    path: '/menuManagement',
    component,
    exact: false,
};
export const reducers = {
    // 有权限的非第三方应用列表
    authProductList: {
        initialState: [],
    },

    tableDataSource: {
        initialState: [],
    },
    menuTree: {
        initialState: [],
    },
    editMenuTree: {
        initialState: [],
    },
    flatMenuTree: {
        initialState: {},
    },
    currentTabKey: {
        initialState: '',
    },
    isLoading: {
        initialState: false,
    },
    currentMenu: {
        initialState: null,
    },
    resourceTypes: {
        initialState: [],
    },
    resourceTableDataSource: {
        initialState: [],
    },
    // 菜单类型数据源
    menuTypes: {
        initialState: [],
    },
    // 菜单打开类型数据源，内部、外部
    targetTypes: {
        initialState: [],
    },
};
export const i18n = i18nJson;
export default component;
