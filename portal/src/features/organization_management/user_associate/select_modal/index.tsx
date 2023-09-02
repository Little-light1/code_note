/*
 * @Author: sds
 * @Date: 2022-01-05 13:30:52
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-09-Mo 04:56:17
 */
import React, { useState, useEffect } from 'react';
import { Input, Spin, Button } from 'antd';
import { RightOutlined, SearchOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { Modal } from '@gwaapp/ease';
import { Table } from '@components/table';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';

interface Props {
    id: string;
    titles: any[];
    columns: any[];
    leftData: [];
    rightData: [];
    searchKeys: any[];
    isLoading?: boolean;
    ok: (ids: any, rightListData: any) => void;
}

const SelectModal = ({
    id,
    titles,
    columns,
    leftData,
    rightData,
    searchKeys,
    isLoading = false,
    ok,
}: Props) => {
    const { t } = useTranslation();
    const title = titles[0];
    const leftTitle = titles[1];
    const rightTitle = titles[2];
    const placeholder = searchKeys.reduce(
        (pre, cur) => `${pre.name}/${cur.name}`,
    );
    const [leftSearchValue, setLeftSearchValue] = useState('');
    const [rightSearchValue, setRightSearchValue] = useState('');
    const [leftSelectedRolesRows, setLeftSelectedRolesRows] = useState([]);
    const [rightSelectedRolesRows, setRightSelectedRolesRows] = useState([]);
    const [leftListData, setLeftListData] = useState<any[]>([]);
    const [rightListData, setRightListData] = useState<any[]>([]);
    useEffect(() => {
        const myLeftListData = _.cloneDeep(leftData);

        const myRightListData = _.cloneDeep(rightData);

        setLeftListData(myLeftListData);
        setRightListData(myRightListData);
    }, [leftData, rightData]); // input search

    const onChange = (e: any, key: string) => {
        const { value } = e.target;

        switch (key) {
            case 'left':
                setLeftSearchValue(value);
                break;

            case 'right':
                setRightSearchValue(value);
                break;

            default:
                break;
        }
    }; // 过滤

    const filterData = (key: string) => {
        let value = '';
        let newData: any[] = [];

        const filter = (data: any) => {
            const resultData = _.filter(data, (ele: any) => {
                for (let i = 0; i < searchKeys.length; i += 1) {
                    const flag = ele[searchKeys[i].key]?.includes(value);
                    if (flag) return true;
                }
                return false;
            });

            return resultData;
        };

        switch (key) {
            case 'left':
                value = leftSearchValue;
                newData = filter(leftListData);
                break;

            case 'right':
                value = rightSearchValue;
                newData = filter(rightListData);
                break;

            default:
                break;
        }

        return newData;
    }; // 待选复选框

    const unSelectedRowSelection = {
        selectedRowKeys: leftSelectedRolesRows.reduce(
            (pre: any, cur: any) => pre.concat([cur.id]),
            [],
        ),
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            setLeftSelectedRolesRows(selectedRows);
        },
    }; // 已选复选框

    const selectedRowSelection = {
        selectedRowKeys: rightSelectedRolesRows.reduce(
            (pre: any, cur: any) => pre.concat([cur.id]),
            [],
        ),
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            setRightSelectedRolesRows(selectedRows);
        },
    }; // 关联

    const addRoles = () => {
        let lData = leftListData;
        let rData = rightListData;
        leftSelectedRolesRows.forEach((element: any) => {
            lData = _.filter(lData, (e: any) => e.id !== element.id);
        });
        rData = rData.concat(leftSelectedRolesRows);
        setLeftSelectedRolesRows([]);
        setLeftListData(lData);
        setRightListData(rData);
    }; // 关闭

    const handleCancel = () => {
        setLeftListData([]);
        setRightListData([]);
        setLeftSearchValue('');
        setRightSearchValue('');
        setLeftSelectedRolesRows([]);
        setRightSelectedRolesRows([]);
    }; // 保存

    const handleOk = () => {
        const ids = filterData('right').reduce(
            (pre: any, cur: any) => pre.concat([cur.id]),
            [],
        );
        ok(ids, rightListData);
    };

    return (
        <Modal
            id={id}
            title={title}
            destroyOnClose
            width={1200}
            bodyStyle={{
                height: 730,
            }}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={t('保存')}
            cancelText={t('关闭')}
            confirmLoading={isLoading}
        >
            <Spin spinning={isLoading}>
                <div className={styles.roleAssociate}>
                    <div className={styles.left}>
                        <div>{leftTitle}</div>
                        <div className={styles.contant}>
                            <Input
                                className={styles.input}
                                placeholder={placeholder}
                                onChange={(e) => {
                                    onChange(e, 'left');
                                }}
                                suffix={
                                    <SearchOutlined
                                        className={styles.searchIcon}
                                    />
                                }
                            />
                            <Table
                                columns={columns}
                                dataSource={filterData('left')}
                                rowSelection={{ ...unSelectedRowSelection }}
                                showIndex
                                rowKey="id"
                                scroll={{
                                    y: '600px',
                                }}
                            />
                        </div>
                    </div>
                    <div className={styles.middle}>
                        <div className={styles.operateIcon}>
                            <Button
                                disabled={!leftSelectedRolesRows.length}
                                icon={<RightOutlined className={styles.icon} />}
                                onClick={addRoles}
                            />
                            {/* <Button disabled={!rightSelectedRolesRows.length} icon={<LeftOutlined className={styles.icon} />} onClick={removeRoles} /> */}
                        </div>
                    </div>
                    <div className={styles.right}>
                        <div>{rightTitle}</div>
                        <div className={styles.contant}>
                            <Input
                                className={styles.input}
                                placeholder={placeholder}
                                onChange={(e) => {
                                    onChange(e, 'right');
                                }}
                                suffix={
                                    <SearchOutlined
                                        className={styles.searchIcon}
                                    />
                                }
                            />
                            <Table
                                columns={columns}
                                dataSource={filterData('right')}
                                rowSelection={{ ...selectedRowSelection }}
                                showIndex
                                rowKey="id"
                                scroll={{
                                    y: '600px',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Spin>
        </Modal>
    );
}; // const isEqual = (pre: any, next: any) => {
//   const nextLeftData = next.leftData;
//   if (!nextLeftData.length) {
//     return true;
//   } else {
//     return false;
//   }
// };

export default SelectModal;
