/*
 * @Author: shimmer
 * @Date: 2022-05-25 08:52:15
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-09-19 10:28:18
 * @Description:
 *
 */
import {LazyLoader} from '@gwaapp/ease';
import i18nJson from './i18n.json';

const component = LazyLoader(() => import('./view'));
export const key = 'login';
export const title = '登陆';
export const route = {
    key,
    title,
    path: '/login',
    component,
    auth: false,
};
export const reducers = {
    login: {
        initialState: {
            response: {},
        },
    },
    code: {
        initialState: '',
    },
    codeSession: {
        initialState: '',
    },
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
export const i18n = i18nJson;
export default component;
export const async = false;
