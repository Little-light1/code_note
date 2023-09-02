/*
 * @Author: sds
 * @Date: 2022-01-05 13:30:52
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-09-01 16:24:18
 */
import React, {useState, useEffect, useCallback} from 'react';
import {Button, Table, Input, Select, message} from 'antd';
import {LeftOutlined, RightOutlined} from '@ant-design/icons';
import _ from 'lodash';
import {Modal} from '@gwaapp/ease'; // import { Table } from '@components/table';
import {useTranslation} from 'react-i18next';

import styles from './styles.module.scss';

interface Props {
    id: string;
    titles: any[];
    columns: any[];
    roleTypeList: any[];
    leftData: [];
    rightData: [];
    searchKeys: any[];
    isLoading?: boolean;
    ok: (ids: any) => Promise<unknown>;
}

const SelectModal = ({
    id,
    titles,
    columns,
    roleTypeList,
    leftData,
    rightData,
    searchKeys,
    isLoading = false,
    ok,
}: Props) => {
    const {t} = useTranslation();
    const title = titles[0];
    const leftTitle = titles[1];
    const rightTitle = titles[2];
    const placeholder = searchKeys.reduce(
        (pre, cur, i) =>
            pre + cur.name + (i !== searchKeys.length - 1 ? '/' : ''),
        '',
    );
    const [leftSelectedRolesRows, setLeftSelectedRolesRows] = useState([]);
    const [rightSelectedRolesRows, setRightSelectedRolesRows] = useState([]);
    const [leftListData, setLeftListData] = useState<any[]>([]);
    const [rightListData, setRightListData] = useState<any[]>([]);
    const [roleTypeSelectedKey, setRoleTypeSelectedKey] = useState(null);
    const [leftSearchKey, setLeftSearchKey] = useState('');
    const [rightSearchKey, setRightSearchKey] = useState('');
    useEffect(() => {
        setLeftListData(_.cloneDeep(leftData));
        setRightListData(_.cloneDeep(rightData));
    }, [leftData, rightData]);
    const filterLeftData = useCallback(() => {
        let newLeftData = _.cloneDeep(leftListData);

        leftSearchKey &&
            (newLeftData = newLeftData.filter(
                (ele) =>
                    ele.name?.includes(leftSearchKey) ||
                    ele.code?.includes(leftSearchKey),
            ));
        roleTypeSelectedKey &&
            (newLeftData = newLeftData.filter(
                (ele) => ele.roleType === roleTypeSelectedKey,
            ));
        return newLeftData;
    }, [leftSearchKey, roleTypeSelectedKey, leftListData]);
    const filterRightData = useCallback(() => {
        let newLeftData = _.cloneDeep(rightListData);

        if (rightSearchKey) {
            newLeftData = newLeftData.filter(
                (ele) =>
                    ele.name?.includes(rightSearchKey) ||
                    ele.code?.includes(rightSearchKey),
            );
        }

        return newLeftData;
    }, [rightSearchKey, rightListData]); // 待选复选框

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
    }; // 角色类型筛选

    const onSelectChange = (value) => {
        setRoleTypeSelectedKey(value);
    }; // left 搜索

    const onLeftSearch = (value) => {
        setLeftSearchKey(value);
    }; // right 搜索

    const onRightSearch = (value) => {
        setRightSearchKey(value);
    }; // 关联

    const addRoles = () => {
        let lData = _.cloneDeep(leftListData);

        let rData = _.cloneDeep(rightListData);

        leftSelectedRolesRows.forEach((element: any) => {
            lData = _.filter(lData, (e: any) => e.id !== element.id);
        });
        rData = rData.concat(leftSelectedRolesRows);
        const rDataRoleTypeA = Array.from(
            new Set(rData.map((ele) => ele.roleType)),
        );

        if (
            rDataRoleTypeA.length > 2 ||
            (rDataRoleTypeA.length === 2 && !rDataRoleTypeA.includes(5))
        ) {
            message.info(`${t('除数据权限外，请选择相同类型角色')}`);
            return;
        }

        setLeftSelectedRolesRows([]);
        setLeftListData(lData);
        setRightListData(rData);
    }; // 移除

    const removeRoles = () => {
        let lData = leftListData;
        let rData = rightListData;
        rightSelectedRolesRows.forEach((element: any) => {
            rData = _.filter(rData, (e: any) => e.id !== element.id);
        });
        lData = lData.concat(rightSelectedRolesRows);
        setRightSelectedRolesRows([]);
        setLeftListData(lData);
        setRightListData(rData);
    }; // 关闭

    const handleCancel = () => {
        setLeftListData([]);
        setRightListData([]);
        setLeftSelectedRolesRows([]);
        setRightSelectedRolesRows([]);
        setRoleTypeSelectedKey(null);
        setLeftSearchKey('');
        setRightSearchKey('');
    }; // 保存

    const handleOk = () => {
        ok(rightListData.map((item: any) => item.id)).then(() => {
            handleCancel();
        });
    };

    // const onFilter = useCallback(
    //     (item, searchStr) => {
    //         let isMatch = false;
    //         searchKeys.forEach(({key}) => {
    //             const value = _.get(item, key);

    //             if (typeof value !== 'undefined' && value.includes(searchStr)) {
    //                 isMatch = true;
    //             }
    //         });
    //         return isMatch;
    //     },
    //     [searchKeys],
    // );
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
            {/* <Spin spinning={isLoading} style={{height: '100%'}}> */}
            <div className={styles.roleAssociate}>
                <div className={styles.left}>
                    <div>{leftTitle}</div>
                    <div className={styles.content}>
                        <div className={styles.head}>
                            <Select
                                className={styles.select}
                                placeholder={t('选择角色类型')}
                                showArrow
                                allowClear
                                value={roleTypeSelectedKey || null}
                                onChange={onSelectChange}
                            >
                                {roleTypeList.map((ele: any) => (
                                    <Select.Option
                                        key={ele.dictdataValue}
                                        value={ele.dictdataValue}
                                    >
                                        {ele.dictdataName}
                                    </Select.Option>
                                ))}
                            </Select>
                            <Input.Search
                                placeholder={`${placeholder}`}
                                onSearch={onLeftSearch}
                                className={styles.inputSearch}
                            />
                        </div>
                        <Table
                            columns={columns} // dataSource={leftListData}
                            dataSource={filterLeftData()}
                            rowSelection={{...unSelectedRowSelection}}
                            showIndex
                            pagination={false}
                            rowKey="id"
                            size="small"
                            scroll={{
                                y: '600px',
                            }} // onFilter={onFilter}
                        />
                    </div>
                </div>
                <div className={styles.middle}>
                    <div className={styles.cutLine} />
                    <div className={styles.operateIcon}>
                        <Button
                            disabled={!leftSelectedRolesRows.length}
                            icon={<RightOutlined className={styles.icon} />}
                            onClick={addRoles}
                        />
                        <Button
                            disabled={!rightSelectedRolesRows.length}
                            icon={<LeftOutlined className={styles.icon} />}
                            onClick={removeRoles}
                        />
                    </div>
                    <div className={styles.cutLine} />
                </div>
                <div className={styles.right}>
                    <div>{`${rightTitle}(${rightListData.length})`}</div>
                    <div className={styles.content}>
                        <div className={styles.head}>
                            <Input.Search
                                placeholder={`${placeholder}`}
                                onSearch={onRightSearch}
                                className={styles.inputSearch}
                            />
                        </div>
                        <Table
                            columns={columns}
                            dataSource={filterRightData()}
                            rowSelection={{...selectedRowSelection}}
                            showIndex // showSearch={`请输入${placeholder}`}
                            rowKey="id"
                            scroll={{
                                y: '600px',
                            }} // onFilter={onFilter}
                        />
                    </div>
                </div>
            </div>
            {/* </Spin> */}
        </Modal>
    );
};

export default SelectModal;
