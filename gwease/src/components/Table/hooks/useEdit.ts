/*
 * @Author: zhangzhen
 * @Date: 2022-08-29 18:42:00
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-11-04 09:05:36
 *
 */
import {useCallback, useMemo} from 'react';
import {useEditContext} from '../components/EditWrapper';
import {ExtraColumn, Editable} from '../types';
import {EMPTY_COLUMNS} from './constant';

interface UseEditCellProps<RecordType> {
    columns?: ExtraColumn<RecordType>[];
    editable?: Editable<RecordType>;
}

export default function useEdit<RecordType>({columns = EMPTY_COLUMNS, editable}: UseEditCellProps<RecordType>) {
    const {getEditStatus, rowForm, setEditStatus} = useEditContext();
    const onInternalCellClick = useCallback(
        (e, {column, rowIndex, text}) => {
            const editStatusRefState = getEditStatus();

            const {dataIndex} = column;

            let value = text;
            let original = text;

            if (editStatusRefState && editStatusRefState[rowIndex]) {
                if (editStatusRefState[rowIndex][dataIndex]) {
                    if (typeof editStatusRefState[rowIndex][dataIndex].original !== 'undefined') {
                        original = editStatusRefState[rowIndex][dataIndex].original;
                    }
                    if (typeof editStatusRefState[rowIndex][dataIndex].value !== 'undefined') {
                        value = editStatusRefState[rowIndex][dataIndex].value;
                    }
                }
            } else {
                editStatusRefState[rowIndex] = {};
            }

            editStatusRefState[rowIndex][dataIndex] = {
                value,
                original,
                status: 'editing',
            };
            // eslint-disable-next-line no-underscore-dangle
            rowForm[rowIndex]?.setFieldsValue({[dataIndex]: value});

            setEditStatus([...editStatusRefState]);
        },
        [getEditStatus, rowForm, setEditStatus],
    );

    const editColumns = useMemo(
        () =>
            columns.map((column) => {
                const {onCell, renderEdit, dataIndex, editable: columnEditable = false} = column;
                return {
                    ...column,
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
                            onCellClick: onInternalCellClick,
                            record,
                            editable: cellEditable,
                        };
                    },
                };
            }),
        // 注意: editable 只是作为一个功能函数，不会取到上下文
        [columns, editable, onInternalCellClick],
    );

    return {
        editColumns,
    };
}
