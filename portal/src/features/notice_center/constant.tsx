/*
 * @Author: gxn
 * @Date: 2022-04-02 10:51:27
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-12-05 13:14:46
 * @Description: noticeCenter action
 */
import React from 'react';
import {ColumnsType} from 'antd/lib/table';
import PortalIcon from '@/components/icon';
import styles from './styles.module.scss';

export const UPDATE_MODAL_ID = 'noticeCenterModal';
export const dynamicColumns = ({
    dispatch,
    openModal,
    props,
    t,
    afterRead,
}: any): ColumnsType<any> => [
    {
        title: t('标题'),
        // 消息title
        dataIndex: 'msgTitle',
        key: 'msgTitle',
        align: 'center',
        ellipsis: true,
    },
    {
        title: t('消息类型'),
        // 消息类型
        dataIndex: 'msgTypeName',
        key: 'msgTypeName',
        ellipsis: true,
    },
    {
        title: t('消息发送时间'),
        // 消息发送时间
        dataIndex: 'msgCreateTime',
        key: 'msgCreateTime',
        ellipsis: true,
    },
    {
        title: t('消息发送人'),
        // 消息发送人
        dataIndex: 'msgSenderName',
        key: 'msgSenderName',
        ellipsis: true,
    },
    {
        title: t('消息发送部门'),
        // 消息发送部门
        dataIndex: 'msgSenderOrgName',
        key: 'msgSenderOrgName',
        ellipsis: true,
    },
    // {
    //   title: t('common.msgReceivedOrg'), // 接收部门
    //   dataIndex: 'dictdataMark',
    //   key: 'dictdataMark',
    // },
    {
        title: t('状态'),
        // 状态
        dataIndex: 'msgStatus',
        key: 'msgStatus',
        ellipsis: true,

        render: (
            text, // <span>{text === 0 ? '未读' : '已读'}</span>
        ) => (
            <div>
                {text === 0 ? (
                    <span className={styles.unread}>{t('未读')}</span>
                ) : (
                    <span className={styles.read}>{t('已读')}</span>
                )}
            </div>
        ),
    },
    {
        title: t('操作'),
        // 操作
        dataIndex: 'operations',
        key: 'operations',
        align: 'center',
        render: (text: string, record: any) => (
            <div className={styles.operations}>
                <PortalIcon
                    iconClass="icon-portal-Log"
                    className={styles.commonOperationIcon}
                    title={t('详情')}
                    onClick={() => {
                        dispatch(afterRead(props, record));
                        openModal(UPDATE_MODAL_ID, {
                            type: 'edit',
                            node: record,
                        });
                    }}
                    action={{
                        id: 'readNotice',
                        module: props.id,
                        position: [props.menu?.menuName ?? '', t('操作-处理')],
                        action: 'modify',
                        wait: true,
                    }}
                />
            </div>
        ),
    },
];
