/*
 * @Author: Tomato.Bei
 * @Date: 2022-08-05 15:35:15
 * @Last Modified by: selwyn.bishanwen
 * @Last Modified time: 2022-12-02 14:15:19
 */
import {AppThunk} from '@/app/runtime';
import {i18nIns} from '@/app/i18n';
import {PageProps} from '@gwaapp/ease';
import {report} from '@utils/clientAction';
import * as loginLogViewService from '@services/login_logs_view';

const {t} = i18nIns;

/**
 * 获取登录日志列表
 * @param props
 * @returns
 */

export function getLoginLogList(props: PageProps): AppThunk {
    return async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const simpleActions = getPageSimpleActions(id);
        const {pagination, searchCondition, searchTime, sortType} =
            getPageState(getState(), id);
        const paginationClone = JSON.parse(JSON.stringify(pagination));
        const action = {
            id: 'query',
            module: id,
            desc: t('查询登录日志列表'),
        };
        const pageInfo = {
            all: false,
            conditionDto: {...searchCondition, ...searchTime},
            conditions: [sortType],
            pageNum: paginationClone.current,
            pageSize: paginationClone.pageSize,
        };
        dispatch(
            simpleActions.set({
                isListLoading: true,
            }),
        );
        loginLogViewService
            .getLoginLogList(pageInfo)
            .then((res) => {
                const {data} = res;
                const listData = data?.list || [];
                dispatch(
                    simpleActions.set({
                        isListLoading: false,
                    }),
                );
                paginationClone.total = data.total;
                dispatch(
                    simpleActions.set({
                        listData,
                        pagination: paginationClone,
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
            dispatch(getLoginLogList(props));
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
        dispatch(getLoginLogList(props));
    };
}
/**
 * 导出登录日志列表
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
            desc: t('导出登录日志列表'),
        };
        loginLogViewService
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
