import React, {FC, useEffect, useMemo, useState} from 'react';
import {useAppSelector} from '@/app/runtime';
import {useTranslation} from 'react-i18next';
import {shallowEqual} from 'react-redux';
import {getUniqueKey} from '@gwaapp/ease';
import {LeftOutlined, RightOutlined} from '@ant-design/icons';
import {Table} from '@components/table';
import _ from 'lodash';
import styles from './styles.module.scss';

const UserSelected: FC<any> = ({props, value, onChange}) => {
    // 待选择用户选择的key
    const [leftSelectedKeys, setLeftSelectedKeys] = useState<React.Key[]>([]); // 已选择用户选择的key

    const [rightSelectedKeys, setRightSelectedKeys] = useState<React.Key[]>([]);
    const [unSelectedUsers, setUnSelectedUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const {t} = useTranslation();
    const {id} = props; // 获取状态树中的数据
    const {unSelectedUsersData} = useAppSelector(
        (state) => state[getUniqueKey(id)],
        shallowEqual,
    );
    useEffect(() => {
        setUnSelectedUsers(_.cloneDeep(unSelectedUsersData));
    }, [unSelectedUsersData]);
    useEffect(() => {
        setSelectedUsers(value || []);
    }, [value]);
    const columns: any = useMemo(
        () => [
            {
                title: t('序号'),
                dataIndex: 'index',
                align: 'center',
                ellipsis: true,
                render: (text: any, record: any, index: any) => {
                    const number = index + 1;
                    return number;
                },
            },
            {
                dataIndex: 'loginName',
                title: t('登录账号'),
                align: 'center',
                ellipsis: true,
                width: 100,
            },
            {
                dataIndex: 'userName',
                title: t('登录姓名'),
                align: 'center',
                ellipsis: true,
                width: 100,
            },
            {
                dataIndex: 'organization',
                title: t('所属组织'),
                align: 'center',
                ellipsis: true,
                render: (text: any) => <span>{text?.name}</span>,
            },
        ],
        [],
    ); // 查询逻辑

    const filterTable = (item: any, searchStr: string) => {
        const {userName, loginName} = item; // 根据登录姓名搜索

        if (
            (userName && userName.indexOf(searchStr) >= 0) ||
            (loginName && loginName.indexOf(searchStr) >= 0)
        ) {
            return true;
        }

        return false;
    }; // 选择用户

    const moveToRight = (selectedKeys: React.Key[]) => {
        const usersMap = unSelectedUsers.reduce(
            (prev: any, curr: any) => ({...prev, [curr.id]: curr}),
            {},
        );
        const toRightUsers = selectedKeys.map(
            (itemId: string | number) => usersMap[itemId],
        );
        const rightUsers = selectedUsers.concat(toRightUsers as any); // 添加到右侧后根据勾选id移除列表对应项

        const leftUsers: any[] = [];
        unSelectedUsers.forEach((item: any) => {
            if (selectedKeys.indexOf(item.id) === -1) {
                leftUsers.push(item);
            }
        });
        setUnSelectedUsers(leftUsers as never[]);
        setSelectedUsers(rightUsers);
        onChange(rightUsers);
        setLeftSelectedKeys([]);
    }; // 取消选择用户

    const moveToLeft = (selectedKeys: React.Key[]) => {
        const toLeftUsers: any[] = [];
        const rightUsers: any[] = [];
        selectedUsers.forEach((item: any) => {
            if (selectedKeys.indexOf(item.id) !== -1) {
                toLeftUsers.push(item);
            } else {
                rightUsers.push(item);
            }
        }); // 合并数组

        const leftUsers = unSelectedUsers.concat(toLeftUsers as never[]);
        setUnSelectedUsers(leftUsers);
        setSelectedUsers(rightUsers as any);
        onChange(rightUsers);
        setRightSelectedKeys([]);
    };

    return (
        <div className={styles.userSelected}>
            <div className={styles.left}>
                <div className={styles.selected}>{t('待选用户')}</div>
                <div className={styles.table}>
                    <Table
                        dataSource={unSelectedUsers}
                        rowKey="id"
                        showSearch={t('登录姓名/登录账号')}
                        onFilter={filterTable}
                        columns={columns}
                        rowSelection={{
                            selectedRowKeys: leftSelectedKeys,
                            onChange: (keys: React.Key[]) =>
                                setLeftSelectedKeys(keys),
                        }}
                    />
                </div>
            </div>
            <div className={styles.space}>
                <div className={styles.spaceLine} />
                <div
                    className={
                        leftSelectedKeys.length === 0
                            ? styles.disabledBtn
                            : styles.buttonStyle
                    }
                    onClick={() => {
                        moveToRight(leftSelectedKeys);
                    }}
                >
                    <RightOutlined />
                </div>
                <div
                    className={
                        rightSelectedKeys.length === 0
                            ? styles.disabledBtn
                            : styles.buttonStyle
                    }
                    onClick={() => {
                        moveToLeft(rightSelectedKeys);
                    }}
                >
                    <LeftOutlined />
                </div>
                <div className={styles.spaceLine} />
            </div>
            <div className={styles.right}>
                <div className={styles.selected}>
                    {t('已选用户')}
                    <span
                        style={{
                            color: '#00E4FF',
                            marginLeft: '10px',
                        }}
                    >
                        ({selectedUsers.length})
                    </span>
                </div>
                <div className={styles.table}>
                    <Table
                        dataSource={selectedUsers}
                        rowKey="id"
                        showSearch={t('登录姓名/登录账号')}
                        onFilter={filterTable}
                        columns={columns}
                        rowSelection={{
                            selectedRowKeys: rightSelectedKeys,
                            onChange: (keys: React.Key[]) =>
                                setRightSelectedKeys(keys),
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserSelected;
