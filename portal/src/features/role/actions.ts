/*
 * @Author: sds
 * @Date: 2022-01-02 13:52:30
 * @Last Modified by: sun.t.t
 * @Last Modified time: 2022-11-10 15:30:30
 */
import {message, Modal} from 'antd';
import * as roleServices from '@services/role';
import {AppThunk} from '@/app/runtime';
import {PageProps} from '@gwaapp/ease';
import {fetchDictModelVOPageByTypeCode} from '@services/data_dict_config';
import {report} from '@/common/utils/clientAction';
import {i18nIns} from '@/app/i18n';
import {LogActionID} from './types';

const {t} = i18nIns;

/**
 * 获取角色列表
 * @param props
 * @returns
 */

export function getRoleList(props: {id: string}): AppThunk {
    return async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const simpleActions = getPageSimpleActions(id);
        const {pagination, searchKey, roleTypeSelectedKey} = getPageState(
            getState(),
            id,
        );
        const paginationClone = JSON.parse(JSON.stringify(pagination));
        const bData = {
            all: false,
            pageNum: paginationClone.current,
            pageSize: paginationClone.pageSize,
        };
        const params = {
            searchValue: searchKey,
            roleType: roleTypeSelectedKey,
        };
        const action = {
            id: 'search',
            module: id,
            desc: t('查询角色信息'),
        };
        dispatch(
            simpleActions.set({
                isListLoading: true,
            }),
        );
        roleServices
            .getRoleList(params, bData)
            .then((res) => {
                report.success(action);
                const {data} = res;
                const listData = data?.list || [];
                paginationClone.total = data.total;
                dispatch(
                    simpleActions.set({
                        listData,
                        pagination: paginationClone,
                    }),
                );
            })
            .catch((e) => {
                console.log(e);
                report.fail(action);
            })
            .finally(() => {
                dispatch(
                    simpleActions.set({
                        isListLoading: false,
                    }),
                );
            });
    };
}
/**
 * 获取角色类型list
 * @param props
 * @returns
 */

export function getRoleTypeList(props: {id: string}): AppThunk {
    return async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const simpleActions = getPageSimpleActions(id);
        const bData = {
            all: true,
        };
        const typeCode = 'ROLE_TYPE';
        fetchDictModelVOPageByTypeCode(typeCode, bData)
            .then((res) => {
                const {data} = res;
                const listData = data || [];
                dispatch(
                    simpleActions.set({
                        roleTypeList: listData.filter(
                            (item) => item.dictdataIsenabled,
                        ),
                    }),
                );
            })
            .catch((e) => console.log(e));
    };
}
/**
 * 頁碼改變
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
            dispatch(getRoleList(props));
        }
    };
}
/**
 * 删除角色
 * @param props
 * @param record
 * @returns
 */

export function deleteRole(props: any, record: any): AppThunk {
    return (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const simpleActions = getPageSimpleActions(id);
        const param = {
            id: record.id,
        };

        const onOk = () => {
            const action = {
                id: LogActionID.Delete,
                module: id,
                desc: t('删除角色:  {{roleName}}', {
                    roleName: record.name,
                }),
            };
            dispatch(
                simpleActions.set({
                    isListLoading: true,
                }),
            );
            roleServices
                .deleteRole(param)
                .then((res) => {
                    const {code} = res;

                    if (code === '200') {
                        dispatch(getRoleList(props));
                        message.info(t('删除成功'));
                        report.success(action);
                    } else {
                        report.fail(action);
                    }
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

        Modal.confirm({
            title: t('是否确定删除选中的记录?'),
            okText: t('是'),
            cancelText: t('否'),
            onOk,
        });
    };
}
/**
 * 获取角色关联用户
 * @param props
 * @param record
 * @returns
 */

export function getLinkedUsers(props: any, record: any): AppThunk {
    return (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const simpleActions = getPageSimpleActions(id);
        const params = {
            roleId: record.id,
        };
        roleServices
            .getLinkedUsers(params)
            .then((res) => {
                const {code, data} = res;

                if (code === '200') {
                    dispatch(
                        simpleActions.set({
                            linkedUsers: data,
                        }),
                    );
                }
            })
            .catch((e) => console.log(e));
    };
}
/**
 * 获取角色未关联用户
 * @param props
 * @param record
 * @returns
 */

export function getUnLinkedUsers(props: any, record: any): AppThunk {
    return (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const simpleActions = getPageSimpleActions(id);
        const params = {
            exRoleId: record.id,
        };
        roleServices
            .getUnLinkedUsers(params)
            .then((res) => {
                const {code, data} = res;

                if (code === '200') {
                    dispatch(
                        simpleActions.set({
                            unlinkedUsers: data,
                        }),
                    );
                }
            })
            .catch((e) => console.log(e));
    };
} // TODO:暂时取消更新

export function updateRole(props: any, type: any, record: any): AppThunk {
    return (dispatch) => {
        const action = {
            id: 'modifyRoleStatus',
            module: props.id,
            desc: t('修改角色状态:  {{name}}', {
                name: record.name,
            }),
        };
        roleServices
            .updateRole({
                id: record.id,
                roleType: record.roleType,
                code: record.code,
                state: type,
            })
            .then((res) => {
                const {code} = res;

                if (code === '200') {
                    dispatch(getRoleList(props));
                    message.info(t('更新角色成功'));
                    report.success(action);
                } else {
                    report.fail(action);
                }
            })
            .catch((e) => {
                console.log(e);
                report.fail(action);
            });
    };
}
/**
 * 页面初始化
 * @param props
 * @returns
 */

export function onInit(props: PageProps): AppThunk {
    return (dispatch) => {
        dispatch(getRoleList(props));
        dispatch(getRoleTypeList(props));
    };
}
