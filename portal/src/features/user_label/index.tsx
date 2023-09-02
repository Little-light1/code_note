/*
 * @Author: zhangzhen
 * @Date: 2022-08-08 08:38:38
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-08-08 09:29:31
 *
 */
import {LazyLoader} from '@gwaapp/ease';
import i18nJson from './i18n.json';

const component = LazyLoader(() => import('./view'));
export const key = 'userLabel';
export const title = '用户标签管理';
export const route = {
    key,
    path: '/userLabel',
    component,
    title,
    exact: false,
};
export const reducers = {
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
    selectedOrgKeys: {
        initialState: [],
    },
    // 树选择
    userTableDataSource: {
        initialState: [],
    },
    // 列表数据源
    usersInOrgs: {
        initialState: [],
    },
    checkedKeys: {
        initialState: [],
    },
    selectedKeys: {
        initialState: [],
    },
    // 新增编辑类型
    newType: {
        initialState: '',
    },
    // 编辑右侧列表已选的value数据
    userData: {
        initialState: [],
    },
};
export const i18n = i18nJson;
export default component;
