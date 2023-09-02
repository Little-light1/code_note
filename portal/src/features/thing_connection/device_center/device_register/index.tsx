/*
 * @Author: gxn
 * @Date: 2022-03-26 11:37:37
 * @LastEditors: gxn
 * @LastEditTime: 2022-03-31 14:23:41
 * @Description:deviceRegister index
 */
import {LazyLoader} from '@gwaapp/ease';

const component = LazyLoader(() => import('./view'));
export const key = 'deviceRegister';
export const title = '电场设备注册';
export const route = {
    key,
    title,
    path: '/deviceRegister',
    component,
    exact: false,
};
export const reducers = {};
export default component;
