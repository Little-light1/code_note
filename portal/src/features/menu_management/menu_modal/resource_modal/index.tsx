/*
 * @Author: zhangzhen
 * @Date: 2022-11-18 09:39:22
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-12-05 18:27:01
 *
 */
import React, {useRef} from 'react';
import {Modal, useModal, PageProps} from '@gwaapp/ease';
import {FormInstance} from 'antd';
import {useTranslation} from 'react-i18next';
import CustomForm from './form';

interface ResourceModalProps {
    pageProps: PageProps;
    modalId: string;
}

const ResourceModal = ({pageProps, modalId}: ResourceModalProps) => {
    const {state: modalState} = useModal();
    const formRef = useRef<FormInstance | null>(null);
    const {t} = useTranslation();
    const {record, type} = modalState[modalId] || {};
    const actionI18n = type === 'add' ? t('新增') : t('编辑');
    return (
        <Modal
            id={modalId}
            title={`${actionI18n} ${t('资源')}`}
            okText={t('保存')}
            destroyOnClose
            isAutoClose={false}
            maskClosable={false}
            width={1100}
            onOk={() => formRef.current && formRef.current.submit()}
        >
            <CustomForm
                record={record}
                formRef={formRef}
                pageProps={pageProps}
                modalId={modalId}
                modalType={type}
            />
        </Modal>
    );
};

export default ResourceModal;
