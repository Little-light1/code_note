/*
 * @Author: sds
 * @Date: 2022-01-02 13:51:14
 * @Last Modified by: sun.t
 * @Last Modified time: 2022-12-04 14:26:36
 */
import React from 'react';
import {shallowEqual} from 'react-redux';
import {Space, Switch} from 'antd';
import {ColumnsType} from 'antd/es/table';
import {PAGE_SIZE_OPTIONS, Table} from '@components/table';
import {useModal, PageProps, useAction} from '@gwaapp/ease';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useTranslation} from 'react-i18next';
import {
    ROLE_MODAL_ID,
    ROLE_COMPETENCE_MODAL_ID,
    ROLE_USER_MODAL_ID,
} from '../constant';
import styles from './styles.module.scss';
import * as actions from '../actions';
import {LogActionID} from '../types';

interface UserListProps {
    pageProps: PageProps;
}

const RoleList = ({pageProps}: UserListProps) => {
    const {id, title, menu} = pageProps;
    const listData = useAppSelector(
        (state) => state[id].listData,
        shallowEqual,
    );
    const isListLoading = useAppSelector(
        (state) => state[id].isListLoading,
        shallowEqual,
    );
    const pagination = useAppSelector(
        (state) => state[id].pagination,
        shallowEqual,
    );
    const dispatch = useAppDispatch();
    const {getPageSimpleActions} = useAction();
    const simpleActions = getPageSimpleActions(id);
    const {openModal} = useModal();
    const {t} = useTranslation(); // 启动、禁用

    const onChangeState = (checked: boolean, record: any) => {
        const type = checked ? 0 : 1;
        dispatch(actions.updateRole(pageProps, type, record));
    }; // 编辑

    const editRole = (record: any) => {
        openModal(ROLE_MODAL_ID, {
            type: 'edit',
            record,
        });
    }; // 删除

    const deleteRole = (record: any) => {
        dispatch(actions.deleteRole(pageProps, record));
    }; // 權限分配

    const assignPermissions = (record: any) => {
        const {roleType} = record; // 数据权限角色激活数据权限模块
        dispatch(
            simpleActions.set({
                selectedRecord: record,
            }),
        );
        if (Number(roleType) === 5) {
            dispatch(
                simpleActions.set({
                    activeKey: 'data',
                }),
            );
        } else {
            dispatch(
                simpleActions.set({
                    activeKey: 'function',
                }),
            );
        }

        openModal(ROLE_COMPETENCE_MODAL_ID, {
            record,
        });
    }; // 关联用戶

    const associateUser = (record: any) => {
        dispatch(actions.getUnLinkedUsers(pageProps, record));
        dispatch(actions.getLinkedUsers(pageProps, record));
        openModal(ROLE_USER_MODAL_ID, {
            record,
        });
    }; // 操作列关联关系

    const handleMap = [
        {
            title: t('权限分配'),
            event: assignPermissions,
        },
        {
            title: t('角色权限'),
            event: associateUser,
            action: {
                id: 'roleAssignments',
                module: id,
                position: [menu?.menuName ?? '', t('角色分配'), t('保存')],
                action: 'modify',
                wait: true,
            },
        },
        {
            title: t('编辑'),
            event: editRole,
            action: {
                id: LogActionID.Modify,
                module: id,
                position: [menu?.menuName ?? '', t('编辑'), t('确定')],
                action: 'modify',
                wait: true,
            },
        },
        {
            title: t('删除'),
            event: deleteRole,
            action: {
                id: LogActionID.Delete,
                module: id,
                position: [menu?.menuName ?? '', t('删除'), t('是')],
                action: 'delete',
                wait: true,
            },
        },
    ]; // 列

    const columns: ColumnsType<any> = [
        {
            title: t('序号'),
            dataIndex: 'index',
            key: 'index',
            ellipsis: true,
            align: 'center',
            width: 100,
            render: (text: any, record: any, index: any) => {
                const number =
                    (pagination.current - 1) * pagination.pageSize + index + 1;
                return number;
            },
        },
        {
            title: t('角色编码'),
            dataIndex: 'code',
            key: 'code',
            width: 200,
            ellipsis: true,
            align: 'center',
        },
        {
            title: t('角色名称'),
            dataIndex: 'name',
            width: 350,
            key: 'name',
            ellipsis: true,
            align: 'center',
        },
        {
            title: t('角色类型'),
            dataIndex: 'roleTypeValue',
            width: 250,
            key: 'roleTypeValue',
            ellipsis: true,
            align: 'center', // render: (map: any) => map.roleTypeValue,
        },
        {
            title: t('状态'),
            dataIndex: 'state',
            key: 'state',
            width: 120,
            ellipsis: true,
            align: 'center',
            render: (value: any, record: any) => (
                <Switch
                    checkedChildren={t('启用')}
                    unCheckedChildren={t('禁用')}
                    checked={!value?.value}
                    onChange={(checked) => {
                        onChangeState(checked, record);
                    }}
                    action={{
                        id: 'modifyRoleStatus',
                        module: pageProps.id,
                        position: [menu?.menuName ?? '', t('状态')],
                        action: 'modify',
                        wait: true,
                    }}
                />
            ),
        },
        {
            title: t('操作'),
            dataIndex: 'operation',
            key: 'operation',
            ellipsis: true,
            align: 'center',
            fixed: 'right',
            width: 380,
            render: (value: any, record: any) => (
                <Space size="middle">
                    {handleMap.map((element, index) => {
                        // 系统预置角色、本子级角色 不可操作列（本子级可操作角色权限）
                        const roleCode = record.code;
                        const sysFlag = roleCode?.startsWith('sys_'); // 系统预置角色

                        const sonLevelFlag = roleCode === 'LocalAndSonLevel'; // 本子级
                        const disabled =
                            record.state.value === 1 &&
                            (element?.event === assignPermissions ||
                                element?.event === associateUser); // 禁用状态，权限分配、角色权限禁用

                        const flag = (sysFlag || sonLevelFlag) && index !== 1; // 角色权限可查看

                        const rd = (
                            <span
                                className={
                                    flag || disabled
                                        ? styles.handleBottonDisabled
                                        : styles.handleBotton
                                }
                                action={element.action}
                                onClick={() => {
                                    element.event(record);
                                }}
                            >
                                {element.title}
                            </span>
                        );
                        return rd;
                    })}
                </Space>
            ),
        },
    ];
    return (
        <Table
            loading={isListLoading}
            columns={columns}
            dataSource={listData}
            rowKey="id"
            bordered
            pagination={{
                position: ['bottomLeft'],
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                // showTotal: (total: any) => `${t('共')} ${total} ${t('条')}`,
                showTotal: (total: any) => t(`共{{total}}条`, {total}),
                pageSizeOptions: PAGE_SIZE_OPTIONS,
                onChange: (page, pageSize) => {
                    dispatch(actions.changePage(pageProps, page, pageSize));
                },
                showSizeChanger: true,
            }}
        />
    );
};

export default RoleList;
