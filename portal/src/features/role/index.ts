/*
 * @Author: sds
 * @Date: 2022-01-02 13:47:54
 * @Last Modified by: sun.t
 * @Last Modified time: 2022-11-19 14:16:11
 */
import {LazyLoader} from '@gwaapp/ease';
import i18nJson from './i18n.json';

const component = LazyLoader(() => import('./view'));
export const key = 'role';
export const title = '角色管理';
export const route = {
    key,
    title,
    path: '/role',
    component,
};
export const reducers = {
    // search
    searchKey: {
        initialState: '',
    },
    // table
    listData: {
        initialState: [],
    },
    isListLoading: {
        initialState: false,
    },
    // selectedRows: {
    //   initialState: [],
    // },
    pagination: {
        initialState: {
            current: 1,
            pageSize: 50,
            total: 0,
        },
    },
    // add or edit user
    unlinkedUsers: {
        initialState: [],
    },
    linkedUsers: {
        initialState: [],
    },
    selectTreeData: {
        initialState: [],
    },
    linkedRoles: {
        initialState: [],
    },
    // reset password
    userPassword: {
        initialState: null,
    },
    // permission assignment
    // 资源勾选
    resourceIds: {
        initialState: [],
    },
    // 缓存-菜单分类
    menuResources: {
        initialState: [],
    },
    // 资源-菜单id分类
    menuResourceIds: {
        initialState: [],
    },
    // 资源-选中菜单id
    selectedMenuId: {
        initialState: '',
    },
    // 状态-选中的菜单ids
    selectedMenuIds: {
        initialState: [],
    },
    // 状态-选中的资源ids
    selectedResourceIds: {
        initialState: [],
    },
    // 资源-资源类型
    resourceTypes: {
        initialState: [],
    },
    // 状态-加载状态
    isRoleLoading: {
        initialState: false,
    },
    // 状态-修改状态
    isPermissionEdited: {
        initialState: {
            card: false,
            data: false,
        },
    },
    // 状态-新建状态
    isRecover: {
        initialState: false,
    },
    // 状态-系统列表
    systems: {
        initialState: [],
    },
    // 状态-当前活跃系统
    activeSystem: {
        initialState: null,
    },
    // 状态-当前选中的组织ids
    orgIds: {
        initialState: [],
    },
    // 状态-当前选中的设备ids
    deviceIds: {
        initialState: {},
    },
    // 状态-展开的组织机构树
    expandOrgKeys: {
        initialState: [],
    },
    // 状态-权限范围
    scopes: {
        initialState: [],
    },
    // 状态-获取权限范围
    activeScope: {
        initialState: null,
    },
    // 缓存-产品组织树
    productOrgTree: {
        initialState: [],
    },
    // 状态-选中组织id
    selectedOrgId: {
        initialState: '',
    },
    // 状态-当前设备列表
    devices: {
        initialState: [],
    },
    // 缓存-设备缓存
    devicesCache: {
        initialState: {},
    },
    // 缓存-组织缓存
    orgsCache: {
        initialState: {},
    },
    // // 缓存-当前角色&系统对应勾选组织
    // roleOrgsCache: {
    //   initialState: {},
    // },
    activeKey: {
        initialState: 'function',
    },
    submitData: {
        initialState: {},
    },
    submitStatus: {
        initialState: {},
    },
    // 由于角色下的菜单需要全量的数据，所以页面自身请求，不使用全局数据
    menus: {
        initialState: [],
    },
    flatMenuMapById: {
        initialState: {},
    },
    allSystemList: {
        initialState: [],
    },
    // 角色类型
    roleTypeList: {
        initialState: [],
    },
    // 选择的角色类型
    roleTypeSelectedKey: {
        initialState: '',
    },
    // 当前全量系统列表,不再使用app下的“权限系统列表”
    subSystems: {
        initialState: [],
    },
    // 当前选中的权限记录
    selectedRecord: {
        initialState: {},
    },
    // 用户所有的biId
    bIMSourceIds: {
        initialState: [],
    },
    biMenuSourceDTOS: {
        initialState: [],
    },
};
export const i18n = i18nJson;
export default component;
