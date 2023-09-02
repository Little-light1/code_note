import _ from 'lodash';
import {useCallback, useEffect, useMemo, useState, useRef} from 'react';
import {getVisibleKeys, getColumnsWidth, getColumnsSort, packageColumns} from './utils';
import {EMPTY_COLUMNS} from './constant';
import {Columns, ShouldCellUpdate} from '../types';

interface UseColumnProps<RecordType> {
    columns?: Columns<RecordType>;
    contextMenu: boolean;
    onExtraChange?: ({columns}: {columns: Columns}) => void;
    shouldCellUpdate?: ShouldCellUpdate<RecordType>;
}

export default function useExtraColumns<RecordType>({
    columns = EMPTY_COLUMNS,
    contextMenu,
    onExtraChange,
    shouldCellUpdate,
}: UseColumnProps<RecordType>) {
    const [visibleKeys, setVisibleKeys] = useState(getVisibleKeys(columns));
    const [columnsWidth, setColumnsWidth] = useState<{[key: string]: string | number | undefined}>(getColumnsWidth(columns));
    const [columnsSort, setColumnsSort] = useState(getColumnsSort(columns));
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const columnsRef = useRef<any[]>(columns);

    // columns变化，初始化
    useEffect(() => {
        setVisibleKeys(getVisibleKeys(columns));
        setColumnsWidth(getColumnsWidth(columns));
        setColumnsSort(getColumnsSort(columns));
    }, [columns]);

    // 列显示隐藏变化，修改列宽
    useEffect(() => {
        setColumnsWidth(getColumnsWidth(columnsRef.current));
    }, [columnsRef.current.length]);

    // 列表右击菜单
    const onContextMenu = useCallback(
        (e: any, data: any) => {
            e.stopPropagation();
            const {type, dataKey, column} = data;

            let newVisibleKeys = visibleKeys;

            if (type === 'hide') {
                _.remove(newVisibleKeys, (key) => key === dataKey);
            }

            if (type === 'visible') {
                const removed = _.remove(newVisibleKeys, (key) => key === column.dataIndex);

                if (removed.length === 0) {
                    newVisibleKeys = [...visibleKeys, column.dataIndex];
                }
            }

            setVisibleKeys([...newVisibleKeys]);

            onExtraChange && onExtraChange({columns: packageColumns({columns, visibleKeys: newVisibleKeys, columnsWidth})});
        },

        // 注意: onExtraChange 只是作为一个功能函数，不会取到上下文
        [columns, columnsWidth, onExtraChange, visibleKeys],
    );

    // 对齐宽度
    const flushColumnWidth = useCallback((dataIndex: string, width: string | number) => {
        setColumnsWidth((columnsWidthState) => {
            const currentWidth =
                typeof columnsWidthState[dataIndex] === 'string' && typeof columnsWidthState[dataIndex] !== 'undefined'
                    ? parseFloat(columnsWidthState[dataIndex] as string)
                    : columnsWidthState[dataIndex];

            if (currentWidth !== width) {
                return {...columnsWidthState, [dataIndex]: width};
            }
            return columnsWidthState;
        });
    }, []);

    const onResize = useCallback((e: any, {size}: any, column: Record<string, any>) => {
        e.stopPropagation();
        e.preventDefault();
        setIsResizing(true);
        setColumnsWidth((columnsWidthState) => {
            const {dataIndex, minWidth, maxWidth} = column;
            let width = size.width;
            if (typeof minWidth !== 'undefined') {
                width = Math.max(width, minWidth);
            }
            if (typeof maxWidth !== 'undefined') {
                width = Math.min(width, maxWidth);
            }

            return {...columnsWidthState, [dataIndex]: width};
        });
    }, []);

    const onResizeStop = useCallback(
        (e: any) => {
            e.stopPropagation();
            setIsResizing(false);

            onExtraChange && onExtraChange({columns: packageColumns({columns, visibleKeys, columnsWidth})});
        },
        [columns, columnsWidth, onExtraChange, visibleKeys],
    );

    const onMoveHeaderCell = useCallback(
        (dragItem: Record<string, any>, hoverItem: Record<string, any>) => {
            const {dataKey: dragKey, dataIndex: dragIndex} = dragItem;
            const {dataKey: hoverKey, dataIndex: hoverIndex} = hoverItem;

            if (dragKey === hoverKey) return;

            const newColumns = [...columnsRef.current];
            const fromIndex = newColumns.findIndex((col) => col.dataIndex === dragKey);

            const target = newColumns.splice(fromIndex, 1);

            let toIndex = newColumns.findIndex((col) => col.dataIndex === hoverKey);

            if (dragIndex < hoverIndex) {
                toIndex += 1;
            }

            const frontColumns = newColumns.splice(0, toIndex);
            const finalColumns = [...frontColumns, ...target, ...newColumns];

            setColumnsSort(getColumnsSort(finalColumns));

            onExtraChange && onExtraChange({columns: packageColumns({columns: finalColumns, visibleKeys, columnsWidth})});
            columnsRef.current = finalColumns;
        },
        [columns, columnsWidth, onExtraChange, visibleKeys],
    );

    const extraColumns = useMemo(() => {
        // 过滤显示列
        const filterColumns = columns.filter((col) => visibleKeys.includes(col.dataIndex));

        // 重新排序
        const sortColumns = [];
        for (const dataIndex of columnsSort) {
            const foundColumn = filterColumns.find((column) => column.dataIndex === dataIndex);
            if (foundColumn) {
                sortColumns.push(foundColumn);
            }
        }

        columnsRef.current = sortColumns;

        const columnsResult = sortColumns.map((column, index) => {
            const {onHeaderCell, canDrag} = column;

            const tempCanDrag = isResizing ? false : canDrag;

            const extraColumn = {
                ...column,
                canDrag: tempCanDrag,
                visible: true,
                width: columnsWidth[column.dataIndex],
                onHeaderCell: (col: any) => {
                    const extraHeaderCellProps = onHeaderCell ? onHeaderCell(col) : {};
                    return {
                        ...extraHeaderCellProps,
                        dataKey: col.dataIndex,
                        // titleAlign: 'center',
                        // style: 'textAlign:center',
                        // isResizing,
                        ellipsis: col.ellipsis,
                        dataIndex: index,
                        width: typeof col.width === 'string' ? +col.width.split('px')[0] : col.width,
                        title: col.title,
                        colTitle: column.title,
                        canHide: col.canHide,
                        canDrag: col.canDrag,
                        canDrop: col.canDrop,
                        canResize: col.canResize,
                        contextMenu,
                        flushColumnWidth,
                        onResize: (
                            e: MouseEvent,
                            resizer: {
                                handle: string;
                                node: HTMLElement;
                                size: {
                                    height: number;
                                    width: number;
                                };
                            },
                        ) => onResize(e, resizer, col),
                        onResizeStop,
                        onContextMenu,
                        onMoveHeaderCell,
                        // visibleKeys,
                    };
                },
            };

            if (typeof shouldCellUpdate === 'function') {
                extraColumn.shouldCellUpdate = shouldCellUpdate;
            }

            return extraColumn;
        });

        // // 处理表格自适应情况
        // let setWidthCount = 0;
        // columnsResult.forEach((col) => {
        //     if (col.width) {
        //         setWidthCount += 1;
        //     }
        // });

        // if (setWidthCount === columnsResult.length) {
        //     for (const col of [...columnsResult].reverse()) {
        //         if (typeof col.fixed === 'undefined') {
        //             delete col.width;
        //             break;
        //         }
        //     }
        // }

        return columnsResult;
    }, [
        columns,
        visibleKeys,
        columnsSort,
        isResizing,
        columnsWidth,
        shouldCellUpdate,
        contextMenu,
        flushColumnWidth,
        onResizeStop,
        onContextMenu,
        onMoveHeaderCell,
        onResize,
    ]);

    return {
        columnsWidth,
        extraColumns,
        visibleKeys,
        onContextMenu,
    };
}
