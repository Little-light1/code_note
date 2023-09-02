/*
 * @Author: sun.t
 * @Date: 2021-12-14 17:10:18
 * @Last Modified by: selwyn.bishanwen
 * @Last Modified time: 2022-12-12 13:29:15
 */
import {AppThunk} from '@/app/runtime';
import {getAlarmProductConfig, setAlarmProductConfig} from '@/services/alarm';
import {FormInstance, message} from 'antd';
import {PageProps} from '@gwaapp/ease';
import {cloneDeep, isEqual} from 'lodash';
import {report} from '@/common/utils/clientAction';
import {i18nIns} from '@/app/i18n';

const {t} = i18nIns;
/**
 * 获取 应用，应用告警跳转地址，数量
 */

export const getAlarmProductConfigFun =
    (props: PageProps): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {code, data} = await getAlarmProductConfig();

        if (code === '200' && data) {
            const newData = data.map((item, index) => {
                item.index = index + 1;
                return {...item};
            });
            dispatch(
                actions.set({
                    alarmProductConfig: newData,
                    alarmFakeData: newData,
                }),
            );
        }
    }; // 设置告警配置

export const setAlarmProductConfigFun =
    (props: PageProps, form: FormInstance): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {alarmProductConfig, alarmFakeData} = getPageState(
            getState(),
            id,
        );
        const actions = getPageSimpleActions(id);
        const changeName: string[] = alarmFakeData
            .map((item: any, index: number) => {
                if (isEqual(item, alarmProductConfig[index])) {
                    return '';
                }

                return item.noticeConfigProName;
            })
            .filter((item: string) => item !== '');
        const action = {
            id: 'saveAlarmExtension',
            module: id,
            desc: `${t('修改告警扩展配置')}: ${changeName.join(',')}`,
        };
        form.validateFields().then(async () => {
            dispatch(
                actions.set({
                    isLoading: true,
                }),
            );
            const {code} = await setAlarmProductConfig([...alarmProductConfig]);

            if (code === '200') {
                if (changeName.length !== 0) {
                    report.success(action);
                }

                dispatch(
                    actions.set({
                        isLoading: false,
                    }),
                );
                dispatch(getAlarmProductConfigFun(props));
                message.success(t('告警扩展配置保存成功！'));
            } else {
                if (changeName.length !== 0) {
                    report.fail(action);
                }
            }
        });
    }; // 修改跳转地址

export const setAlarmProductUrl =
    (props: PageProps, index: number, url: string): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {alarmProductConfig} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);
        const fakeAlarmProductConfig = cloneDeep(alarmProductConfig);
        fakeAlarmProductConfig[index].noticeConfigUrl = url;
        dispatch(
            actions.set({
                alarmProductConfig: [...fakeAlarmProductConfig],
            }),
        );
    }; // 修改是否显示

export const setAlarmProductIsShow =
    (props: PageProps, index: number, checked: boolean): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {alarmProductConfig} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);
        const fakeAlarmProductConfig = cloneDeep(alarmProductConfig);
        fakeAlarmProductConfig[index].noticeConfigIsShow = checked;
        dispatch(
            actions.set({
                alarmProductConfig: [...fakeAlarmProductConfig],
            }),
        );
    };
/**
 * 页面初始化
 * @param props
 * @returns
 */

export const onInit =
    (props: PageProps): AppThunk =>
    (dispatch) => {
        dispatch(getAlarmProductConfigFun(props));
    };
