/*
 * @Author: zhangzhen
 * @Date: 2022-08-29 18:42:00
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-09-05 10:55:56
 * 
 */
import React, { memo } from "react";
import { Form, Tooltip } from "antd";

const EditingCell = memo(({ column, text, record, rowIndex, getEditStatus, updateTimestamp, ...props }: any) => {
  const { renderEdit, errors, formProps, dataIndex } = column;


  const editRowData = getEditStatus()[rowIndex] || {};

  const editRecord = Object.keys(editRowData).reduce((prev, curr) => ({ ...prev, [curr]: editRowData[curr].value }), {});

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
      onClick={(e) => e.stopPropagation()}
      className={`${errors && errors.length ? "ease-virtual-table-cell-error" : ""} ease-virtual-table-cell-editing`}
    >
      {errors && errors.length ? (
        <Tooltip placement="right" title={errors.join("<br>")}>
          <div className="ease-virtual-table-cell-error-info" />
        </Tooltip>
      ) : null}
      <Form.Item name={`${dataIndex}_${rowIndex}`} {...formProps} noStyle>
        {EditRenderer}
      </Form.Item>
    </td>
  );
});

export default EditingCell;
