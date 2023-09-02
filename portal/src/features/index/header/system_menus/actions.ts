/*
 * @Author: zhangzhen
 * @Date: 2022-09-26 13:26:54
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-12-06 15:42:39
 *
 */
import {AppThunk} from '@/app/runtime';
import {getOtherSystemUrl} from '@/services/resource';
import {openNewTag} from '@/common/utils/openNewTag';

/**
 * 系统变化
 * @param key 系统id
 * @returns
 */
export const changeSystem =
    (key: string): AppThunk =>
    (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {menus, subSystems} = getPageState(getState(), 'app');

        const actions = getPageSimpleActions('app');

        const foundSystemMenuObject = menus.find(
            (menu: any) => menu.code === key,
        );

        const foundSystem = subSystems.find(
            (system: any) => system.code === key,
        );

        if (foundSystem && foundSystemMenuObject) {
            const currentMenus = foundSystemMenuObject.children || [];
            const state = {currentSubSystem: foundSystem, currentMenus};

            dispatch(actions.set(state));
        }
    };

// 获取第三方应用地址
export const getOtherSystemUrlFun =
    (productId: string): AppThunk =>
    async () => {
        const {code, data} = await getOtherSystemUrl({data: {productId}});
        if (data && code === '200') {
            const {url, param, urlEncode, language} = data as any;
            openNewTag(url, param, language, urlEncode);
        }
    };
