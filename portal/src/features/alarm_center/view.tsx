/*
 * @Author: shimmer
 * @Date: 2022-05-11 16:56:44
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-12-02 14:54:26
 */
import React, {FC} from 'react';
import {PageProps, usePage, getUniqueKey} from '@gwaapp/ease';
import {Modal} from 'antd';
import {Table, PAGE_SIZE_OPTIONS} from '@components/table';
import {shallowEqual} from 'react-redux';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import type {ColumnsType} from 'antd/es/table';
import {ToolOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import styles from './styles.module.scss';
import FormPage from './form';
import AlarmDetailModal from './alarm_detail_modal';
import {
    changePage,
    getAlarmDetailFun,
    setModalVisible,
    onInit,
} from './actions';
import {TableDataType} from './types';

const AlarmCenterPage: FC<PageProps> = (props) => {
    const dispatch = useAppDispatch();
    const {id} = props;
    const {
        pageSize,
        pageNum,
        total,
        isTableLoading,
        tableData,
        detailModalVisible,
        alarmType,
        alarmLevel,
        alarmTypeArr,
        alarmLevelArr,
        formValue,
        isFirstLoad,
    } = useAppSelector((state) => state[getUniqueKey(id)], shallowEqual);
    const {t} = useTranslation();
    usePage({
        ...props,
        // 页面初始化逻辑
        init: () => {
            dispatch(onInit(props));
        },
    });
    const tableColumns: ColumnsType<TableDataType> = [
        {
            title: t('序号'),
            dataIndex: 'id',
            ellipsis: true,
            align: 'center',
            width: 120,
            render: (text, record, index) =>
                index + 1 + pageSize * (pageNum - 1),
        },
        {
            title: t('告警内容'),
            dataIndex: 'noticeContent',
            ellipsis: true,
            render: (text) => text || '--',
        },
        {
            title: t('告警对象名称'),
            dataIndex: 'noticeObjectName',
            width: 150,
            ellipsis: true,
            render: (text) => text || '--',
        },
        {
            title: t('告警类型'),
            dataIndex: 'noticeType',
            width: 200,
            ellipsis: true,
            render: (text) => (text && alarmTypeArr[text]) || '--',
        },
        {
            title: t('告警等级'),
            dataIndex: 'noticeLevel',
            ellipsis: true,
            render: (text) => (text && alarmLevelArr[text]) || '--',
        },
        {
            title: t('告警原因'),
            dataIndex: 'noticeCause',
            width: 200,
            ellipsis: true,
            render: (text) => text || '--',
        },
        {
            title: t('告警产生时间'),
            dataIndex: 'createTime',
            ellipsis: true,
            width: 180,
            render: (text) => text || '--',
        },
        {
            title: t('处理状态'),
            dataIndex: 'dealStatus',
            width: 180,
            ellipsis: true,
            render: (text) =>
                text && text.value === '1' ? t('已处理') : t('待处理'),
        },
        {
            title: t('处理人'),
            dataIndex: 'dealUser',
            width: 120,
            ellipsis: true,
            render: (text) => (text ? text.userName : '--'),
        },
        {
            title: t('处理时间'),
            dataIndex: 'dealTime',
            width: 150,
            ellipsis: true,
            render: (text) => text || '--',
        },
        {
            title: t('操作'),
            dataIndex: 'actions',
            width: 100,
            ellipsis: true,
            align: 'center',
            render: (text, record) => (
                <ToolOutlined
                    title={t('处理')}
                    className={`${styles.tool_icons} ${
                        record.dealStatus.value === '1' &&
                        styles.tool_icons_disabled
                    }`}
                    rotate={270}
                    onClick={() => {
                        if (record.dealStatus.value === '1') return;
                        dispatch(getAlarmDetailFun(props, record.noticeId));
                    }}
                />
            ),
        },
    ];
    return (
        <div className={styles.alarmBox}>
            <FormPage
                props={props}
                alarmType={alarmType}
                alarmLevel={alarmLevel}
                formValue={formValue}
                isFirstLoad={isFirstLoad}
            />
            <Table
                columns={tableColumns}
                dataSource={tableData}
                loading={isTableLoading}
                rowKey="id"
                size="small"
                pagination={{
                    total,
                    pageSize,
                    current: pageNum,
                    pageSizeOptions: PAGE_SIZE_OPTIONS,
                    position: ['bottomLeft'],
                    showSizeChanger: true,
                    onChange: (current, size) =>
                        dispatch(changePage(props, current, size)),
                }}
            />

            <Modal
                title={t('告警详情查看')}
                visible={detailModalVisible}
                width={450}
                destroyOnClose
                footer={null}
                onCancel={() => {
                    dispatch(setModalVisible(props, false));
                }}
            >
                <AlarmDetailModal props={props} />
            </Modal>
        </div>
    );
};

export default AlarmCenterPage;
