import {message} from 'antd';
import {
    fetchAddMenu,
    fetchUpdateResource,
    fetchDeleteResource,
    fetchUpdateMenu,
} from '@services/menu_management';
import _ from 'lodash';
import {PageProps} from '@gwaapp/ease';
import {randomStr} from '@/common/utils/string';
import {boolean2Int} from '@/common/utils/boolean';
import {AppThunk} from '@/app/runtime';
import {report} from '@/common/utils/clientAction';
import {i18nIns} from '@/app/i18n';
import {asyncMenuList, asyncResourceList} from '../actions';
import {LogActionID} from '../types';

const {t} = i18nIns;

/**
 * 获取菜单列表
 * @param props
 * @returns
 */

const addMenu =
    (props: PageProps, values: Record<string, any>): AppThunk<Promise<void>> =>
    (dispatch, getState, {getPageSimpleActions, getPageState}) =>
        new Promise((resolve, reject) => {
            const {id} = props;
            const {flatMenuTree, currentTabKey} = getPageState(getState(), id);
            const actions = getPageSimpleActions(id);
            const action = {
                id: LogActionID.Add,
                module: id,
                desc: t('新增菜单：{{name}}', {
                    name: values.menuName,
                }),
            };
            const submitValues = {...values};
            const parent = flatMenuTree[values.menuParentid[0]]; // 直接挂在产品下

            if (parent && parent.type === 'product') {
                submitValues.menuParentid = 0;
            } // 挂在菜单下
            else {
                submitValues.menuParentid = submitValues.menuParentid[0];
            }

            submitValues.applicationCode = currentTabKey;
            submitValues.menuCode = randomStr();
            submitValues.menuRemark = '';
            submitValues.menuIsdel = 0; // 不必要字段 @章
            // 不能有空格

            submitValues.menuRoutingPath = _.trim(submitValues.menuRoutingPath);
            fetchAddMenu(submitValues)
                .then(({code, data}) => {
                    if (code === '200') {
                        // 刷新外部列表
                        dispatch(asyncMenuList(props));
                        dispatch(
                            actions.set({
                                currentMenu: data,
                            }),
                        );
                        dispatch(asyncResourceList(props));
                        resolve();
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
        record: any,
    ): AppThunk<
        Promise<{
            isRefreshFrameMenus: boolean;
            isCloseModal?: boolean;
        }>
    > =>
    (dispatch, getState, {getPageState}) =>
        new Promise((resolve, reject) => {
            const {id} = props;
            const {currentMenu, flatMenuTree} = getPageState(getState(), id); // 启用禁用转换

            values.menuEnable = boolean2Int(values.menuEnable);
            values.menuIconEnable = boolean2Int(values.menuIconEnable);
            values.menuVisible = boolean2Int(values.menuVisible); // 当前没有菜单信息, 任然未创建菜单

            if (!currentMenu) {
                dispatch(addMenu(props, values))
                    .then(() =>
                        resolve({
                            isRefreshFrameMenus: true,
                        }),
                    )
                    .catch(() => reject());
            } else {
                const action = {
                    id: LogActionID.Modify,
                    module: id,
                    desc: t('编辑菜单：{{name}}', {
                        name: record.menuName,
                    }),
                };
                const submitMenu = {...currentMenu, ...values};

                if (values.menuParentid instanceof Array) {
                    submitMenu.menuParentid = submitMenu.menuParentid[0];
                }

                const parent = flatMenuTree[values.menuParentid[0]]; // 直接挂在产品下

                if (parent && parent.type === 'product') {
                    submitMenu.menuParentid = 0;
                }

                fetchUpdateMenu(submitMenu)
                    .then(({code}) => {
                        if (code === '200') {
                            message.info(t('保存成功'));
                            dispatch(asyncMenuList(props));
                            resolve({
                                isRefreshFrameMenus: true,
                                isCloseModal: true,
                            });
                            report.success(action);
                        } else {
                            reject();
                            report.fail(action);
                        }
                    })
                    .catch(() => {
                        reject();
                        report.fail(action);
                    });
            }
        });
/**
 * 启/禁用
 * @param props
 * @param value
 * @param record
 * @returns
 */

export const updateResourceEnable =
    (props: PageProps, record: Record<string, any>, value: boolean): AppThunk =>
    async (dispatch) => {
        const {code} = await fetchUpdateResource({
            ...record,
            msourceEnable: boolean2Int(value),
        });

        if (code === '200') {
            message.info(t('保存成功'));
            dispatch(asyncResourceList(props));
        }
    };
/**
 * 删除内容
 * @param props
 * @param value
 * @param record
 * @returns
 */

export const deleteResource =
    (props: PageProps, record: Record<string, any>): AppThunk =>
    async (dispatch) => {
        const {id} = props;
        const action = {
            id: LogActionID.DeleteResource,
            module: id,
            desc: t('删除资源：{{name}}', {
                name: record.msourceName,
            }),
        };
        const {code} = await fetchDeleteResource(record.msourceId).catch(() => {
            report.fail(action);
        });

        if (code === '200') {
            message.info(t('删除成功'));
            dispatch(asyncResourceList(props));
            report.success(action);
        } else {
            report.fail(action);
        }
    };
