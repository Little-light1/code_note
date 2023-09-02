import React, {FC, useImperativeHandle, useMemo, useState} from 'react';
import {Table, Input} from 'antd';
import {connectMenu} from 'react-contextmenu';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {uniqueId} from 'lodash';
import {useInternalState, usePagination, useScroll, useIndex, useFilter, TableContext, useExtraColumns, useRow, useEdit} from './hooks';
import HeaderCell from './components/HeaderCell';
import Row from './components/Row';
import EditableCell from './components/EditableCell';
import HeaderWrapper from './components/HeaderWrapper';
import TableContextMenu from './components/TableContextMenu';
import {EditWrapper, useEditContext} from './components/EditWrapper';
import type {EaseEditableTableProps} from './types';
import './styles.scss';
import Wrapper from './components/Wrapper';
import useReColumnWidth from './hooks/useReColumnWidth';

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
const EaseTable: FC<EaseEditableTableProps> = ({
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
    offset = DEFAULT_OFFSET,
    scroll,
    index,
    i18n,
    table,
    ...props
}) => {
    const [contextMenuId] = useState(uniqueId('ease_table_'));

    const {submit, restore, getFieldsValue, confirm} = useEditContext();

    const {internalDataSource, internalColumns} = useInternalState({dataSource, columns});

    const {internalPagination, onInternalChange} = usePagination({pagination, onChange});

    const {indexDataSource, indexColumns} = useIndex({showIndex, dataSource: internalDataSource, columns: internalColumns, index});

    const {filterDataSource, setFilterValue} = useFilter({dataSource: indexDataSource, onFilter});

    const {extraColumns, visibleKeys, columnsWidth, onContextMenu} = useExtraColumns({
        columns: indexColumns,
        onExtraChange,
        contextMenu,
        shouldCellUpdate,
    });

    const {internalScroll, containerRef} = useScroll({
        offset,
        scroll,
        pagination: internalPagination,
        columnsWidth,
        dataSource: filterDataSource,
    });

    const {editColumns} = useEdit({columns: extraColumns, editable});

    const {adaptiveColumns} = useReColumnWidth({columns: editColumns, containerRef});

    // 这里取全量的columns
    const {onInternalRow} = useRow({onRow, columns: indexColumns});

    const components = {header: {cell: HeaderCell, wrapper: HeaderWrapper}, body: {row: Row, cell: EditableCell, wrapper: Wrapper}};

    // @ts-ignore
    const ConnectedMenu = useMemo(() => connectMenu(contextMenuId)(TableContextMenu), [contextMenuId]);

    const contextValue = useMemo(
        () => ({contextMenuId, i18n, visibleKeys, onContextMenu}),
        [contextMenuId, i18n, onContextMenu, visibleKeys],
    );

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

                <div className="ease-table" ref={containerRef}>
                    <DndProvider backend={HTML5Backend}>
                        <Table
                            components={components}
                            // @ts-ignore
                            columns={adaptiveColumns}
                            className={`ease-table-view ${className || ''}`}
                            dataSource={filterDataSource}
                            bordered
                            pagination={internalPagination}
                            size="small"
                            scroll={internalScroll}
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

const EaseTableWrapper: FC<EaseEditableTableProps> = ({editStatus, onEdit, defaultEditStatus, dataSource, ...props}) => (
    <EditWrapper editStatus={editStatus} dataSource={dataSource} onEdit={onEdit} defaultEditStatus={defaultEditStatus}>
        <EaseTable {...props} dataSource={dataSource} />
    </EditWrapper>
);

export default EaseTableWrapper;
