/*
 * @Author: gxn
 * @Date: 2022-04-02 10:51:27
 * @LastEditors: gxn
 * @LastEditTime: 2022-05-01 16:26:51
 * @Description: noticeModal
 */
import React from 'react';
import {Modal, useModal} from '@gwaapp/ease';
import {useAppSelector} from '@/app/runtime';
import {i18nIns} from '@/app/i18n';
import {Row, Col} from 'antd';
import PortalIcon from '@/components/icon';
import styles from './styles.module.scss';
import {handledowloadAttachment} from '../actions';

const {t} = i18nIns;

interface UpdateModalProps {
    modalId: string;
}

const UpdateModal = ({modalId}: UpdateModalProps) => {
    const noticeContent = useAppSelector(
        (state) => state.noticeCenter.noticeContent,
    );
    const {state: modalState} = useModal();
    const {node} = modalState[modalId] || {};
    return (
        <Modal
            id={modalId}
            title={`${node && node.msgTitle}-${t('详情')}`}
            footer={null}
            destroyOnClose
            isAutoClose={false}
            width={800}
        >
            <div className={styles.content}>
                <div className={styles.msgHead}>
                    <Row>
                        <Col span={12}>
                            <div className={styles.msgContent}>
                                {/* 标题： */}
                                <div className={styles.msgLabel}>
                                    {t('标题')}:
                                </div>
                                <div>{noticeContent.msgTitle}</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className={styles.msgContent}>
                                {/* 消息类型： */}
                                <div className={styles.msgLabel}>
                                    {t('消息类型')}:
                                </div>
                                <div>{noticeContent.msgTypeName}</div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <div className={styles.msgContent}>
                                {/* 发送时间： */}
                                <div className={styles.msgLabel}>
                                    {t('消息发送时间')}:
                                </div>
                                <div>{noticeContent.msgCreateTime}</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className={styles.msgContent}>
                                {/* 发送人： */}
                                <div className={styles.msgLabel}>
                                    {t('发送人')}:
                                </div>
                                <div>{noticeContent.msgSenderName}</div>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className={styles.htmlBox}>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: `${
                                noticeContent ? noticeContent.msgContent : ''
                            }`,
                        }}
                    />
                </div>

                {noticeContent.fileList?.length ? (
                    <div className={styles.docAttachments}>
                        {/* 附件： */}
                        <p>{t('附件：')}</p>
                        <div>
                            {noticeContent.fileList.map(
                                (
                                    f, // eslint-disable-next-line jsx-a11y/anchor-is-valid
                                ) => (
                                    <a
                                        className={styles.docAttachmentItem}
                                        key={f.id}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={handledowloadAttachment(
                                            f.fileToken,
                                        )}
                                    >
                                        <PortalIcon iconClass="icon-portal-JobLog" />
                                        <span>{f.name}</span>
                                    </a>
                                ),
                            )}
                        </div>
                    </div>
                ) : (
                    ''
                )}
            </div>
        </Modal>
    );
};

export default UpdateModal;
