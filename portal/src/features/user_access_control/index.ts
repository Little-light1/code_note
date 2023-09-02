import {LazyLoader} from '@gwaapp/ease';
import {PageTitle, PageKey, InitialPageNum, InitialPageSize} from './constant';

const component = LazyLoader(() => import('./view'));
export const key = PageKey;
export const title = PageTitle;
export const route = {
    key,
    path: `/${PageKey}`,
    component,
    title,
    exact: false,
};
export const reducers = {
    // 访问时间控制加载
    timeListLoading: {
        initialState: false,
    },
    // 访问地址控制加载
    addressListLoading: {
        initialState: false,
    },
    // 访问时间控制列表
    timeList: {
        initialState: [],
    },
    // 访问地址控制列表
    addressList: {
        initialState: [],
    },
    // 访问时间控制页码
    timePageNum: {
        initialState: InitialPageNum,
    },
    // 访问时间控制每页数量
    timePageSize: {
        initialState: InitialPageSize,
    },
    // 访问时间控制总数
    timeTotal: {
        initialState: 0,
    },
    // 访问地址控制页码
    addressPageNum: {
        initialState: InitialPageNum,
    },
    // 访问地址控制每页数量
    addressPageSize: {
        initialState: InitialPageSize,
    },
    // 访问地址控制总数
    addressTotal: {
        initialState: 0,
    },
    // 待选择用户
    unSelectedUsersData: {
        initialState: [],
    },
    // 已选择用户
    selectedUsersData: {
        initialState: [],
    },
};

export default component;
