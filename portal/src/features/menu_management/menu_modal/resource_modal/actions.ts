import {fetchAddResource, fetchUpdateResource} from '@services/menu_management';
import {message} from 'antd';
import {AppThunk} from '@/app/runtime';
import {PageProps} from '@gwaapp/ease';
import {boolean2Int} from '@/common/utils/boolean';
import {report} from '@/common/utils/clientAction';
import {i18nIns} from '@/app/i18n';
import {asyncResourceList} from '../../actions';
import {LogActionID} from '../../types';

const {t} = i18nIns;

/**
 * 增加页面资源
 * @param props
 * @param values
 * @returns
 */

export const addResource =
    (
        props: PageProps,
        values: Record<string, any>,
        menuId: string,
    ): AppThunk<Promise<void>> =>
    (dispatch) =>
        new Promise((resolve, reject) => {
            const {id} = props;
            const action = {
                id: LogActionID.AddResource,
                module: id,
                desc: t('新增资源：{{name}}', {
                    name: values.msourceName,
                }),
            };
            fetchAddResource({
                ...values,
                menuId,
                msourceIsdel: 0,
                msourceRemark: '',
                msourceEnable: boolean2Int(values.msourceEnable),
            })
                .then(({code}) => {
                    if (code === '200') {
                        resolve();
                        message.info(t('新增成功'));
                        dispatch(asyncResourceList(props));
                        report.success(action);
                    } else {
                        reject();
                        report.fail(action);
                    }
                })
                .catch(() => {
                    report.fail(action);
                });
        });
/**
 * 更新页面资源
 * @param props
 * @param values
 * @returns
 */

export const updateResource =
    (
        props: PageProps,
        values: Record<string, any>,
        record: Record<string, any>,
    ): AppThunk<Promise<void>> =>
    (dispatch) =>
        new Promise((resolve, reject) => {
            const {id} = props;
            const action = {
                id: LogActionID.ModifyResource,
                module: id,
                desc: t('编辑资源：{{name}}', {
                    name: record.msourceName,
                }),
            };
            fetchUpdateResource({
                ...record,
                ...values,
                msourceEnable: boolean2Int(values.msourceEnable),
            })
                .then(({code}) => {
                    if (code === '200') {
                        resolve();
                        message.info(t('更新成功'));
                        dispatch(asyncResourceList(props));
                        report.success(action);
                    } else {
                        reject();
                        report.fail(action);
                    }
                })
                .catch(() => {
                    report.fail(action);
                });
        });
/**
 * 提交
 * @param props
 * @returns
 */

export const submit =
    (
        props: PageProps,
        values: Record<string, any>,
        type: 'add' | 'edit',
        record: Record<string, any>,
    ): AppThunk<Promise<void>> =>
    (dispatch, getState, {getPageState}) =>
        new Promise((resolve, reject) => {
            const {id} = props;
            const {currentMenu} = getPageState(getState(), id);

            if (!currentMenu) {
                return;
            } // 当前没有菜单信息, 任然未创建菜单

            let doSubmit = () =>
                dispatch(addResource(props, values, currentMenu.menuId));

            if (type === 'edit') {
                doSubmit = () =>
                    dispatch(updateResource(props, values, record));
            }

            doSubmit()
                .then(() => resolve())
                .catch(() => reject());
        });
