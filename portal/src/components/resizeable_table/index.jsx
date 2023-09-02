/**
 * @Author:zy
 * @Description：可进行拖拽的table
 * @Date:2020-04-27
 */
import {Table} from 'antd';
import {Resizable} from 'react-resizable';
import React, {useState, useEffect} from 'react';
import _ from 'lodash';
import './styles.scss'; // import { Math } from 'core-js';

/**
 * 可缩放的表格头部
 * @param {*} props
 */

const ResizeableTitle = (props) => {
    const {onResize, width, ...restProps} = props; // 如果没有指定宽度

    if (!width) {
        return <th {...restProps} />;
    } // 如果指定了宽度

    return (
        <Resizable
            width={width}
            height={0}
            onResize={onResize}
            draggableOpts={{
                enableUserSelectHack: false,
            }}
        >
            <th {...restProps} />
        </Resizable>
    );
};
/**
 * 封装可缩放的表格组件
 */

const ResizeableTable = (props) => {
    // 获取除了列之外的其它参数
    const {
        id = 'resizeableTableID',
        columns: originalColumns,
        ...restProps
    } = props; // 设置状态

    const [columns, setColumns] = useState(originalColumns);
    // const id = props.id || 'resizeableTableID'; // 处理列发生改变

    useEffect(() => {
        // 将originalColumns、和columns相同的列， 使用columns中的列长赋值
        _.forEach(originalColumns, (originalColumn) => {
            const column = _.find(
                columns,
                (col) => col.title === originalColumn.title,
            );

            if (column) {
                originalColumn.width = column.width ? column.width : 200;
            } // http://ztpm.goldwind.com.cn:9898/pro/bug-view-40348.html
            // //如果存在固定列
            // if (originalColumn.fixed) {
            //     delete originalColumns[index].width;
            // }
        });

        setColumns(originalColumns);
    }, [originalColumns]); // 表头设置

    const components = {
        header: {
            cell: ResizeableTitle,
        },
    }; // 处理表头列拉伸事件

    const handleResize =
        (index) =>
        (e, {size}) => {
            const tableDom = document.getElementById(id);
            const headResizableCellDom =
                tableDom.getElementsByClassName('react-resizable');
            const headResizableCellDomToArray =
                (headResizableCellDom && Object.values(headResizableCellDom)) ||
                [];

            const newColumns = _.cloneDeep(columns);

            const columnWith = size.width;
            // const varietySubtractionValue =
            //     headResizableCellDomToArray[index].offsetWidth - columnWith;
            const subtractionValue = columnWith - newColumns[index].width;

            if (subtractionValue > -2 && subtractionValue < 2) {
                return;
            } // if (Math.abs(varietySubtractionValue) > 100) {
            //     newColumns[index].width = headResizableCellDomToArray[index].offsetWidth + subtractionValue;
            // } else {
            //     newColumns[index].width = columnWith;
            // }

            newColumns[index].width = columnWith < 60 ? 60 : columnWith;
            newColumns.forEach((element, i) => {
                headResizableCellDomToArray.forEach((cellEle) => {
                    if (i !== index && element.title === cellEle.innerText) {
                        element.width = cellEle.offsetWidth;
                    }
                });
            });
            setColumns(newColumns); // const minColumnWidth = 50,
            //     nextColumns = [...columns];
            // let columnWith = size.width;
            // // 如果是调整最后一列列宽  设置不可变
            // if (index === columns.length - 1) {
            //     return;
            // }
            // if (columnWith >= columns[index].width + columns[index + 1].width - minColumnWidth) {
            //     // 设置第index列新宽度
            //     nextColumns[index] = {
            //         ...nextColumns[index],
            //         width: columns[index].width + columns[index + 1].width - minColumnWidth
            //     };
            //     nextColumns[index + 1] = {
            //         ...nextColumns[index + 1]
            //         // width: minColumnWidth
            //     };
            // } else if (columnWith <= minColumnWidth) {
            //     // 设置第index列新宽度
            //     nextColumns[index] = {
            //         ...nextColumns[index],
            //         width: minColumnWidth
            //     };
            //     nextColumns[index + 1] = {
            //         ...nextColumns[index + 1]
            //         // width: columns[index].width + columns[index + 1].width - minColumnWidth
            //     };
            // } else {
            //     nextColumns[index] = {
            //         ...nextColumns[index],
            //         width: columnWith
            //     };
            //     nextColumns[index + 1] = {
            //         ...nextColumns[index + 1]
            //         // width: columns[index].width + columns[index + 1].width - columnWith
            //     };
            // }
            // setColumns(nextColumns);
        }; // 给每一列添加拉伸事件 如果没有指定宽度，给一个默认宽度

    const newColumns = _.map(columns, (col, index) => ({
        ...col,
        onHeaderCell: (column) => ({
            width: column.width ? column.width : 120,
            onResize: handleResize(index),
        }),
    }));

    return (
        // components 覆盖默认的 table 元素
        <Table
            id={id}
            components={components}
            columns={newColumns}
            {...restProps}
        />
    );
};

export default ResizeableTable;
