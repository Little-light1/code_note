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

export const getAddressList =
    (props: PageProps): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions, getPageState}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {addressPageNum, addressPageSize} = getPageState(getState(), id);
        dispatch(
            actions.set({
                addressListLoading: true,
            }),
        );
        const params = {
            proCode: 'OC',
        };
        const pageData = {
            pageNum: addressPageNum,
            pageSize: addressPageSize,
        };
        controlServices
            .getIPList(params, pageData)
            .then(({code, data}) => {
                if (code === '200') {
                    const {total, list} = data as any;
                    dispatch(
                        actions.set({
                            addressTotal: total,
                            addressList: list || [],
                        }),
                    );
                }
            })
            .finally(() => {
                dispatch(
                    actions.set({
                        addressListLoading: false,
                    }),
                );
            });
    };
/**
 * 添加或更新访问地址控制
 * @param props 页面属性
 * @param startAddress 起始地址
 * @param endAddress 结束地址
 * @param userIds 用户id数组
 * @param type 类型： 新增 ｜ 编辑
 * @param ids id
 * @returns
 */

export const addOrUpdateAddress =
    (
        props: PageProps,
        startAddress: string,
        endAddress: string,
        userIds: string[],
        type: ModalActionType,
        ids: string[],
        recordStartAddress: string,
        recordEndAddress: string,
    ): AppThunk<Promise<void>> =>
    () =>
        new Promise((resolve, reject) => {
            const {id} = props;

            if (type === ModalActionType.Add) {
                // 新增
                const action = {
                    id: LogActionID.Add,
                    module: id,
                    desc: t(
                        '新增访问地址控制 起始地址：{{startAddress}} 结束地址：{{endAddress}}',
                        {
                            startAddress,
                            endAddress,
                        },
                    ),
                };
                const params = {
                    startIp: startAddress,
                    endIp: endAddress,
                    userIds,
                };
                controlServices
                    .addIP(params)
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
                // 编辑
                const action = {
                    id: LogActionID.Modify,
                    module: id,
                    desc: t(
                        '编辑访问地址控制 起始地址：{{startAddress}} 结束地址：{{endAddress}}',
                        {
                            startAddress: recordStartAddress,
                            endAddress: recordEndAddress,
                        },
                    ),
                };
                const params = {
                    ids,
                    startIp: startAddress,
                    endIp: endAddress,
                    userIds,
                };
                controlServices
                    .updateIP(params)
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
 * 删除访问地址控制
 * @param props
 * @param ids ID列表
 * @returns
 */

export const deleteAddress =
    (
        props: PageProps,
        ids: string[],
        startAddress: string,
        endAddress: string,
    ): AppThunk =>
    async (dispatch) => {
        const {id} = props;
        const action = {
            id: LogActionID.Delete,
            module: id,
            desc: t(
                '删除访问地址控制 起始地址：{{startAddress}} 结束地址：{{endAddress}}',
                {
                    startAddress,
                    endAddress,
                },
            ),
        };
        const {code} = await controlServices.deleteIP(ids).catch(() => {
            report.fail(action);
        });

        if (code === '200') {
            message.info(t('删除成功'));
            report.success(action);
            dispatch(getAddressList(props));
        } else {
            report.fail(action);
        }
    };
