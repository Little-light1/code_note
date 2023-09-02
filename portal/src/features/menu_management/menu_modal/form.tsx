import React, {useMemo, MutableRefObject} from 'react';
import {shallowEqual} from 'react-redux';
import {FormInstance, Button} from 'antd';
import {useModal, PageProps} from '@gwaapp/ease';
import {Collapse, Panel} from '@/components/collapse';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {Table} from '@/components/table';
import {useTranslation} from 'react-i18next';
import styles from './styles.module.scss';
import ResourceModal from './resource_modal';
import {RESOURCE_MODAL, dynamicColumns} from './constant';
import MenuForm from './menu_form';
import {LogActionID} from '../types';

interface MenuResourceFormProps {
    parent: null | any;
    pageProps: PageProps;
    formRef: MutableRefObject<FormInstance<any> | null>;
    modalId: string;
    modalType: 'add' | 'edit'; // 模态窗口类型

    // record: Record<string, any>;
}

const MenuResourceForm = ({
    pageProps,
    parent,
    formRef,
    modalType,
    modalId,
}: // record,
MenuResourceFormProps) => {
    const {id} = pageProps;
    const dispatch = useAppDispatch();
    const {openModal} = useModal();
    const {t} = useTranslation();
    const {currentMenu, resourceTableDataSource} = useAppSelector(
        (state) => state[id],
        shallowEqual,
    );
    const columns = useMemo(
        () =>
            dynamicColumns({
                dispatch,
                openModal,
                pageProps,
                currentMenu,
            }),
        [dispatch, openModal, pageProps, currentMenu],
    ); // 当前存在菜单信息

    const isShowResource = !!currentMenu;
    return (
        <div className={styles.view}>
            <ResourceModal pageProps={pageProps} modalId={RESOURCE_MODAL} />

            <Collapse
                defaultActiveKey={['info', 'resource']}
                expandIconPosition="right"
                destroyInactivePanel
            >
                {/* 菜单信息   页面资源 */}
                <Panel key="info" header={t('菜单信息')} forceRender>
                    <MenuForm
                        pageProps={pageProps}
                        formRef={formRef}
                        parent={parent}
                        modalType={modalType}
                        record={currentMenu}
                        modalId={modalId}
                    />
                </Panel>

                {isShowResource ? (
                    <Panel key="resource" header={t('页面资源')} forceRender>
                        <Button
                            type="primary"
                            action={{
                                id: LogActionID.AddResource,
                                module: id,
                                position: [
                                    pageProps.menu?.menuName ?? '',
                                    currentMenu.menuName,
                                    t('添加资源'),
                                    t('保存'),
                                ],
                                action: 'add',
                                wait: true,
                            }}
                            onClick={() => {
                                openModal(RESOURCE_MODAL, {
                                    type: 'add',
                                });
                            }}
                        >
                            {t('添加资源')}
                        </Button>
                        <div className={styles.resourceTable}>
                            <Table
                                scroll={{
                                    y: '300px',
                                }}
                                columns={columns}
                                dataSource={resourceTableDataSource}
                                rowKey="msourceId"
                            />
                        </div>
                    </Panel>
                ) : null}
            </Collapse>
        </div>
    );
};

export default MenuResourceForm;
