import React from 'react';
import {Table, Space} from 'antd';
import {useTable} from './hooks/useTable';

const TableDemo = () => {
    const {columns, dataSource} = useTable();
    return (
        <div>
            {/* 表格组件 */}
            <Space direction="vertical" size={12}>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    bordered
                    pagination={{
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `Total ${total} items`,
                        position: ['bottomLeft'],
                    }}
                    size="small"
                />
            </Space>
        </div>
    );
};

export default TableDemo;
