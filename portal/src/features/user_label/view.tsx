/*
 * @Author: mikey.zhaopeng
 * @Date: 2021-12-02 16:39:27
 * @Last Modified by: Chen.zi.wei
 * @Last Modified time: 2022-11-21 10:33:49
 */
import React, {FC, useMemo} from 'react';
import {shallowEqual} from 'react-redux';
import {Button, Space, Input} from 'antd';
import {PAGE_SIZE_OPTIONS, Table} from '@components/table';
import {usePage, PageProps, useModal} from '@gwaapp/ease';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import PortalIcon from '@/components/icon';
import {report} from '@/common/utils/clientAction';
import UpdateModal from './update_modal'; // 引入弹窗组件

import styles from './styles.module.scss';
import {onInit, changePage, deleteData, searchData, startEdit} from './actions';

const {Search} = Input; // Input 包含 search 在此定义一下

const USER_LABEL_MODAL_ID = 'userLabel';

const UserLabel: FC<any> = (props: PageProps) => {
    const {id, menu} = props;
    const {tableDataSource, isTableLoading, total, pageSize, page} =
        useAppSelector((state) => state[id], shallowEqual);
    const dispatch = useAppDispatch();
    const {openModal} = useModal();
    const {t} = useTranslation();
    const columns = useMemo(
        () => [
            // {
            //   title: t('userLabel.idCode'),
            //   name: '标签编码',
            //   dataIndex: 'id',
            //   key: 'id',
            //   width: 350,
            //   align: 'center',
            // },
            {
                title: t('标签名称'),
                name: '标签名称',
                dataIndex: 'name',
                key: 'name',
                width: 350,
                align: 'center',
            },
            {
                title: t('用户数量'),
                dataIndex: 'userList',
                name: '用户数量',
                align: 'center',
                width: 200,
                render: (text: string | any[]) =>
                    text ? <span>{text.length}</span> : null,
            },
            {
                title: t('标签描述'),
                dataIndex: 'remark',
                key: 'remark',
                name: '标签描述',
                width: 350,
                align: 'center',
                render: (text: string | any[]) =>
                    text ? <span>{text}</span> : '--',
            },
            {
                title: t('操作'),
                dataIndex: 'operation',
                key: 'operation',
                name: '操作',
                align: 'center',
                render: (
                    text: any,
                    record: {
                        userList: string | any[];
                    },
                ) => (
                    <Space size="middle">
                        <PortalIcon
                            iconClass="icon-portal-edit"
                            className={styles.commonOperationIcon}
                            title={t('编辑')}
                            onClick={() =>
                                dispatch(
                                    startEdit(props, record, () =>
                                        openModal(USER_LABEL_MODAL_ID, {
                                            type: 'edit',
                                            node: record,
                                        }),
                                    ),
                                )
                            }
                            action={{
                                id: 'addUpdate',
                                module: id,
                                position: [
                                    menu?.menuName ?? '',
                                    t('编辑'),
                                    t('确定'),
                                ],
                                action: 'modify',
                                wait: true,
                            }}
                        />
                        <PortalIcon
                            iconClass="icon-portal-delete"
                            className={styles.commonOperationIcon}
                            disabled={record.userList.length !== 0}
                            title={
                                record.userList.length !== 0
                                    ? t('标签下存在用户 , 无法删除')
                                    : t('删除')
                            }
                            onClick={() => {
                                dispatch(deleteData(props, record));
                            }}
                            action={{
                                id: 'addUpdate',
                                module: id,
                                position: [
                                    menu?.menuName ?? '',
                                    t('删除'),
                                    t('是'),
                                ],
                                action: 'delete',
                                wait: true,
                            }}
                        />
                    </Space>
                ),
            },
        ],
        [dispatch, id, menu?.menuName, openModal, props, t],
    );

    const inputChange = (e: any) => {
        if (e.target.value === '') {
            dispatch(searchData(props, e.target.value));
        }
    };

    usePage({...props, init: (pageProps) => dispatch(onInit(pageProps))});
    return (
        <div className={styles.searchView}>
            <div className={styles.topContainer}>
                <div>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<PortalIcon iconClass="icon-portal-add" />}
                        onClick={() =>
                            openModal(USER_LABEL_MODAL_ID, {
                                type: 'add',
                            })
                        }
                        action={{
                            id: 'addUpdate',
                            module: id,
                            position: [
                                menu?.menuName ?? '',
                                t('新建'),
                                t('确定'),
                            ],
                            action: 'add',
                            wait: true,
                        }}
                    >
                        {t('新建')}
                    </Button>
                    <UpdateModal
                        addModalId={USER_LABEL_MODAL_ID}
                        pageProps={props}
                    />
                </div>
                <div>
                    <Search
                        className={styles.positionInput}
                        style={{width: '300px'}}
                        allowClear
                        maxLength={20}
                        onSearch={(value) => {
                            report.action({
                                id: 'addUpdate',
                                module: 'userLabel',
                                position: [menu?.menuName ?? '', t('查询')],
                                action: 'query',
                                wait: true,
                            });
                            dispatch(searchData(props, value));
                        }}
                        placeholder={t('请输入标签名称')}
                        onChange={(e) => inputChange(e)}
                    />
                </div>
            </div>
            <div className={styles.tableArea}>
                <Table
                    columns={columns}
                    dataSource={tableDataSource}
                    loading={isTableLoading}
                    showIndex
                    rowKey="id"
                    pagination={{
                        total,
                        pageSize,
                        current: page,
                        pageSizeOptions: PAGE_SIZE_OPTIONS,
                        onChange: (current, size) =>
                            dispatch(changePage(props, current, size!)),
                    }}
                    scroll={{
                        y: '630px',
                    }}
                />
            </div>
        </div>
    );
};

export default UserLabel;
