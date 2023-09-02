/*
 * @Author: 机构类型属性配置
 * @Date: 2022-03-21 17:14:06
 * @Last Modified by: gongzunbao
 * @Last Modified time: 2023-06-30 17:02:24
 */
import React, {FC, useMemo} from 'react';
import {shallowEqual} from 'react-redux';
import {Button, Space, Collapse, message} from 'antd';
import {PAGE_SIZE_OPTIONS, Table} from '@components/table';
import {CloseCircleFilled, HolderOutlined} from '@ant-design/icons';
import {useModal, useAction, usePage, PageProps} from '@gwaapp/ease';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import PortalIcon from '@/components/icon';
import {Events} from '@common/events';
import {useTranslation} from 'react-i18next';
import CopyModel from './copy_modal'; // 引入复制新建弹框组件

import UpdateModal from './update_modal'; // 引入弹窗组件

import AddOrganizationModal from './add_organization_modal'; // 引入创建框架弹框组件

import styles from './styles.module.scss';
import {
    onInit,
    changePage,
    changePageDef,
    deleteTemplate,
    deleteOrganizationTemplate,
    deleteData,
    listData,
    noListData,
    typeData,
} from './actions';
import {COPY_MODAL_ID, ADD_ORGANIZATION_MODAL} from './constant';

const USER_LABEL_MODAL_ID = 'organizationTypeConfiguration';

const OrganizationTypeConfiguration: FC<any> = (props: PageProps) => {
    const {id, menu} = props;
    const {
        topListSource,
        isTableLoading,
        total,
        totalDef,
        pageSizeDef,
        pageSize,
        pageDef,
        page,
        selectedRowKeys,
        selectedTemplateId,
        templateList,
        bottomListSource,
    } = useAppSelector((state) => state[id], shallowEqual);
    const dispatch = useAppDispatch();
    const {
        getPageSimpleActions,
        handlers: {register, deregister},
    } = useAction();
    const actions = getPageSimpleActions(id);
    const {openModal} = useModal();
    const userInfo = useAppSelector((state) => state.app.userInfo);
    const parentID = userInfo.enterpriseID;
    dispatch(
        actions.set({
            enterpriseID: parentID,
        }),
    ); // console.log(parentID, '拿到当前登录的租户');

    const {t} = useTranslation();
    const columns = useMemo(
        () => [
            {
                title: t('控件名称'),
                name: '控件名称',
                dataIndex: 'fieldName',
                key: 'fieldName',
                width: 200,
                align: 'center',
            },
            {
                title: t('控件类型'),
                name: '控件类型',
                dataIndex: 'fieldType',
                key: 'fieldType',
                width: 200,
                align: 'center',
                render: (record: any, text: any) => {
                    if (text.fieldType === '0') {
                        return <span>{t('文本框')}</span>;
                    }

                    if (text.fieldType === '2') {
                        return <span>{t('日期')}</span>;
                    }

                    if (text.fieldType === '1') {
                        return <span>{t('下拉框')}</span>;
                    }

                    if (text.fieldType === '3') {
                        return <span>{t('时间')}</span>;
                    }

                    if (text.fieldType === '1000') {
                        return <span>{t('编码文本框')}</span>;
                    }

                    if (text.fieldType === '1001') {
                        return <span>{t('标签不显示')}</span>;
                    }

                    if (text.fieldType === '1002') {
                        return <span>{t('序号控件')}</span>;
                    }

                    return <span>-</span>;
                },
            },
            {
                title: t('数据类型'),
                name: '数据类型',
                dataIndex: 'dataType',
                align: 'center',
                width: 200,
                render: (text: string | any) =>
                    text ? <span>{text.desc}</span> : null,
            },
            {
                title: t('是否必填'),
                dataIndex: 'isNull',
                key: 'isNull',
                name: '是否必填',
                width: 200,
                align: 'center',
                render: (text: string | any) =>
                    text ? <span>{text.desc}</span> : null,
            },
            // {
            //     title: t('默认值'),
            //     dataIndex: 'defaultValue',
            //     key: 'defaultValue',
            //     name: '默认值',
            //     width: 200,
            //     align: 'center',
            //     render: (text: string | any) =>
            //         text ? <span>{text}</span> : null,
            // },
            {
                title: t('操作'),
                dataIndex: 'operation',
                key: 'operation',
                name: '操作',
                align: 'center',
                render: (
                    text: any,
                    record: {
                        userList: string | any[];
                    },
                ) => (
                    <Space size="middle">
                        <PortalIcon
                            iconClass="icon-portal-edit"
                            className={styles.commonOperationIcon}
                            title={t('编辑')}
                            onClick={() =>
                                openModal(USER_LABEL_MODAL_ID, {
                                    type: 'edit',
                                    node: record,
                                })
                            }
                            action={{
                                id: 'addUpdate',
                                module: 'organizationTypeConfiguration',
                                position: [
                                    menu?.menuName ?? '',
                                    t('编辑'),
                                    t('确定'),
                                ],
                                action: 'modify',
                                wait: true,
                            }}
                        />

                        <PortalIcon
                            iconClass="icon-portal-delete"
                            className={styles.commonOperationIcon}
                            title={t('删除')}
                            onClick={() => {
                                dispatch(deleteData(props, record));
                            }}
                            action={{
                                id: 'addUpdate',
                                module: 'organizationTypeConfiguration',
                                position: [
                                    menu?.menuName ?? '',
                                    t('删除'),
                                    t('确定'),
                                ],
                                action: 'delete',
                                wait: true,
                            }}
                        />
                    </Space>
                ),
            },
        ],
        [dispatch, menu?.menuName, openModal, props, t], // 依赖没发生变化时columns不会重新渲染
    );
    const columnsList = useMemo(
        () => [
            {
                title: t('控件名称'),
                name: '控件名称',
                dataIndex: 'fieldName',
                key: 'fieldName',
                width: 200,
                align: 'center',
            },
            {
                title: t('控件类型'),
                name: '控件类型',
                dataIndex: 'fieldType',
                key: 'fieldType',
                width: 200,
                align: 'center',
                render: (record: any, text: any) => {
                    if (text.fieldType === '0') {
                        return <span>{t('文本框')}</span>;
                    }

                    if (text.fieldType === '2') {
                        return <span>{t('日期')}</span>;
                    }

                    if (text.fieldType === '1') {
                        return <span>{t('下拉框')}</span>;
                    }

                    if (text.fieldType === '3') {
                        return <span>{t('时间')}</span>;
                    }

                    if (text.fieldType === '1000') {
                        return <span>{t('编码文本框')}</span>;
                    }

                    if (text.fieldType === '1001') {
                        return <span>{t('标签不显示')}</span>;
                    }

                    if (text.fieldType === '1002') {
                        return <span>{t('序号控件')}</span>;
                    }

                    return <span>-</span>;
                },
            },
            {
                title: t('数据类型'),
                name: '数据类型',
                dataIndex: 'dataType',
                align: 'center',
                width: 200,
                render: (text: string | any) =>
                    text ? <span>{text.desc}</span> : null,
            },
            {
                title: t('是否必填'),
                dataIndex: 'isNull',
                key: 'isNull',
                name: '是否必填',
                width: 150,
                align: 'center',
                render: (text: string | any) =>
                    text ? <span>{text.desc}</span> : null,
            },
            // {
            //     title: t('默认值'),
            //     dataIndex: 'isDefaultField',
            //     key: 'isDefaultField',
            //     name: '默认值',
            //     width: 150,
            //     align: 'center',
            //     render: (text: string | any) =>
            //         text ? <span>{text.desc}</span> : null,
            // },
        ],
        [t], // 依赖没发生变化时columns不会重新渲染
    );
    usePage({
        ...props,
        init: (pageProps) => {
            dispatch(onInit(pageProps));
            register(
                'portal_organization_type_attribute_configuration',
                () => dispatch(typeData(props)),
                Events.update_data_dict,
            );
        },
        close: () => {
            deregister(
                'portal_organization_type_attribute_configuration',
                Events.update_data_dict,
            );
        }, // close会全部清空
    });

    const renderButton = (i: any) => (
        <div className={styles.tabItem} id={i.id}>
            <Button
                title={i.name}
                onClick={() => {
                    dispatch(
                        actions.set({
                            selectedTemplateId: i.id,
                        }),
                    );
                    dispatch(listData(props));
                    dispatch(noListData(props));
                }}
            >
                <HolderOutlined className={styles.holeIcon} />
                {i.name}

                <span
                    className={selectedTemplateId === i.id ? styles.tail : ''}
                    id={i.id}
                />
                <CloseCircleFilled
                    className={styles.close}
                    onClick={(e) => {
                        e.stopPropagation();
                        dispatch(
                            deleteOrganizationTemplate(props, i.id, i.name),
                        );
                    }}
                    action={{
                        id: 'addUpdate',
                        module: 'organizationTypeConfiguration',
                        position: [
                            menu?.menuName ?? '',
                            t('删除机构类型'),
                            t('确定'),
                        ],
                        action: 'delete',
                        wait: true,
                    }}
                />
            </Button>
        </div>
    );

    return (
        <div className={styles.searchView}>
            <div className={styles.content}>
                <div className={styles.tabs}>
                    <div>
                        <Button
                            id="template_manage_view_add_btn"
                            block
                            type="primary"
                            style={{
                                width: '205px',
                            }}
                            className={styles.commonButtonPrimary}
                            icon={
                                <PortalIcon
                                    iconClass="icon-portal-add"
                                    style={{
                                        fontSize: '14px',
                                        marginRight: '4px',
                                    }}
                                />
                            }
                            onClick={() => openModal(ADD_ORGANIZATION_MODAL)}
                            action={{
                                id: 'addUpdate',
                                module: 'organizationTypeConfiguration',
                                position: [
                                    menu?.menuName ?? '',
                                    t('新建机构类型'),
                                    t('确定'),
                                ],
                                action: 'add',
                                wait: true,
                            }}
                        >
                            {/* 新建机构类型 */}
                            {t('新建机构类型')}
                        </Button>
                        <AddOrganizationModal pageProps={props} />
                    </div>

                    <div className={styles.tabScrollPanel} id="template_list">
                        {templateList.map((i: any) => renderButton(i))}
                    </div>
                </div>

                <div className={styles.detail}>
                    <div>
                        <Button
                            id="template_copy_btn"
                            type="link"
                            style={{
                                color: '#03e6f5',
                                border: '1px solid #03e6f5',
                                marginBottom: '10px',
                                borderRadius: '4px',
                            }}
                            className={styles.commonButtonPrimary}
                            icon={
                                <PortalIcon
                                    iconClass="icon-portal-add2"
                                    style={{
                                        marginRight: '3px',
                                    }}
                                />
                            }
                            onClick={() => {
                                if (!selectedTemplateId) {
                                    message.info(t('请先选择框架'));
                                } else {
                                    openModal(COPY_MODAL_ID);
                                }
                            }}
                            action={{
                                id: 'addUpdate',
                                module: 'organizationTypeConfiguration',
                                position: [
                                    menu?.menuName ?? '',
                                    t('复制新建'),
                                    t('确定'),
                                ],
                                action: 'add',
                                wait: true,
                            }}
                        >
                            {/* 复制新建 */}
                            {t('复制新建')}
                        </Button>
                        <CopyModel pageProps={props} />
                    </div>
                    <Collapse
                        className={styles.collapse}
                        id="fields_collapse"
                        defaultActiveKey={['1', '2']}
                        expandIconPosition="right"
                        destroyInactivePanel
                    >
                        {/* 自定义 */}
                        <Collapse.Panel
                            header={t('自定义')}
                            key="1"
                            className={styles.colSon}
                        >
                            <div
                                style={{
                                    marginBottom: '16px',
                                }}
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{
                                        marginRight: '10px',
                                    }}
                                    icon={
                                        <PortalIcon
                                            iconClass="icon-portal-add"
                                            style={{
                                                fontSize: '14px',
                                                marginRight: '4px',
                                            }}
                                        />
                                    }
                                    onClick={() => {
                                        if (!selectedTemplateId) {
                                            message.info(t('请先选择框架'));
                                        } else {
                                            openModal(USER_LABEL_MODAL_ID, {
                                                type: 'add',
                                            });
                                        }
                                    }}
                                    action={{
                                        id: 'addUpdate',
                                        module: 'organizationTypeConfiguration',
                                        position: [
                                            menu?.menuName ?? '',
                                            t('新建'),
                                            t('确定'),
                                        ],
                                        action: 'add',
                                        wait: true,
                                    }}
                                >
                                    {/* 新建 */}
                                    {t('新建')}
                                </Button>
                                <Button
                                    type="primary"
                                    key="delete"
                                    id="data_source_view_delete_groups"
                                    icon={
                                        <PortalIcon
                                            iconClass="icon-portal-delete"
                                            style={{
                                                fontSize: '14px',
                                                marginRight: '4px',
                                            }}
                                        />
                                    }
                                    onClick={() => {
                                        if (!selectedTemplateId) {
                                            message.info(t('请先选择框架'));
                                        } else {
                                            dispatch(deleteTemplate(props));
                                        }
                                    }}
                                    action={{
                                        id: 'addUpdate',
                                        module: 'organizationTypeConfiguration',
                                        position: [
                                            menu?.menuName ?? '',
                                            t('批量删除'),
                                            t('确定'),
                                        ],
                                        action: 'delete',
                                        wait: true,
                                    }}
                                >
                                    <PortalIcon iconClass="icon_Batch" />
                                    {/* 批量删除 */}
                                    {t('批量删除')}
                                </Button>
                                <UpdateModal
                                    addModalId={USER_LABEL_MODAL_ID}
                                    pageProps={props}
                                />
                            </div>
                            <Table
                                columns={columns}
                                dataSource={topListSource}
                                loading={isTableLoading}
                                showIndex
                                rowKey="id"
                                pagination={{
                                    total: totalDef,
                                    pageSize: pageSizeDef,
                                    current: pageDef,
                                    pageSizeOptions: PAGE_SIZE_OPTIONS,
                                    onChange: (current, size) =>
                                        dispatch(
                                            changePageDef(
                                                props,
                                                current,
                                                size!,
                                            ),
                                        ),
                                }}
                                scroll={{
                                    y: '230px',
                                }}
                                rowSelection={{
                                    selectedRowKeys,
                                    onChange: (keys: React.Key[]) =>
                                        dispatch(
                                            actions.set({
                                                selectedRowKeys: keys,
                                            }),
                                        ),
                                }}
                            />
                        </Collapse.Panel>
                        {/* 默认 */}
                        <Collapse.Panel
                            header={t('默认')}
                            key="2"
                            className={styles.colSon}
                        >
                            <Table
                                columns={columnsList}
                                dataSource={bottomListSource}
                                loading={isTableLoading}
                                showIndex
                                rowKey="id"
                                pagination={{
                                    total,
                                    pageSize,
                                    current: page,
                                    pageSizeOptions: PAGE_SIZE_OPTIONS,
                                    onChange: (current, size) =>
                                        dispatch(
                                            changePage(props, current, size!),
                                        ),
                                }}
                                scroll={{
                                    y: '230px',
                                }}
                            />
                        </Collapse.Panel>
                    </Collapse>
                </div>
            </div>
        </div>
    );
};

export default OrganizationTypeConfiguration;
