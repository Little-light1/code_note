/*
 * @Author: gxn
 * @Date: 2022-03-26 11:37:37
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-12-01 15:02:27
 * @Description:infoModelConfig index
 */
import {LazyLoader} from '@gwaapp/ease';

const component = LazyLoader(() => import('./view'));
export const key = 'infoModelEntry';
export const title = '词条管理(2.0)';
export const route = {
    key,
    title,
    path: '/infoModelEntry',
    component,
    exact: false,
};
export const reducers = {};
export default component;
