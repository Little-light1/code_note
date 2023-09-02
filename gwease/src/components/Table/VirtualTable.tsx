import React, { FC, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Table, Input } from "antd";
import { connectMenu } from "react-contextmenu";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { uniqueId } from "lodash";
import { useInternalState, usePagination, useIndex, useFilter, TableContext, useExtraColumns, TableContextValue } from "./hooks";
import HeaderCell from "./components/HeaderCell";
import HeaderWrapper from "./components/HeaderWrapper";
import TableContextMenu from "./components/TableContextMenu";
import type { EaseVirtualTableProps } from "./types";
import "./styles.scss";
import useVirtual from "./hooks/useVirtual";
// import { getRecordKey } from "./hooks/utils";
import useRowSelection from "./hooks/useRowSelection";



const { Search } = Input;

/* <RecordType = any>(props: EaseTableProps<RecordType>) => React.ReactNode */
const EaseVirtualTable: FC<EaseVirtualTableProps> = ({
  columns,
  dataSource,
  pagination = false,
  showIndex = false,
  showFilter = false,
  rowSelection,
  contextMenu = true,
  className,
  onChange,
  onExtraChange,
  onFilter,
  onRow,
  scroll,
  index,
  i18n,
  table,
  rowHeight,
  rowKey,
  ...props
}) => {
  const [contextMenuId] = useState(uniqueId("ease_table_"));

  // const dataSourceMap = useMemo(() => {
  //   if (typeof dataSource === "undefined" || dataSource.length === 0) return {};
  //   return dataSource.reduce((prev, record, i) => ({ ...prev, [getRecordKey({ rowKey, record, index: i })]: record }), {});
  // }, [dataSource, rowKey]);

  const [contextValue, setContextValue] = useState<TableContextValue>({
    contextMenuId,
    i18n,
    visibleKeys: [],
    selectedRowKeys: rowSelection && rowSelection.selectedRowKeys ? [...rowSelection.selectedRowKeys] : [],
    // dataSourceMap,
  });

  const { internalDataSource, internalColumns } = useInternalState({ dataSource, columns });

  const { internalPagination, onInternalChange } = usePagination({ pagination, onChange });

  const { indexDataSource, indexColumns } = useIndex({ showIndex, dataSource: internalDataSource, columns: internalColumns, index });

  const { filterDataSource, setFilterValue } = useFilter({ dataSource: indexDataSource, onFilter });

  const { rowSelectionColumns } = useRowSelection({ columns: indexColumns, rowSelection, dataSource, rowKey, setContextValue });

  const { extraColumns, visibleKeys, onContextMenu } = useExtraColumns({ columns: rowSelectionColumns, onExtraChange, contextMenu });

  const { renderVirtualList, containerRef, adaptiveColumns } = useVirtual({ columns: extraColumns, scroll, rowHeight });

  const components = { header: { cell: HeaderCell, wrapper: HeaderWrapper }, body: renderVirtualList };

  // @ts-ignore
  const ConnectedMenu = useMemo(() => connectMenu(contextMenuId)(TableContextMenu), [contextMenuId]);

  useEffect(() => {
    setContextValue({
      contextMenuId,
      i18n,
      visibleKeys,
      onContextMenu,
      selectedRowKeys: rowSelection && rowSelection.selectedRowKeys ? [...rowSelection.selectedRowKeys] : [],
    });
  }, [contextMenuId, i18n, onContextMenu, visibleKeys, rowSelection]);

  // 暴露api
  useImperativeHandle(table, () => ({
    columns: indexColumns,
  }));


  return (
    <TableContext.Provider value={contextValue}>
      <div className="ease-table-container">
        {showFilter ? (
          <Search
            className="ease-table-search"
            allowClear
            maxLength={20}
            onSearch={setFilterValue}
            placeholder={typeof showFilter === "string" ? showFilter : ""}
          />
        ) : null}

        <div className="ease-table" ref={containerRef}>
          <DndProvider backend={HTML5Backend}>
            <Table
              components={components}
              // @ts-ignore
              columns={adaptiveColumns}
              className={`ease-table-view ${className || ""}`}
              dataSource={filterDataSource}
              bordered
              pagination={internalPagination}
              size="small"
              scroll={scroll}
              onChange={onInternalChange}
              {...props}
            />
          </DndProvider>
        </div>

        {/* @ts-ignore */}
        <ConnectedMenu i18n={i18n?.contextMenu} columns={indexColumns} />
      </div>
    </TableContext.Provider>
  );
};

export default EaseVirtualTable;
