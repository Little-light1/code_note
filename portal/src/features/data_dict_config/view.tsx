import React, {FC, useCallback, useMemo} from 'react';
import {shallowEqual} from 'react-redux';
import {Col, Row, Button} from 'antd';
import {
    EditOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import {SearchTree} from '@components/tree';
import {PAGE_SIZE_OPTIONS, Table} from '@components/table';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useModal, useAction, usePage, PageProps} from '@gwaapp/ease';
import {DICT_TYPES} from '@/common/constant';
import PortalIcon from '@/components/icon';
import {dynamicColumns, UPDATE_MODAL_ID} from './constant';
import styles from './styles.module.scss';
import {
    onInit,
    onTreeSelect,
    batchDelete,
    updateEnable,
    initDictDataList,
} from './actions';
import UpdateModal from './update_modal';
import {LogActionID} from './types';

const DataDictConfig: FC<PageProps> = (props) => {
    const {id} = props;
    const {
        dictTypeTree,
        expandedTreeKeys,
        selectedTreeNode,
        tableDataSource,
        isTableLoading,
        selectedRowKeys,
        pagination,
    } = useAppSelector((state) => state[id], shallowEqual);
    const dispatch = useAppDispatch();
    const {getPageSimpleActions, handlers} = useAction();
    const {trigger} = handlers;
    const actions = getPageSimpleActions(id);
    const {openModal} = useModal();
    const {t} = useTranslation();
    const selectedTreeKeys = useMemo(
        () => (selectedTreeNode ? [selectedTreeNode.key] : []),
        [selectedTreeNode],
    ); // 是否可以添加字典

    const canAddDict = !!(selectedTreeNode && !selectedTreeNode.children); // 生成列配置

    const columns = useMemo(
        () =>
            dynamicColumns({
                dispatch,
                openModal,
                props,
                t,
                updateEnable,
                batchDelete,
                trigger,
            }),
        [dispatch, openModal, props, t, trigger],
    ); // 分页

    const onChangePage = useCallback(
        (page: any, pageSize: any) => {
            const pageInfo = {...pagination, pageNumber: page, pageSize};
            dispatch(
                actions.set({
                    pagination: pageInfo,
                }),
            );
            dispatch(initDictDataList(props));
        },
        [actions, dispatch, pagination, props],
    ); // sub title render

    const subTitleRender = useCallback(
        (node) => {
            const {addable, modifiable, deletable, type} = node;
            return (
                <span className={styles.treeSubTitle}>
                    {modifiable ? (
                        <EditOutlined
                            className={styles.icon}
                            action={{
                                id: LogActionID.ModifyCategory,
                                module: id,
                                position: [
                                    props.menu?.menuName ?? '',
                                    t('编辑'),
                                    t('保存'),
                                ],
                                action: 'modify',
                                wait: true,
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openModal(UPDATE_MODAL_ID, {
                                    type: 'edit',
                                    node,
                                    targetTypes: [type],
                                });
                            }}
                        />
                    ) : null}
                    {deletable ? (
                        <MinusCircleOutlined
                            className={styles.icon}
                            action={{
                                id: LogActionID.DeleteCategory,
                                module: id,
                                position: [
                                    props.menu?.menuName ?? '',
                                    t('删除'),
                                    t('确定'),
                                ],
                                action: 'delete',
                                wait: true,
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                dispatch(batchDelete(props, node, type));
                            }}
                        />
                    ) : null}

                    {addable ? (
                        <PlusCircleOutlined
                            className={styles.icon}
                            action={{
                                id: LogActionID.AddCategory,
                                module: id,
                                position: [
                                    props.menu?.menuName ?? '',
                                    t('新建'),
                                    t('保存'),
                                ],
                                action: 'add',
                                wait: true,
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openModal(UPDATE_MODAL_ID, {
                                    type: 'add',
                                    node,
                                    targetTypes: addable,
                                });
                            }}
                        />
                    ) : null}
                </span>
            );
        },
        [dispatch, id, openModal, props, t],
    );
    usePage({...props, init: (pageProps) => dispatch(onInit(pageProps))});
    return (
        <>
            <Row className={styles.view}>
                <Col span={4} className={styles.leftTreeContainer}>
                    <div className={styles.leftTree}>
                        <SearchTree
                            isShowSearch={false}
                            treeData={dictTypeTree}
                            expandedKeys={expandedTreeKeys}
                            checkable={false}
                            selectedKeys={selectedTreeKeys}
                            onExpand={(keys: any[]) =>
                                dispatch(
                                    actions.set({
                                        expandedTreeKeys: keys,
                                    }),
                                )
                            }
                            subTitleRender={subTitleRender}
                            onSelect={(keys, nodes) =>
                                dispatch(onTreeSelect(props, keys, nodes))
                            }
                        />
                    </div>
                </Col>

                <Col span={20} className={styles.rightTable}>
                    <div className={styles.toolbar}>
                        <Button
                            type="primary"
                            disabled={!canAddDict}
                            icon={<PlusOutlined />}
                            action={{
                                id: LogActionID.AddDict,
                                module: id,
                                position: [
                                    props.menu?.menuName ?? '',
                                    t('新建'),
                                    t('保存'),
                                ],
                                action: 'add',
                                wait: true,
                            }}
                            onClick={() =>
                                openModal(UPDATE_MODAL_ID, {
                                    type: 'add',
                                    node: selectedTreeNode,
                                    targetTypes: [DICT_TYPES.item.key],
                                })
                            }
                        >
                            {t('新建')}
                        </Button>
                        <Button
                            type="primary"
                            icon={
                                <PortalIcon
                                    iconClass="icon-portal-delete"
                                    className={styles.commonOperationIcon}
                                    style={{
                                        marginRight: 5,
                                    }}
                                />
                            }
                            action={{
                                id: LogActionID.DeleteDict,
                                module: id,
                                position: [
                                    props.menu?.menuName ?? '',
                                    t('删除'),
                                    t('确定'),
                                ],
                                action: 'delete',
                                wait: true,
                            }}
                            danger
                            onClick={() => dispatch(batchDelete(props))}
                        >
                            {t('删除')}
                        </Button>
                    </div>
                    <Table
                        dataSource={tableDataSource}
                        columns={columns}
                        loading={isTableLoading}
                        showIndex={{
                            current: pagination.pageNumber,
                            pageSize: pagination.pageSize,
                        }}
                        // scroll={{
                        //     y: '600px',
                        // }}
                        rowKey="dictdataId"
                        pagination={{
                            position: ['bottomLeft'],
                            current: pagination.pageNumber,
                            pageSize: pagination.pageSize,
                            total: pagination.total,
                            // showTotal: (total: any) =>
                            //     `${t('共')} ${total} ${t('条')}`,
                            showTotal: (total: any) =>
                                t(`共{{total}}条`, {total}),
                            pageSizeOptions: PAGE_SIZE_OPTIONS,
                            onChange: onChangePage,
                            showSizeChanger: true,
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
                </Col>
            </Row>

            <UpdateModal modalId={UPDATE_MODAL_ID} />
        </>
    );
};

export default DataDictConfig;
