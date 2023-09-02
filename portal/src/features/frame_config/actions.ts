/*
 * @Author: zhangzhen
 * @Date: 2022-11-18 09:39:21
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-11-21 17:11:29
 *
 */
import {utils} from '@components/tree';
import {
    fetchIndexPicList,
    fetchCommonConfig,
    fetchFrameConfig,
} from '@services/frame_config';
import {PageProps} from '@gwaapp/ease';
import {AppThunk} from '@/app/runtime';

const {loopToAntdTreeData} = utils;
/**
 * 初始化轮播图
 * @param props
 * @returns
 */

export const initBgPics =
    (props: PageProps): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id); // 获取所有轮播图

        const {code, data} = await fetchIndexPicList();

        if (code === '200') {
            dispatch(
                actions.set({
                    bgPics: data,
                }),
            );
        }
    };
/**
 * 初始化通用配置
 * @param props
 * @returns
 */

export const initCommonConfig =
    (props: PageProps): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id); // 获取所有轮播图

        const {code, data} = await fetchCommonConfig();

        if (code === '200') {
            const commonConfigs = loopToAntdTreeData({
                treeData: data!,
                keyPropName: 'cconfigId',
                titlePropName: 'cconfigName',
                // attachNodeProps: subjoinCanAddDictTypeExtraProps,
                needAttachIndexParentKey: true,
            });
            dispatch(
                actions.set({
                    commonConfigs,
                }),
            );
        }
    };

export const thunkInitFrame =
    (props: PageProps): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const action = getPageSimpleActions(id);
        const {code, data} = await fetchFrameConfig();

        if (code === '200' && data) {
            const {
                browserLogoConfigDTO,
                mainWinConfigDTO: {left = 1, top = 1},
            } = data;

            // 设置图标信息
            dispatch(
                action.set({
                    logo: browserLogoConfigDTO,
                    frame: {left: !!left, top: !!top},
                    frameResponse: data,
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
        dispatch(initBgPics(props));
        dispatch(initCommonConfig(props));
        dispatch(thunkInitFrame(props));
    };
