/*
 * @Author: gxn
 * @Date: 2021-11-29 13:53:10
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-12-10 11:33:55
 * @Description: org modal
 */
import React, {useRef} from 'react';
import {Modal, useModal, PageProps} from '@gwaapp/ease';
import {FormInstance} from 'antd';
import {useTranslation} from 'react-i18next';
import CustomForm from './form';

interface UpdateModalProps {
    pageProps: PageProps;
    modalId: string;
}

const UpdateModal = ({pageProps, modalId}: UpdateModalProps) => {
    const {t} = useTranslation();
    const formRef = useRef<FormInstance | null>(null);
    const {state: modalState} = useModal();
    const {data, type} = modalState[modalId] || {};
    const actionI18n = type === 'add' ? t('新建') : t('编辑');
    return (
        <Modal
            id={modalId}
            title={`${actionI18n} ${t('组织')}`}
            okText={`${t('保存')}`}
            cancelText={t('取消')}
            destroyOnClose
            isAutoClose={false}
            width={800}
            onOk={() => formRef.current && formRef.current.submit()}
        >
            <CustomForm
                data={data}
                formRef={formRef}
                pageProps={pageProps}
                modalId={modalId}
                modalType={type}
            />
        </Modal>
    );
};

export default UpdateModal;
