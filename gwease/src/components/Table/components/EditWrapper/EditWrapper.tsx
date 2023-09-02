import { useGetState } from "ahooks";
import { FormInstance, message } from "antd";
import { cloneDeep } from "lodash";
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEBOUNCE_EDIT_DELAY } from "../../constant";
import { DataSource, EditStatus, Submit, DepUpdatedCells } from "../../types";

interface EditContextValue {
  editStatus: EditStatus;
  setEditStatus: (editStatus: EditStatus) => void;
  getEditStatus: () => EditStatus;
  // editStatusRef: React.MutableRefObject<EditStatus>;

  depUpdatedCells: DepUpdatedCells;
  setDepUpdatedCells: (depUpdatedCells: DepUpdatedCells) => void;
  getDepUpdatedCells: () => DepUpdatedCells;

  rowForm: {
    [key: string]: FormInstance<any>;
  };
  setRowForm: React.Dispatch<
    React.SetStateAction<{
      [key: string]: FormInstance<any>;
    }>
  >;
  confirm: (forbidExitEditStatus: boolean) => void;
  submit: Submit;
  restore: () => void;
  getFieldsValue: () => { editedData: any; dataSource?: DataSource; snapShoot?: DataSource };
}

export const EditContext = React.createContext<EditContextValue>({} as any);

interface EditWrapperProps {
  defaultEditStatus?: EditStatus;
  editStatus?: EditStatus;
  dataSource?: DataSource;
  onEdit?: (editStatus: EditStatus) => void;
}

const EMPTY: EditStatus = [];

export const EditWrapper: FC<EditWrapperProps> = ({ defaultEditStatus, editStatus, dataSource, children, onEdit }) => {
  const noticeOnce = useRef(false);
  const [internalEditStatus, setEditStatus, getEditStatus] = useGetState<EditStatus>(defaultEditStatus || EMPTY);
  const [depUpdatedCells, setDepUpdatedCells, getDepUpdatedCells] = useGetState<DepUpdatedCells>([]);
  // const internalEditStatusRef = useRef<EditStatus>(defaultEditStatus || EMPTY);
  const [rowForm, setRowForm] = useState<{ [key: string]: FormInstance }>({});

  useEffect(() => {
    if (typeof editStatus !== "undefined") {
      const clone = cloneDeep(editStatus);
      setEditStatus(clone);
      // internalEditStatusRef.current = clone;
    }
  }, [editStatus, setEditStatus]);

  const setInternalEditStatus = useCallback(
    (status) => {
      if (!noticeOnce.current) {
        message.info("点击Esc退出表格编辑状态", 3);
        noticeOnce.current = true;
      }

      if (onEdit) {
        onEdit(status);
      } else {
        setEditStatus(status);
        // internalEditStatusRef.current = status;
      }
    },
    [onEdit, setEditStatus]
  );

  // 获取当前数据
  const getFieldsValue = useCallback(() => {
    const snapShoot = cloneDeep(dataSource) as any;
    const editedData: { [key: string]: any } = [];
    internalEditStatus.forEach((rowEditData, rowIndex) => {
      // editedData[Number(rowIndex)] = {};
      if (rowEditData) {
        Object.keys(rowEditData).forEach((dataIndex) => {
          if (!editedData[rowIndex]) {
            editedData[rowIndex] = {};
          }
          editedData[rowIndex][dataIndex] = rowEditData[dataIndex].value;
          snapShoot && (snapShoot[rowIndex][dataIndex] = rowEditData[dataIndex].value);
        });
      } else {
        snapShoot[rowIndex] = dataSource ? dataSource[rowIndex] : {};
      }
    });

    return {
      editedData,
      dataSource,
      snapShoot,
    };
  }, [dataSource, internalEditStatus]);

  // 确认修改
  const confirmEdit = useCallback(
    (forbidExitEditStatus: boolean = false) =>
      new Promise<void>((resolve, reject) => {
        const confirmEditStatus: EditStatus = [];

        const forms = internalEditStatus.map((value, rowIndex) => rowForm[rowIndex]);

        Promise.allSettled(forms.map((form) => form.validateFields())).then((results) => {

          const validateErrors: any[] = [];
          let isError = false;
          internalEditStatus.forEach((rowEditData, rowIndex) => {
            const validateResult = results[rowIndex];
            let needRecord = false;
            if (rowEditData) {
              // 列校验通过
              if (validateResult.status === "fulfilled") {
                Object.keys(rowEditData).forEach((key) => {
                  const { value, original, status, errors } = rowEditData[key];
                  // 修改过
                  if (value !== original) {
                    needRecord = true;
                  }

                  // 有错误信息
                  if (errors && errors.length) {
                    needRecord = true;
                    isError = true;
                    validateErrors[rowIndex] = errors;
                  }

                  // 转换单元格状态
                  if (status === "editing") {
                    rowEditData[key].status = "edited";
                  }
                });
              }
              // 列校验不通过
              else {
                const { errorFields } = validateResult.reason;

                const formErrorFields = errorFields.reduce((prev: any, { errors, name }: any) => {
                  // TODO: 这里为什么是数组
                  const dataKey = name[0];
                  prev[dataKey] = errors;
                  return prev;
                }, {});

                validateErrors[rowIndex] = formErrorFields;
                isError = true;

                Object.keys(rowEditData).forEach((key) => {
                  const { value, original, status, errors = [] } = rowEditData[key];
                  const fieldErrors = formErrorFields[key] || [];

                  // 修改过
                  if (value !== original) {
                    needRecord = true;
                  }

                  // 错误信息合并
                  rowEditData[key].errors = Array.from(new Set([...errors, ...fieldErrors]));

                  if (status === "editing") {
                    rowEditData[key].status = forbidExitEditStatus ? "editing" : "edited";
                  }
                });
              }
            }

            // @ts-ignore
            // confirmEditStatus[rowIndex] = Object.keys(newValues).length ? newValues : undefined;
            needRecord && (confirmEditStatus[rowIndex] = rowEditData);
          });
          setInternalEditStatus([...confirmEditStatus]);
          if (isError) {

            reject(validateErrors);
          } else {
            resolve();
          }
        });
      }),
    [internalEditStatus, rowForm, setInternalEditStatus]
  );

  // 重置
  const restore = useCallback(() => {
    Object.values(rowForm).forEach((form) => {
      form?.resetFields();
    });
    setInternalEditStatus([]);
  }, [rowForm, setInternalEditStatus]);

  // 提交
  const submit = useCallback<Submit>(
    () =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          confirmEdit()
            .then(() => {
              const submitData = {} as any;

              const allEditStatus = {} as any;

              internalEditStatus.forEach((rowEditData, rowIndex) => {
                if (rowEditData && Object.keys(rowEditData).length) {
                  allEditStatus[rowIndex] = rowEditData;
                }
              });

              Object.keys(allEditStatus).forEach((rowIndex) => {
                const rowEditData = allEditStatus[rowIndex];

                if (Object.keys(rowEditData).length) {
                  submitData[rowIndex] = {};

                  if (Object.keys(rowEditData).length) {
                    Object.keys(rowEditData).forEach((columnKey) => {
                      submitData[rowIndex][columnKey] = rowEditData[columnKey].value;
                    });
                  }
                }
              });

              resolve(submitData);
            })
            .catch((errors) => reject(errors));
        }, DEBOUNCE_EDIT_DELAY);

        // const forms = internalEditStatus.map((value, rowIndex) => rowForm[rowIndex]);

        // Promise.allSettled(forms.map((form) => form.validateFields())).then((results) => {
        //   let isCanSubmit = true;
        //   const validateErrors: any[] = [];
        //   results.forEach((result, rowIndex) => {
        //     const { status } = result;

        //     if (status === "rejected") {
        //       const { errorFields } = result.reason;
        //       isCanSubmit = false;

        //       validateErrors[rowIndex] = errorFields.reduce((prev: any, { errors, name }: any) => {
        //         // TODO: 这里为什么是数组
        //         const dataKey = name[0];
        //         prev[dataKey] = errors;
        //         return prev;
        //       }, {});
        //     }
        //   });

        //   if (isCanSubmit) {
        //     const submitData = {} as any;

        //     const allEditStatus = {} as any;

        //     internalEditStatus.forEach((rowEditData, rowIndex) => {
        //       if (rowEditData && Object.keys(rowEditData).length) {
        //         allEditStatus[rowIndex] = rowEditData;
        //       }
        //     });

        //     Object.keys(allEditStatus).forEach((rowIndex) => {
        //       const rowEditData = allEditStatus[rowIndex];

        //       if (Object.keys(rowEditData).length) {
        //         submitData[rowIndex] = {};

        //         if (Object.keys(rowEditData).length) {
        //           Object.keys(rowEditData).forEach((columnKey) => {
        //             submitData[rowIndex][columnKey] = rowEditData[columnKey].value;
        //           });
        //         }
        //       }
        //     });

        //     resolve(submitData);
        //   } else {
        //     reject(validateErrors);
        //   }
        // });
      }),
    [confirmEdit, internalEditStatus]
  );

  const memoValue = useMemo(
    () => ({
      editStatus: internalEditStatus,
      // editStatusRef: internalEditStatusRef,
      getEditStatus,
      setEditStatus: setInternalEditStatus,
      depUpdatedCells,
      setDepUpdatedCells,
      getDepUpdatedCells,
      submit,
      restore,
      confirm: confirmEdit,
      getFieldsValue,
      setRowForm,
      rowForm,
    }),
    [
      internalEditStatus,
      getEditStatus,
      setInternalEditStatus,
      depUpdatedCells,
      setDepUpdatedCells,
      getDepUpdatedCells,
      submit,
      restore,
      confirmEdit,
      getFieldsValue,
      rowForm,
    ]
  );

  useEffect(() => {
    function handleKeyDown(e: any) {
      if (e.keyCode === 27) {
        confirmEdit();
      }
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [confirmEdit]);

  return <EditContext.Provider value={memoValue}>{children}</EditContext.Provider>;
};

export function useEditContext() {
  const context = React.useContext(EditContext);
  if (context === undefined) {
    throw new Error(` useEdit must be used within a Provider`);
  }
  return context;
}
