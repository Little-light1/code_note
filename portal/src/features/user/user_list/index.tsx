/*
 * @Author: sds
 * @Date: 2021-12-02 08:59:31
 * @Last Modified by: gongzunbao
 * @Last Modified time: 2023-06-26 19:14:14
 */
import React from 'react';
import {shallowEqual} from 'react-redux';
import {Space} from 'antd';
import {ColumnsType} from 'antd/es/table';
import {
    EditOutlined,
    DeleteOutlined,
    LockOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {PAGE_SIZE_OPTIONS, Table} from '@components/table';
import {useModal, useAction, PageProps} from '@gwaapp/ease';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useTranslation} from 'react-i18next';
import {emailEncryption, phoneEncryption} from '@/common/utils/reg';
import {
    USER_MODAL_ID,
    USER_PASSWORD_MODAL_ID,
    USER_ROLE_MODAL_ID,
    SYS_USER,
} from '../constant';
import styles from './styles.module.scss';
import * as actions from '../actions';
import useTableList from './useTableList';

interface UserListProps {
    pageProps: PageProps;
}

/**
 * 用户列表
 * @param {object} param
 */
const UserList = ({pageProps}: UserListProps) => {
    // 页面ID，菜单
    const {id, menu} = pageProps;
    // 设备树loading
    const isTreeLoading = useAppSelector(
        (state) => state[id].isTreeLoading,
        shallowEqual,
    );
    // 选择的行keys
    const selectedRowKeys = useAppSelector(
        (state) => state[id].selectedRowKeys,
        shallowEqual,
    );
    // 设备树选择的key
    const selectedKeys = useAppSelector(
        (state) => state[id].selectedKeys,
        shallowEqual,
    );
    // 模糊搜索key
    const searchKey = useAppSelector(
        (state) => state[id].searchKey,
        shallowEqual,
    );
    // 使用周期key
    const timeLimitKey = useAppSelector(
        (state) => state[id].timeLimitKey,
        shallowEqual,
    );
    // 使用状态key
    const userStateKey = useAppSelector(
        (state) => state[id].userStateKey,
        shallowEqual,
    );
    // 列表当前页
    const current = useAppSelector((state) => state[id].current, shallowEqual);
    // 列表页数
    const pageSize = useAppSelector(
        (state) => state[id].pageSize,
        shallowEqual,
    );
    // 是否更新列表
    const update = useAppSelector((state) => state[id].update, shallowEqual);
    // 列表hooks
    const {listData, isListLoading, total} = useTableList({
        current,
        pageSize,
        selectedKeys,
        searchKey,
        timeLimitKey,
        userStateKey,
        update,
    });
    // 公共方法
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const {getPageSimpleActions} = useAction();
    const simpleActions = getPageSimpleActions(id);
    const {openModal} = useModal();

    // 复选框
    const rowSelection = {
        selectedRowKeys,
        onChange: (Keys: any, rows: any) => {
            dispatch(
                simpleActions.set({
                    selectedRowKeys: Keys,
                    selectedRows: rows,
                }),
            );
        },
    };

    /**
     * 编辑用户
     * @param {object} record
     */
    const editUser = (record: any) => {
        dispatch(actions.getLinkedRole(pageProps, record));
        dispatch(actions.getRoleList(pageProps));
        openModal(USER_MODAL_ID, {
            type: 'edit',
            record,
        });
    };

    /**
     * 注销用户
     * @param {object} record
     */
    const deleteUser = (record: any) => {
        dispatch(actions.deleteUser(pageProps, record));
    };

    /**
     * 重置密码
     * @param {object} record
     */
    const resetPassword = (record: any) => {
        openModal(USER_PASSWORD_MODAL_ID, {
            record,
        });
    };

    /**
     * 关联角色
     * @param {object} record
     */
    const associateRole = (record: any) => {
        dispatch(actions.getLinkedRole(pageProps, record));
        openModal(USER_ROLE_MODAL_ID, {
            record,
        });
    };

    // 列
    const columns: ColumnsType<any> = [
        // 指定表格数据源
        {
            title: t('序号'),
            dataIndex: 'index',
            key: 'index',
            ellipsis: true,
            align: 'center',
            width: 90,
            render: (text: any, record: any, index: any) => {
                const number = (current - 1) * pageSize + index + 1;
                return number;
            },
        },
        {
            title: t('用户账号'),
            dataIndex: 'loginName',
            key: 'loginName',
            width: 180,
            ellipsis: true,
            align: 'center',
        },
        {
            title: t('用户名称'),
            dataIndex: 'userName',
            key: 'userName',
            width: 180,
            ellipsis: true,
            align: 'center',
        },
        {
            title: t('所属组织'),
            dataIndex: 'organization',
            key: 'organization',
            width: 220,
            ellipsis: true,
            align: 'center',
            render: (value: any) => value?.name,
        },
        {
            title: t('手机号码'),
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: 160,
            ellipsis: true,
            align: 'center',
            render: (text) => (text && phoneEncryption(text)) || '--',
        },
        {
            title: t('用户类型'),
            dataIndex: 'type',
            key: 'type',
            width: 180,
            ellipsis: true,
            align: 'center',
            render: (value: any) => value?.desc,
        },
        {
            title: t('标签'),
            dataIndex: 'tagList',
            key: 'tagList',
            width: 150,
            ellipsis: true,
            align: 'center',
            render: (value: any) => {
                const tags: any[] = [];
                value.forEach((ele: any) => tags.push(ele?.name));
                return String(tags);
            },
        },
        {
            title: t('邮箱'),
            dataIndex: 'email',
            key: 'email',
            width: 180,
            ellipsis: true,
            align: 'center',
            render: (text) => (text && emailEncryption(text)) || '--',
        },
        {
            title: t('使用周期'),
            dataIndex: 'timeLimit',
            key: 'timeLimit',
            width: 180,
            ellipsis: true,
            align: 'center',
            render: (val) => val.desc,
        },
        {
            title: t('使用期限'),
            dataIndex: 'startDate',
            key: 'startDate',
            width: 180,
            ellipsis: true,
            align: 'center',
            render: (startDate, record) => {
                const endDate = record.endDate;
                let re = '';

                if (startDate || endDate) {
                    re = `${startDate}/${endDate}`;
                }

                return re;
            },
        },
        {
            title: t('状态'),
            dataIndex: 'state',
            key: 'state',
            width: 250,
            ellipsis: true,
            align: 'center',
            render: (value: any) => value.desc,
        },
        {
            title: t('操作'),
            dataIndex: 'operation',
            key: 'operation',
            ellipsis: true,
            align: 'center',
            fixed: 'right',
            width: 200,
            render: (value: any, record: any) => {
                const active = record?.state?.value === 3;
                const sysFlag = SYS_USER.includes(record?.loginName);
                return (
                    <Space size="middle">
                        <EditOutlined
                            className={styles.handleIcon}
                            title={t('编辑')}
                            onClick={() => {
                                editUser(record);
                            }}
                            action={{
                                id: 'addOrUpdate',
                                module: id,
                                position: [
                                    menu?.menuName ?? '',
                                    t('编辑'),
                                    t('保存'),
                                ],
                                action: 'modify',
                                wait: true,
                            }}
                        />
                        <DeleteOutlined
                            className={
                                active
                                    ? styles.handleIconDisabled
                                    : styles.handleIcon
                            }
                            title={t('注销')}
                            onClick={() => {
                                deleteUser(record);
                            }}
                            action={{
                                id: 'delete',
                                module: id,
                                position: [
                                    menu?.menuName ?? '',
                                    t('注销'),
                                    t('是'),
                                ],
                                action: 'delete',
                                wait: true,
                            }}
                        />
                        <LockOutlined
                            className={
                                record?.loginName === 'BDMSAdmin'
                                    ? styles.handleIconDisabled
                                    : styles.handleIcon
                            }
                            title={t('重置密码')}
                            onClick={() => {
                                resetPassword(record);
                            }}
                            action={{
                                id: 'resetPassword',
                                module: id,
                                position: [
                                    menu?.menuName ?? '',
                                    t('重置密码'),
                                    t('保存'),
                                ],
                                action: 'modify',
                                wait: true,
                            }}
                        />
                        <UserOutlined
                            className={
                                sysFlag
                                    ? styles.handleIconDisabled
                                    : styles.handleIcon
                            }
                            title={t('用户角色')}
                            onClick={() => {
                                associateRole(record);
                            }}
                            action={{
                                id: 'associateRole',
                                module: id,
                                position: [
                                    menu?.menuName ?? '',
                                    t('关联角色'),
                                    t('保存'),
                                ],
                                action: 'modify',
                                wait: true,
                            }}
                        />
                    </Space>
                );
            },
        },
    ];
    return (
        <Table
            loading={isTreeLoading || isListLoading}
            columns={columns}
            dataSource={listData}
            rowSelection={{...rowSelection}}
            rowKey="id"
            bordered
            pagination={{
                position: ['bottomLeft'],
                current,
                pageSize,
                total,
                pageSizeOptions: PAGE_SIZE_OPTIONS,
                onChange: (cur, size) => {
                    dispatch(
                        simpleActions.set({
                            current: cur,
                            pageSize: size,
                        }),
                    );
                },
                showSizeChanger: true,
            }}
        />
    );
};

export default UserList;
