import { TablePaginationConfig, TableProps } from 'antd';
import { ColumnType, FilterValue, SorterResult, TableCurrentDataSource } from 'antd/lib/table/interface';
import React from 'react';
export type AntdTablePagination = false | TablePaginationConfig | undefined;
export type Pagination = boolean | TablePaginationConfig | undefined;
export interface CustomTableProps<RecordType = any> extends Omit<TableProps<RecordType>, 'pagination' | 'columns' | 'scroll'> {
  pagination?: boolean | TablePaginationConfig;
  showIndex?: boolean | {
    current: number;
    pageSize: number;
  };
  indexWidth?: number;
  onChange?: OnTableChange;
  onFilter?: (item: RecordType, searchValue: string) => boolean;
  showSearch?: boolean | string;
  columns?: ColumnType<RecordType>[];
  offset?: {
    x: number;
    y: number;
  };
  scroll?: ({
    x?: string | number | true | undefined;
    y?: string | number | undefined;
  } & {
    scrollToFirstRowOnChange?: boolean | undefined;
  }) | false;
}
export interface SelectTableProps<RecordType = any> extends CustomTableProps<RecordType> {
  selectedRowKeys?: React.Key[];
  onSelect?: (keys: React.Key[]) => void;
}
export type OnTableChange<RecordType = any> = (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: SorterResult<RecordType> | SorterResult<RecordType>[], extra: TableCurrentDataSource<RecordType>) => void;