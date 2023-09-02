/*
 * @Author: shimmer
 * @Date: 2022-05-26 15:12:01
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-12-02 09:28:00
 *
 */
import {AppThunk} from '@/app/runtime';
import {getAlarmList, getAlarmDetail, alarmDeal} from '@/services/alarm';
import {fetchDictModelVOPageByTypeCode} from '@services/data_dict_config';
import {message} from 'antd';
import {PageProps} from '@gwaapp/ease';
import {cloneDeep} from 'lodash';
import {report} from '@/common/utils/clientAction';
import {i18nIns} from '@/app/i18n';
import {formSubmitCondition} from './constant';
import {ListType, TableDataType} from './types';

const {t} = i18nIns;

/**
 * 获取列表数据
 * @param props
 * @param values
 * @returns
 */

export const getAlarmCenterList =
    (
        props: PageProps,
        params: any,
        isPageChange?: boolean,
        isLog?: boolean,
    ): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {pageNum, pageSize} = getPageState(getState(), id);
        dispatch(
            actions.set({
                isTableLoading: true,
            }),
        );

        const values = cloneDeep(params);
        formSubmitCondition[0].value = values.noticeContent;
        formSubmitCondition[1].value = values.noticeType;
        formSubmitCondition[2].value = values.rangeDate[0].format(
            'YYYY-MM-DD 00:00:00',
        );
        formSubmitCondition[3].value = values.rangeDate[1].format(
            'YYYY-MM-DD 23:59:59',
        );
        formSubmitCondition[4].value = values.noticeLevel;
        const arr = formSubmitCondition.filter((item) => item.value !== '');
        values.conditions = [...arr];
        values.all = false;
        values.pageSize = pageSize;
        values.pageNum = isPageChange ? pageNum : 1;
        dispatch(
            actions.set({
                searchFormValue: {
                    noticeContent: values.noticeContent,
                    noticeType: values.noticeType,
                    rangeDate: values.rangeDate,
                    noticeLevel: values.noticeLevel,
                },
                isFirstLoad: false,
            }),
        );
        delete values.noticeContent;
        delete values.noticeType;
        delete values.rangeDate;
        delete values.noticeLevel;
        const action = {
            id: 'searchAlarmCenterList',
            module: props.id,
            desc: t('查询告警中心列表'),
        };

        report.action({
            id: 'searchAlarmCenterList',
            module: props.id,
            position: [props.menu?.menuName ?? '', t('查询')],
            action: 'query',
            wait: true,
        });
        const {code, data} = await getAlarmList<ListType>({...values});

        if (code === '200' && data) {
            if (isLog) {
                report.success(action);
            }

            if (!isPageChange) {
                dispatch(
                    actions.set({
                        pageNum: 1,
                    }),
                );
            }

            dispatch(
                actions.set({
                    tableData: data.list,
                    isTableLoading: false,
                    total: data.total,
                }),
            );
        } else {
            if (isLog) report.fail(action);
        }
    }; // 切换分页

export const changePage =
    (props: PageProps, page: number, size: number): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {searchFormValue} = getPageState(getState(), id);
        dispatch(
            actions.set({
                pageSize: size,
                pageNum: page,
            }),
        );
        dispatch(getAlarmCenterList(props, searchFormValue, true, false));
    }; // 告警详情查看

export const getAlarmDetailFun =
    (props: PageProps, alarmId: number): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {alarmLevelArr, alarmTypeArr} = getPageState(getState(), id);
        const {code, data} = await getAlarmDetail<TableDataType>({
            noticeId: alarmId,
        });

        if (code === '200' && data) {
            const detailInfo = [
                {
                    name: '告警内容',
                    value: data.noticeContent,
                },
                {
                    name: '告警对象名称',
                    value: data.noticeObjectName,
                },
                {
                    name: '告警类型',
                    value: alarmTypeArr[data.noticeType],
                },
                {
                    name: '告警等级',
                    value: alarmLevelArr[data.noticeLevel],
                },
                {
                    name: '告警产生时间',
                    value: data.createTime,
                },
                {
                    name: '告警原因',
                    value: data.noticeCause,
                },
            ];
            dispatch(
                actions.set({
                    alarmDetailInfo: data,
                    alarmDetailArr: detailInfo,
                }),
            );
            dispatch(
                actions.set({
                    detailModalVisible: true,
                }),
            );
        }
    }; // 修改Modal显隐

export const setModalVisible =
    (props: PageProps, visible: boolean): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        dispatch(
            actions.set({
                detailModalVisible: visible,
            }),
        );
    }; // 获取告警类型等级字典值

export const initDictDataList =
    (props: PageProps): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const alarmTypeRes = await fetchDictModelVOPageByTypeCode(
            'ALARM_TYPE',
            {
                all: true,
                conditions: [
                    {
                        condition: 'EQ',
                        field: 'dictdataIsenabled',
                        value: 1,
                    },
                ],
            },
        );
        const alarmLevelRes = await fetchDictModelVOPageByTypeCode(
            'NOTICE_LEVEL',
            {
                all: true,
                conditions: [
                    {
                        condition: 'EQ',
                        field: 'dictdataIsenabled',
                        value: 1,
                    },
                ],
            },
        );

        if (alarmTypeRes.code === '200' && alarmTypeRes.data) {
            const alarmType = alarmTypeRes.data
                .filter((v) => v.dictdataIsenabled)
                .map((item) => ({
                    value: item.dictdataValue,
                    text: item.dictdataName,
                }));
            const obj: Record<string, any> = {};
            alarmTypeRes.data.map((item) => {
                obj[item.dictdataValue] = item.dictdataName;
                return item;
            });
            alarmType.unshift({
                value: '',
                text: t('全部'),
            });
            dispatch(
                actions.set({
                    alarmType,
                    alarmTypeArr: obj,
                }),
            );
        }

        if (alarmLevelRes.code === '200' && alarmLevelRes.data) {
            const alarmLevel = alarmLevelRes.data
                .filter((v) => v.dictdataIsenabled)
                .map((item) => ({
                    value: item.dictdataValue,
                    text: item.dictdataName,
                }));
            const obj: Record<string, any> = {};
            alarmLevelRes.data.map((item) => {
                obj[item.dictdataValue] = item.dictdataName;
                return item;
            });
            alarmLevel.unshift({
                value: '',
                text: t('全部'),
            });
            dispatch(
                actions.set({
                    alarmLevel,
                    alarmLevelArr: obj,
                }),
            );
        }
    }; // 处理告警

export const alarmDealFun =
    (props: PageProps, alarmInfo: any): AppThunk =>
    async (dispatch, getState, {getPageState}) => {
        const {id} = props;
        const userId = JSON.parse(
            window.localStorage.getItem('userInfo') || '{}',
        )?.id;
        const {searchFormValue} = getPageState(getState(), id);
        const action = {
            id: 'dealAlarmInfo',
            module: id,
            desc: t('处理告警信息：{{name}}', {
                name: alarmInfo.noticeContent,
            }),
        };
        report.action({
            id: 'dealAlarmInfo',
            module: id,
            position: [props.menu?.menuName ?? '', t('操作-处理')],
            action: 'modify',
            wait: true,
        });
        const {data, code} = await alarmDeal({
            aappNoticeDealRemoteList: [
                {
                    noticeId: alarmInfo.noticeId,
                    dealStatus: 'CONFIRMED',
                },
            ],
            dealUserId: userId,
        });

        if (code === '200' && data) {
            report.success(action);
            message.success(t('告警信息处理完成！'));
            dispatch(getAlarmCenterList(props, searchFormValue, false, false));
            dispatch(setModalVisible(props, false));
        } else {
            message.error(t('告警信息处理失败！'));
            report.fail(action);
        }
    }; // 保存表单数据

export const saveFormValue =
    (props: PageProps, values: any): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        dispatch(
            actions.set({
                formValue: values,
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
        dispatch(initDictDataList(props));
    };
