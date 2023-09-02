/*
 * @Author: Tomato.Bei
 * @Date: 2022-10-08 14:38:18
 * @Last Modified by: Tomato.Bei
 * @Last Modified time: 2022-10-08 15:24:22
 * @Des: 运管中心首页-行为
 */
import {AppThunk} from '@/app/runtime';
import {getOtherSystemUrl} from '@/services/resource';
import {openNewTag} from '@/common/utils/openNewTag';

/**
 * 系统变化
 * @param code 系统编码
 * @returns
 */
export const changeSystem =
    (code: string): AppThunk =>
    (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {menus, subSystems} = getPageState(getState(), 'app');
        const actions = getPageSimpleActions('app');
        const foundSystemMenuObject = menus.find(
            (menu: any) => menu.code === code,
        );
        const foundSystem = subSystems.find(
            (system: any) => system.code === code,
        );

        if (foundSystem && foundSystemMenuObject) {
            const currentMenus = foundSystemMenuObject.children || [];
            const state = {currentSubSystem: foundSystem, currentMenus};

            dispatch(actions.set(state));
        }
    };

/**
 * 获取第三方产品地址
 * @param productId 产品id
 * @returns
 */
export const getOtherSystemUrlFun =
    (productId: string): AppThunk =>
    async () => {
        const SUCCESS_CODE = '200';
        const {code, data} = await getOtherSystemUrl({data: {productId}});

        if (data && code === SUCCESS_CODE) {
            const {url, param, language, urlEncode} = data as any;

            openNewTag(url, param, language, urlEncode);
        }
    };
