import _, {uniqBy} from 'lodash';
import {
    getTreeByEnterpriseId,
    getOrganizationInfoById,
    getSonOrgByOrgID,
    getOrganizationTemplateByOrgId,
    getDeviceListByOrgId,
    getOrgTemplateFieldByTemplateId,
    exportExcel,
    getThingTreeByEnterpriseId,
    getUserListByOrganizationWithName,
    exportOrgTemplate,
    delDevice,
    getOrgBindingFarmList,
    getDictDataListByTypeCode,
    getUserListByOrganization,
    checkRecursiveDelOrg,
    recursiveDelOrg,
    getSameLevelFlag,
} from '@services/organization_management';
import {deleteDictClass, deleteDictItems} from '@services/data_dict_config';
import {utils} from '@components/tree';
import {Modal, message} from 'antd';
import {logError, report} from '@/common/utils/clientAction';
import {PageProps} from '@gwaapp/ease';
import {DICT_TYPES} from '@/common/constant';
import {AppThunk} from '@/app/runtime';
import {i18nIns} from '@/app/i18n';
import test from 'node:test';
import {subjoinExtraProps, changeFarmName, setSameLeveFlag} from './helper';

const {t} = i18nIns;

const {tree2Flat, loopToAntdTreeData} = utils;

/**
 * 获取场站信息
 * @param props
 * @returns
 */

export const getFarmListAjax =
    (
        props:
            | PageProps
            | {
                  id: string;
              },
        selectedFarmList,
        type,
    ): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props; // const {selectedTreeNode, dictTypeMapById} = getPageState(getState(), id);

        const actions = getPageSimpleActions(id);
        try {
            const {data} = await getOrgBindingFarmList(
                {
                    type: 'thing_farm',
                },
                {
                    conditions: [
                        {
                            condition: 'LIKE',
                            field: 'name',
                            type: 'thing',
                            value: '',
                        },
                    ],
                },
            );

            const myData = uniqBy(data, 'customerId');
            dispatch(
                actions.set({
                    farmList: [],
                }),
            );

            if (data) {
                myData.forEach((item) => {
                    item.value = item.customerId;
                    item.label = item.name;
                    if (type === 'add') {
                        item.disabled = item.enable;
                    } else {
                        if (selectedFarmList.indexOf(item.customerId) > -1) {
                            item.disabled = false;
                        } else {
                            item.disabled = item.enable;
                        }
                    }
                });
                dispatch(
                    actions.set({
                        farmList: myData,
                    }),
                );
            }
        } catch (error: any) {
            logError({
                error,
            });
        }
    };
/**
 * 获取用户信息
 * @param props
 * @returns
 */

export const fetchUserListByOrganizationWithName =
    (props: PageProps, type: number): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {selectedTreeNode} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);

        if (type) {
            try {
                const {key} = selectedTreeNode;
                const {data} = await getUserListByOrganizationWithName({
                    orgId: key,
                });

                if (data) {
                    const myData = JSON.parse(JSON.stringify(data));
                    myData.forEach(
                        (item: {
                            organizationName: any;
                            organization: {
                                name: any;
                            };
                        }) => {
                            item.organizationName =
                                item.organization && item.organization.name;
                        },
                    ); // 全量用户

                    dispatch(
                        actions.set({
                            linkedUsers: myData,
                        }),
                    );
                    dispatch(
                        actions.set({
                            userTableSource: myData,
                        }),
                    );
                }
            } catch (error: any) {
                logError({
                    error,
                });
            }
        } else {
            try {
                const {key} = selectedTreeNode;
                const {data} = await getUserListByOrganization(
                    {
                        retPassword: false,
                    },
                    {
                        all: true,
                        conditions: [
                            {
                                condition: 'NE',
                                field: 'organizationID',
                                value: key,
                                valueType: 'STRING',
                            },
                        ],
                        resultFields: ['ORGANIZATION'],
                    },
                );

                if (data.list) {
                    data.list.forEach((item: any) => {
                        item.organizationName = item.organization.name;
                    });
                    dispatch(
                        actions.set({
                            unlinkedUsers: data.list,
                        }),
                    );
                }
            } catch (error: any) {
                logError({
                    error,
                });
            }
        }
    };
/**
 * 删除电场绑定设备
 * @param props
 * @returns
 */

export const deleteBindDevice =
    (props: PageProps, record: any): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {tableDataSource} = getPageState(getState(), id);
        const myTableDataSource = JSON.parse(JSON.stringify(tableDataSource));

        try {
            const {code}: any = await delDevice({
                orgId: record.orgId,
                deviceId: record.deviceId,
            });

            if (code === '200') {
                message.success(t('删除成功'), 2);

                for (let i = tableDataSource.length - 1; i >= 0; i -= 1) {
                    if (tableDataSource[i].deviceId === record.deviceId) {
                        myTableDataSource.splice(i, 1);
                    }
                }

                dispatch(
                    actions.set({
                        tableDataSource: myTableDataSource,
                    }),
                );
            }
        } catch (error: any) {
            logError({
                error,
            });
        }
    };
/**
 * 初始化弹框数据
 * @param props
 * @param deviceTableShow
 * @returns
 */

export const initModalData =
    (props: PageProps): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id); // 清空actionCount

        const initDataObj = {
            leftSelectedKeys: [],
            leftSearchName: '',
            rightSelectedKeys: [],
            rightSearchName: '',
            actionCount: 0,
            selectedTreeNodeInModal: [],
            expandedTreeKeysInModal: [],
            selectedDeviceList: [],
            unSelectedDeviceList: [],
        };
        dispatch(actions.set(initDataObj));
    };
/**
 * 切换展示物理设备
 * @param props
 * @param deviceTableShow
 * @returns
 */

export const toggleDeviceTable =
    (props: PageProps, deviceTableShow: boolean): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        dispatch(
            actions.set({
                deviceTableShow: !deviceTableShow,
            }),
        );
    };
/**
 * 切换展示哦用户
 * @param props
 * @param deviceTableShow
 * @returns
 */

export const toggleUserTable =
    (props: PageProps, userTableShow: boolean): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        dispatch(
            actions.set({
                userTableShow: !userTableShow,
            }),
        );
    };
/**
 * 导出组织机构数据
 * @param props
 * @returns
 */

export const exportOrgDetail =
    (props: PageProps): AppThunk =>
    async (dispatch, getState, {getPageState}) => {
        const {id} = props;
        const {selectedTreeNode} = getPageState(getState(), id);

        if (selectedTreeNode) {
            const action = {
                id: 'exportOrg',
                module: id,
                desc: `${t('导出组织机构数据')}：${selectedTreeNode.name}`,
            };

            try {
                const {key} = selectedTreeNode;
                const params = {
                    orgId: key,
                    proCode: 'OC',
                };
                await exportExcel(params);
                report.success(action);
            } catch (error: any) {
                report.fail(action);
                logError({
                    error,
                });
            }
        }
    };
/**
 * 业务电场ID查询属于它的所有设备信息
 * @param props
 * @returns
 */

export const getDeviceListByOrgIdAjax =
    (
        props:
            | PageProps
            | {
                  id: string;
              },
    ): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {selectedTreeNode, orgInfo} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);

        if (
            selectedTreeNode &&
            orgInfo.platformOrganization &&
            Number(orgInfo.platformOrganization.type) === 170
        ) {
            try {
                const {key, thingId} = selectedTreeNode;
                dispatch(
                    actions.set({
                        isTableLoading: true,
                    }),
                );
                const {data}: any = await getDeviceListByOrgId({
                    orgid: key,
                    farmThingId: thingId,
                    proCode: 'OC',
                });

                if (data) {
                    const tableObj = {
                        isTableLoading: false,
                        tableDataSource: data.selectedDeviceList,
                    };
                    dispatch(actions.set(tableObj));
                }
            } catch (error: any) {
                const tableObj = {
                    isTableLoading: false,
                    tableDataSource: [],
                };
                dispatch(actions.set(tableObj));
                logError({
                    error,
                });
            }
        }
    };
/**
 * 根据左侧树选中节点获取信息
 * @param props
 * @returns
 */

const initOrgInfo =
    (
        props:
            | PageProps
            | {
                  id: string;
              },
        type: string,
    ): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {selectedTreeNode} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);

        if (selectedTreeNode) {
            const action = {
                id: 'searchOrg',
                module: id,
                desc: `${selectedTreeNode.name}${t('查询')}`,
            };

            try {
                const {key} = selectedTreeNode;
                const params = {
                    proCode: 'OC',
                    orgId: key,
                };
                const {data} = await getOrganizationInfoById(params);

                if (data) {
                    report.success(action); // 保存数据结构

                    if (type === 'add') {
                        dispatch(
                            actions.set({
                                orgInfo: data,
                                dynamicRow: [],
                            }),
                        );
                    } else {
                        data.fieldList.forEach((item) => {
                            if (item.fieldName === t('映射的物理电场')) {
                                item.fieldValue =
                                    item.fieldValue &&
                                    item.fieldValue.length > 0
                                        ? item.fieldValue.split(',')
                                        : [];
                            }
                        });
                        dispatch(
                            actions.set({
                                orgInfo: data,
                                dynamicRow: data.fieldList,
                            }),
                        );
                    } // 获取物理设备信息

                    dispatch(getDeviceListByOrgIdAjax(props));
                    // 获取物理电场
                    const selectFarmList = data.businessOrganizationVO.farmId
                        ? data.businessOrganizationVO.farmId.split(',')
                        : [];

                    if (type === 'edit' && selectFarmList.length > 0) {
                        dispatch(getFarmListAjax(props, selectFarmList, type));
                    }
                } else {
                    report.fail(action);
                }
            } catch (error: any) {
                report.fail(action);
                logError({
                    error,
                });
            }
        }
    };
/**
 * 获取子级信息
 * @param props
 * @returns
 */

const initOrgSonInfo =
    (
        props:
            | PageProps
            | {
                  id: string;
              },
    ): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {selectedTreeNode} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);

        if (selectedTreeNode) {
            dispatch(
                actions.set({
                    loading: true,
                }),
            );

            try {
                const {key} = selectedTreeNode;
                const {data} = await getSonOrgByOrgID({
                    orgId: key,
                    proCode: 'OC',
                });

                if (data) {
                    dispatch(
                        actions.set({
                            orgSonList: data,
                            loading: false,
                        }),
                    );
                }
            } catch (error: any) {
                logError({
                    error,
                });
            }
        }
    };

/**
 * 初始化物理组织机构树
 * @param props
 * @returns
 */

export const initThingOrgTree =
    (props: PageProps): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {selectedTreeNode, expandedTreeKeys, tableDataSource} =
            getPageState(getState(), id);
        const params = {
            proCode: 'OC',
        };
        dispatch(
            actions.set({
                farmTreeLoading: true,
            }),
        );

        try {
            const {data} = await getThingTreeByEnterpriseId(params);

            if (typeof data === 'undefined') {
                logError({
                    msg: '接口错误: data字段缺失.',
                });
                return;
            }
            const dataList = changeFarmName(data);
            const dictTypeTree = loopToAntdTreeData({
                treeData: dataList,
                keyPropName: 'orgId',
                titlePropName: 'title',
                needAttachIndexParentKey: true,
            });
            const flatTreeDataMap = tree2Flat({
                treeData: dictTypeTree,
                keyPropName: 'orgId',
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
            } // 保存设备划拨弹框的树状图

            dispatch(
                actions.set({
                    deviceTableDataSource: dictTypeTree,
                    farmTreeLoading: false,
                }),
            );
            // 初始化弹框内容

            const needSetObjs = {
                selectedDeviceList: tableDataSource,
                unSelectedDeviceList: [],
                totalSelectedDeviceList: tableDataSource,
                totalUnSelectedDeviceList: [],
            };
            dispatch(actions.set(needSetObjs));
        } catch (error: any) {
            logError({
                error,
            });
        }
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
        dispatch(initOrgInfo(props, ''));
    };

/**
 * 获取场站信息
 * @param props
 * @returns
 */

export const getDictDataTreeVOByTypeCodeAjax =
    (
        props:
            | PageProps
            | {
                  id: string;
              },
    ): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props; // const {selectedTreeNode, dictTypeMapById} = getPageState(getState(), id);

        const actions = getPageSimpleActions(id);

        try {
            const {data} = await getDictDataListByTypeCode({
                typeCode: 'FARM_TYPE',
            });

            if (data) {
                data.forEach((item) => {
                    item.dictdataValue = item.dictdataValue.toString();
                });
                dispatch(
                    actions.set({
                        farmTypeList: data.filter((v) => v.dictdataIsenabled),
                    }),
                );
            }
        } catch (error: any) {
            logError({
                error,
            });
        }
    };
/**
 * 获取模板信息
 * @param props
 * @returns
 */

export const getOrgTemplateByOrgId =
    (
        props:
            | PageProps
            | {
                  id: string;
              },
        actionType: string,
    ): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {selectedTreeNode, sameLevelFlag} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);
        let mySameLevelFlag = false;
        if (actionType === 'add') {
            if (sameLevelFlag) {
                mySameLevelFlag =
                    selectedTreeNode.type === '170' ? sameLevelFlag : false;
            }
        } else {
            mySameLevelFlag = true;
        }
        // const selectFarmList = orgInfo.businessOrganizationVO?.farmId
        //     ? orgInfo.businessOrganizationVO?.farmId.split(',')
        //     : [];
        if (selectedTreeNode) {
            try {
                const {data} = await getOrganizationTemplateByOrgId({
                    pOrgId: selectedTreeNode.key,
                    sameLevelFlag: mySameLevelFlag,
                });

                if (data) {
                    dispatch(
                        actions.set({
                            orgTemplateList: data,
                        }),
                    );
                    // dispatch(
                    //     getFarmListAjax(props, selectFarmList, actionType),
                    // );
                }
            } catch (error: any) {
                logError({
                    error,
                });
            }
        }
    };
/**
 * 跳转treeNode
 * @param props
 * @returns
 */

export const jumpTreeNode =
    (props: PageProps, record: any): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {selectedTreeNode} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);
        const selectedNode = {...selectedTreeNode, key: record.id};
        dispatch(
            actions.set({
                selectedTreeNode: selectedNode,
            }),
        ); // 获取节点信息

        dispatch(initOrgInfo(props, '')); // 获取子节点信息

        dispatch(initOrgSonInfo(props));
    };
/**
 * 返回上一级
 * @param props
 * @returns
 */

export const backToFather =
    (props: PageProps, record: any): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const selectedNode = {...record, key: record.id, isRight: 1};
        dispatch(
            actions.set({
                selectedTreeNode: selectedNode,
            }),
        ); // 获取节点信息

        dispatch(initOrgInfo(props, '')); // 获取子节点信息

        dispatch(initOrgSonInfo(props));
    }; // 下载导入组织模板

export const downLoadTemplate =
    (props: PageProps): AppThunk =>
    async () => {
        const {id} = props;
        const action = {
            id: 'exportTemplate',
            module: id,
            desc: `${t('模板下载')}`,
        };

        try {
            await exportOrgTemplate();
            message.success(`${t('下载成功')}`, 2);
            report.success(action);
        } catch (error: any) {
            logError({
                error,
            });
            report.fail(action);
        }
    };
/**
 * 根据选择的组织模板Id获取组织模板字段信息
 * @param props
 * @returns
 */

export const getTemplateDetail =
    (
        props:
            | PageProps
            | {
                  id: string;
              },
        templateId: any,
    ): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);

        try {
            const {data} = await getOrgTemplateFieldByTemplateId(templateId);

            if (data) {
                dispatch(
                    actions.set({
                        dynamicRow: data,
                    }),
                );
            }
        } catch (error: any) {
            logError({
                error,
            });
        }
    };

/**
 * 页面请求包-请求设备信息，自组织在机构信息
 * @param props
 * @returns
 */

export const orgAjaxBox =
    (props: PageProps, type: string): AppThunk =>
    (dispatch) => {
        dispatch(initOrgInfo(props, type));
        dispatch(initOrgSonInfo(props));
        dispatch(fetchUserListByOrganizationWithName(props, 1));
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
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);

        if (!selectedNodes.length) {
            return;
        }

        if (!selectedNodes[0].isRight) {
            return;
        }

        const selectedTreeNode = _.omit(selectedNodes[0], ['dicttypeName']);

        dispatch(
            actions.set({
                selectedTreeNode,
            }),
        ); // eslint-disable-next-line @typescript-eslint/no-use-before-define

        dispatch(orgAjaxBox(props, ''));
    };

/**
 * 初始化组织机构树
 * @param props
 * @returns
 */
export const initOrgTree =
    (props: PageProps): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {selectedTreeNode, expandedTreeKeys, sameLevelFlag} =
            getPageState(getState(), id);

        report.action({
            id: 'searchOrgTree',
            module: props.id,
            position: [props.menu?.menuName ?? '', t('获取组织机构树')],
            action: 'query',
            wait: true,
        });
        const action = {
            id: 'searchOrgTree',
            module: id,
            desc: `${t('获取组织机构树')}`,
        };
        const params = {
            // proCode: currentSubSystem?.code,
            proCode: 'OC',
        };

        try {
            const {data} = await getTreeByEnterpriseId(params);

            if (typeof data === 'undefined') {
                logError({
                    msg: '接口错误: data字段缺失.',
                });
                return;
            }
            const loop = (myData: any[]) => {
                const test: any[] = [];
                myData.forEach((ele) => {
                    const sEle = {
                        value: ele?.id,
                        title: ele?.name,
                        key: ele?.id,
                        isRight: ele?.isRight,
                        disabled: !ele?.isRight,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        children: loop(ele?.children ? ele?.children : []),
                    };
                    test.push(sEle);
                });
                return test;
            };
            const dataList = setSameLeveFlag(data, sameLevelFlag);
            const dictTypeTree = loopToAntdTreeData({
                treeData: dataList,
                keyPropName: 'id',
                titlePropName: 'name',
                attachNodeProps: subjoinExtraProps,
                needAttachIndexParentKey: true,
            });
            const flatTreeDataMap = tree2Flat({
                treeData: dictTypeTree,
                keyPropName: 'id',
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
            }

            let selectedObj = {};

            for (const key in flatTreeDataMap) {
                if (flatTreeDataMap[key].isRight === 1) {
                    selectedObj = flatTreeDataMap[key];
                    break;
                }
            } // 如果没有则是初始化场景

            if (!selectedTreeNode) {
                tempState.selectedTreeNode = dictTypeTree.length
                    ? selectedObj
                    : null;
            }

            dispatch(actions.set(tempState)); // 获取节点信息
            // eslint-disable-next-line @typescript-eslint/no-use-before-define

            dispatch(orgAjaxBox(props, '')); // 发送日志数据

            report.success(action); // // 获取模板列表
            dispatch(getOrgTemplateByOrgId(props, 'edit'));
        } catch (error: any) {
            report.fail(action);
            logError({
                error,
            });
        }
    };
/**
 * 获取sameLeveFlag
 * @param props
 * @param record
 * @returns
 */

export const thunkGetSameLevelFlag =
    (props: PageProps): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions, getPageState}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        try {
            const {code, data} = await getSameLevelFlag(
                'ADD_SAME_LEVEL_ORG_FLAG',
            );
            if (code === '200') {
                const sameLevelFlag = data.dconfigValue === '1';
                dispatch(
                    actions.set({
                        sameLevelFlag,
                    }),
                );
                dispatch(initOrgTree(props));
            }
        } catch (error: any) {
            logError(error);
        }
    };

/**
 * 页面初始化
 * @param props
 * @returns
 */

export const onInit =
    (props: PageProps): AppThunk =>
    (dispatch) => {
        dispatch(initThingOrgTree(props));
        dispatch(fetchUserListByOrganizationWithName(props, 0));
        dispatch(getFarmListAjax(props, [], ''));
        dispatch(getDictDataTreeVOByTypeCodeAjax(props));
        dispatch(thunkGetSameLevelFlag(props));
    };

/**
 * 批量删除
 * @param props
 * @returns
 */
export const batchDelete =
    (props: PageProps, record?: any, type?: number): AppThunk =>
    async (dispatch, getState, {getPageState}) => {
        const {id} = props;
        const {selectedRowKeys} = getPageState(getState(), id);
        let service = deleteDictClass;
        let waitForDeleteItems = ''; // 删除字典, 只需要刷新字典数据

        let isRefreshTree = true; // 单项删除

        if (record) {
            if (type === DICT_TYPES.dict.key) {
                service = deleteDictItems;
                isRefreshTree = false;
                waitForDeleteItems = record.dictdataId;
            } else {
                waitForDeleteItems = record.dicttypeId;
            }
        } // 批量删除
        else {
            if (!selectedRowKeys.length) {
                Modal.warning({
                    title: '请选择要删除的内容.',
                });
                return;
            }

            isRefreshTree = false;
            service = deleteDictItems;
            waitForDeleteItems = selectedRowKeys.join(',');
        }

        Modal.confirm({
            title: t('确定要删除吗'),
            onOk: async () => {
                try {
                    const {code} = await service(waitForDeleteItems);

                    if (code === '200') {
                        Modal.success({
                            title: t('删除成功'),
                        });

                        if (isRefreshTree) {
                            dispatch(initOrgTree(props));
                        } else {
                            dispatch(initOrgInfo(props, ''));
                        }
                    }
                } catch (error: any) {
                    logError(error);
                }
            },
        });
    };

/**
 * 删除子组织机构-校验
 * @param props
 * @param record
 * @returns
 */

export const deleteCards =
    (props: PageProps, record: any, index: number): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions, getPageState}) => {
        const {id} = props;
        const {dictTypeMap} = getPageState(getState(), id);
        const action = {
            id: 'deleteOrg',
            module: id,
            desc: `${t('删除组织机构')}：${record.name}`,
        };
        const recordChildren = !!(
            dictTypeMap[record.id].children &&
            dictTypeMap[record.id].children.length > 0
        );

        Modal.confirm({
            title: recordChildren
                ? `${t('是否级联删除子组织机构')}？`
                : `${t('是否确定删除选中的组织机构')}？`,
            onOk: async () => {
                try {
                    const {code, data} = await checkRecursiveDelOrg(record.id);
                    const {stat_key, msg} = data;
                    if (code === '200') {
                        if (stat_key === 0) {
                            dispatch(deleteCardsAjax(props, record, index));
                        } else {
                            message.error(msg, 2);
                            report.fail(action);
                        }
                    } else {
                        report.fail(action);
                    }
                } catch (error: any) {
                    report.fail(action);
                    logError(error);
                }
            },
        });
    };

/**
 * 删除子组织机构-请求
 * @param props
 * @param record
 * @returns
 */

export const deleteCardsAjax =
    (props: PageProps, record: any, index: number): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions, getPageState}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {orgSonList} = getPageState(getState(), id);
        const myOrgSonList = JSON.parse(JSON.stringify(orgSonList));
        const action = {
            id: 'deleteOrg',
            module: id,
            desc: `${t('删除组织机构')}：${record.name}`,
        };
        try {
            const {code, data} = await recursiveDelOrg(record.id);
            if (code === '200') {
                if (data) {
                    myOrgSonList.splice(index, 1);
                    dispatch(
                        actions.set({
                            orgSonList: myOrgSonList,
                        }),
                    );
                    message.success(`${t('删除成功')}`, 2);

                    dispatch(initOrgTree(props));
                    report.fail(action);
                }
            }
            report.success(action);
        } catch (error: any) {
            logError(error);
            report.fail(action);
        }
    };
