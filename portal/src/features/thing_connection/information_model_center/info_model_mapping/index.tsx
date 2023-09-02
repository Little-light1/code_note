/*
 * @Author: gxn
 * @Date: 2022-03-26 11:37:37
 * @LastEditors: gxn
 * @LastEditTime: 2022-03-26 14:46:57
 * @Description:infoModelMapping index
 */
import {LazyLoader} from '@gwaapp/ease';

const component = LazyLoader(() => import('./view'));
export const key = 'infoModelMapping';
export const title = '信息模型字典';
export const route = {
    key,
    title,
    path: '/infoModelMapping',
    component,
    exact: false,
};
export const reducers = {
    jumpPageToken: {
        initialState: '',
    },
};
export default component;
