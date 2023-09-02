/*
 * @Author: gxn
 * @Date: 2022-03-26 11:37:37
 * @LastEditors: gxn
 * @LastEditTime: 2022-03-26 14:46:57
 * @Description:connectionManage index
 */
import {LazyLoader} from '@gwaapp/ease';

const component = LazyLoader(() => import('./view'));
export const key = 'connectionManage';
export const title = '连接管理';
export const route = {
    key,
    title,
    path: '/connectionManage',
    component,
    exact: false,
};
export const reducers = {};
export default component;
