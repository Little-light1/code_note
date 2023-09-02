import React, {FC} from 'react';
import {shallowEqual} from 'react-redux';
import {Switch, Button, Space, Input, Tooltip} from 'antd';
import {usePage, PageProps, useModal, useAction} from '@gwaapp/ease';
import {PlusOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {PAGE_SIZE_OPTIONS, Table} from '@components/table';
import {CatchTokenImage} from '@/components/catch_image';
import PortalIcon from '@/components/icon';
import {Events} from '@/common/events';
import {report} from '@/common/utils/clientAction';
import {
    onInit,
    changePage,
    searchData,
    updateState,
    fetchAppData,
} from './actions';
import styles from './styles.module.scss';
import AddRole from './add_role';

const {Search} = Input;
const UPDATE_MODAL_ID = 'account';

const Account: FC<PageProps> = (props) => {
    const dispatch = useAppDispatch();
    const {id, menu} = props;
    const {
        handlers: {register, deregister},
    } = useAction();
    const {tableDataSource, isTableLoading, total, pageSize, page} =
        useAppSelector((state) => state[id], shallowEqual);
    usePage({
        ...props,
        init: (pageProps) =>
            dispatch(onInit(pageProps)).then(() =>
                register(
                    'portal_account',
                    () => dispatch(fetchAppData(props)),
                    Events.update_product_menus,
                ),
            ),
        unMount: (pageProps) => dispatch(onInit(pageProps)),
        // unMount要清空部分状态。unMount里面 自己设置一下
        close: (pageProps) => {
            dispatch(onInit(pageProps));
            deregister('portal_account', Events.update_product_menus);
        }, // close会全部清空
    });
    const {openModal} = useModal();
    const {t} = useTranslation();

    const getList = (List: any) => {
        const arr = [];

        for (let i = 0; i < List.length; i += 1) {
            const str = `【${List[i].productName}】: ${List[i].startDate}~${List[i].endDate}`;
            arr.push(str);
        }

        return arr.join(',');
    };

    const columns = [
        {
            title: t('企业logo'),
            dataIndex: 'logo',
            key: 'logo',
            width: 150,
            align: 'center',
            render: (text: string, record: any) =>
                record.logo !== '' ||
                record.logo !== null ||
                record.logo !== undefined ? (
                    <CatchTokenImage
                        height={30}
                        width={30}
                        token={text}
                        alt={record.text}
                    />
                ) : (
                    <span />
                ),
        },
        {
            title: t('企业名称'),
            dataIndex: 'name',
            key: 'name',
            width: 300,
            align: 'center',
        },
        {
            title: t('企业简称'),
            dataIndex: 'shortName',
            key: 'shortName',
            width: 200,
            align: 'center',
        },
        // {
        //     title: t('账户性质'),
        //     dataIndex: 'type',
        //     key: 'type',
        //     width: 150,
        //     align: 'center',
        //     render: (text: {value: number}) => {
        //         if (text && text.value === 1) {
        //             return <span>{t('运维企业')}</span>;
        //         }

        //         if (text && text.value === 2) {
        //             return <span>{t('平台企业')}</span>;
        //         }

        //         return <span>{t('应用企业')}</span>;
        //     },
        // },
        {
            title: t('账户状态'),
            dataIndex: 'state',
            key: 'state',
            width: 200,
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
                    checked={!text.value}
                    onChange={(value) =>
                        dispatch(updateState(props, record, value))
                    }
                    action={{
                        id: 'addUpdate',
                        module: 'account',
                        position: [menu?.menuName ?? '', t('状态')],
                        action: 'modify',
                        wait: true,
                    }}
                />
            ),
        },
        {
            title: t('产品服务使用时效'),
            dataIndex: 'productList',
            key: 'productList',
            align: 'center',
            ellipsis: {
                showTitle: false,
            },
            render: (productList = []) => (
                <Tooltip title={getList(productList)}>
                    <span>{getList(productList)}</span>
                </Tooltip>
            ),
        },
        {
            title: t('操作'),
            dataIndex: 'operation',
            key: 'operation',
            align: 'center',
            width: 200,

            render: (text: any, record: any) => (
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
                            module: 'account',
                            position: [
                                menu?.menuName ?? '',
                                t('编辑'),
                                t('确定'),
                            ],
                            action: 'modify',
                            wait: true,
                        }}
                    />
                </Space>
            ),
        },
    ];

    const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            dispatch(searchData(props, e.target.value));
        }
    };

    return (
        <div className={styles.searchView}>
            <div className={styles.topContainer}>
                <div>
                    {/*   操作日志6个动作：新增、修改、删除、查询、导出、导入、
                              'add', 'modify', 'delete', 'query', 'export', 'import' */}
                    {/* 新增编辑 操作结果埋点 action:操作行为 wait: true等待接口完成不要直接发操作日志信息 props.menu.menuName 页面菜单 */}
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<PlusOutlined />}
                        onClick={() =>
                            openModal(UPDATE_MODAL_ID, {
                                type: 'add',
                            })
                        }
                        action={{
                            id: 'addUpdate',
                            module: 'account',
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
                    <AddRole addModalId={UPDATE_MODAL_ID} id={id} />
                </div>
                <div>
                    <Search
                        className={styles.positionInput}
                        style={{width: '465px'}}
                        allowClear
                        maxLength={20}
                        onSearch={(value) => {
                            report.action({
                                id: 'addUpdate',
                                module: 'account',
                                position: [menu?.menuName ?? '', t('查询')],
                                action: 'query',
                                wait: true,
                            });
                            dispatch(searchData(props, value));
                        }}
                        placeholder={t('请输入企业名称/企业简称')}
                        onChange={(e) => inputChange(e)}
                    />
                </div>
            </div>
            <div className={styles.tableArea}>
                <Table
                    columns={columns}
                    dataSource={tableDataSource}
                    loading={isTableLoading}
                    showIndex
                    rowKey="id"
                    pagination={{
                        total,
                        pageSize,
                        current: page,
                        pageSizeOptions: PAGE_SIZE_OPTIONS,
                        onChange: (current, size) =>
                            dispatch(changePage(props, current, size!)),
                    }}
                    scroll={{y: '610px'}}
                />
            </div>
        </div>
    );
};

export default Account;
