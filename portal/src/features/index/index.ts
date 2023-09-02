/*
 * @Author: sun.t
 * @Date: 2021-11-02 10:53:15
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2023-04-25 11:01:22
 */
import {LazyLoader} from '@gwaapp/ease';

const component = LazyLoader(() => import('./view'));
export const key = 'index';
export const title = '应用门户首页';
export const route = {
    key,
    title,
    path: '/',
    component,
};
export const reducers = {
    // 侧边栏是否展开折叠
    siderCollapsed: {
        initialState: false,
    },
    // 侧边栏是否固定空间
    siderFixed: {
        initialState: false,
    },
    // 头部是否隐藏
    headerVisible: {
        initialState: true,
    },
    // 当前菜单类型
    menuResourceType: {
        initialState: 'normal',
    },
    quicklyMenus: {
        initialState: [],
    },
    noticeNum: {
        initialState: 0,
    },
    noticeClock: {
        initialState: null,
    },
    // 应用告警数量，跳转地址
    alarmProductNums: {
        initialState: [],
    },
    systemVersionInfo: {
        initialState: [],
    },
    // 是否显示app
    appVisible: {
        initialState: false,
    },
    appData: {
        initialState: [
            {
                id: 1,
                dconfigCode: 'AAPP_Android_APP',
                name: 'Android版下载的二维码图片',
                url: null,
                dconfigValue: '',
                version: '',
                pushDate: '',
                isOn: false,
            },
            {
                id: 2,
                dconfigCode: 'AAPP_IOS_APP',
                name: 'iPhone版下载的二维码图片',
                url: null,
                dconfigValue: '',
                version: '',
                pushDate: '',
                isOn: false,
            },
        ],
    },
};
export default component;
export const async = false;
