/*
 * @Author: zhangzhen
 * @Date: 2022-07-21 13:46:40
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-09-14 10:09:55
 *
 */
import {PageProps} from '@gwaapp/ease';
import {fetchKaptcha, fetchLogin, fetchNgspLogin} from '@services/login';
import {LoginProps} from '@services/login/types';
import {AppThunk} from '@/app/runtime';
import {cloneDeep} from 'lodash';
import {getPreviewImageUrl, getQrCodeUrl} from '@/services/file';
import {getQrCodeConfig} from '@/services/qrcode';
// 企业Id
const userInfo = window.localStorage.getItem('userInfo');
const TenantId = userInfo ? JSON.parse(userInfo)?.enterpriseID : '1000';
// JSON.parse(window.localStorage.getItem('userInfo') || '')?.enterpriseID;
// const TenantId = '1000'
// pending | fulfilled | rejected

export const asyncLogin = async (values: LoginProps) => {
    let response;

    if (values.forceQuit) {
        // 强制无验证码登录
        delete values.code;
        response = await fetchNgspLogin(values);
    } else {
        // 验证码登录
        response = await fetchLogin(values);
    }

    return response;
}; // 强制无验证码登录

export const ngspLogin = async (values: LoginProps) => fetchNgspLogin(values); // export const loginActions: IAction<LoginState>[] = [
//     {
//         actionType: asyncLogin.pending,
//         action: (state) => {
//             state.loading = true;
//         },
//     },
//     {
//         actionType: asyncLogin.fulfilled,
//         action: (state) => {
//             state.loading = false;
//         },
//     },
//     {
//         actionType: asyncLogin.rejected,
//         action: (state) => {
//             state.loading = false;
//         },
//     },
// ];
// //  获取二维码配置
// export const getQrCodeConfigFun =
//     (props: PageProps): AppThunk =>
//         async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
//             const {id} = props;
//             const actions = getPageSimpleActions(id);
//             const {qrCodeArr} = getPageState(getState(), id);
//             const newQrCodeArr = cloneDeep(qrCodeArr);
//             const paramsAndriod = {
//                 dconfigCode: 'Android_APP',
//                 tenantId: TenantId || '1000',
//             };
//             const paramsIOS = {
//                 dconfigCode: 'IOS_APP',
//                 tenantId: TenantId || '1000',
//             };
//             const androidRes = await getQrCodeConfig<{dconfigValue: string; dconfigId: number}>(paramsAndriod);
//             const iosRes = await getQrCodeConfig<{dconfigValue: string; dconfigId: number}>(paramsIOS);

//             let windowOrigin = window.location.origin
//             if (windowOrigin.includes('localhost')) {
//               windowOrigin = 'http://10.64.200.215:8888'
//             }
//             if (androidRes.code === '200' && androidRes.data) {
//                 if (Object.keys(androidRes.data || {}).length !== 0) {
//                     const picPreview = await getQrCodeUrl(androidRes.data.dconfigValue);

//                     newQrCodeArr[0].url = windowOrigin + picPreview;
//                     newQrCodeArr[0].dconfigId = androidRes.data.dconfigId;
//                 } else {
//                     newQrCodeArr[0].url = '';
//                 }
//             }
//             if (iosRes.code === '200' && iosRes.data) {
//                 if (Object.keys(iosRes.data || {}).length !== 0) {
//                     const picPreview = await getQrCodeUrl(iosRes.data.dconfigValue);
//                     newQrCodeArr[1].url = windowOrigin + picPreview;
//                     newQrCodeArr[1].dconfigId = iosRes.data.dconfigId;
//                 } else {
//                     newQrCodeArr[1].url = '';
//                 }
//             }

//             console.log('获取二维码数据: ', newQrCodeArr);

//             dispatch(actions.set({qrCodeArr: newQrCodeArr}));
//         };

/**
 *
 * @param props
 * @param dictModelItem
 * @returns
 */

export const refreshCode =
    (props: PageProps): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {image, sessionId} = await fetchKaptcha();
        // dispatch(getQrCodeConfigFun(props));

        dispatch(
            actions.set({
                code: image,
                codeSession: sessionId,
            }),
        );
    };
