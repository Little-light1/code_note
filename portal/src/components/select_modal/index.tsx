/*
 * @Author: sds
 * @Date: 2022-01-05 13:30:52
 * @Last Modified by: sun.t
 * @Last Modified time: 2022-11-16 16:57:40
 */
import React, {useState, useEffect, useCallback} from 'react';
import {Button} from 'antd';
import {LeftOutlined, RightOutlined} from '@ant-design/icons';
import _ from 'lodash';
import {Modal} from '@gwaapp/ease';
import {Table} from '@components/table';
import {i18nIns} from '@/app/i18n';

import styles from './styles.module.scss';

const {t} = i18nIns;

interface Props {
    id: string;
    titles: any[];
    columns: any[];
    leftData: [];
    rightData: [];
    searchKeys: any[];
    isLoading?: boolean;
    readOnly?: boolean;
    ok: (ids: any) => void;
}

const SelectModal = ({
    id,
    titles,
    columns,
    leftData,
    rightData,
    searchKeys,
    isLoading = false,
    readOnly = false,
    ok,
}: Props) => {
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
    useEffect(() => {
        setLeftListData(_.cloneDeep(leftData));
        setRightListData(_.cloneDeep(rightData));
    }, [leftData, rightData]); // 待选复选框

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
    }; // 保存

    const handleOk = () => {
        ok(rightListData.map((item: any) => item.id));
    };

    const onFilter = useCallback(
        (item, searchStr) => {
            let isMatch = false;
            searchKeys.forEach(({key}) => {
                const value = _.get(item, key);

                if (typeof value !== 'undefined' && value.includes(searchStr)) {
                    isMatch = true;
                }
            });
            return isMatch;
        },
        [searchKeys],
    );
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
            footer={readOnly ? null : undefined} // 临时处理方法，需要封装的组件支持原属性footer={null}
            // footer={readOnly && <></>} // 临时处理方法，需要封装的组件支持原属性footer={null}
            confirmLoading={isLoading}
        >
            {/* <Spin spinning={isLoading} style={{height: '100%'}}> */}
            <div className={styles.roleAssociate}>
                <div className={styles.left}>
                    <div>{leftTitle}</div>
                    <div className={styles.content}>
                        <Table
                            columns={columns}
                            dataSource={leftListData}
                            rowSelection={
                                readOnly
                                    ? undefined
                                    : {...unSelectedRowSelection}
                            }
                            showIndex
                            showSearch={`${placeholder}`}
                            rowKey="id"
                            scroll={{
                                y: '600px',
                            }}
                            onFilter={onFilter}
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
                        <Table
                            columns={columns}
                            dataSource={rightListData}
                            rowSelection={
                                readOnly ? undefined : {...selectedRowSelection}
                            }
                            showIndex
                            showSearch={`${placeholder}`}
                            rowKey="id"
                            scroll={{
                                y: '600px',
                            }}
                            onFilter={onFilter}
                        />
                    </div>
                </div>
            </div>
            {/* </Spin> */}
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
