/*
 * @Author: zhangzhen
 * @Date: 2022-09-26 13:26:52
 * @LastEditors: gxn
 * @LastEditTime: 2023-03-02 15:28:12
 *
 */
import {Key} from 'react';
import request, {prefix} from '../common';
import fetchMenuTreeMock from './mock/fetchMenuTree.mock.json';
import fetchUserAllBiMenuSourceMock from './mock/fetchUserAllBiMenuSource.mock.json';
import fetchUserMenuSourceMock from './mock/fetchUserMenuSource.mock.json';
import fetchMenusMock from './mock/fetchMenus.json';

// 获取权限卡片资源
export const fetchUserAllBiMenuSource = (params: {
    menuId?: number;
    userId: string;
}) =>
    request({
        url: prefix('/biMenuSource/getUserAllBiMenuSource'),
        method: 'post',
        params,
        mock: [200, fetchUserAllBiMenuSourceMock],
    });

// 获取用户页面资源信息
export const fetchUserMenuSource = (params: {
    menuId?: number;
    userId: string;
}) =>
    request({
        url: prefix('/menuManager/getUserAllMenuSource'),
        method: 'post',
        params,
        mock: [200, fetchUserMenuSourceMock],
    });

// 获取授权菜单菜单树(isShowDisabled 是否展示被禁用的菜单)
export const fetchMenuTree = (isShowDisabled = 1) =>
    request({
        url: prefix('/AuthorProduct/getUserProductMenuTree'),
        method: 'post',
        mock: [200, fetchMenuTreeMock],
        params: {
            isDisable: isShowDisabled,
        },
        // mockType: 'Mock',
    });

// 获取所有授权菜单菜单树(isShowDisabled 是否展示被禁用的菜单)
export const fetchAuthMenuTree = (isShowDisabled = 1) =>
    request({
        url: prefix('/AuthorProduct/getAuthUserProductMenuTree'),
        method: 'post',
        mock: [200, fetchMenuTreeMock],
        params: {
            isDisable: isShowDisabled,
        },
        // mockType: 'Mock',
    });

// 获取授权菜单扁平树
export const fetchMenus = () =>
    request({
        url: prefix('/AuthorProduct/getUserProductMenuDTOS'),
        method: 'post',
        mock: [200, fetchMenusMock],
        // mockType: 'Mock',
    });

// 获取当前用户全量组织机构
// export const fetchUserOrgTree = (params: {productCode: string; userId: string}) =>
//   request({
//     url: prefix(`/aapp/organization/getUserOrgTreeVO`),
//     method: 'get',
//     params,
//   });

// 获取当前用户全量组织机构
export const fetchUserOrgTree = (params: {proCode: string}) =>
    request({
        url: prefix(`/aappauthor/org/getUserRightFullOrgTreeVO`),
        method: 'post',
        params,
    });

// 根据菜单ID获取页面资源(全量，无权限)
export const fetchMenuResourceByMenuId = (params: {menuId: Key}) =>
    request({
        url: prefix('/menuManager/getMenuSourceDTOSByMId'),
        method: 'post',
        params,
        mock: [200, {}],
    });

// 根据菜单ID获取BI资源
export const fetchBiResourceByMenuId = (params: {
    menuId: Key;
    userId: string;
}) =>
    request({
        url: prefix('/biMenuSource/getUserBiMenuSourceList'),
        method: 'post',
        params,
        mock: [200, {}],
    });

// 获取集成三方系统地址
export const getOtherSystemUrl = (data: {}) =>
    request({
        url: prefix('/sso/get'),
        method: 'post',
        ...data,
    });
// 根据菜单id 和登陆用户 userid 获取 当前菜单 有权限的 菜单资源和Bi菜单资源
export const getMenuSourceByMenuRole = (params: Object) =>
    request<any>({
        url: prefix('/menuManager/getMenuSourceByMenuRole'),
        method: 'post',
        params,
    });
