import React, {FC, useImperativeHandle, useMemo, useState, useEffect, memo} from 'react';
import {Table, Input} from 'antd';
import {connectMenu} from 'react-contextmenu';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {uniqueId} from 'lodash';
import {
    useScroll,
    useInternalState,
    usePagination,
    useIndex,
    useFilter,
    TableContext,
    useExtraColumns,
    useRow,
    TableContextValue,
} from './hooks';
import HeaderCell from './components/HeaderCell';
import HeaderWrapper from './components/HeaderWrapper';
import TableContextMenu from './components/TableContextMenu';
import {EditVirtualWrapper, useEditVirtualContext} from './components/EditWrapper';
import type {EaseEditableVirtualTableProps} from './types';
import './styles.scss';
import useEditTableVirtual from './hooks/useEditTableVirtual';
import useRowSelection from './hooks/useRowSelection';

const {Search} = Input;
const DEFAULT_OFFSET = {
    x: 20,
    y: 39,
};

function defaultShouldCellUpdate<RecordType = any>(record: RecordType, prevRecord: RecordType) {
    let shouldUpdate = false;
    for (const key in record) {
        if (record[key] !== prevRecord[key]) {
            shouldUpdate = true;
        }
    }
    return shouldUpdate;
}

/* <RecordType = any>(props: EaseTableProps<RecordType>) => React.ReactNode */
const EaseTable: FC<EaseEditableVirtualTableProps> = ({
    columns,
    dataSource,
    pagination = false,
    showIndex = false,
    showFilter = false,
    contextMenu = true,
    className,
    shouldCellUpdate = defaultShouldCellUpdate,
    onChange,
    onExtraChange,
    onFilter,
    onRow,
    editable,
    scroll = {y: 500},
    offset = DEFAULT_OFFSET,
    rowHeight,
    index,
    i18n,
    table,
    rowSelection,
    rowKey,
    tableType,
    ...props
}) => {
    // 当外部传进来的columns长度变化时才更新
    const columnsNew = useMemo(() => columns, [columns?.length]);
    const onExtraChangeNew = useMemo(() => onExtraChange, [columns?.length]);

    const [contextMenuId] = useState(uniqueId('ease_table_'));

    const [contextValue, setContextValue] = useState<TableContextValue>({
        contextMenuId,
        i18n,
        visibleKeys: [],
        onContextMenu: () => {},
        selectedRowKeys: rowSelection && rowSelection.selectedRowKeys ? [...rowSelection.selectedRowKeys] : [],
        // dataSourceMap,
    });

    const {submit, restore, getFieldsValue, confirm} = useEditVirtualContext();

    const {internalDataSource, internalColumns} = useInternalState({dataSource, columns: columnsNew});

    const {internalPagination, onInternalChange} = usePagination({pagination, onChange});

    const {indexDataSource, indexColumns} = useIndex({showIndex, dataSource: internalDataSource, columns: internalColumns, index});
    const {filterDataSource, setFilterValue} = useFilter({dataSource: indexDataSource, onFilter});
    const {rowSelectionColumns} = useRowSelection({columns: indexColumns, rowSelection, dataSource, rowKey, setContextValue});

    const {extraColumns, visibleKeys, onContextMenu, columnsWidth} = useExtraColumns({
        columns: rowSelectionColumns,
        onExtraChange: onExtraChangeNew,
        contextMenu,
        shouldCellUpdate,
    });

    const {internalScroll} = useScroll({
        offset,
        scroll,
        pagination: internalPagination,
        columnsWidth,
        dataSource: filterDataSource,
    });

    // const {editColumns} = useEdit({columns: extraColumns, editable});

    // 这里取全量的columns
    const {onInternalRow} = useRow({onRow, columns: indexColumns});

    const {renderVirtualList, adaptiveColumns, containerRef} = useEditTableVirtual({dataSource, columns: extraColumns, scroll, rowHeight});

    const components = {header: {cell: HeaderCell, wrapper: HeaderWrapper}, body: renderVirtualList};

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
    }, [contextMenuId, i18n, onContextMenu, rowSelection, visibleKeys]);

    // 暴露api
    useImperativeHandle(table, () => ({
        submit,
        restore,
        confirm,
        getFieldsValue,
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
                        placeholder={typeof showFilter === 'string' ? showFilter : ''}
                    />
                ) : null}

                <div className="ease-virtual-table" ref={containerRef}>
                    <DndProvider backend={HTML5Backend}>
                        <Table
                            components={components}
                            // @ts-ignore
                            columns={adaptiveColumns}
                            className={`ease-virtual-table-view ${className || ''}`}
                            dataSource={filterDataSource}
                            bordered
                            pagination={internalPagination}
                            size="small"
                            scroll={filterDataSource.length === 0 ? internalScroll : scroll}
                            onChange={onInternalChange}
                            onRow={onInternalRow}
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

const EaseTableWrapper: FC<EaseEditableVirtualTableProps> = memo(
    ({editStatus, onEdit, defaultEditStatus, dataSource, onExtraChange, columns, ...props}) => (
        <EditVirtualWrapper editStatus={editStatus} dataSource={dataSource} onEdit={onEdit} defaultEditStatus={defaultEditStatus}>
            <EaseTable {...props} dataSource={dataSource} columns={columns} onExtraChange={onExtraChange} />
        </EditVirtualWrapper>
    ),
);

export default EaseTableWrapper;
