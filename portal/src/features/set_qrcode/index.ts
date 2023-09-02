/*
 * @Author: shimmer
 * @Date: 2022-05-11 16:55:08
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-07-29 10:49:55
 *
 */
import {LazyLoader} from '@gwaapp/ease';
const component = LazyLoader(() => import('./view'));
export const key = 'setQrcode';
export const title = '二维码图片配置';
export const route = {
    key,
    title,
    path: '/setQrcode',
    component,
    exact: false,
};
export const reducers = {
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
    uploadBtnLoading: {
        initialState: false,
    },
    clearBtnLoading: {
        initialState: false,
    },
    saveBtnLoading: {
        initialState: false,
    },
    spining: {
        initialState: false,
    },
};
export const i18n = {
    zh: {},
    en: {},
};
export default component;
