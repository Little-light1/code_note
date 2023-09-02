/*
 * @Author: zhangzhen
 * @Date: 2023-01-03 09:16:45
 * @LastEditors: zhangzhen
 * @LastEditTime: 2023-05-11 13:06:43
 *
 */
import {GetRowKey} from 'antd/lib/table/interface';
import {Key} from 'react';
import {Columns} from '../types';

// const DEFAULT_WIDTH = 100;

export function getVisibleKeys(columns: Columns) {
    return columns.filter((col) => !!(typeof col.visible === 'undefined' || col.visible === true)).map((col) => col.dataIndex);
}

export function getColumnsWidth(columns: Columns) {
    return columns.reduce(
        (prev, curr) => ({...prev, [curr.dataIndex]: typeof curr.width === 'string' ? +curr.width.split('px')[0] : curr.width}),
        {},
    );
    // return columns.reduce((prev, curr) => ({ ...prev, [curr.dataIndex]: curr.width }), {});
}

export function getColumnsSort(columns: Columns) {
    return columns.map((column) => column.dataIndex);
}

export function packageColumns({
    columns,
    visibleKeys,
    columnsWidth,
}: {
    columns: Columns;
    visibleKeys: Key[];
    columnsWidth: {[key: string]: string | number | undefined};
}): Columns<any> {
    const newColumns = columns.map((column) => {
        const {dataIndex} = column;
        if (typeof dataIndex === 'undefined') {
            return column;
        }
        return {
            ...column,
            width: columnsWidth[dataIndex] || column.width,
            visible: visibleKeys.includes(dataIndex),
        };
    });
    return newColumns;
}

export function getRecordKey<RecordType>({rowKey, record, index}: {rowKey?: string | GetRowKey<RecordType>; record: any; index: number}) {
    let key;
    if (rowKey) {
        if (typeof rowKey === 'function') {
            key = record[rowKey(record, index)];
        } else {
            key = record[rowKey];
        }
    } else {
        key = record.key;
    }

    return key;
}
