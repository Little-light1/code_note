/*
 * @Author: gxn
 * @Date: 2022-03-26 11:37:37
 * @LastEditors: gxn
 * @LastEditTime: 2022-03-26 14:46:57
 * @Description:infoModelConfig index
 */
import {LazyLoader} from '@gwaapp/ease';

const component = LazyLoader(() => import('./view'));
export const key = 'infoModelConfig';
export const title = '信息模型管理';
export const route = {
    key,
    title,
    path: '/infoModelConfig',
    component,
    exact: false,
};
export const reducers = {};
export default component;
