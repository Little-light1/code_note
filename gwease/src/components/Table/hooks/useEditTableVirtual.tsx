import {useSize} from 'ahooks';
import React, {useEffect, useMemo, useRef, useState, useCallback, memo} from 'react';
import {CustomizeScrollBody} from 'rc-table/lib/interface';
import {VariableSizeGrid as Grid} from 'react-window';
import {Form, Empty} from 'antd';
import _ from 'lodash';
import {ExtraColumn, EaseVirtualTableProps, EditStatus, Editable} from '../types';
import {EMPTY_COLUMNS} from './constant';
import EditableVirtualCell from '../components/EditableVirtualCell';
import {DEBOUNCE_EDIT_DELAY} from '../constant';

// import  "../styles.scss";
import {useEditVirtualContext} from '../components/EditWrapper/EditVirtualWrapper';

interface UseVirtualProps<RecordType> {
    dataSource: readonly any[] | undefined;
    columns: ExtraColumn<RecordType>[];
    scroll: EaseVirtualTableProps<RecordType>['scroll'];
    // rowHeight?: (rowIndex: number) => number;
    rowHeight?: number;
    className?: 'string';
    editable?: Editable<RecordType>;
}

const VirtualBody: React.FC<any> = memo(
    ({rawData, gridRef, onValuesChange, scrollY, form, adaptiveColumns, totalHeight, rowHeight, tableWidth, scrollbarSize, onScroll}) => (
        <Form form={form} onValuesChange={onValuesChange} style={{height: scrollY}}>
            <Grid
                ref={gridRef}
                className="ease-table-virtual-grid"
                columnCount={adaptiveColumns.length}
                columnWidth={(index: number) => {
                    const {width} = adaptiveColumns[index];
                    const width2Number = parseFloat(String(width!));
                    return totalHeight > scrollY && index === adaptiveColumns.length - 1 ? width2Number - scrollbarSize - 1 : width2Number;
                }}
                height={scrollY}
                rowCount={rawData.length}
                rowHeight={() => rowHeight}
                width={tableWidth}
                onScroll={({scrollLeft}: {scrollLeft: number}) => {
                    onScroll &&
                        onScroll({
                            scrollLeft,
                        });
                }}>
                {({columnIndex, rowIndex, style}: {columnIndex: number; rowIndex: number; style: React.CSSProperties}) => {
                    const {align = 'left', render} = adaptiveColumns[columnIndex];
                    const value = (rawData[rowIndex] as any)[(adaptiveColumns as any)[columnIndex].dataIndex];
                    const mergeStyle = {
                        ...style,
                        textAlign: align,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                    };
                    return (
                        <div
                            className={`ease-table-virtual-cell ease-table-virtual-cell-ellipsis ${
                                columnIndex === adaptiveColumns.length - 1 ? 'ease-table-virtual-cell-last' : ''
                            }  ${(rowIndex + 1) % 2 === 0 ? 'ease-table-virtual-cell-even' : 'ease-table-virtual-cell-odd'}`}
                            style={mergeStyle}
                            title={render ? render(value, rawData[rowIndex], rowIndex) : value}>
                            <EditableVirtualCell
                                height={rowHeight}
                                rowIndex={rowIndex}
                                column={adaptiveColumns[columnIndex]}
                                text={value}
                                record={rawData[rowIndex]}
                                style={style}
                                editable={adaptiveColumns[columnIndex].editable}
                                {...adaptiveColumns[columnIndex]}
                            />
                        </div>
                    );
                }}
            </Grid>
        </Form>
    ),
);

export default function useEditTableVirtual<RecordType>({
    dataSource,
    columns = EMPTY_COLUMNS,
    scroll,
    rowHeight = 45,
    editable,
}: UseVirtualProps<RecordType>) {
    const [form] = Form.useForm();
    const {setTableForm, setEditStatus, getEditStatus, setDepUpdatedCells, getDepUpdatedCells} = useEditVirtualContext();
    const gridRef = useRef<any>();
    const containerRef = useRef<any>();
    const containerSize = useSize(containerRef);
    const tableDataRef = useRef<any[]>([]);
    const tableDataRefLength = useRef<number>(0);
    const editStatusRef = useRef<any[]>([]);
    const onScrollRef = useRef(null);
    const editStatus: EditStatus = getEditStatus();
    useEffect(() => {
        setTableForm(form);
    }, [form, setTableForm]);

    const {width: tableWidth = 0} = containerSize || {};
    // @ts-ignore
    const scrollY = parseFloat(scroll.y);
    const [connectObject] = useState<any>(() => {
        const obj = {};

        Object.defineProperty(obj, 'scrollLeft', {
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
        if (!withoutWidthColumnCount && tableWidth && totalWidth < tableWidth) {
            // 最后一列需要自适应
            needAdaptiveColumnsIndex.push(columns.length - 1);
            withoutWidthColumnCount += 1;
            // 排除最后一列，重新计算
            totalWidth = columns.reduce((total, c, i) => total + (i === columns.length - 1 ? 0 : parseFloat(String(c.width!))), 0);
        }
        // columns总宽度>容器宽度不做处理
        // if (!withoutWidthColumnCount && tableWidth && totalWidth > tableWidth && tableDataRef.current.length === 0) {
        //     return columns!.map((column) => ({
        //         ...column,
        //         width: Math.floor(tableWidth / columns.length),
        //     }));
        // }

        return columns!.map((column, index) => {
            const {onCell, renderEdit, dataIndex, editable: columnEditable = false} = column;

            if (column.renderEdit) {
                column.editable = true;
            }

            column.ellipsis = true;
            if (column.width && !needAdaptiveColumnsIndex.includes(index)) {
                return column;
            }

            return {
                ...column,
                width: Math.floor((tableWidth - totalWidth) / withoutWidthColumnCount),
                onCell: (record: any, rowIndex?: number): any => {
                    const extraCellProps = onCell ? onCell(record, rowIndex) : {};

                    // 默认以列的editable为准
                    let cellEditable = columnEditable;

                    if (typeof renderEdit === 'undefined') {
                        cellEditable = false;
                    } else {
                        cellEditable = editable ? editable({record, rowIndex, column}) : cellEditable;
                    }

                    return {
                        ...extraCellProps,
                        column,
                        text: dataIndex ? record[dataIndex] : '',
                        rowIndex,
                        record,
                        editable: cellEditable,
                    };
                },
            };
        });
    }, [columns, editable, tableWidth]);

    useEffect(() => resetVirtualGrid, [tableWidth, columns]);
    // 编辑值变化
    const onValuesChange = useCallback(
        _.debounce((changedValues) => {
            const editStatusRefState = getEditStatus();
            const depUpdatedCellsRefState = getDepUpdatedCells(); // 这里每次修改会重新定义当前的依赖变化，触发renderEdit
            // 列dateIndexArr
            const changeValuesArr = Object.keys(changedValues)[0].split('_');

            let changeValuesName: string = '';
            // rowIndex
            let changeValuesIndex: number;
            if (changeValuesArr.length > 2) {
                changeValuesIndex = Number(changeValuesArr.pop());
                changeValuesName = changeValuesArr.join('_');
            } else {
                changeValuesName = changeValuesArr[0];
                changeValuesIndex = Number(changeValuesArr[1]);
            }
            const prepareClearColumnIndexKeys: string[] = [];
            const defaultValues: {[key: string]: any} = {};
            const columnsChange = columns;
            const record = tableDataRef.current[changeValuesIndex];

            if (typeof editStatusRefState[changeValuesIndex] === 'undefined') {
                editStatusRefState[changeValuesIndex] = {};
            }

            if (typeof depUpdatedCellsRefState[changeValuesIndex] === 'undefined') {
                depUpdatedCellsRefState[changeValuesIndex] = {};
            }

            Object.keys(changedValues).forEach((key) => {
                editStatusRefState[changeValuesIndex][changeValuesName].value = changedValues[key];
            });

            // 转换成Record格式
            const editRecord = Object.keys(editStatusRefState[changeValuesIndex]).reduce(
                (prev, curr) => ({...prev, [curr]: editStatusRefState[changeValuesIndex][curr].value}),
                {},
            );

            // 找出所有前置依赖在changedValues中的列
            columnsChange.forEach(({dataIndex, dependence, defaultValue = null}) => {
                if (typeof dependence !== 'undefined' && dependence.length) {
                    dependence.forEach((dependColumnKey) => {
                        if (typeof changedValues[`${dependColumnKey}_${changeValuesIndex}`] !== 'undefined') {
                            prepareClearColumnIndexKeys.push(dataIndex);

                            // 计算当前这列的默认赋值
                            defaultValues[`${dataIndex}_${changeValuesIndex}`] =
                                typeof defaultValue === 'function' ? defaultValue(editRecord) : defaultValue;
                        }
                    });
                }
            });

            // 清空相关字段
            if (prepareClearColumnIndexKeys.length) {
                prepareClearColumnIndexKeys.forEach((key) => {
                    editStatusRefState[changeValuesIndex][key] = {
                        value: defaultValues[key],
                        original: record[key],
                        status: 'editing',
                    };

                    depUpdatedCellsRefState[changeValuesIndex][key] = new Date().getTime();
                });
                const realPrepareClearColumnIndexKeys = prepareClearColumnIndexKeys.map((item) => `${item}_${changeValuesIndex}`);

                form.setFieldsValue(realPrepareClearColumnIndexKeys.reduce((prev, curr) => ({...prev, [curr]: defaultValues[curr]}), {}));
            }

            setDepUpdatedCells(depUpdatedCellsRefState);

            setEditStatus([...editStatusRefState]);
        }, DEBOUNCE_EDIT_DELAY),
        [columns],
    );

    // TODO:dataSource数据变化,设置form的值
    useEffect(() => {
        if (dataSource && dataSource.length === 0) {
            form.resetFields();
            return;
        }

        // 当前处于编辑状态的行
        const editIndexArr = editStatus
            .map((item, index) => {
                if (item) {
                    const isEmpty = item && Object.keys(item).length === 0;

                    if (!isEmpty) return index;
                }
                return null;
            })
            .filter((item) => item !== null) as number[];
        // 此次变化的Index
        let nowChangeIndexArr = [];
        const s1 = editIndexArr.filter(
            (a) => editStatusRef.current.indexOf(a) === -1, // 第一个数组中独有的
        );
        const s2 = editStatusRef.current.filter(
            (a) => editIndexArr.indexOf(a) === -1, // 第二个数组中独有的
        );
        nowChangeIndexArr = s1.concat(s2);

        // 上次的数据长度小于这次的数据长度
        if (tableDataRefLength.current < tableDataRef.current.length) {
            // 新增
            nowChangeIndexArr.forEach((rowIndex: number) => {
                const record = tableDataRef.current[rowIndex];
                const recordValue = record && Object.values(record as any);
                const recordParam = record && Object.keys(record as any);
                const newRecord: Record<string, any> = {};

                if (recordParam && recordValue) {
                    recordParam.forEach((item: string, index: number) => {
                        newRecord[`${item}_${rowIndex}`] = recordValue[index];
                    });

                    form.setFieldsValue(newRecord);
                }
            });
        } else if (tableDataRefLength.current > tableDataRef.current.length) {
            // 上次的数据长度大于这次的数据长度
            // 删除
            form.resetFields();
            editStatus.forEach((record, rowIndex) => {
                if (record) {
                    const newRecord: Record<string, any> = {};
                    const recordValue = Object.values(record);
                    const recordParam = Object.keys(record);
                    recordParam.forEach((item: string, index) => {
                        newRecord[`${item}_${rowIndex}`] = recordValue[index].value;
                    });
                    form.setFieldsValue(newRecord);
                }
            });
        }

        // 保存这次属于编辑状态的行数
        editStatusRef.current = editIndexArr;
        // 保存这次的数据长度
        tableDataRefLength.current = tableDataRef.current.length;
    }, [form, tableDataRef.current.length, dataSource, editStatus]);

    // 虚拟列表
    const renderVirtualList: CustomizeScrollBody<RecordType> = useCallback(
        (rawData: readonly RecordType[], {scrollbarSize, ref, onScroll}: any) => {
            ref.current = connectObject;
            const totalHeight = rawData.length * 54;
            tableDataRef.current = rawData as RecordType[];
            // 只保存第一次不让onScroll函数一直变化
            if (!onScrollRef.current) {
                onScrollRef.current = onScroll;
            }

            if (!rawData.length) {
                return (
                    <div style={{padding: '15px'}}>
                        <Empty style={{width: tableWidth}} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                );
            }
            return (
                <VirtualBody
                    {...{
                        scrollY,
                        rawData,
                        gridRef,
                        onValuesChange,
                        form,
                        adaptiveColumns,
                        totalHeight,
                        rowHeight,
                        tableWidth,
                        scrollbarSize,
                        onScroll: onScrollRef.current,
                    }}
                />
            );
        },
        [adaptiveColumns, connectObject, form, onValuesChange, rowHeight, scrollY, tableWidth],
    );

    return {
        renderVirtualList,
        containerRef,
        adaptiveColumns,
    };
}
