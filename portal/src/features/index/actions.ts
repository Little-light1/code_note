/*
 * @Author: sun.t
 * @Date: 2021-12-14 17:10:18
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2023-03-Tu 01:42:30
 */
import {i18nIns} from '@/app/i18n';
import {AppThunk} from '@/app/runtime';
import {
    addShortcutMenuDTO,
    delShortcutMenuDTO,
    getShortcutMenuDTOByUserId,
} from '@services/sider';
import {getAlarmProductNums} from '@/services/alarm';
import {
    changePassWord,
    updateSingleUser,
    updateSingleUserInfo,
} from '@/services/user';
import {getSystemVersionInfo, thunkGetEnv} from '@/services/systemVersion';
import {message} from 'antd';
import {encryptionPassword} from '@/common/utils/encryption';
import {APPLICATION} from '@common/constant';
import {getAppInfo, dealAppData} from '../login/actions';
import {route as setQrcodeRoute} from '../set_qrcode/index';

const {t} = i18nIns;

export const thunkGetShortcutMenuDTOByUserId =
    (): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const actions = getPageSimpleActions('index');
        const {userInfo} = getPageState(getState(), 'app');
        const {code, data} = await getShortcutMenuDTOByUserId({
            userId: userInfo.id,
        });

        if (code === '200') {
            const quicklyMenus: any[] = [];
            data.forEach((item: any) => {
                if (item.dtos && item.dtos.length) {
                    quicklyMenus.push({
                        ...item,
                        key: item.id,
                        title: item.name,
                        children: item.dtos.map((menu) => ({
                            ...menu,
                            title: menu.menuName,
                            key: menu.menuId,
                        })),
                    });
                }
            });
            dispatch(
                actions.set({
                    quicklyMenus,
                }),
            );
        }
    };
/**
 * 点击取消便捷菜单
 * @param props
 * @param menuId
 * @returns
 */

export const cancelShortcutMenuDTO =
    (menu: any): AppThunk =>
    async (dispatch) => {
        const saveObj = {
            shortcutMenuId: menu.scmId,
        };
        const {code} = await delShortcutMenuDTO(saveObj);

        if (code === '200') {
            message.info(t('操作成功！'), 2);
            dispatch(thunkGetShortcutMenuDTOByUserId());
        }
    };
/**
 * 点击保存便捷菜单
 * @param props
 * @param menuId
 * @returns
 */

export const saveQuickMenu =
    (menu: any): AppThunk =>
    async (dispatch, getState, {getPageState}) => {
        const {userInfo} = getPageState(getState(), 'app');
        const saveObj = {
            applicationCode: menu.applicationCode,
            menuId: menu.menuId,
            scmCreateBy: userInfo.id,
            scmCreatetime: menu.menuCreatetime,
            scmOwnerId: userInfo.id,
            scmSort: menu.menuSort,
        };
        const {code} = await addShortcutMenuDTO(saveObj);

        if (code === '200') {
            message.info(t('加入成功！'), 2);
            dispatch(thunkGetShortcutMenuDTOByUserId());
        }
    };
/**
 * 获取应用告警配置
 * @param props
 * @param menuId
 * @returns
 */

export const getAlarmProductNumsFun =
    (): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const actions = getPageSimpleActions('index');
        const {code, data} = await getAlarmProductNums();

        if (code === '200') {
            dispatch(
                actions.set({
                    alarmProductNums: data,
                }),
            );
        }
    }; // 修改密码

export const changePasswordFun =
    (values: any, logout: () => void): AppThunk =>
    async () => {
        values.newPassword = encryptionPassword(values.newPassword);
        values.oldPassword = encryptionPassword(values.oldPassword);
        delete values.confirm;
        delete values.username;
        const {code} = await changePassWord(values);

        if (code === '200') {
            message.success(t('密码已修改！'));
            logout();
        }
    };

/**
 * 获取系统版本信息
 * @param props
 * @returns
 */
export const getSystemVersion =
    (): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {code, data} = await getSystemVersionInfo();
        const actions = getPageSimpleActions('index');
        if (code === '200' && data) {
            dispatch(
                actions.set({
                    systemVersionInfo: data,
                }),
            );
        }
    };

/**
 * 获取大数据系统版本信息（包含大数据平台企业）
 * @param props
 * @returns
 */
export const thunkGetEnvAjax = (): AppThunk => async () => {
    const {code, data} = await thunkGetEnv();
    if (`${code}` === '200' && data) {
        window.aappAmbariConfigs.bpType = data;
    }
};
/**
 * 更新当前用户信息
 * @param props
 * @returns
 */
export const updatePersonInfo =
    (userValues: any, setModalState: (value: any) => void): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const simpleActions = getPageSimpleActions('app');
        const {code, data} = await updateSingleUser(userValues);
        if (code === '200' && data) {
            message.success(t('个人信息修改成功'));
            dispatch(
                simpleActions.set({
                    userInfo: userValues,
                }),
            );
            setModalState('check');
        } else {
            setModalState('edit');
        }
    };

/**
 * 更新当前用户信息 (个人信息编辑)
 * @param props
 * @returns
 */
export const updatePersonalInfo =
    (userValues: any, setModalState: (value: any) => void): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const simpleActions = getPageSimpleActions('app');
        const {code, data} = await updateSingleUserInfo(userValues);
        if (code === '200' && data) {
            message.success(t('个人信息修改成功'));
            dispatch(
                simpleActions.set({
                    userInfo: userValues,
                }),
            );
            setModalState('check');
        } else {
            setModalState('edit');
        }
    };

/**
 * 更新app二维码数据
 * @param props
 * @returns
 */
export const requestAppData =
    (): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const actions = getPageSimpleActions('index');
        const appRes = await dispatch(getAppInfo());
        dispatch(dealAppData(appRes, actions));
    };

/**
 * 页面初始化
 * @param props
 * @returns
 */
export const onInit =
    (): AppThunk =>
    (dispatch, getState, {getPageState}) => {
        const {menus} = getPageState(getState(), 'app');
        const dataplatApplication = menus.find(
            (ele: any) => ele.code === APPLICATION.dataplat.code,
        );
        // 包含大数据平台，请求环境类别（标准环境、河北建投环境）
        if (dataplatApplication) {
            dispatch(thunkGetEnvAjax());
        }

        dispatch(thunkGetShortcutMenuDTOByUserId());
        dispatch(getAlarmProductNumsFun());
        dispatch(getSystemVersion());

        // 如果在 /setQrcode页面刷新, 这里的接口不需要执行
        if (window.location.pathname !== setQrcodeRoute.path) {
            dispatch(requestAppData());
        }
    };
