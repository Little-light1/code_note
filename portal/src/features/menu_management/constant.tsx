import React from 'react';
import {Switch, Space} from 'antd';
import {CatchTokenImage} from '@components/catch_image';
import {ColumnsType} from 'antd/es/table';
import PortalIcon from '@/components/icon';
import {AppDispatch} from '@/app/runtime';
import {i18nIns} from '@/app/i18n';
import {PageProps} from '@gwaapp/ease';
import {Events} from '@common/events';
import styles from './styles.module.scss';
import {deleteMenu, toggleEnable, startEditMenu} from './actions';
import {LogActionID} from './types';

const {t} = i18nIns;

export const MENU_MODAL_ID = 'menuManagement';
export const staticColumns: ColumnsType<any> = [
    {
        title: t('菜单编码'),
        dataIndex: 'menuCode',
        // 在数据中对应的属性
        key: 'menuCode',
        align: 'center',
        ellipsis: true,
    },
    {
        title: t('菜单名称'),
        dataIndex: 'menuName',
        key: 'menuName',
        align: 'center',
        ellipsis: true,
    },
    {
        title: t('路由地址'),
        dataIndex: 'menuRoutingPath',
        key: 'menuRoutingPath',
        align: 'center',
        ellipsis: true,
    },
    {
        title: t('图标'),
        dataIndex: 'menuIconToken',
        key: 'menuIconToken',
        width: 150,
        align: 'center',
        render: (text: string, record: any) => (
            <CatchTokenImage
                height={32}
                width={32}
                token={text}
                alt={record.ipicName}
            />
        ),
    },
];
interface DynamicColumnsProps {
    dispatch: AppDispatch;
    openModal: (id: string, extra?: any) => void;
    props: PageProps;
    trigger: (key: string) => any;
    t: (s: string) => string;
}
interface Item {
    menuEnable: number;
    operation: string;
}
export const dynamicColumns = ({
    dispatch,
    openModal,
    props,
    trigger,
    t,
}: DynamicColumnsProps): ColumnsType<Item> => [
    ...staticColumns,
    {
        title: t('类型'),
        dataIndex: 'menuTypeName',
        key: 'menuTypeName',
        align: 'center',
        ellipsis: true,
    },
    {
        title: t('排序'),
        dataIndex: 'menuSort',
        key: 'menuSort',
        align: 'center',
        ellipsis: true,
    },
    {
        title: t('状态'),
        dataIndex: 'menuEnable',
        key: 'menuEnable',
        width: 150,
        align: 'center',
        render: (text: number, record: any) => (
            <Switch
                checkedChildren={t('启用')}
                unCheckedChildren={t('禁用')}
                checked={!!text}
                onChange={(value) =>
                    dispatch(toggleEnable(props, value, record)).then(() =>
                        trigger(Events.update_product_menus),
                    )
                }
                action={{
                    id: 'modifyMenuStatus',
                    module: props.id,
                    position: [props.menu?.menuName ?? '', t('状态')],
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
        align: 'center',
        render: (text: number, record: any) => (
            <Space size="middle">
                <PortalIcon
                    iconClass="icon-portal-add"
                    className={styles.commonOperationIcon}
                    title={t('新增子菜单')}
                    action={{
                        id: LogActionID.Add,
                        module: props.id,
                        position: [
                            props.menu?.menuName ?? '',
                            t('新增子菜单'),
                            t('保存'),
                        ],
                        action: 'add',
                        wait: true,
                    }}
                    onClick={() => {
                        openModal(MENU_MODAL_ID, {
                            type: 'add',
                            parent: record,
                        });
                    }}
                />

                <PortalIcon
                    iconClass="icon-portal-edit"
                    className={styles.commonOperationIcon}
                    title={t('编辑')}
                    action={{
                        id: LogActionID.Modify,
                        module: props.id,
                        position: [
                            props.menu?.menuName ?? '',
                            t('编辑'),
                            t('保存'),
                        ],
                        action: 'modify',
                        wait: true,
                    }}
                    onClick={() => {
                        dispatch(startEditMenu(props, record));
                        openModal(MENU_MODAL_ID, {
                            type: 'edit',
                            record,
                        });
                    }}
                />

                <PortalIcon
                    iconClass="icon-portal-delete"
                    className={styles.commonOperationIcon}
                    disabled={record.menuEnable}
                    title={
                        record.menuEnable
                            ? t('启用状态下数据不可删除')
                            : t('删除')
                    }
                    action={{
                        id: LogActionID.Delete,
                        module: props.id,
                        position: [
                            props.menu?.menuName ?? '',
                            t('删除'),
                            t('确定'),
                        ],
                        action: 'delete',
                        wait: true,
                    }}
                    onClick={() => {
                        dispatch(
                            deleteMenu(props, record.menuId, record.menuName),
                        ).then(() => trigger(Events.update_product_menus));
                    }}
                />
            </Space>
        ),
    },
];
