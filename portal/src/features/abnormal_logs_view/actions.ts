/*
 * @Author: Tomato.Bei
 * @Date: 2022-08-05 15:34:07
 * @Last Modified by: selwyn.bishanwen
 * @Last Modified time: 2022-12-02 14:14:51
 */
import {AppThunk} from '@/app/runtime';
import {i18nIns} from '@/app/i18n';
import {PageProps} from '@gwaapp/ease';
import {report} from '@utils/clientAction';
import * as abnormalLogViewService from '@services/abnormal_logs_view';

const {t} = i18nIns;
/**
 * 获取异常日志列表
 * @param props
 * @returns
 */
export function getAbnormalLogList(props: PageProps): AppThunk {
    return async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const simpleActions = getPageSimpleActions(id);
        const {pagination, searchCondition, searchTime, sortType} =
            getPageState(getState(), id);
        const paginationClone = JSON.parse(JSON.stringify(pagination));
        const pageInfo = {
            all: false,
            conditionDto: {...searchTime, ...searchCondition},
            conditions: [sortType],
            pageNum: paginationClone.current,
            pageSize: paginationClone.pageSize,
        };
        const action = {
            id: 'query',
            module: id,
            desc: t('查询异常日志列表'),
        };
        dispatch(
            simpleActions.set({
                isListLoading: true,
            }),
        );
        abnormalLogViewService
            .getAbnormalLogList(pageInfo)
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
 * 页码改变
 * @param props
 * @param page
 * @param pageSize
 * @returns
 */

export function changePage(
    props: any,
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
            dispatch(getAbnormalLogList(props));
        }
    };
}
/**
 * 页面初始化
 * @param props
 * @returns
 */

export function onInit(props: PageProps): AppThunk {
    return (dispatch) => {
        dispatch(getAbnormalLogList(props));
    };
}
/**
 * 导出异常日志列表
 * @param props
 * @returns
 */

export function logExcel(props: {id: string}): AppThunk {
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
            desc: t('导出异常日志列表'),
        };
        abnormalLogViewService.getlogExcel(pageInfo).then((res) => {
            if (res.code === '200') {
                report.success(action);
            } else {
                report.fail(action);
            }
        });
    };
}
