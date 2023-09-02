/* eslint-disable @typescript-eslint/naming-convention */

/* eslint-disable no-underscore-dangle */
import {
    fetchRoleOrgIds,
    fetchHaveDataPrivilege,
    fetchRoleDevices,
    updateRoleDataPrivileges,
    insertRoleDataPurviewType,
    fetchAuthUserOrgTree,
} from '@services/role';
import {utils} from '@components/tree';
import React from 'react';
import {ORGANIZATION_TYPES} from '@common/constant';
import _ from 'lodash';
import {message} from 'antd';
import {AppThunk} from '@/app/runtime';
import {PageProps} from '@gwaapp/ease';
import {closeModal} from '@components/modal';
import {logError, report} from '@/common/utils/clientAction';
import {i18nIns} from '@/app/i18n';
import {SCOPES, CUSTOM_SCOPE, ALL_SYSTEM, generateUniqueId} from './constant';
import {memoTree2Flat} from './helper';
import {ROLE_COMPETENCE_MODAL_ID} from '../../constant';

const {t} = i18nIns;

const {loopToAntdTreeData} = utils;
export function reset(props: PageProps): AppThunk {
    return (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        dispatch(
            actions.set({
                resourceIds: [],
                menuResources: [],
                selectedMenuId: '',
                selectedResourceIds: [],
                selectedMenuIds: [],
                systems: [],
                orgIds: [],
                expandOrgKeys: [],
                devices: [],
                deviceIds: [],
                activeSystem: null,
                activeScope: null,
                activeKey: 'function',
                devicesCache: {},
                submitData: {},
                isPermissionEdited: {
                    function: false,
                    data: false,
                },
                submitStatus: {},
                orgsCache: {}, // roleOrgsCache: {},
            }),
        );
    };
} // 获取设备(角色 & 组织机构ID & 产品Code)

export function thunkRoleDevices(props: PageProps, record: any): AppThunk {
    return async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {
            activeSystem,
            selectedOrgId,
            devicesCache,
            deviceIds,
            submitData,
            isRecover,
        } = getPageState(getState(), id);
        const actions = getPageSimpleActions(id); // 没有选中的设备

        if (!selectedOrgId) {
            return;
        }

        const params = {
            proCode: activeSystem.code,
            orgId: selectedOrgId,
            roleId: record.id,
        };
        const {code, data} = await fetchRoleDevices(params);

        if (code === '200') {
            // 将数据中的业务ID覆盖原本的id,原本的是thingID, 业务上无用
            // 防御后端出错返回null
            const coverData = (data || []).map((item: any) => ({
                ...item,
                id: item.customerId,
            }));
            const state: any = {
                devices: coverData,
                devicesCache: {
                    ...devicesCache,
                    [generateUniqueId(activeSystem.code, selectedOrgId)]:
                        coverData,
                },
            }; // 恢复缓存

            const cache = submitData[activeSystem.code]; // 策略 1. 如果覆盖场景（没有缓存过系统操作，没有缓存过组织及切换），结果直接丢弃

            if (
                isRecover &&
                typeof cache === 'undefined' &&
                deviceIds[selectedOrgId] === 'undefined'
            ) {
                state.deviceIds = [];
            } // 策略 2. 切换系统恢复缓存场景
            else if (
                typeof cache !== 'undefined' &&
                typeof cache.deviceIds !== 'undefined'
            ) {
                state.deviceIds = cache.deviceIds;

                if (typeof cache.deviceIds[selectedOrgId] === 'undefined') {
                    state.deviceIds = {
                        ...state.deviceIds,
                        [selectedOrgId]: coverData
                            .filter((device: any) => device.haveRight)
                            .map((device: any) => device.id),
                    };
                }
            } // 策略 3. 切换组织恢复缓存场景
            else if (typeof deviceIds[selectedOrgId] !== 'undefined') {
                state.deviceIds = deviceIds;
            } // 策略 3. 新建
            else {
                state.deviceIds = {
                    ...deviceIds,
                    [selectedOrgId]: coverData
                        .filter((device: any) => device.haveRight)
                        .map((device: any) => device.id),
                };
            }

            dispatch(actions.set(state));
        }
    };
} // 获取系统全量的组织机构树
// TODO: 这里后期需要调整，不需要缓存了， 这里取的都是OC的组织机构树

export function thunkCodeOrgs(props: PageProps): AppThunk<Promise<void>> {
    return (dispatch, getState, {getPageState, getPageSimpleActions}) =>
        new Promise((resolve, reject) => {
            const {
                id,
                menu: {applicationCode},
            } = props; // const {userInfo} = getPageState(getState(), 'app');

            const {activeSystem, orgsCache} = getPageState(getState(), id);
            const actions = getPageSimpleActions(id);

            const generalHandler = (productOrgTree: any) => {
                const state: any = {
                    productOrgTree,
                }; // 记录全量系统对应组织树缓存

                state.orgsCache = {
                    ...orgsCache,
                    [applicationCode]: productOrgTree,
                };
                dispatch(actions.set(state));
            };

            if (activeSystem.id === ALL_SYSTEM.id) {
                resolve();
                return;
            }

            if (orgsCache[applicationCode]) {
                generalHandler(orgsCache[applicationCode]);
                resolve();
            } else {
                fetchAuthUserOrgTree({
                    proCode: applicationCode,
                })
                    .then((userOrgTreeResponse) => {
                        if (userOrgTreeResponse.code === '200') {
                            const productOrgTree = loopToAntdTreeData({
                                treeData: userOrgTreeResponse.data,
                                keyPropName: 'id',
                                titlePropName: 'name',
                                attachNodeProps: (item: any) => {
                                    const attachProps = {
                                        selectable: false,
                                        disableCheckbox: false,
                                    };

                                    if (item.type === ORGANIZATION_TYPES.farm) {
                                        attachProps.selectable = true;
                                    }

                                    if (!item.isRight) {
                                        attachProps.disableCheckbox = true;
                                    }

                                    return attachProps;
                                },
                            });
                            generalHandler(productOrgTree);
                            resolve();
                        } else {
                            reject(new Error(userOrgTreeResponse.msg));
                        }
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }
        });
} // 获取当前角色对应组织勾选信息

export function thunkRoleOrgs(props: PageProps, record: any): AppThunk {
    return async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {
            id,
            menu: {applicationCode},
        } = props;
        const {activeSystem, submitData, isRecover, orgsCache} = getPageState(
            getState(),
            id,
        );
        const actions = getPageSimpleActions(id);
        const cache = submitData[activeSystem.code];

        if (activeSystem.id === ALL_SYSTEM.id) {
            return;
        }

        const roleOrgIdsResponse = await fetchRoleOrgIds({
            roleId: record.id,
            proCode: activeSystem.code,
        });
        const state: any = {}; // 通用逻辑，处理展开和选中

        const generalHandler = () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const flatOrgs = memoTree2Flat(`${applicationCode}_map`, {
                treeData: orgsCache[applicationCode],
                toType: 'object',
            }); // 处理展开项 & 选中项
            // 当以存在勾选项

            if (roleOrgIdsResponse.data && roleOrgIdsResponse.data.length) {
                let expandOrgKeys: string[] = [];
                let firstFarm: any = null;
                roleOrgIdsResponse.data.forEach((orgId: string) => {
                    const orgItem = flatOrgs[orgId]; // 原则上这里是不应该取不到的，需要记录错误

                    if (orgItem) {
                        const {_treeKeys} = orgItem;
                        expandOrgKeys = [
                            ...expandOrgKeys,
                            ...[..._treeKeys].splice(0, _treeKeys.length - 1),
                        ];
                        !firstFarm &&
                            orgItem.type === ORGANIZATION_TYPES.farm &&
                            (firstFarm = orgItem);
                    } else {
                        logError({
                            msg: `角色管理-数据权限：已选组织机构中，组织机构树中没有找到该条组织机构：${orgId}`,
                        });
                    }
                });
                state.expandOrgKeys = Array.from(new Set(expandOrgKeys));

                if (firstFarm) {
                    state.selectedOrgId = firstFarm.id;
                }
            } // 当不存在勾选项
            else {
                // 初始化展开第一层节点
                orgsCache[applicationCode].length &&
                    (state.expandOrgKeys = [orgsCache[applicationCode][0].key]);
                const firstFarm = memoTree2Flat(applicationCode, {
                    treeData: orgsCache[applicationCode],
                    toType: 'array',
                }).find(({type}: any) => type === ORGANIZATION_TYPES.farm);

                if (firstFarm) {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    const {_treeKeys} = firstFarm;
                    state.expandOrgKeys = [..._treeKeys].splice(
                        0,
                        _treeKeys.length - 1,
                    ); // 获取第一个电场的设备勾选状态

                    state.selectedOrgId = firstFarm.id;
                }
            }
        }; // 获取组织机构勾选状态

        if (roleOrgIdsResponse.code === '200') {
            // 策略 1. 如果覆盖场景，结果直接丢弃
            if (isRecover && typeof cache === 'undefined') {
                state.orgIds = {
                    checked: [],
                    halfChecked: [],
                };
            } // 策略 2. 恢复缓存场景，使用缓存结果
            else if (
                typeof cache !== 'undefined' &&
                typeof cache.orgIds !== 'undefined'
            ) {
                const {orgIds} = cache;
                state.orgIds = orgIds;
            } // 策略 3. 新建场景，使用接口结果
            else {
                state.orgIds = {
                    checked: roleOrgIdsResponse.data,
                    halfChecked: [],
                }; // 对全选/半选分类
                // roleOrgIdsResponse.data.forEach((orgId: string) => {
                //   const org = flatOrgs[orgId];
                //   if (org) {
                //     if (typeof org.children === 'undefined') {
                //       state.orgIds.checked.push(orgId);
                //     } else {
                //       const childrenOrgIds = getAllTreeKeys({treeData: org.children});
                //       let notExitedCount = 0;
                //       for (const cOrgId of childrenOrgIds) {
                //         if (roleOrgIdsResponse.data.indexOf(cOrgId) < 0) {
                //           notExitedCount += 1;
                //         }
                //       }
                //       if (notExitedCount > 0 && notExitedCount !== childrenOrgIds.length) {
                //         state.orgIds.halfChecked.push(orgId);
                //       } else if (notExitedCount === 0) {
                //         state.orgIds.checked.push(orgId);
                //       } else {
                //         state.orgIds.checked.push(orgId);
                //       }
                //     }
                //   } else {
                //     state.orgIds.checked.push(orgId);
                //   }
                // });
            }

            generalHandler();
            dispatch(actions.set(state)); // 初始化请求选中电场的权限设备集合

            dispatch(thunkRoleDevices(props, record));
        }
    };
} // 切换系统

export function toggleSystem(
    props: PageProps,
    activeSystem: any,
    record: any,
): AppThunk {
    return (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {isRecover, submitData} = getPageState(getState(), id);
        const scopes =
            activeSystem.id === 'all'
                ? SCOPES.filter((v) => v.value !== CUSTOM_SCOPE.value)
                : SCOPES;
        const state: any = {
            activeSystem,
            scopes,
        };
        const cache = submitData[activeSystem.code]; // 策略 1. 如果覆盖场景，结果直接丢弃

        if (isRecover && typeof cache === 'undefined') {
            state.activeScope = null;
        } // 策略 2. 如果缓存场景，使用缓存
        else if (typeof cache !== 'undefined') {
            state.activeScope = submitData[activeSystem.code].scope;
        } // 策略 3.
        else {
            state.activeScope = CUSTOM_SCOPE;
        }

        dispatch(actions.set(state));
        dispatch(thunkCodeOrgs(props)).then(() => {
            dispatch(thunkRoleOrgs(props, record));
        });
    };
} // 切换范围

export function toggleScope(props: PageProps, value: number): AppThunk {
    return (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id); // const {activeSystem, submitData} = getPageState(getState(), id);

        const foundScope = SCOPES.find((scope) => scope.value === value);

        if (!foundScope) {
            return;
        } // const cloneSubmitData = _.cloneDeep(submitData);
        // if (typeof cloneSubmitData[activeSystem.code] === 'undefined') {
        //   cloneSubmitData[activeSystem.code] = {};
        // }
        // cloneSubmitData[activeSystem.code].scope = foundScope;

        dispatch(
            actions.set({
                activeScope: foundScope, // submitData: cloneSubmitData
            }),
        );
    };
} // 切换组织

export function selectOrg(
    props: PageProps,
    nextOrgId: React.Key,
    currDeviceIds: string[],
    record: any,
): AppThunk {
    return (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {selectedOrgId, deviceIds} = getPageState(getState(), id);
        const state: any = {
            deviceIds: {...deviceIds, [selectedOrgId]: currDeviceIds},
            selectedOrgId: nextOrgId,
        };
        dispatch(actions.set(state));
        dispatch(thunkRoleDevices(props, record)); // if (devicesCache[generateUniqueId(activeSystem.code, nextOrgId)]) {
        //   state.devices = devicesCache[generateUniqueId(activeSystem.code, nextOrgId)];
        //   dispatch(actions.set(state));
        // } else {
        //   dispatch(thunkRoleDevices(props, record));
        // }
    };
} // 修改编辑状态

export function restartEditStatus(props: PageProps, system: any): AppThunk {
    return (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {submitData, isPermissionEdited} = getPageState(getState(), id);

        const cloneIsPermissionEdited = _.cloneDeep(isPermissionEdited);

        const cloneSubmitData = _.cloneDeep(submitData);

        delete cloneSubmitData[system.code];
        cloneIsPermissionEdited.data[system.code] = false;

        if (
            Object.values(cloneIsPermissionEdited.data).filter((value) => value)
                .length === 0
        ) {
            cloneIsPermissionEdited.data = false;
        }

        dispatch(
            actions.set({
                submitData: cloneSubmitData,
                isPermissionEdited: cloneIsPermissionEdited,
            }),
        );
    };
} // 提交成功

export function submitSuccess(
    props: PageProps,
    system: any,
    record: any,
): AppThunk {
    return (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const appActions = getPageSimpleActions('app');
        const {submitData, isPermissionEdited, activeSystem, subSystems} =
            getPageState(getState(), id);
        // const {subSystems} = getPageState(getState(), 'app');

        const cloneIsPermissionEdited = _.cloneDeep(isPermissionEdited);

        const cloneSubmitData = _.cloneDeep(submitData);

        delete cloneSubmitData[system.code];
        cloneIsPermissionEdited.data[system.code] = false;

        if (
            Object.values(cloneIsPermissionEdited.data).filter((value) => value)
                .length === 0
        ) {
            cloneIsPermissionEdited.data = false;
        }

        const cloneSubmitStatus = _.cloneDeep(
            getPageState(getState(), id).submitStatus,
        );

        const {isBatchSubmit} = cloneSubmitStatus;
        const state: any = {};

        _.remove(cloneSubmitStatus.queue, (task) => task === system.code);

        if (cloneSubmitStatus.queue.length === 0) {
            cloneSubmitStatus.isSubmitting = false;
            dispatch(
                appActions.set({
                    isShowGlobalMask: false,
                }),
            ); // 关闭模态窗口

            if (isBatchSubmit) {
                dispatch(closeModal(ROLE_COMPETENCE_MODAL_ID));
                dispatch(reset(props));
            } // 当所有任务成功后,需要处理掉"全部"

            delete cloneIsPermissionEdited.all;
            delete cloneSubmitData.all;
            // subSystems中包含全量数据过滤内部权限数据gwFlag.value === 0
            const internalSystem: any = [];
            subSystems.forEach((item: any) => {
                if (item.gwFlag.value === 0) {
                    internalSystem.push(item);
                }
            });
            state.systems = internalSystem;
            // 删除可选系统中的"全部"

            state.isRecover = false; // 重置"覆盖"状态
            // 更新提交状态"队列"

            state.submitStatus = cloneSubmitStatus;
        } // 重新设置活跃系统

        if (
            state.systems &&
            !state.systems
                .map(({code}: any) => code)
                .includes(activeSystem.code) &&
            state.systems.length
        ) {
            state.activeSystem = state.systems[0];
        }

        dispatch(
            actions.set({
                isPermissionEdited: cloneIsPermissionEdited,
                submitData: cloneSubmitData,
                submitStatus: cloneSubmitStatus,
                ...state,
            }),
        );

        if (state.systems) {
            dispatch(
                toggleSystem(props, state.activeSystem || activeSystem, record),
            );
        }
    };
} // 提交系统

export function submitSystem(
    props: PageProps,
    system: any,
    record: any,
): AppThunk {
    return async (dispatch, getState, {getPageState}) => {
        const {
            id,
            menu: {applicationCode, menuName},
        } = props;
        report.action({
            id: 'dataPermissionAssignment',
            module: id,
            position: [menuName ?? '', t('权限分配'), t('保存')],
            action: 'modify',
            wait: true,
        });
        const action = {
            id: 'dataPermissionAssignment',
            module: id,
            desc: `${t('更新数据权限：')}${record?.name}`,
        };
        const {submitData, devicesCache} = getPageState(getState(), id);
        const {scope, deviceIds, orgIds} = submitData[system.code];

        if (system.code === ALL_SYSTEM.code) {
            const {code} = await insertRoleDataPurviewType({
                proCode: 'all',
                purviewTypeValue: scope.value,
                roleId: record.id,
            });
            if (code === '200') {
                report.success(action);
                message.info(`[${system.name}]${t('数据权限更新成功')}`);
                dispatch(submitSuccess(props, system, record));
            } else {
                report.fail(action);
            }
        } else if (scope.value === 3) {
            const {checked = [], halfChecked = []} = orgIds;
            const tempData: any = {
                productId: system.id,
                roleId: record.id,
                orgRightOrgIds: [...checked, ...halfChecked],
            };
            const devRightOrgIds: string[] = [];
            const exRightOrgFarmIds: string[] = [];
            const updateOrgDevicesDTOS: any[] = [];
            Object.keys(deviceIds).forEach((farmId: string) => {
                const tempDeviceIds = deviceIds[farmId];
                const devicesInFarm =
                    devicesCache[generateUniqueId(system.code, farmId)]; // 策略1: 如果数据全部排除

                if (tempDeviceIds.length === 0) {
                    exRightOrgFarmIds.push(farmId);
                    return;
                } // 策略2: 如果数据全部加入

                if (tempDeviceIds.length === devicesInFarm.length) {
                    devRightOrgIds.push(farmId);
                    return;
                } // 策略3: 修改数据大于设备数量一半 排除掉另外一半

                if (tempDeviceIds.length > devicesInFarm.length / 2) {
                    updateOrgDevicesDTOS.push({
                        orgId: farmId,
                        exCustomIds: _.difference(
                            devicesInFarm.map((device: any) => device.id),
                            tempDeviceIds,
                        ),
                    });
                } else {
                    updateOrgDevicesDTOS.push({
                        orgId: farmId,
                        inCustomIds: tempDeviceIds,
                    });
                }
            });
            tempData.hugeDevicesDTO = {
                devRightOrgIds,
                exRightOrgFarmIds,
                updateOrgDevicesDTOS,
            };
            const {code} = await updateRoleDataPrivileges(
                tempData,
                applicationCode,
            );
            if (code === '200') {
                report.success(action);
                message.info(`[${system.name}]${t('数据权限更新成功')}`);
                dispatch(submitSuccess(props, system, record));
            } else {
                report.fail(action);
            }
        } else {
            const {code} = await insertRoleDataPurviewType({
                proCode: system.code,
                purviewTypeValue: scope.value,
                roleId: record.id,
            });

            if (code === '200') {
                report.success(action);
                message.info(`[${system.name}]${t('数据权限更新成功')}`);
                dispatch(submitSuccess(props, system, record));
            } else {
                report.fail(action);
            }
        }
    };
} // 取消该系统的变化

export function cancelSystem(
    props: PageProps,
    system: any,
    record: any,
): AppThunk {
    return (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {submitData, activeSystem} = getPageState(getState(), id);
        const state: any = {};
        state.submitData = _.clone(submitData);
        delete state.submitData[system.code];
        dispatch(actions.set(state)); // 当前任然再编辑

        if (activeSystem.code === system.code) {
            // 当前系统数据重新请求
            dispatch(toggleSystem(props, system, record));
        }

        dispatch(restartEditStatus(props, system));
    };
} // 提交当前表单修改

export function submit(props: PageProps, values: any): AppThunk {
    return (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {
            selectedOrgId,
            activeSystem,
            deviceIds,
            submitData,
            activeScope,
        } = getPageState(getState(), id); // 当前系统未做任意修改

        if (!activeScope && !Object.keys(values).length) {
            return;
        }

        const submitSystemData: any = {
            scope: activeScope,
        };

        if (Object.keys(values).length > 0) {
            const tempDeviceIs = {
                ...deviceIds,
            };
            if (selectedOrgId) {
                tempDeviceIs[selectedOrgId] = values.deviceIds;
            }
            submitSystemData.deviceIds = tempDeviceIs;
            submitSystemData.orgIds = values.orgIds;
        }

        dispatch(
            actions.set({
                submitData: {
                    ...submitData,
                    [activeSystem.code]: submitSystemData,
                },
                // 内容压入缓存后, 初始化表单
                deviceIds: {},
                orgIds: {},
                activeScope: null,
            }),
        );
    };
} // 初始化

export function onInit(props: PageProps, record: any): AppThunk {
    return async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {subSystems} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id); // 判断是否配置过数据权限

        const {data} = await fetchHaveDataPrivilege(record.id);
        const isRecover = !data; // 只保留内部系统
        // 过滤掉不需要进行数据权限分配的子应用（目前仅有融合应用不需要分配）
        let systems = subSystems.filter(
            (system: any) =>
                system.gwFlag &&
                system.gwFlag.value === 0 &&
                system.code !== 'RHYY',
        );
        let activeSystem = null;

        if (isRecover) {
            systems = [ALL_SYSTEM, ...systems];
        }

        activeSystem = systems[0] || null;
        const activeScope = isRecover ? null : CUSTOM_SCOPE;
        dispatch(
            actions.set({
                activeSystem,
                isRecover,
                systems,
                activeScope,
                scopes:
                    activeSystem.id === 'all'
                        ? SCOPES.filter((v) => v.value !== CUSTOM_SCOPE.value)
                        : SCOPES, // submitData: {
                //   [activeSystem.code]: {
                //     scope: activeScope,
                //   },
                // },
            }),
        ); // 获取系统对应组织机构相关数据, 根据角色 & 用户ID & 产品Code

        dispatch(thunkCodeOrgs(props)).then(() => {
            dispatch(thunkRoleOrgs(props, record));
        });
    };
}
