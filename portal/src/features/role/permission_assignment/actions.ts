import {Modal, message} from 'antd';
import {delRoleDataPrivileges} from '@services/role';
import {AppThunk} from '@/app/runtime';
import {PageProps} from '@gwaapp/ease';
import {i18nIns} from '@/app/i18n';
import {closeModal} from '@components/modal';
import {submitSystem, submit} from './data_permission/actions';
import {submitFunctionPermission} from './function_permission/actions';
import {isNeedToSubmitDataForm} from './helper';
import {ALL_SYSTEM} from './data_permission/constant';
import {ROLE_COMPETENCE_MODAL_ID} from '../constant';

const {t} = i18nIns;

export function reset(props: PageProps): AppThunk {
    return (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        dispatch(
            actions.set({
                resourceIds: [],
                menuResources: [],
                selectedMenuId: '',
                selectedResourceIds: [],
                selectedMenuIds: [],
                systems: [],
                orgIds: [],
                expandOrgKeys: [],
                devices: [],
                deviceIds: [],
                activeSystem: null,
                activeScope: null,
                devicesCache: {},
                submitData: {},
                isPermissionEdited: {
                    function: false,
                    data: false,
                },
                submitStatus: {},
                orgsCache: {}, // roleOrgsCache: {},
            }),
        );
    };
}
export function submitPermission(
    props: PageProps,
    record: any,
    functionForm: any,
    dataForm: any,
): AppThunk {
    return async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const appActions = getPageSimpleActions('app');
        const {isPermissionEdited, systems} = getPageState(getState(), id);
        let isEdited = false;
        const submitStatus: any = {
            isSubmitting: true,
            queue: [],
        };

        if (isPermissionEdited.function) {
            isEdited = true;
            dispatch(
                appActions.set({
                    isShowGlobalMask: {
                        visible: true,
                        text: t('数据提交中,请稍候....'),
                    },
                }),
            );
            await dispatch(
                submitFunctionPermission({
                    props,
                    values: functionForm.current.getFieldsValue(),
                    record,
                }),
            );
            // functionForm.current?.submit().then(() => {
            //     console.log('functionForm 提交完成');
            // });
        }

        if (isPermissionEdited.data) {
            // 手动提交提交当前页修改数据
            if (isNeedToSubmitDataForm(getPageState(getState(), id))) {
                dispatch(submit(props, dataForm.current.getFieldsValue()));
            } // 当提交子系统中存在全部, 则只会提交全部

            if (isPermissionEdited.data.hasOwnProperty('all')) {
                const system = systems.find((s: any) => s.code === 'all');
                isEdited = true;
                dispatch(submitSystem(props, system, record));
                submitStatus.queue.push('all');
            } else {
                Object.keys(isPermissionEdited.data).forEach((code) => {
                    const editStatus = isPermissionEdited.data[code];

                    if (editStatus) {
                        isEdited = true;
                        const system = systems.find(
                            (s: any) => s.code === code,
                        );
                        dispatch(submitSystem(props, system, record));
                        submitStatus.queue.push(code);
                    }
                });
            }
        }

        submitStatus.count = submitStatus.queue.length;
        submitStatus.isBatchSubmit = true;

        if (isEdited) {
            dispatch(
                actions.set({
                    submitStatus,
                }),
            );
            if (submitStatus.count > 0) {
                dispatch(
                    appActions.set({
                        isShowGlobalMask: {
                            visible: true,
                            text: t('数据提交中,请稍候....'),
                        },
                    }),
                );
            } else {
                dispatch(
                    appActions.set({
                        isShowGlobalMask: false,
                    }),
                );
                dispatch(closeModal(ROLE_COMPETENCE_MODAL_ID));
                dispatch(reset(props));
            }
        } else {
            message.info(t('没有数据需要提交'));
        }
    };
}
export function recover(props: PageProps, record: any): AppThunk {
    return async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {subSystems} = getPageState(getState(), id);

        const generalHandler = () => {
            let systems = subSystems.filter(
                (system: any) => system.code !== 'RHYY',
            );
            let activeSystem = null;
            systems = [ALL_SYSTEM, ...systems];
            activeSystem = systems[0] || null;
            const activeScope = null;
            dispatch(
                actions.set({
                    isRecover: true,
                    activeScope,
                    activeSystem,
                    systems,
                    submitData: {},
                    isPermissionEdited: {
                        card: false,
                        data: false,
                    },
                    deviceIds: {},
                }),
            );
        };

        Modal.confirm({
            content: t('当前操作将会清空角色数据权限, 是否确定重置?'),
            onOk: () => {
                delRoleDataPrivileges({
                    proCode: 'all',
                    roleId: record.id,
                }).then(({code}) => {
                    if (code === '200') {
                        message.info(t('重置数据权限成功'));
                        generalHandler();
                    }
                });
            },
        });
    };
}
