/*
 * @Author: zhangzhen
 * @Date: 2022-11-21 16:20:07
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-12-05 17:16:51
 *
 */
import React, {useRef} from 'react';
import {FormInstance} from 'antd';
import {shallowEqual} from 'react-redux';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {Modal, useModal, PageProps, useAction} from '@gwaapp/ease';
import {useTranslation} from 'react-i18next';
import {closeModal} from '@/components/modal';
import CustomForm from './form';
import {SELECT_SCOPE_MODAL_ID} from './constant';

interface IProps {
    addModalId: string;
    pageProps: PageProps;
}
const SelectSope = ({addModalId, pageProps}: IProps) => {
    const {id} = pageProps;
    const formRef = useRef<FormInstance | null>(null);
    const {state} = useModal();
    const {node: selectedNode, type: modalType} = state[addModalId] || {};
    const {t} = useTranslation();
    const {getPageSimpleActions} = useAction();
    const actions = getPageSimpleActions(id);
    const dispatch = useAppDispatch();
    const {selectScope} = useAppSelector((state) => state[id], shallowEqual);
    const actionI18n = modalType === 'add' ? t('新建') : t('编辑');
    return (
        <Modal
            id={SELECT_SCOPE_MODAL_ID}
            title={actionI18n}
            destroyOnClose
            width={1200}
            isAutoClose={false}
            okText={`${t('确定')}`}
            cancelText={t('取消')}
            onOk={() => {
                dispatch(actions.set({selectScopeName: selectScope}));
                dispatch(closeModal(SELECT_SCOPE_MODAL_ID));
            }}
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

export default SelectSope;
