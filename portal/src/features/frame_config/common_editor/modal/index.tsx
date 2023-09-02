import React, {useRef} from 'react';
import {FormInstance} from 'antd';
import {Modal, useModal, PageProps} from '@gwaapp/ease';
import {useTranslation} from 'react-i18next';
import CustomForm from './form';

const CommonConfigModal = ({
    pageProps,
    modalId,
}: {
    pageProps: PageProps;
    modalId: string;
}) => {
    const formRef = useRef<FormInstance | null>(null);
    const {state: modalState} = useModal();
    const {data, type} = modalState[modalId] || {};
    const {t} = useTranslation();
    return (
        <Modal
            id={modalId}
            title={type === 'add' ? t('新增') : t('编辑')}
            okText={t('保存')}
            width={750}
            destroyOnClose
            isAutoClose={false}
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

export default CommonConfigModal;
