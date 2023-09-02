/*
 * @Descripttion:
 * @Author: gxn
 * @Date: 2023-05-20 08:50:09
 */
import React, {useRef} from 'react';
import {FormInstance} from 'antd';
import {Modal, useModal, PageProps} from '@gwaapp/ease';
import {useTranslation} from 'react-i18next';
import {useAppDispatch} from '@/app/runtime';
import CustomForm from './form';
import {submitDetail} from './actions';

interface IProps {
    modalId: string;
    pageProps: PageProps;
}

const DeviceModal = ({modalId, pageProps}: IProps) => {
    const formRef = useRef<FormInstance | null>(null);
    const {state: modalState} = useModal();
    const dispatch = useAppDispatch();
    const {node: selectedNode, type: modalType} = modalState[modalId] || {};
    const {t} = useTranslation();
    const actionI18n = modalType === 'add' ? t('新建') : t('关联设备');
    return (
        <Modal
            id={modalId}
            title={`${actionI18n}`}
            destroyOnClose
            width={1255}
            isAutoClose={false}
            okText={t('保存')}
            cancelText={t('取消')}
            onOk={() => dispatch(submitDetail(pageProps))}
        >
            <CustomForm
                selectedNode={selectedNode}
                formRef={formRef}
                pageProps={pageProps}
                addModalId={modalId}
                modalType={modalType}
            />
        </Modal>
    );
};

export default DeviceModal;
