import React, {FC, useMemo} from 'react';
import {Switch, Button} from 'antd';
import {Table} from '@components/table';
import {i18nIns} from '@/app/i18n';
import {useAppSelector, useAppDispatch} from '@/app/runtime';
import {useModal, PageProps} from '@gwaapp/ease';
import {CatchTokenImage} from '@/components/catch_image';
import PortalIcon from '@/components/icon';
import BgPicModal from './modal';
import {enablePic, deleteBgPic} from './actions';
import {BG_MODAL} from './constant';
import styles from './styles.module.scss';
import {LogActionID} from '../types';

const {t} = i18nIns;

const staticColumns = [
    {
        title: t('图片名称'),
        dataIndex: 'ipicName',
        key: 'ipicName',
    },
    {
        title: t('缩略图'),
        dataIndex: 'ipicFiletoken',
        key: 'ipicFiletoken',
        render: (text: string, record: any) => (
            <CatchTokenImage
                height={50}
                width={100}
                token={text}
                alt={record.ipicName}
            />
        ),
    },
    {
        title: t('顺序'),
        dataIndex: 'ipicSort',
        key: 'ipicSort',
    },
];

const BgEditor: FC<{
    pageProps: PageProps;
}> = ({pageProps}) => {
    const {id} = pageProps;
    const dispatch = useAppDispatch();
    const dataSource = useAppSelector((state) => state[id].bgPics);
    const {openModal} = useModal();
    const columns = useMemo(
        () => [
            ...staticColumns,
            {
                title: t('状态'),
                dataIndex: 'ipicIsenable',
                key: 'ipicIsenable',
                render: (text, record) => (
                    <Switch
                        checked={!!text}
                        checkedChildren={t('启用')}
                        unCheckedChildren={t('禁用')}
                        onChange={(value) =>
                            dispatch(enablePic(pageProps, value, record))
                        }
                        action={{
                            id: 'modifyBgStatus',
                            module: pageProps.id,
                            position: [
                                pageProps.menu?.menuName ?? '',
                                t('背景页面配置'),
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
                            iconClass="icon-portal-edit"
                            className={styles.commonOperationIcon}
                            title={t('编辑')}
                            action={{
                                id: LogActionID.ModifyBGConfig,
                                module: id,
                                position: [
                                    pageProps.menu?.menuName ?? '',
                                    t('背景页面配置'),
                                    t('编辑'),
                                    t('保存'),
                                ],
                                action: 'modify',
                                wait: true,
                            }}
                            onClick={() => {
                                openModal(BG_MODAL, {
                                    type: 'edit',
                                    data,
                                });
                            }}
                        />

                        <PortalIcon
                            iconClass="icon-portal-delete"
                            className={styles.commonOperationIcon}
                            action={{
                                id: LogActionID.DeleteBGConfig,
                                module: id,
                                position: [
                                    pageProps.menu?.menuName ?? '',
                                    t('背景页面配置'),
                                    t('删除'),
                                    t('确定'),
                                ],
                                action: 'delete',
                                wait: true,
                            }}
                            disabled={data.ipicIsenable === 1}
                            title={
                                data.ipicIsenable === 1
                                    ? t('启用状态下数据不可删除')
                                    : t('删除')
                            }
                            onClick={() => {
                                dispatch(deleteBgPic(pageProps, data));
                            }}
                        />
                    </div>
                ),
            },
        ],
        [dispatch, openModal, pageProps, id],
    );
    return (
        <>
            <Button
                type="primary"
                action={{
                    id: LogActionID.AddBGConfig,
                    module: id,
                    position: [
                        pageProps.menu?.menuName ?? '',
                        t('背景页面配置'),
                        t('新建'),
                        t('保存'),
                    ],
                    action: 'add',
                    wait: true,
                }}
                onClick={() =>
                    openModal(BG_MODAL, {
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
                rowKey="ipicId"
                scroll={false}
            />

            <BgPicModal pageProps={pageProps} modalId={BG_MODAL} />
        </>
    );
};

export default BgEditor;
