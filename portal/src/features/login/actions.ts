import {getQrCodeConfig} from '@/services/qrcode';
import {getPreviewImageUrl} from '@/services/file';
import {AppThunk} from '@/app/runtime';
import {message} from 'antd';
import {reducers} from './index';

export const androidCode = 'AAPP_Android_APP';
export const iosCode = 'AAPP_IOS_APP';

export const requestAppData =
    (): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const actions = getPageSimpleActions('login');
        const appRes = await dispatch(getAppInfo());

        dispatch(dealAppData(appRes, actions));
    };

export const dealAppData =
    (appRes: any, actions: any): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        // 返回值顺序处理, 第一个item是安卓, 第二个是ios
        const newAppArr = [];
        // 是否显示app下载入口
        let visible = false;

        if (appRes && Array.isArray(appRes) && appRes.length > 0) {
            for (const item of appRes) {
                if (item.isOn) {
                    visible = true;
                }

                if (item.dconfigValue) {
                    const picPreview = await getPreviewImageUrl(
                        item.dconfigValue,
                    );
                    item.url = window.location.origin + picPreview;
                }

                // 处理顺序
                if (item.dconfigCode === androidCode) {
                    item.id = 1;
                    (item.name = 'Android版下载的二维码图片'),
                        (newAppArr[0] = item);
                } else {
                    item.id = 2;
                    (item.name = 'iPhone版下载的二维码图片'),
                        (newAppArr[1] = item);
                }
            }

            dispatch(
                actions.set({
                    appData: newAppArr,
                    appVisible: visible,
                }),
            );
        }
    };

export const getAppInfo =
    (): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const params = [androidCode, iosCode];

        const appRes = await getQrCodeConfig(params);

        if (appRes.code === '200') {
            // && (appRes.data && Array.isArray(appRes.data) && appRes.data.length)
            return appRes.data;
        }
        message.error('数据获取失败');
    };
