import request, {prefix} from '../common'; // import {CreateMenuDTO} from './types';

import addMenuMock from './mock/addMenu.mock.json';
import fetchResourceByMenuIdMock from './mock/fetchResourceByMenuId.mock.json'; // 根据产品获取菜单

//  列表数据获取   产品管理--添加aapp应用实例
export const getProductListByPage = (data: any) =>
    request({
        url: prefix('/aappauthor/product/getProductListByPage'),
        method: 'post',
        data,
    });

export const fetchMenuByProdCode = (prdCode: string, userId: string) =>
    request({
        url: prefix('/menuManager/getUserMenuTreeVOByPrdCode'),
        method: 'post',
        params: {
            prdCode,
            userId,
        },
        mock: [200, addMenuMock],
    }); // 根据菜单获取资源

export const fetchResourceByMenuId = (menuId: string, userId: string) =>
    request({
        url: prefix('/menuManager/getUserMenuSource'),
        method: 'post',
        params: {
            menuId,
            userId,
        },
        mock: [200, fetchResourceByMenuIdMock],
    }); // 查询全量菜单树
// 删除菜单

export const fetchDeleteMenu = (menuId?: string) =>
    request({
        url: prefix('/menuManager/logicDelMenuDTO'),
        method: 'post',
        params: {
            menuId,
        },
        mock: [200, addMenuMock],
    }); // 创建菜单

export const fetchAddMenu = (submitParams: any = {}) =>
    request({
        url: prefix('/menuManager/insertMenuDTO'),
        method: 'post',
        data: submitParams,
        mock: [200, addMenuMock],
    }); // 更新菜单

export const fetchUpdateMenu = (submitParams: any = {}) =>
    request({
        url: prefix('/menuManager/updateMenuDTO'),
        method: 'post',
        data: submitParams,
        mock: [200, addMenuMock],
    }); // 新增菜单下资源

export const fetchAddResource = (submitParams: any = {}) =>
    request({
        url: prefix('/menuManager/addMenuSourceDTO'),
        method: 'post',
        data: submitParams,
        mock: [200, addMenuMock],
    }); // 更新菜单下资源

export const fetchUpdateResource = (submitParams: any = {}) =>
    request({
        url: prefix('/menuManager/updateMenuSourceDTO'),
        method: 'post',
        data: submitParams,
        mock: [200, addMenuMock],
    }); // 删除菜单下资源

export const fetchDeleteResource = (mSourceId?: string) =>
    request({
        url: prefix('/menuManager/logicDelMenuSourceDTO'),
        method: 'post',
        params: {
            mSourceId,
        },
        mock: [200, addMenuMock],
    });
