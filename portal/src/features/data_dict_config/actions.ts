import _ from 'lodash';
import {message, Modal} from 'antd';
import {
    // fetchDictModelTree,
    // fetchDictModelVOPageByTypeCode,
    getDictDataTreePageByTypeCode,
    deleteDictClass,
    deleteDictItems,
    updateDictItem,
    fetchDictTypeTree,
} from '@services/data_dict_config';
import {utils} from '@components/tree';
import {report} from '@/common/utils/clientAction';
import {boolean2Int} from '@utils/boolean';
import {AppThunk} from '@/app/runtime';
import {PageProps} from '@gwaapp/ease';
import {DICT_TYPES} from '@/common/constant';
import {i18nIns} from '@/app/i18n';
import {subjoinExtraProps} from './helper';
import {LogActionID} from './types';

const {t} = i18nIns;

const {tree2Flat, loopToAntdTreeData} = utils;
/**
 * 根据左侧树选中节点获取列表数据
 * @param props
 * @returns
 */

export const initDictDataList =
    (
        props:
            | PageProps
            | {
                  id: string;
              },
    ): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {selectedTreeNode, dictTypeMapById, pagination} = getPageState(
            getState(),
            id,
        );
        const actions = getPageSimpleActions(id);

        if (selectedTreeNode) {
            const {key} = selectedTreeNode;
            const pageInfo = {
                pageNum: pagination.pageNumber,
                pageSize: pagination.pageSize,
            };
            const bodyData = {
                all: false,
                ...pageInfo,
            }; // 同时将选中项置空

            dispatch(
                actions.set({
                    isTableLoading: true,
                    selectedRowKeys: [],
                }),
            );
            const {data} = await getDictDataTreePageByTypeCode(key, bodyData);

            if (data) {
                const dictDataTree = loopToAntdTreeData({
                    treeData: data.list || [],
                    keyPropName: 'dictdataId',
                    titlePropName: 'dictdataName',
                    attachNodeProps: (item) => {
                        const {dicttypeId} = item;

                        if (dictTypeMapById[dicttypeId]) {
                            return {
                                dicttypeName: dictTypeMapById[dicttypeId].title,
                                type: DICT_TYPES.item.key,
                            };
                        }

                        return {};
                    },
                });
                const dictDataMapById = tree2Flat({
                    treeData: dictDataTree,
                    keyPropName: 'key',
                    toType: 'object',
                });
                dispatch(
                    actions.set({
                        tableDataSource: dictDataTree,
                        dictDataMapById,
                        isTableLoading: false,
                        pagination: {
                            pageNumber: pageInfo.pageNum,
                            pageSize: pageInfo.pageSize,
                            total: data.total,
                        },
                    }),
                );
            }
        }
    };
/**
 * 初始化字典树
 * @param props
 * @returns
 */

export const initDictTypeTree =
    (props: {id: string}): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {selectedTreeNode, expandedTreeKeys} = getPageState(
            getState(),
            id,
        );
        const {code, data} = await fetchDictTypeTree();

        if (code !== '200' || typeof data === 'undefined') {
            logError({
                msg: t('接口错误'),
            });
            return;
        }

        const dictTypeTree = loopToAntdTreeData({
            treeData: data,
            keyPropName: 'dicttypeCode',
            titlePropName: 'dicttypeName',
            attachNodeProps: subjoinExtraProps,
            needAttachIndexParentKey: true,
        });
        const flatTreeDataMap = tree2Flat({
            treeData: dictTypeTree,
            keyPropName: 'key',
            toType: 'object',
        });
        const flatTreeDataMapById = Object.values(flatTreeDataMap).reduce<
            Record<string, any>
        >((prev, curr: any) => ({...prev, [curr.dicttypeId]: curr}), {});
        const tempState: any = {
            dictTypeMap: flatTreeDataMap,
            dictTypeMapById: flatTreeDataMapById,
            dictTypeTree,
        };

        if (!expandedTreeKeys.length) {
            tempState.expandedTreeKeys = dictTypeTree.map(
                (node: any) => node.key,
            );
        } // 如果没有则是初始化场景

        if (!selectedTreeNode) {
            tempState.selectedTreeNode = dictTypeTree.length
                ? dictTypeTree[0]
                : null;
        }

        dispatch(actions.set(tempState));
        dispatch(initDictDataList(props));
    };
/**
 *
 * @param props
 * @param dictModelItem
 * @returns
 */

export const onTreeSelect =
    (
        props: PageProps,
        keys: (string | number)[],
        selectedNodes: any[],
    ): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {pagination} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);

        if (!selectedNodes.length) {
            return;
        }

        const selectedTreeNode = _.omit(selectedNodes[0], ['dicttypeName']);

        dispatch(
            actions.set({
                selectedTreeNode,
                pagination: {...pagination, pageNumber: 1},
            }),
        );
        dispatch(initDictDataList(props));
    };
/**
 * 批量删除
 * @param props
 * @returns
 */

export const batchDelete =
    (props: PageProps, record?: any, type?: number): AppThunk<Promise<void>> =>
    (dispatch, getState, {getPageState, getPageSimpleActions}) =>
        new Promise((resolve, reject) => {
            const {id} = props;
            const {selectedRowKeys, selectedTreeNode, tableDataSource} =
                getPageState(getState(), id);
            const actions = getPageSimpleActions(id);
            let service = deleteDictClass;
            let waitForDeleteItems = '';
            let action: any = null; // 删除字典, 只需要刷新字典数据

            let isRefreshTree = true; // 删除树节点, 当前选中既是删除则需要重置

            let isResetSelectedTreeNode = false; // 单项删除

            if (record) {
                if (type === DICT_TYPES.item.key) {
                    action = {
                        id: LogActionID.DeleteDict,
                        module: id,
                        desc: t('删除字典项：{{name}}', {
                            name: record.dictdataName,
                        }),
                    };
                    service = deleteDictItems;
                    isRefreshTree = false;
                    waitForDeleteItems = record.dictdataId;
                } else {
                    action = {
                        id: LogActionID.DeleteCategory,
                        module: id,
                        desc: t('删除分类：{{name}}', {
                            name: record.dicttypeName,
                        }),
                    };
                    waitForDeleteItems = record.dicttypeId;

                    if (
                        selectedTreeNode &&
                        selectedTreeNode.dicttypeId === record.dicttypeId
                    ) {
                        isResetSelectedTreeNode = true;
                    }
                }
            } // 批量删除
            else {
                if (!selectedRowKeys.length) {
                    // 请选择要删除的内容
                    message.warning(t('请选择要删除的选项'));
                    return;
                }

                let notAllowNum = 0;
                tableDataSource.forEach((item: any) => {
                    if (
                        item.dictdataIsenabled === 1 &&
                        selectedRowKeys.indexOf(item.dictdataId) >= 0
                    ) {
                        notAllowNum += 1;
                    }
                });

                if (notAllowNum >= 1) {
                    message.warning(t('不可删除启用状态的字典项'));
                    return;
                }

                isRefreshTree = false;
                service = deleteDictItems;
                waitForDeleteItems = selectedRowKeys.join(',');
                action = {
                    id: LogActionID.DeleteDict,
                    module: id,
                    desc: t('批量删除字典项：{{num}}条', {
                        num: selectedRowKeys.length,
                    }),
                };
            }

            Modal.confirm({
                title: t('是否确定删除选中的记录?'),
                onOk: async () => {
                    service(waitForDeleteItems)
                        .then(({code, msg}) => {
                            if (code === '200') {
                                report.success(action);
                                resolve();
                                message.success(t('删除成功'));

                                if (isRefreshTree) {
                                    if (isResetSelectedTreeNode) {
                                        dispatch(
                                            actions.set({
                                                selectedTreeNode: null,
                                            }),
                                        );
                                    }

                                    dispatch(initDictTypeTree(props));
                                } else {
                                    dispatch(initDictTypeTree(props));
                                    dispatch(initDictDataList(props));
                                }
                            } else {
                                report.fail(action);
                                Modal.error({
                                    title: msg,
                                });
                                reject();
                            }
                        })
                        .catch(() => {
                            report.fail(action);
                            reject();
                        });
                },
            });
        });
/**
 * 更新启用状态
 * @param props
 * @param record
 * @returns
 */

export const updateEnable =
    (props: PageProps, record: any, value: boolean): AppThunk<Promise<void>> =>
    (dispatch) =>
        new Promise((resolve, reject) => {
            const submitParams = {
                ...record,
                dictdataIsenabled: boolean2Int(value),
            };
            const action = {
                id: 'modifyDictStatus',
                module: props.id,
                desc: t('修改字典项状态：{{name}}', {
                    name: record.dictdataName,
                }),
            };
            updateDictItem(submitParams)
                .then(({code, msg}) => {
                    if (code === '200') {
                        message.success(t('更新成功'));
                        dispatch(initDictDataList(props));
                        resolve();
                        report.success(action);
                    } else {
                        Modal.error({
                            title: msg,
                        });
                        reject();
                        report.fail(action);
                    }
                })
                .catch((err) => {
                    report.fail(action);
                });
        });
/**
 * 页面初始化
 * @param props
 * @returns
 */

export const onInit =
    (props: PageProps): AppThunk =>
    (dispatch) => {
        dispatch(initDictTypeTree(props));
    };
