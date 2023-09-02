import React from 'react';
import {SearchTree} from '@components/tree';
import {VirtualTable as Table} from '@gwaapp/ease';
import {shallowEqual} from 'react-redux';
import {LeftOutlined, RightOutlined} from '@ant-design/icons';
import {message, Input, Modal, Spin} from 'antd';
import {useTranslation} from 'react-i18next';
import {
    useAppDispatch,
    useAppSelector,
    getPageSimpleActions,
} from '@/app/runtime';
import {STATIC_COLUMNS_LEFT, STATIC_COLUMNS_RIGHT} from './constant';
import styles from './styles.module.scss';
import {
    changeLeftSelectedKeys,
    changeRightSelectedKeys,
    moveToRight,
    moveToLeft,
    searchInputChange,
    searchTableData,
    onModalTreeSelect,
} from './actions';

const {Search} = Input;

const UserSelectItem = ({pageProps}: any) => {
    const {id} = pageProps;
    const dispatch = useAppDispatch();
    const {
        deviceTableDataSource,
        selectedDeviceList,
        unSelectedDeviceList,
        leftSelectedKeys,
        rightSelectedKeys,
        leftSearchName,
        rightSearchName,
        selectedTreeNodeInModal,
        expandedTreeKeysInModal,
        actionCount,
        deviceLoading,
        farmTreeLoading,
    } = useAppSelector((state) => state[id], shallowEqual);
    const simpleAction = getPageSimpleActions(id);
    const {t} = useTranslation();
    return (
        <div className={styles.userSelectItem}>
            <div className={styles.left}>
                <div className={styles.up}>
                    <Spin
                        spinning={farmTreeLoading}
                        className={`${
                            farmTreeLoading
                                ? styles.deviceLoading
                                : styles.deviceLoadingHidden
                        }`}
                    />
                    <SearchTree
                        isShowSearch
                        placeholder={t('请输入组织机构名称')}
                        checkable={false}
                        treeData={deviceTableDataSource}
                        defaultExpandAll
                        expandedKeys={expandedTreeKeysInModal}
                        onExpand={(keys: any[]) => {
                            dispatch(
                                simpleAction.set({
                                    expandedTreeKeysInModal: keys,
                                }),
                            );
                        }}
                        selectedKeys={selectedTreeNodeInModal}
                        onSelect={(keys, nodes) => {
                            if (actionCount > 0) {
                                Modal.confirm({
                                    title: t('有操作记录，确定要切换节点吗'),
                                    onOk: async () => {
                                        dispatch(
                                            onModalTreeSelect(
                                                pageProps,
                                                keys,
                                                nodes,
                                            ),
                                        );
                                    },
                                });
                            } else {
                                dispatch(
                                    onModalTreeSelect(pageProps, keys, nodes),
                                );
                            }
                        }}
                    />
                </div>

                <div className={styles.down}>
                    <div className={styles.searchArea}>
                        <Search
                            className={styles.positionInput}
                            allowClear
                            maxLength={20}
                            value={leftSearchName}
                            onSearch={(value) => {
                                dispatch(
                                    searchTableData(pageProps, value, 'left'),
                                );
                            }}
                            placeholder={t('设备ID/设备名称/型号')}
                            onChange={(e) =>
                                dispatch(
                                    searchInputChange(
                                        pageProps,
                                        e.target.value,
                                        'left',
                                    ),
                                )
                            }
                        />
                    </div>
                    {/* filterUnselectedDeviceInOrgs依赖的就是状态树上的数据 */}
                    <div className={styles.tableArea}>
                        <Table
                            dataSource={unSelectedDeviceList}
                            showIndex
                            index={{
                                width: 100,
                            }}
                            showSearch={false}
                            loading={deviceLoading}
                            columns={STATIC_COLUMNS_LEFT}
                            rowKey="deviceId"
                            rowSelection={{
                                selectedRowKeys: leftSelectedKeys,
                                onChange: (keys: React.Key[]) =>
                                    dispatch(
                                        changeLeftSelectedKeys(pageProps, keys),
                                    ),
                            }}
                            scroll={{
                                y: '250px',
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.space}>
                <div className={styles.spaceLine} />
                <div
                    className={styles.buttonStyle}
                    onClick={() => {
                        if (leftSelectedKeys.length === 0) {
                            message.info(t('请选择需要移动的设备'), 2);
                            return;
                        }

                        dispatch(
                            moveToRight(
                                pageProps,
                                leftSelectedKeys,
                                unSelectedDeviceList,
                                selectedDeviceList,
                            ),
                        );
                    }}
                >
                    <RightOutlined />
                </div>
                <div
                    className={styles.buttonStyle}
                    onClick={() => {
                        if (rightSelectedKeys.length === 0) {
                            message.info(t('请选择需要移动的设备'), 2);
                            return;
                        }

                        if (selectedTreeNodeInModal.length === 0) {
                            message.info(t('请选择节点'), 2);
                            return;
                        }

                        dispatch(
                            moveToLeft(
                                pageProps,
                                rightSelectedKeys,
                                unSelectedDeviceList,
                                selectedDeviceList,
                            ),
                        );
                    }}
                >
                    <LeftOutlined />
                </div>
                <div className={styles.spaceLine} />
            </div>

            <div className={styles.right}>
                <div className={styles.searchArea}>
                    <Search
                        className={styles.positionInput}
                        allowClear
                        maxLength={20}
                        value={rightSearchName}
                        onSearch={(value) => {
                            dispatch(
                                searchTableData(pageProps, value, 'right'),
                            );
                        }}
                        placeholder={t('设备ID/设备名称/型号')}
                        onChange={(e) =>
                            dispatch(
                                searchInputChange(
                                    pageProps,
                                    e.target.value,
                                    'right',
                                ),
                            )
                        }
                    />
                </div>
                <div className={styles.tableArea}>
                    <Table
                        dataSource={selectedDeviceList}
                        showIndex
                        rowKey="deviceId"
                        showSearch={false}
                        loading={deviceLoading} // searchCallback={search}
                        columns={STATIC_COLUMNS_RIGHT}
                        rowSelection={{
                            selectedRowKeys: rightSelectedKeys,
                            onChange: (keys: React.Key[]) =>
                                dispatch(
                                    changeRightSelectedKeys(pageProps, keys),
                                ),
                        }}
                        scroll={{
                            y: '500px',
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserSelectItem;
