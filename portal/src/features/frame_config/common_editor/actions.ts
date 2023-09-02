import {message, Modal} from 'antd';
import {
    updateCommonConfig,
    deleteCommonConfig,
    addCommonConfig,
} from '@services/frame_config';
import {PageProps} from '@gwaapp/ease';
import {logError, report} from '@/common/utils/clientAction';
import {boolean2Int} from '@/common/utils/boolean';
import {AppThunk} from '@/app/runtime';
import {i18nIns} from '@/app/i18n';
import {initCommonConfig} from '../actions';
import {LogActionID} from '../types';

const {t} = i18nIns;

/**
 * 启用通用配置
 * @param props
 * @param values
 * @returns
 */

export const enableCommonConfig =
    (props: PageProps, value: boolean, record: any): AppThunk<Promise<void>> =>
    (dispatch) =>
        new Promise<void>((resolve, reject) => {
            const action = {
                id: 'modifyCommonStatus',
                module: props.id,
                desc: t('修改通用功能状态: {{name}}', {
                    name: record.cconfigName,
                }),
            };
            updateCommonConfig({...record, cconfigIsenable: boolean2Int(value)})
                .then(({code}) => {
                    if (code === '200') {
                        dispatch(initCommonConfig(props));
                        report.success(action);
                        resolve();
                    } else {
                        reject();
                        report.fail(action);
                    }
                })
                .catch((error: any) => {
                    logError({
                        error,
                    });
                    reject();
                    report.fail(action);
                });
        });
/**
 * 删除
 * @param props
 * @param value
 * @param record
 * @returns
 */

export const deleteCommon =
    (props: PageProps, data: any): AppThunk<Promise<void>> =>
    (dispatch) =>
        new Promise<void>((resolve, reject) => {
            Modal.confirm({
                title:
                    data.children && data.children.length
                        ? t('存在子菜单，确定要删除吗')
                        : t('确定要删除吗'),
                onOk: async () => {
                    const {id} = props;
                    const action = {
                        id: LogActionID.DeleteCommonConfig,
                        module: id,
                        desc: t('删除通用功能: {{funcName}}', {
                            funcName: data.cconfigName,
                        }),
                    };

                    try {
                        const {code, msg} = await deleteCommonConfig(
                            data.cconfigId,
                        );

                        if (code === '200') {
                            // message.info({
                            //     title: t('删除成功'),
                            // });
                            message.info(t('删除成功'));
                            dispatch(initCommonConfig(props));
                            resolve();
                            report.success(action);
                        } else {
                            message.error({
                                title: msg,
                            });
                            reject();
                            report.fail(action);
                        }
                    } catch (error: any) {
                        logError({
                            error,
                        });
                        reject();
                        report.fail(action);
                    }
                },
                onCancel: () => {
                    reject();
                },
            });
        });
/**
 * 提交
 * @param props
 * @param values
 * @returns
 */

export const submit =
    (
        props: PageProps,
        values: Record<string, any>,
        modalType: string,
        data: any,
    ): AppThunk<Promise<void>> =>
    (dispatch) =>
        new Promise<void>((resolve, reject) => {
            let service = addCommonConfig;
            const submitValues: any = {
                ...values,
                cconfigIsenable: boolean2Int(values.cconfigIsenable),
            };
            const {id} = props; // 是否为编辑，否则为新增

            const isEdit = modalType === 'edit';
            const logAction: any = {
                id: isEdit
                    ? LogActionID.ModifyCommonConfig
                    : LogActionID.AddCommonConfig,
                module: id,
            };

            if (isEdit) {
                service = updateCommonConfig;
                submitValues.cconfigId = data.cconfigId;
                logAction.desc = t('编辑通用功能: {{funcName}}', {
                    funcName: data.cconfigName,
                });
            } else {
                if (data) {
                    submitValues.cconfigParentid = data.cconfigId;
                }
                logAction.desc = t('新建通用功能: {{funcName}}', {
                    funcName: submitValues.cconfigName,
                });
            }

            service(submitValues)
                .then(({code, msg}) => {
                    if (code === '200') {
                        message.info(t('保存成功'));
                        dispatch(initCommonConfig(props));
                        resolve();
                        report.success(logAction);
                    } else {
                        message.error({
                            title: msg,
                        });
                        reject();
                        report.fail(logAction);
                    }
                })
                .catch((error: any) => {
                    logError({
                        error,
                    });
                    reject();
                    report.fail(logAction);
                });
        });
