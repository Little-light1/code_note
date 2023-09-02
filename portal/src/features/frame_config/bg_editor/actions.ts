import {
    updateIndexPic,
    addIndexPic,
    deleteIndexPic,
} from '@services/frame_config';
import {message, Modal} from 'antd';
import {boolean2Int} from '@utils/boolean';
import {PageProps} from '@gwaapp/ease';
import {logError, report} from '@/common/utils/clientAction';
import {AppThunk} from '@/app/runtime';
import {i18nIns} from '@/app/i18n';
import {initBgPics} from '../actions';
import {LogActionID} from '../types';

const {t} = i18nIns;

/**
 * 更新背景图片
 * @param props
 * @param values
 * @returns
 */

export const updateBgPics =
    (props: PageProps, values: any, data: any): AppThunk =>
    (dispatch) =>
        new Promise<void>((resolve, reject) => {
            const {id} = props;
            const action = {
                id: LogActionID.ModifyBGConfig,
                module: id,
                desc: t('编辑背景页面: {{pageName}}', {
                    pageName: data.ipicName,
                }),
            };
            updateIndexPic({...values, ipicId: data.ipicId})
                .then(({code, msg}) => {
                    if (code === '200') {
                        message.info(t('保存成功'));
                        dispatch(initBgPics(props));
                        resolve();
                        report.success(action);
                    } else {
                        reject(msg);
                        report.fail(action);
                    }
                })
                .catch((error) => {
                    logError({
                        error,
                    });
                    reject(error.message);
                    report.fail(action);
                });
        });
/**
 * 启用背景图片
 * @param props
 * @param values
 * @returns
 */

export const enablePic =
    (props: PageProps, value: boolean, record: any): AppThunk =>
    async (dispatch) => {
        const action = {
            id: 'modifyBgStatus',
            module: props.id,
            desc: t('修改背景页面状态: {{name}}', {
                name: record.ipicName,
            }),
        };

        try {
            const {code} = await updateIndexPic({
                ...record,
                ipicIsenable: boolean2Int(value),
            });

            if (code === '200') {
                dispatch(initBgPics(props));
                report.success(action);
            } else {
                report.fail(action);
            }
        } catch (error) {
            report.fail(action);
        }
    };
/**
 * 新建背景图片
 * @param props
 * @param values
 * @returns
 */

export const addBgPic =
    (props: PageProps, values: any): AppThunk<Promise<void>> =>
    (dispatch) =>
        new Promise<void>((resolve, reject) => {
            const {id} = props;
            const action = {
                id: LogActionID.AddBGConfig,
                module: id,
                desc: t('新建背景页面: {{pageName}}', {
                    pageName: values.ipicName,
                }),
            };
            addIndexPic(values)
                .then(({code, msg}) => {
                    if (code === '200') {
                        message.info(t('新增成功'));
                        dispatch(initBgPics(props));
                        resolve();
                        report.success(action);
                    } else {
                        reject(msg);
                        report.fail(action);
                    }
                })
                .catch((error) => {
                    logError({
                        error,
                    });
                    reject(error.message);
                    report.fail(action);
                });
        });
/**
 * 提交
 * @param props
 * @param values
 * @param type
 * @returns
 */

export const submit =
    (props: PageProps, values: any, type: string, data?: any): AppThunk =>
    (dispatch) => {
        // 将boolean转成0|1
        const submitValues = {
            ...values,
            ipicIsenable: boolean2Int(values.ipicIsenable),
        };

        if (type === 'add') {
            return dispatch(addBgPic(props, submitValues));
        }

        return dispatch(updateBgPics(props, submitValues, data));
    };
/**
 * 删除背景图
 * @param props
 * @param data
 * @returns
 */

export const deleteBgPic =
    (props: PageProps, data?: any): AppThunk =>
    (dispatch) => {
        Modal.confirm({
            title: t('确定要删除吗'),
            onOk: async () => {
                const {id} = props;
                const action = {
                    id: LogActionID.DeleteBGConfig,
                    module: id,
                    desc: t('删除背景页面: {{pageName}}', {
                        pageName: data.ipicName,
                    }),
                };
                const {code, msg} = await deleteIndexPic(data.ipicId).catch(
                    () => {
                        report.fail(action);
                    },
                );

                if (code === '200') {
                    message.info(t('删除成功'));
                    dispatch(initBgPics(props));
                    report.success(action);
                } else {
                    Modal.error({
                        title: msg,
                    });
                    report.fail(action);
                }
            },
        });
    };
