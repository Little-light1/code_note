/*
 * @Author: Tomato.Bei
 * @Date: 2022-08-05 15:33:51
 * @Last Modified by:   Tomato.Bei
 * @Last Modified time: 2022-08-05 15:33:51
 */
import React from 'react';
import {shallowEqual} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {ColumnsType} from 'antd/es/table';
import {PageProps} from '@gwaapp/ease';
import {PAGE_SIZE_OPTIONS, Table} from '@components/table';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import * as actions from '../actions';

interface AbnormalLogListProps {
    pageProps: PageProps;
}

const TableContent = ({pageProps}: AbnormalLogListProps) => {
    const {id} = pageProps;
    const {t} = useTranslation();
    const {listData, pagination, isListLoading} = useAppSelector(
        (state) => state[id],
        shallowEqual,
    );
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
            title: t('操作IP'),
            dataIndex: 'opnIp',
            key: 'opnIp',
            width: 100,
            ellipsis: true,
            align: 'center',
        },
        {
            title: t('操作账号'),
            dataIndex: 'opnUser',
            key: 'opnUser',
            width: 100,
            ellipsis: true,
            align: 'center',
        },
        {
            title: t('操作姓名'),
            dataIndex: 'opnName',
            key: 'opnName',
            width: 80,
            ellipsis: true,
            align: 'center',
        },
        {
            title: t('操作行为'),
            dataIndex: 'opnBehavior',
            key: 'opnBehavior',
            width: 130,
            ellipsis: true,
            align: 'center',
        },
        {
            title: t('操作内容'),
            dataIndex: 'opnContext',
            key: 'opnContext',
            width: 230,
            ellipsis: true,
            align: 'center',
        },
        {
            title: t('操作时间'),
            dataIndex: 'opnTime',
            key: 'opnTime',
            width: 90,
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

                showTotal: (total: any) =>
                    t(`共{{total}}条`, {total: total}),

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
