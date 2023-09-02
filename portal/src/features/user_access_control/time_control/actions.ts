import {AppThunk} from '@/app/runtime';
import {report} from '@/common/utils/clientAction';
import {PageProps} from '@gwaapp/ease';
import * as controlServices from '@services/user_access_control';
import {i18nIns} from '@/app/i18n';
import {message} from 'antd';
import {LogActionID, ModalActionType} from '../types';

const {t} = i18nIns;

/**
 * 页面初始化
 * @param props
 * @returns
 */

export const getTimeList =
    (props: PageProps): AppThunk =>
    (dispatch, getState, {getPageSimpleActions, getPageState}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {timePageNum, timePageSize} = getPageState(getState(), id);
        dispatch(
            actions.set({
                timeListLoading: true,
            }),
        );
        const params = {
            proCode: 'OC',
        };
        const pageData = {
            pageNum: timePageNum,
            pageSize: timePageSize,
        };
        controlServices
            .getTimeList(params, pageData)
            .then(({code, data}) => {
                if (code === '200') {
                    const {total, list} = data as any;
                    dispatch(
                        actions.set({
                            timeTotal: total,
                            timeList: list || [],
                        }),
                    );
                }
            })
            .finally(() => {
                dispatch(
                    actions.set({
                        timeListLoading: false,
                    }),
                );
            });
    };
/**
 * 添加或更新访问时间控制
 * @param props 页面属性
 * @param startTime 起始时间
 * @param endTime 结束时间
 * @param userIds 用户id数组
 * @param type 类型：新增 ｜ 编辑
 * @param ids id
 * @returns
 */

export const addOrUpdateTimeControl =
    (
        props: PageProps,
        startTime: string,
        endTime: string,
        userIds: string[],
        type: ModalActionType,
        ids: string[],
        recordStartTime: string,
        recordEndTime: string,
    ): AppThunk<Promise<void>> =>
    () =>
        new Promise((resolve, reject) => {
            const {id} = props;

            if (type === ModalActionType.Add) {
                const action = {
                    id: LogActionID.Add,
                    module: id,
                    desc: t(
                        '新增访问时间控制 起始时间：{{startTime}} 结束时间：{{endTime}}',
                        {
                            startTime,
                            endTime,
                        },
                    ),
                };
                const params = {
                    startTime,
                    endTime,
                    userIds,
                };
                controlServices
                    .addTime(params)
                    .then(({code}) => {
                        if (code === '200') {
                            report.success(action);
                            resolve();
                        } else {
                            report.fail(action);
                            reject(new Error());
                        }
                    })
                    .catch(() => {
                        report.fail(action);
                        reject(new Error());
                    });
            } else {
                const action = {
                    id: LogActionID.Modify,
                    module: id,
                    desc: t(
                        '编辑访问时间控制 起始时间：{{startTime}} 结束时间：{{endTime}}',
                        {
                            startTime: recordStartTime,
                            endTime: recordEndTime,
                        },
                    ),
                };
                const params = {
                    ids,
                    startTime,
                    endTime,
                    userIds,
                };
                controlServices
                    .updateTime(params)
                    .then(({code}) => {
                        if (code === '200') {
                            report.success(action);
                            resolve();
                        } else {
                            report.fail(action);
                            reject(new Error());
                        }
                    })
                    .catch(() => {
                        report.fail(action);
                        reject(new Error());
                    });
            }
        });
/**
 * 删除访问时间控制
 * @param props
 * @param ids ID列表
 * @returns
 */

export const deleteTime =
    (
        props: PageProps,
        ids: string[],
        startTime: string,
        endTime: string,
    ): AppThunk =>
    async (dispatch) => {
        const {id} = props;
        const action = {
            id: LogActionID.Delete,
            module: id,
            desc: t(
                '删除访问时间控制 起始时间：{{startTime}} 结束时间：{{endTime}}',
                {
                    startTime,
                    endTime,
                },
            ),
        };
        const {code} = await controlServices.deleteTime(ids).catch(() => {
            report.fail(action);
        });

        if (code === '200') {
            message.info(t('删除成功'));
            report.success(action);
            dispatch(getTimeList(props));
        } else {
            report.fail(action);
        }
    };
