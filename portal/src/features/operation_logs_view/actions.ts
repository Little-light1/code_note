/*
 * @Author: Tomato.Bei
 * @Date: 2022-08-05 15:32:45
 * @Last Modified by: selwyn.bishanwen
 * @Last Modified time: 2022-12-02 14:14:21
 */
import {PageProps} from '@gwaapp/ease';
import {AppThunk} from '@/app/runtime';
import {report} from '@utils/clientAction';
import {fetchDictModelVOPageByTypeCode} from '@services/data_dict_config';
import * as getOpnLOgViewService from '@/services/operation_logs_view';
import {i18nIns} from '@/app/i18n';

const {t} = i18nIns;

export function thunkInitDict(props: PageProps): AppThunk {
    return (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const simpleActions = getPageSimpleActions(id);
        Promise.all([
            fetchDictModelVOPageByTypeCode('busi_app', {}),
            fetchDictModelVOPageByTypeCode('opn_behavior', {}),
        ]).then(([busiTypeData, opnBehaviorData]) => {
            if (!busiTypeData.data || !opnBehaviorData.data) {
                return;
            }

            dispatch(
                simpleActions.set({
                    busiTypeList: [
                        {
                            dictdataCode: '',
                            dictdataName: t('全部'),
                        },
                        ...busiTypeData.data,
                    ],
                    opnBehaviorList: [
                        {
                            dictdataCode: '',
                            dictdataName: t('全部'),
                        },
                        ...opnBehaviorData.data,
                    ],
                }),
            );
        });
    };
}
/**
 * 获取操作日志列表
 * @param props
 * @returns
 */

export function getOperateLogList(props: PageProps): AppThunk {
    return (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const simpleActions = getPageSimpleActions(id);
        const {pagination, searchCondition, searchTime, sortType} =
            getPageState(getState(), id);
        const paginationClone = JSON.parse(JSON.stringify(pagination));
        const action = {
            id: 'query',
            module: id,
            desc: t('查询操作日志列表'),
        };
        dispatch(
            simpleActions.set({
                isListLoading: true,
            }),
        );
        const pageInfo = {
            all: true,
            conditionDto: {...searchCondition, ...searchTime},
            conditions: [sortType],
            pageNum: paginationClone.current,
            pageSize: paginationClone.pageSize,
        };
        getOpnLOgViewService
            .getOpnLog(pageInfo)
            .then((res) => {
                const {data} = res;
                const listData = data?.list || [];
                paginationClone.total = data.total;
                dispatch(
                    simpleActions.set({
                        listData,
                        pagination: paginationClone,
                        isListLoading: false,
                    }),
                );
                report.success(action);
            })
            .catch(() => {
                report.fail(action);
            })
            .finally(() =>
                dispatch(
                    simpleActions.set({
                        isListLoading: false,
                    }),
                ),
            );
    };
}
/**
 * 页面初始化
 * @param props
 * @returns
 */

export function onInit(props: PageProps): AppThunk {
    return (dispatch) => {
        dispatch(thunkInitDict(props));
        dispatch(getOperateLogList(props));
    };
}
/**
 * 页码改变触发的函数
 * @param props
 * @param page
 * @param pageSize
 * @returns
 */

export function changePage(
    props: PageProps,
    page: number,
    pageSize: number,
): AppThunk {
    return (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const simpleActions = getPageSimpleActions(id);
        const {pagination} = getPageState(getState(), id);

        if (pagination.current !== page || pagination.pageSize !== pageSize) {
            dispatch(
                simpleActions.set({
                    pagination: {...pagination, current: page, pageSize},
                }),
            );
            dispatch(getOperateLogList(props));
        }
    };
}
/**
 * 导出操作日志列表
 * @param props
 * @returns
 */

export function logExcel(props: PageProps): AppThunk {
    return (dispatch, getState, {getPageState}) => {
        const {id} = props;
        const {searchCondition} = getPageState(getState(), id);
        const {searchTime} = getPageState(getState(), id);
        const pageInfo = {
            conditionDto: {...searchTime, ...searchCondition},
        };
        const action = {
            id: 'export',
            module: id,
            desc: t('导出操作日志列表'),
        };
        getOpnLOgViewService
            .getlogExcel(pageInfo)
            .then((res) => {
                if (res.code === '200') {
                    report.success(action);
                } else {
                    report.fail(action);
                }
            })
            .catch(() => {
                report.fail(action);
            });
    };
}
