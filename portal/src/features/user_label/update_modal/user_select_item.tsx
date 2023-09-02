import React, {useState, useMemo, useCallback} from 'react';
import {SearchTree} from '@components/tree';
import {Table} from '@components/table';
import {shallowEqual} from 'react-redux';
import {LeftOutlined, RightOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {
    useAppDispatch,
    useAppSelector,
    getPageSimpleActions,
} from '@/app/runtime';
// import {useVT} from 'virtualizedtableforantd4';
import styles from './styles.module.scss';
import {thunkGetUsersByOrgIds} from '../actions';

let valueLength: {} | null | undefined;

const UserSelectItem = ({pageProps, value = [], onChange}) => {
    const {id} = pageProps;
    const dispatch = useAppDispatch();
    const [leftSelectedKeys, setLeftSelectedKeys] = useState([]);
    const [rightSelectedKeys, setRightSelectedKeys] = useState([]);
    const {userTableDataSource, usersInOrgs, checkedKeys, selectedKeys} =
        useAppSelector((state) => state[id], shallowEqual);
    const simpleAction = getPageSimpleActions(id);
    const {t} = useTranslation();
    // const [vt] = useVT(
    //     () => ({
    //         scroll: {
    //             y: 230,
    //         },
    //     }),
    //     [],
    // );
    const STATIC_COLUMNS =
        // useMemo(() =>
        [
            {
                dataIndex: 'index',
                key: 'index',
                title: t('序号'),
                name: '序号',
                align: 'center',
                width: 90,
                render: (text: any, record: any, index: any) => {
                    const number = index + 1;
                    return number;
                },
            },
            {
                dataIndex: 'loginName',
                title: t('用户账号'),
                name: '用户账号',
                align: 'center',
                width: 100,
                ellipsis: true,
            },
            {
                dataIndex: 'userName',
                title: t('用户名称'),
                name: '用户名称',
                align: 'center',
                width: 90,
                ellipsis: true,
            },
            {
                dataIndex: 'organization',
                title: t('所属组织机构'),
                name: '所属组织机构',
                align: 'center',
                width: 120,
                ellipsis: true,
                // render: (e) => console.log(e),
                render: (text: any) => <span>{text?.name}</span>,
            },
        ];
    //     [t],
    // );

    const moveToRight = () => {
        const usersInOrgsMap = usersInOrgs.reduce(
            (prev: any, curr: any) => ({...prev, [curr.id]: curr}),
            {},
        ); // 根据勾选id从列表中找到对应的数据

        const newList = [
            ...value,
            ...leftSelectedKeys.map((item: any) => usersInOrgsMap[item]),
        ];
        onChange(newList); // 添加到右侧后根据勾选id移除列表对应项

        const table: any[] = [];
        usersInOrgs.forEach((item: any) => {
            if (leftSelectedKeys.indexOf(item.id) === -1) {
                table.push(item);
            }
        });
        dispatch(
            simpleAction.set({
                usersInOrgs: table,
            }),
        );
        setLeftSelectedKeys([]);
    };

    const moveToLeft = () => {
        const table: any[] = [];
        value.forEach((item) => {
            if (rightSelectedKeys.indexOf(item.id) === -1) {
                table;
            } else {
                table.push(item);
            }
        });
        // 合并数组
        const tableList = usersInOrgs.concat(table);
        dispatch(
            simpleAction.set({
                usersInOrgs: tableList,
            }),
        );
        const dataTable: any[] = [];
        value.forEach((item) => {
            if (rightSelectedKeys.indexOf(item.id) === -1) {
                dataTable.push(item);
            }
        });
        onChange(dataTable);
        setRightSelectedKeys([]);
    }; // 取出所有的key用来展开树节点

    const treeOpen: any[] = []; // eslint-disable-next-line @typescript-eslint/no-shadow

    function arr(_userTableDataSource: any) {
        _userTableDataSource.forEach((item: {children: any; id: any}) => {
            if (item.children) {
                treeOpen.push(item.id);
                arr(item.children);
            }
        });
    }

    arr(userTableDataSource);
    const filterUsersInOrgs = useMemo(() => {
        // 数组去重
        const deWeightThree = () => {
            const map = new Map();

            for (const item of usersInOrgs) {
                if (!map.has(item.id)) {
                    map.set(item.id, item);
                }
            }

            return [...map.values()];
        };

        const newArr3 = deWeightThree();
        return newArr3;
    }, [usersInOrgs]);

    // 查询逻辑
    const filterTable = useCallback((item, searchStr) => {
        const {loginName, userName, organization} = item;

        if (
            loginName.indexOf(searchStr) >= 0 ||
            userName.indexOf(searchStr) >= 0 ||
            (organization && organization.name.indexOf(searchStr) >= 0)
        ) {
            return true;
        }

        return false;
    }, []);

    // 右侧table去重
    const filterValue = useMemo(() => {
        const valueArray: never[] = [];
        const obj = {};

        for (let i = 0; i < value.length; i += 1) {
            if (!obj[value[i].id]) {
                valueArray.push(value[i]);
                obj[value[i].id] = true;
            }
        }

        valueLength = valueArray.length;
        return valueArray;
    }, [value]);

    return (
        <div className={styles.userSelectItem}>
            <div className={styles.left}>
                <div className={styles.up}>
                    <SearchTree
                        isShowSearch={false}
                        checkable
                        treeData={userTableDataSource}
                        defaultExpandAll
                        expandedKeys={treeOpen}
                        onCheck={(keys) => {
                            dispatch(thunkGetUsersByOrgIds(pageProps, keys));
                        }}
                        onExpand={(keys: any[]) => {
                            dispatch(
                                simpleAction.set({
                                    expandedKeys: keys,
                                }),
                            );
                        }}
                        checkedKeys={checkedKeys}
                        selectedKeys={selectedKeys}
                    />
                </div>

                <div className={styles.down}>
                    {/* filterUsersInOrgs依赖的就是状态树上的数据 */}
                    <Table
                        dataSource={filterUsersInOrgs}
                        className={styles.tableSearch}
                        // showIndex
                        showSearch={t('用户账号/用户名称/所属组织机构')}
                        onFilter={filterTable}
                        columns={STATIC_COLUMNS}
                        rowKey="id"
                        rowSelection={{
                            selectedRowKeys: leftSelectedKeys,
                            onChange: (keys: React.Key[]) =>
                                setLeftSelectedKeys(keys),
                        }}
                        scroll={{
                            y: 192,
                        }}
                        // components={vt}
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
                    {t('已选人员')}
                    <span
                        style={{
                            color: '#00E4FF',
                        }}
                    >
                        &nbsp;(&nbsp;{valueLength}&nbsp;)
                    </span>
                </div>
                <div className={styles.table}>
                    <Table
                        dataSource={filterValue}
                        // showIndex
                        rowKey="id"
                        className={styles.tableSearch}
                        showSearch={t('用户账号/用户名称/所属组织机构')}
                        onFilter={filterTable}
                        columns={STATIC_COLUMNS}
                        rowSelection={{
                            selectedRowKeys: rightSelectedKeys,
                            onChange: (keys: React.Key[]) =>
                                setRightSelectedKeys(keys),
                        }}
                        scroll={{
                            y: 467,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserSelectItem;
