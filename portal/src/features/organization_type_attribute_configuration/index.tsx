import {LazyLoader} from '@gwaapp/ease';
import i18nJson from './i18n.json';

const component = LazyLoader(() => import('./view'));
export const key = 'organizationTypeConfiguration';
export const title = '机构类型属性配置管理';
export const route = {
    key,
    path: '/organizationTypeConfiguration',
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
    total: {
        initialState: 0,
    },
    pageSizeDef: {
        initialState: 20,
    },
    pageDef: {
        initialState: 1,
    },
    totalDef: {
        initialState: 0,
    },
    isTableLoading: {
        initialState: false,
    },
    // 左侧模板列表数据获取
    templateList: {
        initialState: [],
    },
    // 根据点击项id获取组织模板列表数据
    topListSource: {
        initialState: [],
    },
    bottomListSource: {
        initialState: [],
    },
    // 复选框勾选
    selectedRowKeys: {
        initialState: [],
    },
    // 选则的模板id
    selectedTemplateId: {
        initialState: '',
    },
    // 添加框架弹框下拉菜单类型数据
    typeDataList: {
        initialState: [],
    },
    // 下拉框- 控件类型数据
    typeControlList: {
        initialState: [],
    },
    // 当前登录的租户
    enterpriseID: {
        initialState: '',
    },
};
export const i18n = i18nJson;
export default component;
