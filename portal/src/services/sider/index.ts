/*
 * @Author: gxn
 * @Date: 2022-04-05 14:27:57
 * @LastEditors: gxn
 * @LastEditTime: 2022-04-12 14:44:33
 * @Description: siderService
 */
import request, {prefix} from '../common'; // import {LoginProps, LoginResponseData} from './types';
// import loginMock from './mock/login.mock.json';
// import checkTokenMock from './mock/checkToken.mock.json';
// 增加快捷菜单

export const addShortcutMenuDTO = (values: any) =>
    request<any>({
        url: prefix('/shortcutMenuManager/addShortcutMenuDTO'),
        method: 'post',
        data: values,
    }); // 删除快捷菜单

export const delShortcutMenuDTO = (values: any) =>
    request<any>({
        url: prefix('/shortcutMenuManager/delShortcutMenuDTO'),
        method: 'post',
        params: values,
    }); // 获取当前用户快捷菜单

export const getShortcutMenuDTOByUserId = (params: {userId: string}) =>
    request({
        url: prefix('/shortcutMenuManager/getProductSCMenuVOByUserId'),
        method: 'post',
        params,
    });
