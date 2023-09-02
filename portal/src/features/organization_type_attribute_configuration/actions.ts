/*
 * @Author: mikey.zhaopeng
 * @Date: 2021-12-06 13:58:44
 * @Last Modified by: gongzunbao
 * @Last Modified time: 2023-07-21 14:14:15
 */
import {
    getOrgTemplateList,
    deleteOrgTemplate,
    deleteTemplateFields,
    deleteField,
    addOrgTemplateField,
    updateOrgTemplateField,
    getTemplateFieldPage,
    getDictDataListByTypeCode,
    getDicDataListByDicType,
} from '@services/organization_type_attribute_configuration';
import {message, Modal as AntdModal} from 'antd';
import {PageProps} from '@gwaapp/ease';
import {AppThunk} from '@/app/runtime';
import {report} from '@/common/utils/clientAction'; // 左侧模板列表数据获取
import {i18nIns} from '@/app/i18n';

const {t} = i18nIns;

export const tagsData =
    (props: PageProps): AppThunk =>
    (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {selectedTemplateId} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);
        getOrgTemplateList({
            all: true,
        }).then((res) => {
            if (res.code === '200') {
                const {list, msg} = res.data;

                if (list instanceof Array) {
                    const newData = list;
                    const hasSelectedTag = newData.find(
                        (tagData: any) => tagData.id === selectedTemplateId,
                    );
                    dispatch(
                        actions.set({
                            templateList: newData,
                        }),
                    );
                    if (!hasSelectedTag) {
                        dispatch(
                            actions.set({
                                pageSize: 20,
                                page: 1,
                                total: 0,
                                pageSizeDef: 20,
                                pageDef: 1,
                                totalDef: 0,
                                topListSource: [],
                                bottomListSource: [],
                            }),
                        );
                    }
                } else {
                    message.error(msg);
                }
            }
        });
    };

// 获取两个列表展示数据  默认的
export const listData =
    (props: PageProps): AppThunk =>
    (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {page, pageSize, selectedTemplateId} = getPageState(
            getState(),
            id,
        );
        const actions = getPageSimpleActions(id);
        getTemplateFieldPage({
            all: true,
            conditions: [
                {
                    condition: 'EQ',
                    field: 'isDefaultField',
                    value: '1',
                    valueType: 'STRING',
                },
                {
                    condition: 'EQ',
                    field: 'templateID',
                    value: selectedTemplateId,
                    valueType: 'STRING',
                },
            ],
            pageNum: page,
            pageSize,
        }).then((res) => {
            if (res.code === '200') {
                const {data, msg} = res;

                if (data.records instanceof Array) {
                    dispatch(
                        actions.set({
                            bottomListSource: data.records,
                            total: data.total,
                        }),
                    );
                } else {
                    message.error(msg);
                }
            }
        });
    };

// 获取两个列表展示数据  非默认的
export const noListData =
    (props: PageProps): AppThunk =>
    (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {pageDef, pageSizeDef, selectedTemplateId} = getPageState(
            getState(),
            id,
        );
        const actions = getPageSimpleActions(id);
        getTemplateFieldPage({
            all: true,
            conditions: [
                {
                    condition: 'EQ',
                    field: 'isDefaultField',
                    value: '0',
                    valueType: 'STRING',
                },
                {
                    condition: 'EQ',
                    field: 'templateID',
                    value: selectedTemplateId,
                    valueType: 'STRING',
                },
            ],
            pageNum: pageDef,
            pageSize: pageSizeDef,
        }).then((res) => {
            if (res.code === '200') {
                const {data, msg} = res;

                if (data.records instanceof Array) {
                    dispatch(
                        actions.set({
                            topListSource: data.records,
                            totalDef: data.total,
                        }),
                    );
                } else {
                    message.error(msg);
                }
            }
        });
    };

// 点击左侧icon删除
export const deleteOrganizationTemplate =
    (props: PageProps, id: any, name: any): AppThunk =>
    async (dispatch) => {
        const action = {
            id: 'addUpdate',
            module: 'organizationTypeConfiguration',
            desc: `${t('删除机构类型')}:${name}`,
        };
        AntdModal.confirm({
            title: t('您确定要删除这条记录吗?'),
            okText: t('确定'),
            cancelText: t('取消'),
            onOk: async () => {
                const {code} = await deleteOrgTemplate({
                    templateId: id,
                });

                if (code === '200') {
                    report.success(action);
                    message.success(t('删除成功'));
                    dispatch(tagsData(props));
                } else {
                    report.fail(action);
                }
            },
        });
    };

// 批量删除
export const deleteTemplate =
    (props: PageProps): AppThunk =>
    async (dispatch, getState, {getPageState}) => {
        const {id} = props;
        const {selectedRowKeys} = getPageState(getState(), id);

        if (!selectedRowKeys.length) {
            message.info(t('请选择要删除的字段'));
        } else {
            const action = {
                id: 'addUpdate',
                module: 'organizationTypeConfiguration',
                desc: t('删除多个控件名称'),
            };
            AntdModal.confirm({
                title:
                    selectedRowKeys.length === 1
                        ? t('您确定要删除这条记录吗?')
                        : t('您确定要删除这些记录吗?'),
                okText: t('确定'),
                cancelText: t('取消'),
                onOk: async () => {
                    const {code} = await deleteTemplateFields(selectedRowKeys);

                    if (code === '200') {
                        message.success(t('删除成功'));
                        dispatch(noListData(props));
                        report.success(action);
                    } else {
                        message.error(t('删除失败'));
                        report.fail(action);
                    }
                },
            });
        }
    };

// 列表删除
export const deleteData =
    (props: PageProps, record: any): AppThunk =>
    async (dispatch) => {
        // 操作结果埋点 desc描述信息id
        const action = {
            id: 'addUpdate',
            module: 'organizationTypeConfiguration',
            desc: `${t('删除') + t('控件名称')}：${record.fieldName}`,
        };
        AntdModal.confirm({
            title: t('您确定要删除这条记录吗?'),
            okText: t('确定'),
            cancelText: t('取消'),
            onOk: async () => {
                const {code} = await deleteField({
                    fieldId: record.id,
                });

                if (code === '200') {
                    report.success(action);
                    message.success(t('删除成功'));
                    dispatch(noListData(props));
                } else {
                    report.fail(action);
                }
            },
        });
    };

// 新增编辑
export const addSubmitData =
    (props: {
        values: any;
        modalType: any;
        selectedTemplateId: any;
    }): AppThunk<Promise<void>> =>
    (dispatch) =>
        new Promise((resolve, reject) => {
            const {
                modalType,
                selectedTemplateId,
                values,
                selectedNode,
                pageProps,
            } = props; // 操作结果埋点 desc描述信息id

            const action = {
                id: 'addUpdate',
                module: 'organizationTypeConfiguration',
                desc: t('{{verb}}控件名称:{{name}}', {
                    verb: modalType === 'add' ? t('新建') : t('编辑'),
                    name:
                        modalType === 'add'
                            ? `${t('新建') + t('控件名称')}：${
                                  values.fieldName
                              }`
                            : `${t('编辑') + t('控件名称')}：${
                                  selectedNode.fieldName
                              }`,
                }),
            };

            if (modalType === 'add') {
                const objList = {
                    dataType: values.dataType,
                    // 数据类型：int、boolean等；来自字典表
                    defaultValue: '',
                    // 默认值
                    fieldName: values.fieldName,
                    // 控件名称
                    fieldType: values.fieldType,
                    //  控件类型：文本、数字等；来自字典表
                    isNull: values.isNull,
                    // 是否必填
                    remark: values.remark,
                    // 描述
                    templateId: selectedTemplateId, // 组织模板ID
                };
                addOrgTemplateField(objList)
                    .then((res) => {
                        const {code, msg} = res;

                        if (code === '200') {
                            message.success(t('新增成功'));
                            dispatch(noListData(pageProps));
                            resolve();
                            report.success(action);
                        } else {
                            report.fail(action);
                            reject(new Error(msg));
                        }
                    })
                    .catch((err) => {
                        report.fail(action);
                        reject(err);
                    });
            } else {
                // 编辑
                const objDataApp = {
                    dataType: values.dataType,
                    defaultValue: '',
                    // 默认值
                    fieldName: values.fieldName,
                    // 字段名称
                    fieldType: values.fieldType,
                    //  控件类型：文本、数字等；来自字典表
                    id: selectedNode.id,
                    // 字段id
                    isNull: values.isNull,
                    // 是否必填
                    remark: values.remark,
                    // 描述
                    templateId: selectedNode.templateID, // 组织模板ID
                };
                updateOrgTemplateField(objDataApp)
                    .then((res) => {
                        const {code, msg} = res;

                        if (code === '200') {
                            message.success(t('编辑成功'));
                            dispatch(noListData(pageProps));
                            resolve();
                            report.success(action);
                        } else {
                            reject(new Error(msg));
                            report.fail(action);
                        }
                    })
                    .catch((err) => {
                        report.fail(action);
                        reject(err);
                    });
            }
        }); // 数据字典下拉框  机构类型

export const typeData =
    (props: PageProps): AppThunk =>
    (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        getDictDataListByTypeCode({typeCode: 'org'}).then((res) => {
            if (res.code === '200') {
                const {data, msg} = res;

                if (data instanceof Array) {
                    dispatch(
                        actions.set({
                            typeDataList: data.filter(
                                (v) => v.dictdataIsenabled,
                            ),
                        }),
                    );
                } else {
                    message.error(msg);
                }
            }
        });
    };
// 下拉框 控件类型
export const controlType =
    (props: PageProps): AppThunk =>
    (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        getDicDataListByDicType({
            all: true,
            conditions: [
                {
                    condition: 'EQ',
                    field: 'dictType',
                    value: 'ORGANIZATION_TEMPLATE_FIELD_TYPE',
                    valueType: 'STRING',
                },
            ],
        }).then((res) => {
            const {data, msg, code} = res;

            if (code === '200') {
                dispatch(
                    actions.set({
                        typeControlList: data.list,
                    }),
                );
            } else {
                message.error(msg);
            }
        });
    };
/**
 * 页面跳转
 * @param props
 * @param page
 * @param pageSize
 * @returns
 */

export const changePage =
    (props: PageProps, page: number, pageSize: number): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        dispatch(
            actions.set({
                page,
                pageSize,
            }),
        );
        dispatch(listData(props));
        dispatch(noListData(props));
    };
export const changePageDef =
    (props: PageProps, pageDef: number, pageSizeDef: number): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        dispatch(
            actions.set({
                pageSizeDef,
                pageDef,
            }),
        );
        dispatch(listData(props));
        dispatch(noListData(props));
    };
/**
 * 页面初始化
 * @param props
 * @returns
 */

export const onInit =
    (props: PageProps): AppThunk =>
    (dispatch) => {
        dispatch(tagsData(props));
        dispatch(typeData(props));
        dispatch(controlType(props));
    };
