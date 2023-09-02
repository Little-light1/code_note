import React, {useCallback, useMemo} from 'react';
import {Switch, Button, message} from 'antd';
import {Table} from '@components/table';
import {useAppSelector, useAppDispatch} from '@/app/runtime';
import {useModal, useAction, PageProps} from '@gwaapp/ease';
import {i18nIns} from '@/app/i18n';
import {CatchTokenImage} from '@/components/catch_image';
import PortalIcon from '@/components/icon';
import {Events} from '@common/events';
import {COMMON_MODAL} from './constant';
import {enableCommonConfig, deleteCommon} from './actions';
import styles from './styles.module.scss';
import CommonModal from './modal';
import {LogActionID} from '../types';

const {t} = i18nIns;

interface Props {
    pageProps: PageProps;
}
const staticColumns = [
    {
        title: t('编码'),
        dataIndex: 'cconfigCode',
        key: 'cconfigCode',
    },
    {
        title: t('功能名称'),
        dataIndex: 'cconfigName',
        key: 'cconfigName',
    },
    {
        title: t('图标'),
        dataIndex: 'cconfigFiletoken',
        key: 'cconfigFiletoken',
        render: (text: string, record: any) => (
            <CatchTokenImage
                height={30}
                width={30}
                token={text}
                alt={record.ipicName}
            />
        ),
    },
    {
        title: t('URL地址'),
        dataIndex: 'cconfigUrlpath',
        key: 'cconfigUrlpath',
    },
    {
        title: t('顺序'),
        dataIndex: 'cconfigSort',
        key: 'cconfigSort',
    },
];

const CommonEditor = ({pageProps}: Props) => {
    const {id} = pageProps;
    const {handlers} = useAction();
    const {trigger} = handlers;
    const dispatch = useAppDispatch();
    const {openModal} = useModal();
    const dataSource = useAppSelector((state) => state[id].commonConfigs);
    const commonConfigs = useAppSelector((state) => state.app.commonConfigs);

    const columnDeleteTitle = useCallback((columnData: any) => {
        if (columnData.cconfigIsenable === 1) {
            return t('启用状态下数据不可删除');
        }
        if (columnData.children && columnData.children.length > 0) {
            return t('包含子级的数据不可删除');
        }
        return t('删除');
    }, []);

    const columns = useMemo(
        () => [
            ...staticColumns,
            {
                title: t('状态'),
                dataIndex: 'cconfigIsenable',
                key: 'cconfigIsenable',
                render: (text, record) => (
                    <Switch
                        checked={!!text}
                        checkedChildren={t('启用')}
                        unCheckedChildren={t('禁用')}
                        onChange={(value) => {
                            const isUseConfigs = commonConfigs.filter(
                                (item: any) => !!item.cconfigIsenable,
                            ).length;

                            if (value && isUseConfigs === 5) {
                                message.warning(t('最多启用五个'));
                                return;
                            }

                            dispatch(
                                enableCommonConfig(pageProps, value, record),
                            ).then(() => {
                                trigger(Events.update_frame_common);
                            });
                        }}
                        action={{
                            id: 'modifyCommonStatus',
                            module: pageProps.id,
                            position: [
                                pageProps.menu?.menuName ?? '',
                                t('通用功能配置'),
                                t('状态'),
                            ],
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
                render: (text, data) => (
                    <div className={styles.operations}>
                        <PortalIcon
                            iconClass="icon-portal-add"
                            className={styles.commonOperationIcon}
                            title={t('新增子菜单')}
                            action={{
                                id: LogActionID.AddCommonConfig,
                                module: id,
                                position: [
                                    pageProps.menu?.menuName ?? '',
                                    t('通用功能配置'),
                                    t('新增子菜单'),
                                    t('保存'),
                                ],
                                action: 'add',
                                wait: true,
                            }}
                            onClick={() => {
                                openModal(COMMON_MODAL, {
                                    type: 'add',
                                    data,
                                });
                            }}
                        />

                        <PortalIcon
                            iconClass="icon-portal-edit"
                            className={styles.commonOperationIcon}
                            title={t('编辑')}
                            action={{
                                id: LogActionID.ModifyCommonConfig,
                                module: id,
                                position: [
                                    pageProps.menu?.menuName ?? '',
                                    t('通用功能配置'),
                                    t('编辑'),
                                    t('保存'),
                                ],
                                action: 'modify',
                                wait: true,
                            }}
                            onClick={() => {
                                openModal(COMMON_MODAL, {
                                    type: 'edit',
                                    data,
                                });
                            }}
                        />

                        <PortalIcon
                            iconClass="icon-portal-delete"
                            className={styles.commonOperationIcon}
                            action={{
                                id: LogActionID.DeleteCommonConfig,
                                module: id,
                                position: [
                                    pageProps.menu?.menuName ?? '',
                                    t('通用功能配置'),
                                    t('删除'),
                                ],
                                action: 'delete',
                                wait: true,
                            }}
                            disabled={
                                data.cconfigIsenable === 1 ||
                                (data.children && data.children.length > 0)
                            }
                            title={columnDeleteTitle(data)}
                            onClick={() => {
                                console.log(data);

                                if (data.cconfigIsenable === 1) {
                                    message.info(t('已启用，不能删除！'), 2);
                                }

                                dispatch(deleteCommon(pageProps, data)).then(
                                    () => trigger(Events.update_frame_common),
                                );
                            }}
                        />
                    </div>
                ),
            },
        ],
        [dispatch, id, openModal, pageProps, trigger, columnDeleteTitle],
    );
    return (
        <>
            <Button
                type="primary"
                action={{
                    id: LogActionID.AddCommonConfig,
                    module: id,
                    position: [
                        pageProps.menu?.menuName ?? '',
                        t('通用功能配置'),
                        t('新建'),
                        t('保存'),
                    ],
                    action: 'add',
                    wait: true,
                }}
                onClick={() =>
                    openModal(COMMON_MODAL, {
                        type: 'add',
                    })
                }
                style={{
                    marginBottom: 10,
                }}
            >
                {/* 新建 */}
                {t('新建')}
            </Button>
            <Table
                showIndex
                columns={columns}
                dataSource={dataSource}
                rowKey="cconfigId"
                scroll={false}
                indexWidth={100}
            />

            <CommonModal pageProps={pageProps} modalId={COMMON_MODAL} />
        </>
    );
};

export default CommonEditor;
