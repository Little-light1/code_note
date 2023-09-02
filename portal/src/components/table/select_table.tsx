import React, {FC, useMemo} from 'react';
import Table from './table';
import {SelectTableProps} from './types';

const SelectTable: FC<SelectTableProps> = ({
    selectedRowKeys,
    onSelect,
    ...args
}) => {
    const rowSelection = useMemo(
        () => ({
            selectedRowKeys,
            onChange: onSelect,
        }),
        [onSelect, selectedRowKeys],
    );
    return <Table {...args} rowSelection={rowSelection} />;
};

export default SelectTable;
