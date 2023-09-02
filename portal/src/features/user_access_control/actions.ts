import {AppThunk} from '@/app/runtime';
import {PageProps} from '@gwaapp/ease';
import * as controlServices from '@services/user_access_control';
import {getAddressList} from './address_control/actions';
import {getTimeList} from './time_control/actions';
/**
 * 当前登录用户待选有权限的用户列表
 * @param props
 * @returns
 */

export const getUserListEx =
    (props: PageProps, userIds: string[]): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const params = {
            proCode: 'OC',
        };
        const pageData = {
            userIds,
        };
        const {code, data} = await controlServices.getUserListEx(
            params,
            pageData,
        );

        if (code === '200') {
            dispatch(
                actions.set({
                    unSelectedUsersData: data || [],
                }),
            );
        }
    };
/**
 * 当前登录用户已选择用户列表
 * @param props
 * @returns
 */

export const getUserList =
    (props: PageProps, userIds: string[]): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {code, data} = await controlServices.getUserListByIds(userIds);

        if (code === '200') {
            dispatch(
                actions.set({
                    selectedUsersData: data || [],
                }),
            );
        }
    };
/**
 * 页面初始化
 * @param props
 * @returns
 */

export const onInit =
    (props: PageProps): AppThunk =>
    (dispatch) => {
        dispatch(getTimeList(props));
        dispatch(getAddressList(props));
    };
