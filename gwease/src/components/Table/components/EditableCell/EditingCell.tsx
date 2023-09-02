/*
 * @Author: zhangzhen
 * @Date: 2022-09-01 20:37:08
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-09-05 09:57:38
 *
 */
import React, {memo} from 'react';
import {Form, Tooltip} from 'antd';

const EditingCell = memo(({column, text, record, rowIndex, getEditStatus, updateTimestamp, ...props}: any) => {
    const {renderEdit, errors, formProps, dataIndex} = column;
    // const { children, className, CollapsePanel, EditableTable, onCellClick, rowSpan, style, title } = props;

    const editRowData = getEditStatus()[rowIndex] || {};

    const editRecord = Object.keys(editRowData).reduce((prev, curr) => ({...prev, [curr]: editRowData[curr].value}), {});

    const EditRenderer = renderEdit({
        text,
        record,
        rowIndex,
        editRecord,
        updateTimestamp,
    });

    return (
        /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
        <td
            {...props}
            onClick={(e) => e.stopPropagation()}
            className={`${errors && errors.length ? 'ease-table-cell-error' : ''} ease-table-cell-editing`}>
            {errors && errors.length ? (
                <Tooltip placement="right" title={errors.join('<br>')}>
                    <div className="ease-table-cell-error-info" />
                </Tooltip>
            ) : null}
            <Form.Item name={dataIndex} {...formProps} noStyle>
                {EditRenderer}
            </Form.Item>
        </td>
    );
});

export default EditingCell;
