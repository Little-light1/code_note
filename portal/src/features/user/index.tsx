/*
 * @Author: sds
 * @Date: 2021-12-01 15:41:06
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2023-06-26 10:03:46
 */
import {LazyLoader} from '@gwaapp/ease';
import i18nJson from './i18n.json';

const component = LazyLoader(() => import('./view'));
export const key = 'user';
export const title = '用户管理';
export const route = {
    key,
    title,
    path: '/user',
    component,
    exact: true, // auth: false,
};
export const reducers = {
    // search
    searchKey: {
        initialState: '',
    },
    timeLimitKey: {
        initialState: null,
    },
    userStateKey: {
        initialState: null,
    },
    // tree
    isTreeLoading: {
        initialState: false,
    },
    treeData: {
        initialState: [],
    },
    totalTree: {
        initialState: [],
    },
    selectedKeys: {
        initialState: [],
    },
    expandedKeys: {
        initialState: [],
    },
    // table
    selectedRowKeys: {
        initialState: [],
    },
    selectedRows: {
        initialState: [],
    },
    current: {
        initialState: 1,
    },
    pageSize: {
        initialState: 20,
    },
    update: {
        // value 变化就更新
        initialState: false,
    },
    // add or edit user
    allRoleList: {
        initialState: [],
    },
    allLabelList: {
        initialState: [],
    },
    selectTreeData: {
        initialState: [],
    },
    linkedRoles: {
        initialState: [],
    },
    roleTypeList: {
        initialState: [],
    },
    // reset password
    userPassword: {
        initialState: null,
    },
    isIDCardIsRequired: {
        initialState: false,
    },
};
export const i18n = i18nJson;
export default component;
