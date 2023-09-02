import React, {FC} from 'react';
import {shallowEqual} from 'react-redux';
import {PageProps, getUniqueKey, useModal, useAction} from '@gwaapp/ease';
import {PAGE_SIZE_OPTIONS, Table} from '@components/table';
import PortalIcon from '@/components/icon';
import {Button, Space, Modal} from 'antd';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useTranslation} from 'react-i18next';
import styles from '../styles.module.scss';
import {TIME_CONTROL_MODAL_ID} from '../constant';
import AddForm from './addForm';
import {LogActionID, ModalActionType} from '../types';
import {getUserList, getUserListEx} from '../actions';
import {deleteTime, getTimeList} from './actions';

const TimeControl: FC<PageProps> = (props) => {
    const {id} = props;
    const {getPageSimpleActions} = useAction();
    const actions = getPageSimpleActions(id);
    const dispatch = useAppDispatch(); // 获取状态树中的数据
    const {t} = useTranslation();

    const {timeList, timeTotal, timePageNum, timePageSize, timeListLoading} =
        useAppSelector((state) => state[getUniqueKey(id)], shallowEqual);
    const {openModal} = useModal(); // 清除弹框的待选择及已选择用户数据，防止渲染出错

    const clearModalUsers = () => {
        dispatch(
            actions.set({
                unSelectedUsersData: [],
                selectedUsersData: [],
            }),
        );
    };

    const columns: any = [
        {
            title: t('序号'),
            dataIndex: 'index',
            key: 'index',
            align: 'center',
            ellipsis: true,
            width: 120,
            render: (text: any, record: any, index: any) => {
                const number = (timePageNum - 1) * timePageSize + index + 1;
                return number;
            },
        },
        {
            title: t('可访问起始时间'),
            dataIndex: 'startTime',
            key: 'startTime',
            width: 200,
            align: 'center',
        },
        {
            title: t('可访问结束时间'),
            dataIndex: 'endTime',
            key: 'endTime',
            width: 200,
            align: 'center',
        },
        {
            title: t('已选择用户'),
            dataIndex: 'userList',
            key: 'userList',
            align: 'center',
            render: (value: any) => (
                <Space wrap size={5}>
                    {value?.map((item: any) => (
                        <span key={item?.id} className={styles.userName}>
                            {item?.loginName}
                        </span>
                    ))}
                </Space>
            ),
        },
        {
            title: t('操作'),
            dataIndex: 'operate',
            key: 'operate',
            width: 200,
            align: 'center',
            render: (text: any, record: any) => (
                <Space size="middle">
                    <PortalIcon
                        iconClass="icon-portal-edit"
                        className={styles.commonOperationIcon}
                        title={t('编辑')}
                        action={{
                            id: LogActionID.Modify,
                            module: id,
                            position: [
                                props.menu?.menuName ?? '',
                                t('访问时间控制'),
                                t('编辑'),
                                t('保存'),
                            ],
                            action: 'modify',
                            wait: true,
                        }}
                        onClick={() => {
                            const userList = record?.userList || [];
                            const userIds = userList.map(
                                (item: any) => item.id,
                            );
                            clearModalUsers();
                            dispatch(getUserListEx(props, userIds));
                            dispatch(getUserList(props, userIds));
                            openModal(TIME_CONTROL_MODAL_ID, {
                                type: ModalActionType.Edit,
                                record,
                            });
                        }}
                    />
                    <PortalIcon
                        iconClass="icon-portal-delete"
                        className={styles.commonOperationIcon}
                        title={t('删除')}
                        action={{
                            id: LogActionID.Delete,
                            module: id,
                            position: [
                                props.menu?.menuName ?? '',
                                t('访问时间控制'),
                                t('删除'),
                                t('是'),
                            ],
                            action: 'delete',
                            wait: true,
                        }}
                        onClick={() => {
                            Modal.confirm({
                                okText: t('是'),
                                cancelText: t('否'),
                                title: t('请确认是否要删除选择的数据？'),
                                onOk: async () => {
                                    dispatch(
                                        deleteTime(
                                            props,
                                            record?.ids || [],
                                            record?.startTime,
                                            record?.endTime,
                                        ),
                                    );
                                },
                            });
                        }}
                    />
                </Space>
            ),
        },
    ];

    const onAdd = () => {
        clearModalUsers();
        dispatch(getUserListEx(props, []));
        openModal(TIME_CONTROL_MODAL_ID, {
            type: ModalActionType.Add,
        });
    };

    // const onTableChange = (page: number, size: number) => {
    //     dispatch(
    //         actions.set({
    //             timePageNum: page,
    //             timePageSize: size,
    //         }),
    //     );
    //     dispatch(getTimeList(props));
    // };

    return (
        <div>
            {/* 新建按钮 */}
            <Button
                className={styles.newButton}
                type="primary"
                icon={<PortalIcon iconClass="icon-portal-add" />}
                action={{
                    id: LogActionID.Add,
                    module: id,
                    position: [
                        props.menu?.menuName ?? '',
                        t('访问时间控制'),
                        t('新建'),
                        t('保存'),
                    ],
                    action: 'add',
                    wait: true,
                }}
                onClick={onAdd}
            >
                {t('新建')}
            </Button>
            <AddForm {...props} />
            <div className={styles.tableArea}>
                <Table
                    rowKey="index"
                    loading={timeListLoading}
                    columns={columns}
                    dataSource={timeList}
                    scroll={{
                        y: '600px',
                    }}
                    // pagination={{
                    //     total: timeTotal,
                    //     pageSize: timePageSize,
                    //     current: timePageNum,
                    //     pageSizeOptions: PAGE_SIZE_OPTIONS,
                    //     onChange: onTableChange,
                    // }}
                />
            </div>
        </div>
    );
};

export default TimeControl;
