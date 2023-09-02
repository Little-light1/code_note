/*
 * @Author: shimmer
 * @Date: 2022-05-26 15:12:01
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-09-19 10:44:12
 *
 */

/*
 * @Author: sun.t
 * @Date: 2021-12-14 17:10:18
 * @Last Modified by: sun.t
 * @Last Modified time: 2022-04-08 12:59:55
 */
import {AppThunk} from '@/app/runtime';
import {message} from 'antd';
import {PageProps} from '@gwaapp/ease';
import {cloneDeep} from 'lodash';
import {getPreviewImageUrl} from '@/services/file';
import {
    uploadQrCode,
    updateQrCodeConfig,
    deleteQrCode,
    addQrCodeConfig,
    deleteQrCodeBatch,
} from '@/services/qrcode';
import {fetchDictModelVOPageByTypeCode} from '@services/data_dict_config';
import {openGlobalMask, closeGlobalMask} from '@/components/modal'; // 字典值
import {i18nIns} from '@/app/i18n';
import {reducers} from './index';
import {iosCode, androidCode, getAppInfo, dealAppData} from '../login/actions';

const {t} = i18nIns;

export const requestAppData =
    (props: PageProps): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        // let loadingFlag = true
        // setTimeout(() => {
        //   if (loadingFlag) {
        //     dispatch(openGlobalMask())
        //   }
        // }, 500);

        const actions = getPageSimpleActions(props.id);
        const indexActions = getPageSimpleActions('index');

        dispatch(
            actions.set({
                spining: true,
            }),
        );

        const appRes = await dispatch(getAppInfo());

        // loadingFlag = false
        dispatch(
            actions.set({
                spining: false,
            }),
        );
        dispatch(closeGlobalMask());
        dispatch(dealAppData(appRes, actions));
        dispatch(dealAppData(appRes, indexActions));
    };

// 二维码上传
export const uploadQrCodeFun =
    (props: PageProps, file: any, qrId: number): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const arr = file.name.split('.');
        const type = arr[arr.length - 1];

        const allowedTypes = ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG'];
        if (!allowedTypes.includes(type)) {
            message.error(
                t('二维码上传失败, 仅支持png, jpg, jpeg格式图片') as string,
            );
            return;
        }

        // 判断图片大小
        if (file.size > 4 * 1024 * 1024) {
            message.error(t('二维码上传失败, 请上传4M以内的图片') as string);
            return;
        }

        const {id} = props;
        const actions = getPageSimpleActions(id);
        dispatch(
            actions.set({
                uploadBtnLoading: true,
            }),
        );
        const {appData} = getPageState(getState(), id);
        const newAppData = cloneDeep(appData);
        const formData = new FormData();
        formData.append('file', file);
        const {code, data} = await uploadQrCode<string>(formData);

        if (code === '200' && data) {
            const picPreview = await getPreviewImageUrl(data);
            newAppData[qrId - 1].url = window.location.origin + picPreview;
            newAppData[qrId - 1].dconfigValue = data;

            dispatch(
                actions.set({
                    appData: newAppData,
                    uploadBtnLoading: false,
                }),
            );
        }
    };

// 版本号文本框change事件
export const handleVersionChange =
    (props: PageProps, event: any, index: any): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {appData} = getPageState(getState(), id);
        const newQrCodeArr = cloneDeep(appData);
        newQrCodeArr[index].version = event.target.value;
        dispatch(
            actions.set({
                appData: newQrCodeArr,
            }),
        );
    };

// 启用/停用按钮 change事件
export const handleSwitchChange =
    (props: PageProps, e: any, index: any): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {appData} = getPageState(getState(), id);
        const newQrCodeArr = cloneDeep(appData);

        newQrCodeArr[index].isOn = e;
        dispatch(
            actions.set({
                appData: newQrCodeArr,
            }),
        );
    };

// 清空二维码
export const deleteQrCodeFun =
    (props: PageProps, dconfigId: number, itemId: number): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        if (itemId) {
            const {id} = props;
            const actions = getPageSimpleActions(id);

            const {appData} = getPageState(getState(), id);
            const newQrCodeArr = cloneDeep(appData);

            newQrCodeArr.forEach((item: any) => {
                if (item.id === itemId) {
                    item.url = null;
                    item.dconfigValue = '';
                }
            });

            dispatch(
                actions.set({
                    appData: newQrCodeArr,
                }),
            );
        }
    };

// 保存安卓和iOS二维码, 版本号, 发布日期等信息
export const saveInfoFun =
    (props: PageProps): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const indexActions = getPageSimpleActions('index');
        const {appData} = getPageState(getState(), id);

        const nowDate = getNow();

        for (const item of appData) {
            if (item.isOn) {
                if (!item.url) {
                    // 请上传二维码
                    message.warn(t('请上传二维码') as string);
                    return;
                }
                if (!item.version) {
                    // 请填写版本号
                    message.warn(t('请填写版本号') as string);
                    return;
                }
            }
        }

        dispatch(actions.set({saveBtnLoading: true}));

        const params = [
            {
                ...appData[0],
                pushDate: nowDate,
            },
            {
                ...appData[1],
                pushDate: nowDate,
            },
        ];

        let result;
        // 1. 查询是否有配置过信息
        //    因为url + 停用状态可以清空, 用pushDate判断
        if (appData[0].pushDate || appData[1].pushDate) {
            // 已配置过, 更新
            result = await updateQrCodeConfig(params);
        } else {
            // 未配置过, 首次配置
            result = await addQrCodeConfig(params);
        }

        if (result.code === '200') {
            message.success(t('二维码图片配置信息保存成功') as string);
            dispatch(actions.set({saveBtnLoading: false}));

            let visible = false;
            for (const appItem of params) {
                if (appItem.isOn) {
                    visible = true;
                    break;
                }
            }

            dispatch(
                actions.set({
                    appData: params,
                    appVisible: visible,
                }),
            );
            dispatch(
                indexActions.set({
                    appData: params,
                    appVisible: visible,
                }),
            );
        } else {
            dispatch(actions.set({saveBtnLoading: false}));
        }
    };

export const deleteFn = () => {
    deleteQrCodeBatch([27, 28]);
};

// deleteFn()

// 获取当前时间
function getNow(): string {
    const now = new Date();
    const y = now.getFullYear();
    const month = now.getMonth();
    const d = now.getDate();
    // h = now.getHours(),
    // m = now.getMinutes(),
    // s = now.getSeconds();
    return `${y}-${month + 1}-${d}`;
}
