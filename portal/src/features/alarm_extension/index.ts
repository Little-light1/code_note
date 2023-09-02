/*
 * @Author: shimmer
 * @Date: 2022-05-11 16:55:08
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-09-07 09:25:02
 *
 */
import {LazyLoader} from '@gwaapp/ease';
import i18nJson from './i18n.json';

const component = LazyLoader(() => import('./view'));
export const key = 'alarmExtension';
export const title = '告警扩展配置';
export const route = {
    key,
    title,
    path: '/alarmExtension',
    component,
    exact: false,
};
export const reducers = {
    alarmProductConfig: {
        initialState: [],
    },
    alarmFakeData: {
        initialState: [],
    },
    isLoading: {
        initialState: false,
    },
};
export const i18n = i18nJson;
export default component;
