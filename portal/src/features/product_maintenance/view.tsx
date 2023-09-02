/*
 * @Author:应用维护
 * @Date: 2021-12-01 16:38:15
 * @Last Modified Chen
 * @Last Modified time: 2022-03-21 14:49:11
 */
import React, {FC, useMemo} from 'react';
import {shallowEqual} from 'react-redux';
import {Switch, Button, Space, Input} from 'antd';
import {CatchTokenImage} from '@/components/catch_image';
import {PAGE_SIZE_OPTIONS, Table} from '@components/table';
import {useTranslation} from 'react-i18next';
import {useModal, usePage, PageProps, useAction} from '@gwaapp/ease';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import PortalIcon from '@/components/icon';
import {Events} from '@common/events';
import {report} from '@/common/utils/clientAction';
import UpdateModal from './update_modal'; // 引入弹窗组件

import styles from './styles.module.scss';
import {
    onInit,
    changePage,
    deleteData,
    searchData,
    updateState,
} from './actions';

const {Search} = Input; // Input 包含 search 在此定义一下

const UPDATE_MODAL_ID = 'maintenance';

const ProductMaintenance: FC<any> = (props: PageProps) => {
    const {id, menu} = props;
    const {tableDataSource, isTableLoading, total, pageSize, page} =
        useAppSelector((state) => state[id], shallowEqual);
    const dispatch = useAppDispatch();
    const {openModal} = useModal();
    const {t} = useTranslation();
    const {
        handlers: {trigger},
    } = useAction();
    const columns = useMemo(
        () => [
            {
                title: t('应用编码'),
                dataIndex: 'code',
                key: 'code',
                name: '应用编码',
                width: 150,
                align: 'center',
            },
            {
                title: t('应用名称'),
                dataIndex: 'name',
                key: 'name',
                name: '应用名称',
                width: 150,
                align: 'center',
            },
            {
                title: t('应用描述'),
                dataIndex: 'remark',
                key: 'remark',
                name: '应用描述',
                width: 150,
                align: 'center',
                ellipsis: true,
            },
            {
                title: t('应用IP'),
                dataIndex: 'piUrl',
                key: 'piUrl',
                name: '应用IP',
                width: 200,
                align: 'center',
            },
            {
                title: t('路由地址'),
                dataIndex: 'piRouter',
                key: 'piRouter',
                name: '路由地址',
                width: 220,
                ellipsis: true,
                align: 'center',
            },
            {
                title: t('内外标识'),
                dataIndex: 'gwFlag',
                key: 'gwFlag',
                name: '内外标识',
                width: 150,
                align: 'center',
                render: (
                    text: any,
                    record: {
                        gwFlag: any;
                    },
                ) => {
                    const {gwFlag} = record;

                    if (gwFlag && typeof gwFlag.value !== 'undefined') {
                        return gwFlag.value === 0
                            ? t('金风内部产品')
                            : t('第三方的产品');
                    }

                    return '';
                },
            },
            {
                title: t('顺序'),
                dataIndex: 'sort',
                key: 'sort',
                name: '排序',
                width: 100,
                align: 'center',
            },
            {
                title: t('应用图片'),
                dataIndex: 'piPicture',
                key: 'piPicture',
                name: '应用图片',
                width: 100,
                align: 'center',
                render: (text: string, record: any) => (
                    <CatchTokenImage
                        height={30}
                        width={30}
                        token={text}
                        alt={record.piPicture}
                    />
                ),
            },
            {
                title: t('状态'),
                dataIndex: 'state',
                key: 'state',
                name: '状态',
                width: 130,
                align: 'center',
                render: (
                    text: {
                        value: any;
                    },
                    record: any,
                ) => (
                    <Switch
                        checkedChildren={t('启用')}
                        unCheckedChildren={t('禁用')}
                        defaultChecked={!text.value}
                        key={`${record.id}${text.value}`}
                        onChange={() =>
                            dispatch(updateState(props, record)).then(() => {
                                trigger(Events.update_product_menus);
                                trigger(Events.refresh_menu_manager);
                            })
                        }
                        action={{
                            id: 'addUpdate',
                            module: 'productMaintenance',
                            position: [menu?.menuName ?? '', t('状态')],
                            action: 'modify',
                            wait: true,
                        }}
                    />
                ),
            },
            {
                title: t('操作'),
                dataIndex: 'operation',
                key: 'operation',
                name: '操作',
                align: 'center',
                render: (
                    text: any,
                    record: {
                        state: {
                            value: number;
                        };
                    },
                ) => (
                    <Space size="middle">
                        <PortalIcon
                            iconClass="icon-portal-edit"
                            className={styles.commonOperationIcon}
                            title={t('编辑')}
                            onClick={() =>
                                openModal(UPDATE_MODAL_ID, {
                                    type: 'edit',
                                    node: record,
                                })
                            }
                            action={{
                                id: 'addUpdate',
                                module: 'productMaintenance',
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
                            disabled={
                                record.state.value === 0 ||
                                record.gwFlag.value === 0
                            }
                            title={
                                // 内部产品提示内部产品不可删除，外部产品禁用情况提示启用状态数据不可删除
                                // eslint-disable-next-line no-nested-ternary
                                record.gwFlag.value === 0
                                    ? t('内部产品不可删除')
                                    : record.state.value === 0
                                    ? t('启用状态下数据不可删除')
                                    : t('删除')
                            }
                            onClick={() => {
                                dispatch(deleteData(props, trigger, record));
                            }}
                            action={{
                                id: 'addUpdate',
                                module: 'productMaintenance',
                                position: [
                                    menu?.menuName ?? '',
                                    t('删除'),
                                    t('是'),
                                ],
                                action: 'delete',
                                wait: true,
                            }}
                        />
                    </Space>
                ),
            },
        ],
        [dispatch, menu?.menuName, openModal, props, t, trigger],
    );

    const inputChange = (e: any) => {
        if (e.target.value === '') {
            dispatch(searchData(props, e.target.value));
        }
    };

    usePage({...props, init: (pageProps) => dispatch(onInit(pageProps))});
    return (
        <div className={styles.searchView}>
            <div className={styles.topContainer}>
                <div>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<PortalIcon iconClass="icon-portal-add" />}
                        onClick={() =>
                            openModal(UPDATE_MODAL_ID, {
                                type: 'add',
                            })
                        }
                        action={{
                            id: 'addUpdate',
                            module: 'productMaintenance',
                            position: [
                                menu?.menuName ?? '',
                                t('新建'),
                                t('确定'),
                            ],
                            action: 'add',
                            wait: true,
                        }}
                    >
                        {t('新建')}
                    </Button>
                    <UpdateModal
                        addModalId={UPDATE_MODAL_ID}
                        pageProps={props}
                    />
                </div>
                <div>
                    <Search
                        className={styles.positionInput}
                        style={{width: '480px'}}
                        allowClear
                        maxLength={20}
                        onSearch={(value) => {
                            report.action({
                                id: 'addUpdate',
                                module: 'productMaintenance',
                                position: [menu?.menuName ?? '', t('查询')],
                                action: 'query',
                                wait: true,
                            });
                            dispatch(searchData(props, value));
                        }}
                        placeholder={t('请输入应用名称/应用编码')}
                        onChange={(e) => {
                            inputChange(e);
                        }}
                    />
                </div>
            </div>
            <div className={styles.tableArea}>
                <Table
                    columns={columns}
                    dataSource={tableDataSource}
                    loading={isTableLoading}
                    showIndex
                    rowKey="MainId"
                    pagination={{
                        total,
                        pageSize,
                        current: page,
                        pageSizeOptions: PAGE_SIZE_OPTIONS,
                        onChange: (current, size) =>
                            dispatch(changePage(props, current, size!)),
                    }}
                    scroll={{
                        y: '630px',
                    }}
                />
            </div>
        </div>
    );
};

export default ProductMaintenance;
