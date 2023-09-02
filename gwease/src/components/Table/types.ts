import { FormItemProps, TablePaginationConfig, TableProps } from "antd";
import { FilterValue, SorterResult, TableCurrentDataSource, ColumnType, ColumnTitle, TableRowSelection } from "antd/lib/table/interface";
import { MutableRefObject } from "react";

export type Scroll =
  | ({
      x?: string | number | true | undefined;
      y?: string | number | undefined;
    } & {
      scrollToFirstRowOnChange?: boolean | undefined;
    })
  | false;

export type Offset = { x: number; y: number };

export type Pagination = boolean | TablePaginationConfig | undefined;

export type AntdTablePagination = false | TablePaginationConfig | undefined;

export type OnTableChange<RecordType = any> = (
  pagination: TablePaginationConfig,
  filters: Record<string, FilterValue | null>,
  sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
  extra: TableCurrentDataSource<RecordType>
) => void;

export type DataSource<RecordType = any> = Exclude<TableProps<RecordType>["dataSource"], undefined>;

// interface ColumnGroupType<RecordType> extends Omit<Column<RecordType>, "dataIndex"> {
//   children: ColumnsType<RecordType>;
// }

export declare type GetComponentProps<DataType> = (
  data: DataType,
  index?: number
) => React.HTMLAttributes<any> | React.TdHTMLAttributes<any>;

export interface Column<RecordType = any> extends Omit<ColumnType<RecordType>, "dataIndex"> {
  visible?: boolean;
  canHide?: boolean;
  canResize?: boolean;
  canDrag?: boolean;
  canDrop?: boolean;
  editable?: boolean;
  renderEdit?: RenderEdit<RecordType>;
  formProps?: FormItemProps;
  dataIndex: string; // TODO:[]?
  dependence?: string[];
  defaultValue?: any | (() => any);
  minWidth?: number;
  maxWidth?: number;
  // titleAlign?: "left" | "right" | "center";
}

// export type Columns<RecordType = any> = (ColumnGroupType<RecordType> | Column<RecordType>)[];
export type Columns<RecordType = any> = Column<RecordType>[];

export interface ExtraColumn<RecordType = any> extends Omit<Column<RecordType>, "onHeaderCell"> {
  // onHeaderCell: GetComponentProps<Columns<RecordType>[number]>;
  onHeaderCell: any;
}
// export interface ExtraColumn<RecordType = any> extends Column<RecordType> {
//   onHeaderCell: (col: Column) => any;
// }

export type Index = {
  key?: string;
  dataIndex?: string;
  title?: ColumnTitle<any>;
  width?: number | string;
  canHide?: boolean;
  canDrag?: boolean;
  canDrop?: boolean;
};

export type OnFilter<RecordType> = (item: RecordType, searchValue: string) => boolean;

export type AlignType = "left" | "center" | "right";

export type RenderEdit<RecordType> = ({
  text,
  record,
  rowIndex,
  editRecord,
  updateTimestamp,
}: {
  text: any;
  record: RecordType;
  rowIndex: number;
  editRecord: { [key: string]: any };
  updateTimestamp: number | undefined;
}) => React.ReactElement<any, any> | null;

export type OnCellClick<RecordType> = (
  e: any,
  props: { rowIndex: number; column: Column<RecordType>; record: RecordType; text: any }
) => void;

export interface I18n {
  contextMenu: {
    hide: string;
    visible: string;
  };
  cell: {
    original: string;
  };
}

export type EditState = "editing" | "edited";
export type EditCellStatus = { value: any; original: any; status: EditState; errors?: string[] };
export type EditRowStatus = { [key: string]: EditCellStatus };
export type EditStatus = EditRowStatus[];

export type DepUpdatedCells = Record<string, number>[];

export type ShouldCellUpdate<RecordType> = (record: RecordType, prevRecord: RecordType) => boolean;

export type Submit = () => Promise<{ [rowIndex: string]: { [key: string]: any } }>;

export interface EaseTableInstance {
  columns: Columns;
}

export interface EaseEditableTableInstance extends EaseTableInstance {
  submit: Submit;
  restore: () => void;
  confirm: (forbidExitEditStatus: boolean) => void;
  getFieldsValue: () => { editedData: any[]; dataSource?: DataSource; snapShoot?: DataSource };
}

export type Editable<RecordType> = ({ record, rowIndex, column }: { record: RecordType; rowIndex?: number; column: Column }) => boolean;

export interface EaseTableBaseProps<RecordType = any> extends Omit<TableProps<RecordType>, "pagination" | "columns"> {
  index?: Index;
  offset?: Offset;
  showIndex?: boolean | { current: number; pageSize: number };
  pagination?: boolean | TablePaginationConfig;
  onFilter?: (item: RecordType, searchValue: string) => boolean;
  showFilter?: boolean;
  i18n?: I18n;
  onExtraChange?: ({ columns }: { columns: Columns }) => void;
  columns?: Columns<RecordType>;
  contextMenu?: boolean;
}

export interface EaseTableProps<RecordType = any> extends Omit<EaseTableBaseProps<RecordType>, "scroll"> {
  scroll?: Scroll;
  shouldCellUpdate?: ShouldCellUpdate<RecordType>;
}

export interface EaseEditableTableProps<RecordType = any> extends Omit<EaseTableBaseProps<RecordType>, "scroll"> {
  editable?: Editable<RecordType>;
  onEdit?: (editStatus: EditStatus) => void;
  editStatus?: EditStatus;
  defaultEditStatus?: EditStatus;
  submit?: Submit;
  table?: MutableRefObject<EaseEditableTableInstance | undefined>;
  shouldCellUpdate?: ShouldCellUpdate<RecordType>;
   scroll: Scroll
}


export interface EaseEditableVirtualTableProps<RecordType = any> extends  Omit<EaseTableBaseProps<RecordType>, "scroll"> {
  editable?: Editable<RecordType>;
  onEdit?: (editStatus: EditStatus) => void;
  editStatus?: EditStatus;
  defaultEditStatus?: EditStatus;
  submit?: Submit;
  table?: MutableRefObject<EaseEditableTableInstance | undefined>;
  shouldCellUpdate?: ShouldCellUpdate<RecordType>;
   scroll?: {
    // TODO: 横向的虚拟滚动
    x?: number | true | string;
    y: number | string;
  };
  rowHeight?: number | undefined
  tableType?:"virtual"// 表明表格类型  flexContainer识别
}

export type EaseVirtualTableRowSelection<RecordType> = Pick<TableRowSelection<RecordType>, "selectedRowKeys" | "onChange">;

export interface EaseVirtualTableProps<RecordType = any> extends Omit<EaseTableBaseProps<RecordType>, "scroll" | "rowSelection"> {
  table?: MutableRefObject<EaseTableInstance | undefined>;
  // rowHeight?: (rowIndex: number) => number;
  rowHeight?: number;
  scroll: {
    // TODO: 横向的虚拟滚动
    x?: number | true | string;
    y: number | string;
  };
  rowSelection?: EaseVirtualTableRowSelection<RecordType>;
}

// export interface SelectTableProps<RecordType = any> extends EaseEditableTableProps<RecordType> {
//   selectedRowKeys?: React.Key[];
//   onSelect?: (keys: React.Key[]) => void;
// }
