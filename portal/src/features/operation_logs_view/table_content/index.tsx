/*
 * @Author: Tomato.Bei
 * @Date: 2022-08-05 15:32:40
 * @Last Modified by: Tomato.Bei
 * @Last Modified time: 2022-09-07 11:34:25
 */
import React from 'react';
import {shallowEqual} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {ColumnsType} from 'antd/es/table';
import {PageProps} from '@gwaapp/ease';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {PAGE_SIZE_OPTIONS, Table} from '@components/table';
import * as actions from '../actions';

interface OperationLogListProps {
    pageProps: PageProps;
}

const TableContent = ({pageProps}: OperationLogListProps) => {
    const {id} = pageProps;
    const {t} = useTranslation();
    const {pagination, listData, isListLoading, busiTypeList, opnBehaviorList} =
        useAppSelector((state) => state[id], shallowEqual);
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
            width: 70,
            ellipsis: true,
            align: 'center',
        },
        {
            title: t('业务应用'),
            dataIndex: 'busiType',
            key: 'busiType',
            width: 100,
            ellipsis: true,
            align: 'center',
            render: (text: any, record: any) => {
                let businessTypeName;
                busiTypeList.forEach((item: any) => {
                    if (item.dictdataCode === record.busiType) {
                        businessTypeName = item.dictdataName;
                    }
                });
                return businessTypeName;
            },
        },
        {
            title: t('操作位置'),
            dataIndex: 'opnPosition',
            key: 'opnPosition',
            width: 150,
            ellipsis: true,
            align: 'center',
        },
        {
            title: t('日志类型'),
            dataIndex: 'logType',
            key: 'logType',
            width: 80,
            ellipsis: true,
            align: 'center',
            render: (text: any) => {
                if (text === '0') {
                    return <span>{t('系统级')}</span>;
                }

                return <span>{t('业务级')}</span>;
            },
        },
        {
            title: t('操作行为'),
            dataIndex: 'opnBehavior',
            key: 'opnBehavior',
            width: 100,
            ellipsis: true,
            align: 'center',
            render: (text: any, record: any) => {
                let opnBehavior;
                opnBehaviorList.forEach((item: any) => {
                    if (item.dictdataCode === record.opnBehavior) {
                        opnBehavior = item.dictdataName;
                    }
                });
                return opnBehavior;
            },
        },
        {
            title: t('操作内容'),
            dataIndex: 'opnContext',
            key: 'opnContext',
            width: 150,
            ellipsis: true,
            align: 'center',
        },
        {
            title: t('操作结果'),
            dataIndex: 'opnResult',
            key: 'opnResult',
            width: 80,
            ellipsis: true,
            align: 'center',
            render: (text: any) => {
                if (text === '0') {
                    return <span>{t('成功')}</span>;
                }

                return <span>{t('失败')}</span>;
            },
        },
        {
            title: t('操作时间'),
            dataIndex: 'opnTime',
            key: 'opnTime',
            width: 150,
            ellipsis: true,
            align: 'left',
        },
    ];
    return (
        <Table
            columns={columns}
            dataSource={listData}
            loading={isListLoading}
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
