/*
 * @Author: gxn
 * @Date: 2022-03-26 11:37:37
 * @LastEditors: gxn
 * @LastEditTime: 2022-03-31 10:49:22
 * @Description:deviceRegister index
 */
import {LazyLoader} from '@gwaapp/ease';

const component = LazyLoader(() => import('./view'));
export const key = 'connectorRegister';
export const title = '接入器注册';
export const route = {
    key,
    title,
    path: '/connectorRegister',
    component,
    exact: false,
};
export const reducers = {};
export default component;
