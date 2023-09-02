/*
 * @Author: zhangzhen
 * @Date: 2023-05-17 13:26:32
 * @LastEditors: shimmer
 * @LastEditTime: 2023-07-11 18:34:10
 *
 */
import {useMemo} from 'react';
import {useSize} from 'ahooks';
import {cloneDeep} from 'lodash';
import {ExtraColumn} from '../types';

interface UseReColumnWidthProps {
    columns: ExtraColumn[];
    containerRef?: any;
}

const useReColumnWidth = (props: UseReColumnWidthProps) => {
    const {columns, containerRef} = props;

    const containerSize = useSize(containerRef);

    const {width: tableWidth = 0} = containerSize || {};

    const adaptiveColumns = useMemo(() => {
        // 没数据手动新增的话会出问题
        // if (tableDataRef.current.length === 0) {
        //     return columns;
        // }
        const needAdaptiveColumnsIndex: number[] = [];
        let withoutWidthColumnCount = 0;
        columns.forEach(({width}, index) => {
            if (!width) {
                needAdaptiveColumnsIndex.push(index);
                withoutWidthColumnCount += 1;
            }
        });
        let totalWidth = columns.reduce((total, column) => total + parseFloat(String(column.width || 0)), 0);
        // columns总宽度<容器宽度
        if (!withoutWidthColumnCount && tableWidth && totalWidth < tableWidth + 10) {
            // 最后一列需要自适应
            needAdaptiveColumnsIndex.push(columns.length - 1);
            withoutWidthColumnCount += 1;
            // 排除最后一列，重新计算
            const cloneColumns = cloneDeep(columns);
            cloneColumns.pop();
            totalWidth = cloneColumns.reduce((total, column) => total + parseFloat(String(column.width || 0)), 0);
        }
        // columns总宽度>容器宽度不做处理
        // if (!withoutWidthColumnCount && tableWidth && totalWidth > tableWidth) {
        //     return columns!.map((column) => ({
        //         ...column,
        //         width: Math.floor(tableWidth / columns.length),
        //     }));
        // }

        return columns!.map((column, index) => {
            column.ellipsis = true;
            if (column.width && !needAdaptiveColumnsIndex.includes(index)) {
                return column;
            }

            return {
                ...column,
                width: Math.floor((tableWidth - totalWidth) / withoutWidthColumnCount) - 20,
            };
        });
    }, [columns, tableWidth]);

    return {
        containerRef,
        adaptiveColumns,
    };
};

export default useReColumnWidth;
