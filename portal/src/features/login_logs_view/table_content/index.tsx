/*
 * @Author: Tomato.Bei
 * @Date: 2022-08-05 15:35:04
 * @Last Modified by:   Tomato.Bei
 * @Last Modified time: 2022-08-05 15:35:04
 */
import React from 'react';
import {shallowEqual} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {ColumnsType} from 'antd/es/table';
import {PageProps} from '@gwaapp/ease';
import {PAGE_SIZE_OPTIONS, Table} from '@components/table';
import PortalIcon from '@/components/icon';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import * as actions from '../actions';

interface LoginLogListProps {
    pageProps: PageProps;
}

const TableContent = ({pageProps}: LoginLogListProps) => {
    const {id} = pageProps;
    const {listData, pagination, isListLoading} = useAppSelector(
        (state) => state[id],
        shallowEqual,
    );
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const columns: ColumnsType<any> = [
        {
            title: t('序号'),
            dataIndex: 'index',
            key: 'index',
            ellipsis: true,
            align: 'center',
            width: 70,
            render: (text: any, record: any, index: any) => {
                const number =
                    (pagination.current - 1) * pagination.pageSize + index + 1;
                return number;
            },
        },
        {
            title: t('登录机器IP'),
            dataIndex: 'loginIp',
            key: 'loginIp',
            width: 100,
            ellipsis: true,
            align: 'center',
        },
        {
            title: t('登录方式'),
            dataIndex: 'loginType',
            key: 'loginType',
            width: 70,
            ellipsis: true,
            align: 'center',
        },
        {
            title: t('登录账号'),
            dataIndex: 'loginUser',
            key: 'loginUser',
            width: 100,
            ellipsis: true,
            align: 'center',
        },
        {
            title: t('登录姓名'),
            dataIndex: 'loginName',
            key: 'loginName',
            width: 80,
            ellipsis: true,
            align: 'center',
        },
        {
            title: t('登录时间'),
            dataIndex: 'loginTime',
            key: 'loginTime',
            width: 150,
            ellipsis: true,
            align: 'left',
        },
        {
            title: t('登录时长'),
            dataIndex: 'loginDuration',
            key: 'loginDuration',
            width: 100,
            ellipsis: true,
            align: 'center',
            render: (text: any) => text || '————',
        },
        {
            title: t('登录状态'),
            dataIndex: 'loginStatus',
            key: 'loginStatus',
            width: 100,
            ellipsis: true,
            align: 'center',
            render: (text: any) => {
                if (text === '0') {
                    return (
                        <span>
                            <PortalIcon
                                iconClass="icon-portal-success"
                                style={{
                                    color: '#52c41a',
                                }}
                            />
                            &nbsp;&nbsp;{t('成功')}
                        </span>
                    );
                }

                return (
                    <span>
                        <PortalIcon
                            iconClass="icon-portal-fail"
                            style={{
                                color: 'red',
                            }}
                        />
                        &nbsp;&nbsp;{t('失败')}
                    </span>
                );
            },
        },
        {
            title: t('退出时间'),
            dataIndex: 'logoutTime',
            key: 'logoutTime',
            width: 150,
            ellipsis: true,
            align: 'left',
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
                showTotal: (total: any) => t(`共{{total}}条`, {total: total}),
                pageSizeOptions: PAGE_SIZE_OPTIONS,
                onChange: (page, pageSize) => {
                    dispatch(actions.changePage(pageProps, page, pageSize));
                },
                showSizeChanger: true,
                showQuickJumper: true,
            }}
        />
    );
};

export default TableContent;
