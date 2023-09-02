/*
 * @Author: zhangzhen
 * @Date: 2022-11-21 16:20:06
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-12-05 18:42:44
 *
 */
import React, {useRef} from 'react';
import {FormInstance} from 'antd';
import {Modal, useModal, PageProps} from '@gwaapp/ease';
import {useTranslation} from 'react-i18next';
import CustomForm from './form';

interface IProps {
    addModalId: string;
    pageProps: PageProps;
}

const AddRole = ({addModalId, pageProps}: IProps) => {
    const formRef = useRef<FormInstance | null>(null);
    const {state} = useModal();
    const {node: selectedNode, type: modalType} = state[addModalId] || {};
    const {t} = useTranslation();
    const actionI18n = modalType === 'add' ? t('新建') : t('编辑');
    return (
        <Modal
            id={addModalId}
            title={`${actionI18n}`}
            destroyOnClose
            width={800}
            isAutoClose={false}
            okText={t('确定')}
            onOk={() => formRef.current && formRef.current.submit()}
        >
            <CustomForm
                selectedNode={selectedNode}
                formRef={formRef}
                pageProps={pageProps}
                addModalId={addModalId}
                modalType={modalType}
            />
        </Modal>
    );
};

export default AddRole;
