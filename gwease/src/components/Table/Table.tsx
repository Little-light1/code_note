import React, {FC, useMemo, useState} from 'react';
import {Table, Input} from 'antd';
import {connectMenu} from 'react-contextmenu';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {uniqueId} from 'lodash';
import {useInternalState, usePagination, useScroll, useIndex, useFilter, TableContext, useExtraColumns} from './hooks';
import HeaderCell from './components/HeaderCell';
import HeaderWrapper from './components/HeaderWrapper';
import TableContextMenu from './components/TableContextMenu';
import type {EaseTableProps} from './types';
import './styles.scss';
import Wrapper from './components/Wrapper';
import useReColumnWidth from './hooks/useReColumnWidth';

const {Search} = Input;

const DEFAULT_OFFSET = {
    x: 20,
    y: 39,
};

const EaseTable: FC<EaseTableProps> = ({
    columns,
    dataSource,
    pagination = false,
    showIndex = false,
    showFilter = false,
    contextMenu = true,
    className,
    onChange,
    onExtraChange,
    onFilter,
    onRow,
    shouldCellUpdate,
    offset = DEFAULT_OFFSET,
    scroll,
    index,
    i18n,
    ...props
}) => {
    const [contextMenuId] = useState(uniqueId('ease_table_'));

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

    const {adaptiveColumns} = useReColumnWidth({columns: extraColumns, containerRef});

    const components = {header: {cell: HeaderCell, wrapper: HeaderWrapper}, body: {wrapper: Wrapper}};

    // @ts-ignore
    const ConnectedMenu = useMemo(() => connectMenu(contextMenuId)(TableContextMenu), [contextMenuId]);

    const contextValue = useMemo(
        () => ({contextMenuId, i18n, visibleKeys, onContextMenu}),
        [contextMenuId, i18n, onContextMenu, visibleKeys],
    );

    // const tableRefCallback = useCallback((e) => {
    //     const thead = e.getElementsByTagName('thead')[0];
    //     if (thead) {
    //         const ths = thead.firstChild.getElementsByTagName('th');
    //         if (ths) {
    //             for (const th of ths) {
    //                 console.log(th.clientWidth);
    //             }
    //         }
    //     }
    // }, []);

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
                            // ref={tableRefCallback}
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

export default EaseTable;
