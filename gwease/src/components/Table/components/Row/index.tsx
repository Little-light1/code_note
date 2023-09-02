/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import React, { FC, useCallback, useEffect, useRef } from "react";
import _ from "lodash";
import { Form } from "antd";
import { useEditContext } from "../EditWrapper";
import { Columns } from "../../types";
import { DEBOUNCE_EDIT_DELAY } from "../../constant";

interface RowProps<RecordType = any> {
  index: number;
  record: RecordType;
  columns: Columns;
}

const Row: FC<RowProps> = ({ index, record, columns, ...props }) => {
  const [form] = Form.useForm();
  const { setRowForm, setEditStatus, getEditStatus, setDepUpdatedCells, getDepUpdatedCells } = useEditContext();
  const columnsRef = useRef(columns);
  const indexRef = useRef(index);
  const recordRef = useRef(record);
  const formRef = useRef(form);

  useEffect(() => {
    columnsRef.current = columns;
    indexRef.current = index;
    recordRef.current = record;
    formRef.current = form;
  }, [columns, index, record, form]);

  const onValuesChange = useCallback(
    _.debounce((changedValues) => {
      const editStatusRefState = getEditStatus();
      const depUpdatedCellsRefState = getDepUpdatedCells(); // 这里每次修改会重新定义当前的依赖变化，触发renderEdit
      const prepareClearColumnIndexKeys: string[] = [];
      const defaultValues: { [key: string]: any } = {};
      const _columns = columnsRef.current;
      const _index = indexRef.current;
      const _form = formRef.current;

      if (typeof editStatusRefState[_index] === "undefined") {
        editStatusRefState[_index] = {};
      }

      if (typeof depUpdatedCellsRefState[_index] === "undefined") {
        depUpdatedCellsRefState[_index] = {};
      }

      Object.keys(changedValues).forEach((key) => {
        editStatusRefState[_index][key].value = changedValues[key];
      });

      // 转换成Record格式
      const editRecord = Object.keys(editStatusRefState[_index]).reduce(
        (prev, curr) => ({ ...prev, [curr]: editStatusRefState[_index][curr].value }),
        {}
      );

      // 找出所有前置依赖在changedValues中的列
      _columns.forEach(({ dataIndex, dependence, defaultValue = null }) => {
        if (typeof dependence !== "undefined" && dependence.length) {
          dependence.forEach((dependColumnKey) => {
            if (typeof changedValues[dependColumnKey] !== "undefined") {
              prepareClearColumnIndexKeys.push(dataIndex);

              // 计算当前这列的默认赋值
              defaultValues[dataIndex] = typeof defaultValue === "function" ? defaultValue(editRecord) : defaultValue;
            }
          });
        }
      });

      // 清空相关字段
      if (prepareClearColumnIndexKeys.length) {
        prepareClearColumnIndexKeys.forEach((key) => {
          editStatusRefState[_index][key] = {
            value: defaultValues[key],
            original: recordRef.current[key],
            status: "editing",
          };

          depUpdatedCellsRefState[_index][key] = new Date().getTime();
        });

        _form.setFieldsValue(prepareClearColumnIndexKeys.reduce((prev, curr) => ({ ...prev, [curr]: defaultValues[curr] }), {}));
      }

      setDepUpdatedCells(depUpdatedCellsRefState);

      setEditStatus([...editStatusRefState]);
    }, DEBOUNCE_EDIT_DELAY),
    []
  );

  useEffect(() => {
    setRowForm((state) => {
      if (typeof state[index] === "undefined") {
        state[index] = {} as any;
      }
      state[index] = form;
      return { ...state };
    });
  }, [form, index, setRowForm]);

  useEffect(() => {
    form.setFieldsValue(record);
  }, [form, record]);

  return (
    <Form form={form} component={false} onValuesChange={onValuesChange}>
      <tr {...props} />
    </Form>
  );
};

export default Row;
