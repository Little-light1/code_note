import {AppThunk} from '@/app/runtime';
import {report} from '@/common/utils/clientAction';
import {
    getOrganizationTree,
    getUserStatusList,
} from '@/services/user_connection_status';
import {PageProps} from '@gwaapp/ease';
import {i18nIns} from '@/app/i18n';
import {LogActionID} from './types';

const {t} = i18nIns;

let timer: any = null;
/**
 * 保存当前查询条件数据
 * @param props
 * @returns
 */

const saveQueryFormValues =
    (props: PageProps): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {orgId, userAccount, username, connectionStatus} = getPageState(
            getState(),
            id,
        );
        dispatch(
            actions.set({
                queryFormValues: {
                    orgId,
                    userAccount,
                    username,
                    connectionStatus,
                },
            }),
        );
    }; // 获取有权限组织架构及上级架构

export const getOrganizationTreeData =
    (props: PageProps): AppThunk =>
    async (dispatch, _, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const params = {
            proCode: 'OC',
        };
        const {code, data} = await getOrganizationTree(params);

        if (code === '200') {
            dispatch(
                actions.set({
                    orgList: data,
                }),
            );
        }
    }; // 重置定时器

export const resetTimer =
    (props: PageProps): AppThunk =>
    async (dispatch, getState, {getPageState}) => {
        const {id} = props;
        const {canResetTimer} = getPageState(getState(), id);
        timer && clearInterval(timer);
        timer = null;

        if (canResetTimer) {
            timer = setInterval(() => {
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                dispatch(getTableData(props, false, false));
            }, 10000);
        }
    }; // 清除定时器

export const clearTimer = (): AppThunk => async () => {
    timer && clearInterval(timer);
    timer = null;
}; /// 查询列表数据

export const getTableData =
    (props: PageProps, needReport: boolean, showError: boolean): AppThunk =>
    (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {queryFormValues, pageNum, pageSize} = getPageState(
            getState(),
            id,
        );
        const {orgId, userAccount, username, connectionStatus} =
            queryFormValues;
        showError &&
            dispatch(
                actions.set({
                    listLoading: true,
                }),
            );
        const params = {
            onlineState: connectionStatus,
            organizationId: orgId,
            proCode: 'OC',
            loginName: userAccount,
            userName: username,
        };
        const pageData = {
            pageNum,
            pageSize,
        }; // 查询日志

        const action = {
            id: LogActionID.Query,
            module: id,
            desc: t('查询用户连接状态监测列表'),
        }; // 先以查询事件为主，取消定时器轮询事件

        dispatch(clearTimer());
        getUserStatusList(params, pageData, showError)
            .then(({code, data}) => {
                if (code === '200') {
                    const {total, list} = data as any;
                    dispatch(
                        actions.set({
                            total,
                            listData: list,
                        }),
                    );
                    needReport && report.success(action);
                } else {
                    needReport && report.fail(action);
                }
            })
            .catch(() => {
                needReport && report.fail(action);
            })
            .finally(() => {
                showError &&
                    dispatch(
                        actions.set({
                            listLoading: false,
                        }),
                    ); // 重置定时器

                dispatch(resetTimer(props));
            });
    }; /// 查询列表数据

export const handleSearch =
    (props: PageProps): AppThunk =>
    async (dispatch, _, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        dispatch(
            actions.set({
                canResetTimer: true,
            }),
        );
        dispatch(saveQueryFormValues(props));
        dispatch(getTableData(props, true, true));
    };
/**
 * 页面初始化
 * @param props
 * @returns
 */

export const onInit =
    (props: PageProps): AppThunk =>
    (dispatch) => {
        dispatch(getOrganizationTreeData(props));
    };
