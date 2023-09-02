import {useGetState} from 'ahooks';
import {FormInstance, message} from 'antd';
import {cloneDeep} from 'lodash';
import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useLocale} from '../../../Runtime/App/LocaleProvider';
import {DEBOUNCE_EDIT_DELAY} from '../../constant';
import {DataSource, EditStatus, Submit, DepUpdatedCells} from '../../types';
// 转换result
const getResult = (
    resultPreArr: Record<string, any>[],
):
    | {
          status?: string;
          value?: any;
          reason?: {
              errorFields: {name: [string]; errors: string[]}[];
          };
      }[]
    | null => {
    const resultObj = resultPreArr[0].status === 'fulfilled' ? resultPreArr[0].value : resultPreArr[0].reason.values;
    let errorFieldsResultArr: ({name?: [string]; errors?: string[]} | undefined)[][] = [];
    let successResultArr = [];
    // 都成功
    const keyArr = Object.keys(resultObj);
    const valueArr = Object.values(resultObj);
    // 判断参数里面带不带"_"
    const indexArr = keyArr.map((item) => {
        const changeValuesArr = item.split('_');
        if (changeValuesArr.length > 2) {
            return Number(changeValuesArr.pop());
        }
        return Number(changeValuesArr[1]);
    });
    const nameArr = keyArr.map((item) => {
        const changeValuesArr = item.split('_');
        if (changeValuesArr.length > 2) {
            changeValuesArr.pop();
            return changeValuesArr.join('_');
        }
        return changeValuesArr[0];
    });
    const resultArr: Record<string, any>[] = [];
    let obj: Record<string, any> = {};
    indexArr.map((item, index) => {
        obj[nameArr[index]] = valueArr[index];
        resultArr[item] = obj;
        if (item !== indexArr[index + 1]) {
            obj = {};
        }
        return null;
    });
    // 失败
    if (resultPreArr[0].status === 'rejected') {
        const errorsFieldsArr: {
            errors: string[];
            name: string[];
        }[] = resultPreArr[0].reason.errorFields;
        const errIndexArr = errorsFieldsArr.map((item) => {
            const errValuesArr = item.name[0].split('_');
            if (errValuesArr.length > 2) {
                return Number(errValuesArr.pop());
            }
            return Number(errValuesArr[1]);
        });
        const errNameArr: [string][] = errorsFieldsArr.map((item) => {
            const errValuesArr = item.name[0].split('_');

            if (errValuesArr.length > 2) {
                errValuesArr.pop();
                return [errValuesArr.join('_')];
            }
            return [errValuesArr[0]];
        });
        const errtextArr = errorsFieldsArr.map((item) => item.errors);
        // 中间数组
        const errorFieldsArr: {name?: [string]; errors?: string[]}[][] = [];
        let errObj: {name?: [string]; errors?: string[]} = {};
        let midArr: {name?: [string]; errors?: string[]}[] = [];
        errIndexArr.map((item, index) => {
            errObj.name = errNameArr[index];
            errObj.errors = errtextArr[index];
            midArr.push(errObj);
            errorFieldsArr[item] = midArr;
            if (item !== errIndexArr[index + 1]) {
                midArr = [];
            }
            errObj = {};
            return null;
        });
        errorFieldsResultArr = Array.from(errorFieldsArr);
    }
    successResultArr = Array.from(resultArr).map((item, index) => {
        const result: {
            status: string;
            value?: any;
            reason?: {
                errorFields: {name: [string]; errors: string[]}[];
            };
        } = {
            status: '',
            value: {},
            reason: {
                errorFields: [],
            },
        };
        if (item && Object.values(item).includes(null)) {
            result.status = 'rejected';
            if (result.reason) result.reason.errorFields = errorFieldsResultArr[index] as {name: [string]; errors: string[]}[];
        } else if (item && !Object.values(item).includes(null)) {
            result.status = 'fulfilled';
            result.value = item;
            delete result.reason;
        } else {
            result.status = 'fulfilled';
            result.value = {};
            delete result.reason;
        }
        return result;
    });
    return successResultArr;
};

// 接口
interface EditContextValue {
    editStatus: EditStatus;
    setEditStatus: (editStatus: EditStatus) => void;
    getEditStatus: () => EditStatus;
    // editStatusRef: React.MutableRefObject<EditStatus>;

    depUpdatedCells: DepUpdatedCells;
    setDepUpdatedCells: (depUpdatedCells: DepUpdatedCells) => void;
    getDepUpdatedCells: () => DepUpdatedCells;

    tableForm: FormInstance | undefined;
    setTableForm: React.Dispatch<FormInstance>;
    confirm: (forbidExitEditStatus: boolean) => void;
    submit: Submit;
    restore: () => void;
    getFieldsValue: () => {editedData: any; dataSource?: DataSource; snapShoot?: DataSource};
}

export const EditContext = React.createContext<EditContextValue>({} as any);

interface EditWrapperProps {
    defaultEditStatus?: EditStatus;
    editStatus?: EditStatus;
    dataSource?: DataSource;
    onEdit?: (editStatus: EditStatus) => void;
}

const EMPTY: EditStatus = [];

export const EditVirtualWrapper: FC<EditWrapperProps> = ({defaultEditStatus, editStatus, dataSource, children, onEdit}) => {
    const noticeOnce = useRef(false);
    const [internalEditStatus, setEditStatus, getEditStatus] = useGetState<EditStatus>(defaultEditStatus || EMPTY);
    const [depUpdatedCells, setDepUpdatedCells, getDepUpdatedCells] = useGetState<DepUpdatedCells>([]);
    // const internalEditStatusRef = useRef<EditStatus>(defaultEditStatus || EMPTY);
    const [tableForm, setTableForm] = useState<FormInstance>();

    const locale = useLocale('Modal');

    useEffect(() => {
        if (typeof editStatus !== 'undefined') {
            const clone = cloneDeep(editStatus);
            setEditStatus(clone);
            // internalEditStatusRef.current = clone;
        }
    }, [editStatus, setEditStatus]);

    const setInternalEditStatus = useCallback(
        (status) => {
            if (!noticeOnce.current) {
                message.info(locale.quitEdit || '点击Esc退出表格编辑状态', 3);
                noticeOnce.current = true;
            }

            if (onEdit) {
                onEdit(status);
            } else {
                setEditStatus(status);
                // internalEditStatusRef.current = status;
            }
        },
        [locale.quitEdit, onEdit, setEditStatus],
    );

    // 获取当前数据
    const getFieldsValue = useCallback(() => {
        const snapShoot = cloneDeep(dataSource) as any;
        const editedData: {[key: string]: any} = [];
        internalEditStatus.forEach((rowEditData, rowIndex) => {
            // editedData[Number(rowIndex)] = {};
            if (rowEditData) {
                Object.keys(rowEditData).forEach((dataIndex) => {
                    if (!editedData[rowIndex]) {
                        editedData[rowIndex] = {};
                    }
                    editedData[rowIndex][dataIndex] = rowEditData[dataIndex].value;
                    snapShoot && snapShoot[rowIndex] && (snapShoot[rowIndex][dataIndex] = rowEditData[dataIndex].value);
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
                Promise.allSettled([tableForm?.validateFields()]).then(
                    (resultsObj: {status: string; value?: any; reason?: {errorFields: any[]}}[]) => {
                        // 错误
                        const validateErrors: any[] = [];
                        let isError = false;
                        let needRecord = false;
                        // 提交结果对或者错两种状态
                        const results = getResult(resultsObj);
                        // 处理数据
                        internalEditStatus.forEach((rowEditData, rowIndex) => {
                            const validateResult = (results && results[rowIndex]) || resultsObj[0];
                            if (rowEditData) {
                                // 列校验通过
                                if (validateResult?.status === 'fulfilled') {
                                    Object.keys(rowEditData).forEach((key) => {
                                        const {value, original, status, errors} = rowEditData[key];
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
                                        if (status === 'editing') {
                                            rowEditData[key].status = 'edited';
                                        }
                                    });
                                }
                                // 列校验不通过
                                else {
                                    const {errorFields} = validateResult.reason as any;

                                    const formErrorFields = errorFields.reduce((prev: any, {errors, name}: any) => {
                                        // TODO: 这里为什么是数组
                                        const dataKey = name[0];
                                        prev[dataKey] = errors;
                                        return prev;
                                    }, {});

                                    validateErrors[rowIndex] = formErrorFields;
                                    isError = true;

                                    Object.keys(rowEditData).forEach((key) => {
                                        const {value, original, status, errors = []} = rowEditData[key];
                                        const fieldErrors = formErrorFields[key] || [];

                                        // 修改过
                                        if (value !== original) {
                                            needRecord = true;
                                        }

                                        // 错误信息合并
                                        rowEditData[key].errors = Array.from(new Set([...errors, ...fieldErrors]));

                                        if (status === 'editing') {
                                            rowEditData[key].status = forbidExitEditStatus ? 'editing' : 'edited';
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
                    },
                );
            }),
        [internalEditStatus, tableForm, setInternalEditStatus],
    );

    // 重置
    const restore = useCallback(() => {
        tableForm?.resetFields();
        setInternalEditStatus([]);
    }, [tableForm, setInternalEditStatus]);

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
        [confirmEdit, internalEditStatus],
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
            setTableForm,
            tableForm,
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
            setTableForm,
            tableForm,
        ],
    );

    useEffect(() => {
        function handleKeyDown(e: any) {
            if (e.keyCode === 27) {
                confirmEdit();
            }
        }
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [confirmEdit]);

    return <EditContext.Provider value={memoValue}>{children}</EditContext.Provider>;
};

export function useEditVirtualContext() {
    const context = React.useContext(EditContext);
    if (context === undefined) {
        throw new Error(` useEdit must be used within a Provider`);
    }
    return context;
}
