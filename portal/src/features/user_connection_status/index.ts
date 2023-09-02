import {LazyLoader} from '@gwaapp/ease';
import {ConnectionStatus} from './types';
import {InitialPageNum, InitialPageSize, PageKey, PageTitle} from './constants';

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
    // 获取的所属组织机构
    orgList: {
        initialState: [],
    },
    // form 表单的选择的组织机构 ID
    orgId: {
        initialState: null,
    },
    // form 表单的用户账号显示
    userAccount: {
        initialState: '',
    },
    // form 表单的用户名称显示
    username: {
        initialState: '',
    },
    // form 表单的连接状态显示
    connectionStatus: {
        initialState: ConnectionStatus.All,
    },
    // 实际查询记录的form表单数据
    queryFormValues: {
        initialState: {},
    },
    // table 当前页数据源
    listData: {
        initialState: [],
    },
    // 页码
    pageNum: {
        initialState: InitialPageNum,
    },
    // 每页数量
    pageSize: {
        initialState: InitialPageSize,
    },
    // 加载数据总数
    total: {
        initialState: 0,
    },
    // 是否需要重置定时器
    canResetTimer: {
        initialState: false,
    },
    listLoading: {
        initialState: false,
    },
};

export default component;
