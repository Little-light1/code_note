import {LazyLoader} from '@gwaapp/ease';
import i18nJson from './i18n.json';

const component = LazyLoader(() => import('./view'));
export const key = 'help';
export const title = '帮助中心';
export const route = {
    key,
    title,
    path: '/help',
    component,
    exact: true,
};
export const reducers = {
    currentDoc: {
        initialState: null,
    },
    docMenu: {
        initialState: [],
    },
    edit: {
        initialState: false,
    },
    editTitle: {
        initialState: '',
    },
    openKeys: {
        initialState: [],
    },
    docLoading: {
        initialState: false,
    },
    addModalShow: {
        initialState: false,
    },
    addFormFields: {
        initialState: {
            parentDocID: '',
            title: '',
        },
    },
    attachmentModalShow: {
        initialState: false,
    },
    selectedGroup: {
        initialState: 0,
    },
    selectedDoc: {
        initialState: null,
    },
    selectedFunc: {
        initialState: null,
    },
    searchResultVisible: {
        initialState: false,
    },
    searchResult: {
        initialState: [],
    },
    expandStatus: {
        initialState: {},
    },
    // 菜单的加载状态
    menusLoading: {
        initialState: false,
    },
    // 新建表单
    addFormRef: {
        initialState: null,
    },
    attachmentUploading: {
        initialState: false,
    },
};
export const i18n = i18nJson;
export default component;
