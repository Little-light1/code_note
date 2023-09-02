/*
 * @Author: sun.t
 * @Date: 2022-07-15 22:01:19
 * @Last Modified by: sun.t
 * @Last Modified time: 2022-07-15 22:05:34
 * @Description: 这里暂时只在VirtualTable使用, context.selectedRowKeys 必然初始化过
 */
import React, { Key, useCallback, useMemo } from "react";
import { Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { GetRowKey } from "antd/lib/table/interface";
// import type { TableProps as RcTableProps } from "rc-table/lib/Table";
import _ from "lodash";
import type { EaseVirtualTableRowSelection, Columns, AlignType } from "../types";
import { EMPTY_COLUMNS } from "./constant";
import { useTable, TableContextValue } from "./useTable";
import { getRecordKey } from "./utils";

interface AllRowCheckProps<RecordType> {
  rowSelection?: EaseVirtualTableRowSelection<RecordType>;
  // dataSource?: RcTableProps<RecordType>["data"];
  dataSource?: readonly any[][];
  rowKey?: string | GetRowKey<RecordType>;
  setContextValue: React.Dispatch<any>;
}

const AllRowCheck: <RecordType>(props: AllRowCheckProps<RecordType>) => any = ({
  rowSelection,
  dataSource = EMPTY_COLUMNS,
  rowKey,
  setContextValue,
}) => {
  const context = useTable();

  const checkAll = useCallback(
    (e: CheckboxChangeEvent) => {
      if (typeof rowSelection === "undefined") return;
      const checked = e.target.checked;
      const { onChange } = rowSelection;
      let selectedRowKeys: string[] = [];
      const selectedRows: any[] = [];
      const info: any = { type: "all" };

      if (checked) {
        selectedRowKeys = dataSource.map((record, index) => {
          if (rowKey) {
            if (typeof rowKey === "function") {
              return record[rowKey(record as any, index)];
            }
            return record[rowKey];
          }
          return record.key;
        });
        // selectedRows = dataSource as any[];
      }

      if (onChange) {
        onChange(selectedRowKeys, selectedRows, info);
      }
      setContextValue((ctx: TableContextValue) => ({ ...ctx, selectedRowKeys }));
    },
    [dataSource, rowKey, rowSelection, setContextValue]
  );

  // 这里 context.selectedRowKeys 必然存在，只有VirtualTable会使用到useRowSelection
  const isAllChecked = context.selectedRowKeys!.length === dataSource.length;

  return <Checkbox className="ease-table-virtual-selection-column" onChange={checkAll} checked={isAllChecked} />;
};

interface RowCheckProps<RecordType> {
  record: Record<string, any>;
  index: number;
  rowSelection?: EaseVirtualTableRowSelection<RecordType>;
  setContextValue: React.Dispatch<any>;
  rowKey?: string | GetRowKey<RecordType>;
}

const RowCheck: <RecordType>(props: RowCheckProps<RecordType>) => any = ({ record, index, rowSelection, rowKey, setContextValue }) => {
  const context = useTable();
  const key = getRecordKey({ rowKey, record, index });
  const check = useCallback(
    (e) => {
      const checked = e.target.checked;
      if (typeof rowSelection === "undefined") return;
      const { onChange } = rowSelection;
      const selectedRowKeys: Key[] = context.selectedRowKeys!;
      const selectedRows: any[] = [];
      const info: any = { type: "single" };

      if (checked) {
        selectedRowKeys.push(key);
      } else {
        _.remove(selectedRowKeys, (k) => k === key);
      }

      // selectedRows = selectedRowKeys.map((k) => context.dataSourceMap[k]);

      if (onChange) {
        onChange(selectedRowKeys, selectedRows, info);
      }
      setContextValue((ctx: TableContextValue) => ({ ...ctx, selectedRowKeys }));
    },
    [context.selectedRowKeys, key, rowSelection, setContextValue]
  );

  return <Checkbox className="ease-table-virtual-selection-column" onChange={check} checked={context.selectedRowKeys!.includes(key)} />;
};

interface UseRowSelectionProps<RecordType = any> {
  columns?: Columns<RecordType>;
  rowSelection?: EaseVirtualTableRowSelection<RecordType>;
  // dataSource?: RcTableProps<RecordType>["data"];
  dataSource?: readonly any[][];
  rowKey?: string | GetRowKey<RecordType>;
  setContextValue: React.Dispatch<any>;
}

export default function useRowSelection<RecordType>({
  columns = EMPTY_COLUMNS,
  rowSelection,
  dataSource = EMPTY_COLUMNS,
  rowKey,
  setContextValue,
}: UseRowSelectionProps<RecordType>) {
  const rowSelectionColumns = useMemo(() => {
    if (typeof rowSelection === "undefined") {
      return columns;
    }
    const rowSelectionColumn = {
      key: "_selection",
      dataIndex: "_selection",
      align: "center" as AlignType,
      title: (
        <AllRowCheck<RecordType> rowSelection={rowSelection} dataSource={dataSource} rowKey={rowKey} setContextValue={setContextValue} />
      ),
      render: (text: any, record: any, index: number) => (
        <RowCheck record={record} index={index} rowSelection={rowSelection} rowKey={rowKey} setContextValue={setContextValue} />
      ),
      width: 50,
      canHide: false,
      canDrag: false,
      canDrop: false,
      canResize: false,
    };

    return [rowSelectionColumn, ...columns];
  }, [columns, dataSource, rowKey, rowSelection, setContextValue]);

  return {
    rowSelectionColumns,
  };
}
