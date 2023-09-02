import React, {useRef} from 'react';
import {FormInstance} from 'antd';
import {Modal, useModal} from '@gwaapp/ease';
import {useTranslation} from 'react-i18next';
import CustomForm from './form';

const BgPicModal = ({pageProps, modalId}) => {
    const formRef = useRef<FormInstance | null>(null);
    const {t} = useTranslation();
    const {state: modalState} = useModal();
    const {data, type} = modalState[modalId] || {};
    return (
        <Modal
            id={modalId}
            title={type === 'add' ? t('新增') : t('编辑')}
            okText={t('保存')}
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

export default BgPicModal;
