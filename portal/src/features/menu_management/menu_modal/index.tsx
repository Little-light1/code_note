import React, {useRef} from 'react';
import {Modal, useModal, useAction, PageProps} from '@gwaapp/ease';
import {FormInstance} from 'antd';
import {useTranslation} from 'react-i18next';
import {useAppDispatch} from '@/app/runtime';
import {Events} from '@common/events';
import MenuResourceForm from './form';

interface MenuModalProps {
    pageProps: PageProps;
    modalId: string;
}

const MenuModal = ({pageProps, modalId}: MenuModalProps) => {
    const {id} = pageProps;
    const {state: modalState} = useModal();
    const {
        getPageSimpleActions,
        handlers: {trigger},
    } = useAction();
    const dispatch = useAppDispatch();
    const actions = getPageSimpleActions(id);
    const formRef = useRef<FormInstance | null>(null);
    const {t} = useTranslation();
    const {parent, type, record} = modalState[modalId] || {};
    const actionI18n = type === 'add' ? t('新建') : t('编辑');
    return (
        <Modal
            id={modalId}
            title={`${actionI18n}`}
            okText={t('保存')}
            cancelText={t('取消')}
            destroyOnClose
            isAutoClose={false}
            maskClosable={false}
            width={900} // 清空资源列表
            onCancel={() => {
                dispatch(
                    actions.set({
                        resourceTableDataSource: [],
                        currentMenu: null,
                    }),
                ); // 初始化菜单资源

                trigger(Events.update_menu_resources);
            }}
            onOk={() => formRef.current && formRef.current.submit()}
        >
            <MenuResourceForm
                parent={parent}
                formRef={formRef}
                pageProps={pageProps}
                modalId={modalId}
                modalType={type}
                record={record}
            />
        </Modal>
    );
};

export default MenuModal;
