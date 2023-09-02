import React, {useRef} from 'react';
import {Modal, useModal} from '@gwaapp/ease';
import {FormInstance} from 'antd';
import {useTranslation} from 'react-i18next';
import {DICT_TYPES} from '@/common/constant';
import DataDictForm from './form';

interface UpdateModalProps {
    modalId: string;
}

const UpdateModal = ({modalId}: UpdateModalProps) => {
    const formRef = useRef<FormInstance | null>(null);
    const {t} = useTranslation();
    const {state: modalState} = useModal();
    const {node, type, targetTypes, selectedNodeType} =
        modalState[modalId] || {};
    let actionI18n = type === 'add' ? t('新建') : t('编辑');
    if (targetTypes && targetTypes.includes(DICT_TYPES.item.key)) {
        actionI18n = type === 'add' ? t('新建字典项') : t('编辑字典项');
    }
    return (
        <Modal
            id={modalId}
            title={actionI18n}
            okText={t('保存')}
            destroyOnClose
            isAutoClose={false}
            width={800}
            onOk={() => formRef.current && formRef.current.submit()}
        >
            <DataDictForm
                selectedNode={node}
                formRef={formRef}
                modalId={modalId}
                modalType={type}
                targetTypes2={targetTypes}
                selectedNodeType={selectedNodeType}
            />
        </Modal>
    );
};

export default UpdateModal;
