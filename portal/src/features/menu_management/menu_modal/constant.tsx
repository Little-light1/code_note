import React from 'react';
import {message, Space, Switch, Modal} from 'antd';
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import {i18nIns} from '@/app/i18n';
import {ColumnsType} from 'antd/lib/table';
import {deleteResource, updateResourceEnable} from './actions';
import {LogActionID} from '../types';

const {t} = i18nIns;

export const RESOURCE_MODAL = 'menuResourceModal';
export const staticColumns: ColumnsType<any> = [
    {
        title: t('资源名称'),
        dataIndex: 'msourceName',
        // 在数据中对应的属性
        key: 'msourceName',
        width: 136,
        ellipsis: true,
    },
    {
        title: t('资源类型'),
        dataIndex: 'msourceTypeI18n',
        key: 'msourceTypeI18n',
        width: 136,
        ellipsis: true,
    },
    {
        title: t('权限标识'),
        dataIndex: 'msourceCode',
        key: 'msourceCode',
        width: 180,
        ellipsis: true,
    },
    {
        title: t('排序'),
        dataIndex: 'msourceSort',
        key: 'msourceSort',
        width: 110,
        ellipsis: true,
    },
];
export const dynamicColumns = ({
    dispatch,
    openModal,
    pageProps,
    currentMenu,
}: any): ColumnsType<any> => [
    ...staticColumns,
    {
        title: t('状态'),
        dataIndex: 'msourceEnable',
        key: 'msourceEnable',
        align: 'center',
        width: 110,
        render: (text: 0 | 1, record: any) => (
            <Switch
                checked={!!text}
                checkedChildren={t('启用')}
                unCheckedChildren={t('禁用')}
                onChange={(value) =>
                    dispatch(updateResourceEnable(pageProps, record, value))
                }
            />
        ),
        ellipsis: true,
    },
    {
        title: t('操作'),
        dataIndex: 'operations',
        key: 'operations',
        align: 'center',
        width: 136,
        render: (text: string, record: any) => (
            <Space size="middle">
                <EditOutlined
                    title={t('编辑')}
                    action={{
                        id: LogActionID.ModifyResource,
                        module: pageProps.id,
                        position: [
                            pageProps.menu?.menuName ?? '',
                            currentMenu.menuName,
                            t('编辑资源'),
                            t('保存'),
                        ],
                        action: 'modify',
                        wait: true,
                    }}
                    onClick={() =>
                        openModal(RESOURCE_MODAL, {
                            type: 'edit',
                            record,
                        })
                    }
                />

                <DeleteOutlined
                    title={t('删除')}
                    action={{
                        id: LogActionID.DeleteResource,
                        module: pageProps.id,
                        position: [
                            pageProps.menu?.menuName ?? '',
                            currentMenu.menuName,
                            t('删除资源'),
                            t('是'),
                        ],
                        action: 'delete',
                        wait: true,
                    }}
                    onClick={() => {
                        // eslint-disable-next-line eqeqeq
                        if (record.msourceEnable == 1) {
                            message.info(
                                `${record.msourceName}${t(
                                    '已启用，不能删除！',
                                )}`,
                            );
                            return;
                        }

                        Modal.confirm({
                            title: t('是否确定删除选中的记录?'),
                            okText: t('是'),
                            cancelText: t('否'),
                            onOk: () => {
                                dispatch(deleteResource(pageProps, record));
                            },
                        });
                    }}
                />
            </Space>
        ),
        ellipsis: true,
    },
];
