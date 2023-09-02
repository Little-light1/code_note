/*
 * @Author: sun.t
 * @Date: 2022-06-30 17:13:59
 * @Last Modified by: sun.t
 * @Last Modified time: 2022-07-04 00:22:01
 */
import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import {Checkbox} from 'antd';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {Table} from '../components/Table';
import 'antd/lib/table/style/index.css';
import data10000 from './mock/orgs100.json';
import reliabilityAnalysisMockColumns from './mock/reliabilityAnalysis/columns.json';
import reliabilityAnalysisMockDataSource from './mock/reliabilityAnalysis/dataSource.json';
import simple2Columns from './mock/columnsSimple2.json';

export default {
    title: 'Example/Table',
    component: Table,
} as ComponentMeta<typeof Table>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Table> = (args) => <Table {...args} />;

export const Simple = () => {
    const [dataSource, setDataSource] = useState<any>([]);
    const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

    const onCheck = (e, deviceId) => {
        if (checkedKeys.includes(deviceId)) {
            _.remove(checkedKeys, (id) => id === deviceId);
        } else {
            checkedKeys.push(deviceId);
        }

        setCheckedKeys([...checkedKeys]);
    };

    const columns = [
        {
            dataIndex: 'deviceId',
            title: '设备ID',
            name: '设备ID',
            align: 'left',
            width: '100',
            sorter: 'asc',
            visiableSetting: false,
        },
        {
            dataIndex: 'deviceName',
            title: '设备名称',
            name: '设备名称',
            align: 'right',
            width: '100',
            visiableSetting: false,
        },
        {
            dataIndex: 'deviceModel',
            title: '型号',
            name: '型号',
            align: 'left',
            width: '100',
            visiableSetting: false,
            canHide: true,
        },
        {
            dataIndex: 'farmName',
            title: '电场名称',
            name: '电场名称',
            align: 'center',
            width: '50',
            visiableSetting: false,
        },
        {
            dataIndex: 'checked',
            width: 50,
            title: '选择',
            name: '选择',
            align: 'center',
            visiableSetting: false,
            render: (text, record) => (
                <Checkbox onChange={(e) => onCheck(e, record.deviceId)} checked={checkedKeys.includes(record.deviceId)} />
            ),
        },
    ];

    useEffect(() => {
        setTimeout(() => {
            setDataSource(data10000);
            // setDataSource([]);
        }, 3000);
    }, []);

    return (
        <Table
            dataSource={dataSource}
            columns={columns}
            showIndex={true}
            // rowSelection={{ onChange: (selectedRowKeys, selectedRows, info) => console.log(selectedRowKeys, selectedRows, info) }}
            rowKey="key"
            scroll={{y: 300}}
            onExtraChange={({columns}) => console.log(columns)}
        />
    );
};

Simple.storyName = '基础';

export const Simple2 = () => {
    const [dataSource, setDataSource] = useState<any>([]);
    const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
    const [columns, setColumns] = useState<any>([]);

    const onCheck = (e, deviceId) => {
        if (checkedKeys.includes(deviceId)) {
            _.remove(checkedKeys, (id) => id === deviceId);
        } else {
            checkedKeys.push(deviceId);
        }

        setCheckedKeys([...checkedKeys]);
    };

    useEffect(() => {
        setTimeout(() => {
            setDataSource(data10000);
            setColumns(simple2Columns);
            // setDataSource([]);
        }, 3000);
    }, []);

    return (
        <div style={{width: 900, height: 500}}>
            <Table
                dataSource={dataSource}
                columns={columns}
                showIndex={false}
                // rowSelection={{ onChange: (selectedRowKeys, selectedRows, info) => console.log(selectedRowKeys, selectedRows, info) }}
                rowKey="key"
                scroll={{y: 300}}
                onExtraChange={({columns}) => setColumns(columns)}
            />
        </div>
    );
};

Simple2.storyName = '测试';

export const ColumnWidth = Template.bind({});
ColumnWidth.args = {
    dataSource: reliabilityAnalysisMockDataSource,
    columns: reliabilityAnalysisMockColumns,
};
ColumnWidth.storyName = '列操作';
