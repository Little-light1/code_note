import { useSize } from "ahooks";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { VariableSizeGrid as Grid } from "react-window";
import { CustomizeScrollBody } from "rc-table/lib/interface";
import { Empty } from "antd";
import { ExtraColumn, EaseVirtualTableProps } from "../types";
import { DEFAULT_ROW_HEIGHT, EMPTY_COLUMNS } from "./constant";
// import  "../styles.scss";

interface UseVirtualProps<RecordType> {
  columns?: ExtraColumn<RecordType>[];
  scroll: EaseVirtualTableProps<RecordType>["scroll"];
  // rowHeight?: (rowIndex: number) => number;
  rowHeight?: number;
}

export default function useVirtual<RecordType>({
  columns = EMPTY_COLUMNS,
  scroll,
  rowHeight = DEFAULT_ROW_HEIGHT,
}: UseVirtualProps<RecordType>) {
  const gridRef = useRef<any>();
  const containerRef = useRef<any>();
  const containerSize = useSize(containerRef);
  const { width: tableWidth = 0 } = containerSize || {};
  // @ts-ignore
  const scrollY = parseFloat(scroll.y);
  const [connectObject] = useState<any>(() => {
    const obj = {};

    Object.defineProperty(obj, "scrollLeft", {
      get: () => {
        if (gridRef.current) {
          return gridRef.current?.state?.scrollLeft;
        }

        return null;
      },

      set: (scrollLeft: number) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({
            scrollLeft,
          });
        }
      },
    });

    return obj;
  });

  const resetVirtualGrid = () => {
    gridRef.current &&
      gridRef.current.resetAfterIndices({
        columnIndex: 0,
        shouldForceUpdate: true,
      });
  };

  const adaptiveColumns = useMemo(() => {
    const needAdaptiveColumnsIndex: number[] = [];
    let withoutWidthColumnCount = 0;

    columns.forEach(({ width }, index) => {
      if (!width) {
        needAdaptiveColumnsIndex.push(index);
        withoutWidthColumnCount += 1;
      }
    });

    let totalWidth = columns.reduce((total, column) => total + parseFloat(String(column.width || 0)), 0);

    // columns总宽度<容器宽度
    if (!withoutWidthColumnCount && tableWidth && totalWidth < tableWidth) {
      // 最后一列需要自适应
      needAdaptiveColumnsIndex.push(columns.length - 1);
      withoutWidthColumnCount += 1;
      // 排除最后一列，重新计算
      totalWidth = columns.reduce((total, c, i) => total + (i === columns.length - 1 ? 0 : parseFloat(String(c.width!))), 0);
    }

    return columns!.map((column, index) => {
      if (column.width && !needAdaptiveColumnsIndex.includes(index)) {
        return column;
      }

      return {
        ...column,
        width: Math.floor((tableWidth - totalWidth) / withoutWidthColumnCount),
      };
    });
  }, [columns, tableWidth]);

  useEffect(() => resetVirtualGrid, [tableWidth]);

  const renderVirtualList: CustomizeScrollBody<RecordType> = (rawData: readonly RecordType[], { scrollbarSize, ref, onScroll }: any) => {
    ref.current = connectObject;
    const totalHeight = rawData.length * 54;

    if (!rawData.length) {
      return <Empty style={{padding:"15px"}} image={Empty.PRESENTED_IMAGE_SIMPLE} />

    }



    return (
      <Grid
        ref={gridRef}
        className="ease-table-virtual-grid"
        columnCount={adaptiveColumns.length}
        columnWidth={(index: number) => {
          const { width } = adaptiveColumns[index];
          const width2Number = parseFloat(String(width!));
          return totalHeight > scrollY && index === adaptiveColumns.length - 1 ? width2Number - scrollbarSize - 1 : width2Number;
        }}
        height={scrollY}
        rowCount={rawData.length}
        rowHeight={() => rowHeight}
        width={tableWidth}
        onScroll={({ scrollLeft }: { scrollLeft: number }) => {
          onScroll({
            scrollLeft,
          });
        }}
      >
        {({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
          const { render, align = "left" } = adaptiveColumns[columnIndex];

          const value = (rawData[rowIndex] as any)[(adaptiveColumns as any)[columnIndex].dataIndex];

          const mergeStyle = { ...style, textAlign: align };

          return (
            <div
              className={`ease-table-virtual-cell ease-table-virtual-cell-ellipsis ${columnIndex === adaptiveColumns.length - 1 ? "ease-table-virtual-cell-last" : ""
                }  ${(rowIndex + 1) % 2 === 0 ? "ease-table-virtual-cell-even" : "ease-table-virtual-cell-odd"}`}
              style={mergeStyle}
              title={value}
            >
              {render ? render(value, rawData[rowIndex], rowIndex) : value}
            </div>
          );
        }}
      </Grid>
    );
  };

  return {
    renderVirtualList,
    containerRef,
    adaptiveColumns,
  };
}
