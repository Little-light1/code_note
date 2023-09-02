// import _ from 'lodash';
import {useDebounceEffect} from 'ahooks';
import {ColumnTitle} from 'antd/lib/table/interface';
import React, {CSSProperties, FC, Key, MouseEventHandler, ReactNode, useRef} from 'react';
import {ContextMenuTrigger} from 'react-contextmenu';
import {Resizable, ResizeCallbackData} from 'react-resizable';
import {useDrag, useDrop} from 'react-dnd';
import {useTable} from '../../hooks';
import './styles.scss';

type DragItem = {dataKey: Key; dataIndex: number};

interface HeaderCellProps {
    dataKey: Key;
    dataIndex: number;
    className: string;
    // titleAlign?: "left" | "right" | "center";
    ellipsis?:
        | {
              showTitle?: boolean;
          }
        | boolean;
    style: CSSProperties;
    title: ColumnTitle<any>;
    colTitle: ReactNode | (({sortOrder, sortColumn, filters}: any) => ReactNode);
    width: number | string;
    canHide?: boolean;
    canDrag?: boolean;
    canDrop?: boolean;
    canResize?: boolean;
    contextMenu: boolean;
    flushColumnWidth: (dataKey: Key, width: number) => void;
    onResize: ((e: React.SyntheticEvent, resizer: ResizeCallbackData) => any) | undefined;
    onResizeStop: ((e: React.SyntheticEvent, resizer: ResizeCallbackData) => any) | undefined;
    onMoveHeaderCell: (dragItem: DragItem, hoverItem: DragItem) => void;
    onContextMenu: Function;
    onMouseEnter: MouseEventHandler;
    onMouseLeave: MouseEventHandler;
}

const type = 'DraggableHeaderCell';

function collect(props: any) {
    return props;
}

const HeaderCell: FC<HeaderCellProps> = (props) => {
    const {contextMenuId} = useTable();

    const {
        // isResizing,
        dataKey,
        dataIndex,
        className,
        style,
        title,
        width,
        colTitle,
        // titleAlign = "center",
        ellipsis = true,
        flushColumnWidth,
        onResize,
        onResizeStop,
        onMoveHeaderCell,
        onContextMenu,
        canHide = true,
        canDrag = true,
        canDrop = true,
        canResize = true,
        contextMenu,
        // onMouseEnter,
        // onMouseLeave,
        ...restProps
    } = props;

    // const isRealWidthRef = useRef(false);

    // const [realWidth, setRealWidth] = useState(typeof width === 'string' ? parseFloat(width) : width);

    const headerCellRef = useRef<any>();

    const [{isOver, dropClassName}, drop] = useDrop({
        accept: type,
        collect: (monitor) => {
            const {dataKey: dragKey, dataIndex: dragIndex} = (monitor.getItem() || {}) as any;

            if (dragKey === dataKey) {
                return {};
            }
            return {
                isOver: monitor.isOver(),
                dropClassName: dragIndex < dataIndex ? 'ease-table-drop-over-backward' : 'ease-table-drop-over-forward',
            };
        },
        drop: (item: DragItem) => {
            onMoveHeaderCell(item, {dataKey, dataIndex});
        },
    });

    const [collected, drag] = useDrag({
        type,
        item: {dataKey, dataIndex},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    if (canDrag) {
        drag(headerCellRef);
    }

    if (canDrop) {
        drop(headerCellRef);
    }

    useDebounceEffect(
        () => {
            if (typeof width === 'undefined' && headerCellRef.current) {
                // isRealWidthRef.current = true;
                flushColumnWidth(dataKey, headerCellRef.current.clientWidth);
            }
        },
        [width],
        {
            wait: 1000,
        },
    );

    // useEffect(() => {
    //     setRealWidth(typeof width === 'string' ? parseFloat(width) : width);
    // }, [width]);

    // 由于antd会自动计算宽度，所以这里会自动纠偏
    // useLayoutEffect(() => {
    //     !top.refs && (top.refs = {});
    //     top.refs[dataIndex] = headerCellRef.current;
    //     if (typeof width === 'undefined' && headerCellRef.current) {
    //         isRealWidthRef.current = true;
    //         setRealWidth(headerCellRef.current.clientWidth);
    //         console.log(headerCellRef.current.clientWidth);
    //     } else {
    //         setRealWidth(typeof width === 'string' ? parseFloat(width) : width);
    //     }
    // }, [width]);

    // table-scrollbar
    if (typeof dataIndex === 'undefined') {
        return <th className={`${className} ease-table-header-cell `} style={style} {...restProps} />;
    }

    // const attributes = {
    //   datakey: dataKey,
    // };

    // // 处理title对齐方式，与cell对齐方式区分开来
    // .ant-table-cell-ellipsis会附加overflow: hidden样式，会导致列宽调整热区被影响
    const mergeStyle = {...style, overflow: 'unset'};

    // 处理title超出省略
    const ellipsisStyle: CSSProperties = ellipsis
        ? {whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block'}
        : {};

    let overLengthTitle;
    if (typeof colTitle === 'string') {
        overLengthTitle = colTitle;
    }

    const TriggerHeaderCell = contextMenu ? (
        <ContextMenuTrigger
            holdToDisplay={-1}
            // ref={headerCellRef}
            id={contextMenuId}
            renderTag="div"
            disable={collected.isDragging}
            // @ts-ignore
            onContextMenu={onContextMenu}
            collect={collect}
            // attributes={attributes}
            dataKey={dataKey}
            canHide={canHide}>
            {/* <Tooltip
                overlayClassName="ease-table-header-cell-tooltip"
                // trigger="click"
                title={overLengthTitle}
                placement="left"
                arrowContent={null}> */}
            <span {...restProps} style={ellipsisStyle} title={overLengthTitle} />
            {/* </Tooltip> */}
        </ContextMenuTrigger>
    ) : (
        // <Tooltip
        //     // trigger="click"
        //     title={overLengthTitle}
        //     placement="left"
        //     overlayClassName="ease-table-header-cell-tooltip">
        <span {...restProps} style={ellipsisStyle} title={overLengthTitle} />
        // </Tooltip>
    );

    const ChildHeaderCell = (
        <th
            ref={headerCellRef}
            className={`${className} ease-table-header-cell ${canDrag ? 'ease-table-cell-drag' : ''} ${
                collected.isDragging ? 'ease-table-cell-dragging' : ''
            } ${isOver ? dropClassName : ''}`}
            style={mergeStyle}>
            {TriggerHeaderCell}
        </th>
    );

    if (!canResize) {
        return ChildHeaderCell;
    }

    return (
        <Resizable
            width={typeof width === 'string' ? parseFloat(width) : width}
            height={0}
            onResize={onResize}
            draggableOpts={{enableUserSelectHack: false}}
            onResizeStop={onResizeStop}>
            {ChildHeaderCell}
        </Resizable>
    );
};

export default HeaderCell;
