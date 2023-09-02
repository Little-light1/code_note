import _ from 'lodash';
import {
    submitFunctionPrivilege,
    getRoleProductMenu,
    updateRoleProductMenu,
} from '@services/role';
import {
    fetchAuthMenuTree,
    fetchMenuResourceByMenuId,
    fetchBiResourceByMenuId,
    getMenuSourceByMenuRole,
} from '@services/resource';
import {message} from 'antd';
import {AppThunk} from '@/app/runtime';
import {utils} from '@components/tree';
import {sortByKey} from '@utils/sort';
import {PageProps} from '@gwaapp/ease';
import {closeModal} from '@/components/modal';
import {report} from '@/common/utils/clientAction';
import {i18nIns} from '@/app/i18n';
import {ROLE_COMPETENCE_MODAL_ID} from '../../constant';
import {mergeResource, filterMenus} from './utils';

const {t} = i18nIns;

const {loopToAntdTreeData, tree2Flat} = utils;
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
} // 数据准备

function getResourcesByMenu(props: PageProps): AppThunk {
    return (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const appState = getPageState(getState(), 'app');
        const actions = getPageSimpleActions(id);
        const {menuResources, menuResourceIds, resourceTypes} = mergeResource({
            menuResources: appState.menuResources,
            biResources: appState.biResources,
        });
        dispatch(
            actions.set({
                menuResources,
                menuResourceIds,
                resourceTypes,
            }),
        );
    };
}

// 获取该角色的所有功能权限的ids--菜单、资源、bi资源
export function fetchFunctionPrivilege({
    props,
    record,
}: {
    props: PageProps;
    record: any;
}): AppThunk {
    return async (dispatch, getState, {getPageSimpleActions, getPageState}) => {
        const {id} = props;
        const {menuResourceMap, biResourceMap} = getPageState(
            getState(),
            'app',
        );
        const {menus} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);
        dispatch(
            actions.set({
                isRoleLoading: true,
            }),
        );
        const {data} = await getRoleProductMenu({
            roleId: record.id,
        });

        if (data) {
            // 针对没有子节点的一级节点，需要将productId放入menuIds中，保证显示时能选中
            let menuIds: Array<any> = [];
            let mSourceIds: Array<any> = [];
            let bIMSourceIds: Array<any> = [];
            data.forEach((item, index) => {
                if (
                    item.menuIds &&
                    item.menuIds.length === 1 &&
                    item.menuIds[0] === 0
                ) {
                    menuIds = menuIds.concat(item.productId);
                } else {
                    menuIds = menuIds.concat(filterMenus(item.menuIds, menus));
                }
                mSourceIds = mSourceIds.concat(item.mSourceIds);
                bIMSourceIds = bIMSourceIds.concat(item.bIMSourceIds);
            });
            const uniqueBiIds = bIMSourceIds.reduce(
                (prev: string[], curr: string) => {
                    const resource = biResourceMap[curr];
                    if (resource) {
                        prev.push(`bi-$-${resource.bimsourceType}-$-${curr}`);
                    }

                    return prev;
                },
                [],
            );

            const uniqueSourceIds = mSourceIds.reduce(
                (prev: string[], curr: string) => {
                    const resource = menuResourceMap[curr];

                    if (resource) {
                        prev.push(`menu-$-${resource.msourceType}-$-${curr}`);
                    }

                    return prev;
                },
                [],
            );
            dispatch(
                actions.set({
                    isRoleLoading: false,
                    selectedMenuIds: menuIds,
                    selectedResourceIds: uniqueBiIds.concat(uniqueSourceIds),
                    bIMSourceIds,
                }),
            );
        }
    };
} // 根据菜单ID获取最新的资源信息

export function updateResources({
    props,
    selectedMenuId,
}: {
    props: PageProps;
    selectedMenuId: React.Key;
}): AppThunk {
    return async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        // const {userInfo} = getPageState(getState(), 'app');
        const {
            menuResources,
            menuResourceIds,
            selectedRecord,
            bIMSourceIds,
            selectedResourceIds,
        } = getPageState(getState(), id);
        const {data} = await getMenuSourceByMenuRole({
            menuId: selectedMenuId,
            roleId: selectedRecord.id,
        });
        const {biMenuSourceDTOS, menuSourceDTOS} = data;
        const {
            menuResources: menuResourcesWithCurrentMenu,
            menuResourceIds: menuResourceIdsWithCurrentMenu,
        } = mergeResource({
            menuResources: menuSourceDTOS,
            biResources: biMenuSourceDTOS,
        });
        const recordBIIds: any = [];
        bIMSourceIds.forEach((item2: any) => {
            biMenuSourceDTOS.forEach((item: any) => {
                if (item2 === item.bimsourceId) {
                    recordBIIds.push(
                        `bi-$-${item.bimsourceType}-$-${item.bimsourceId}`,
                    );
                }
            });
        });

        const actions = getPageSimpleActions(id);

        dispatch(
            actions.set({
                menuResources: {
                    ...menuResources,
                    ...menuResourcesWithCurrentMenu,
                },
                menuResourceIds: {
                    ...menuResourceIds,
                    ...menuResourceIdsWithCurrentMenu,
                }, // TODO: 这里暂时不会出现新的资源类型情况，不需要重复设置
                selectedResourceIds: recordBIIds.concat(selectedResourceIds),
                biMenuSourceDTOS,
            }),
        );
    };
} // 切换菜单

export function selectMenu({
    props,
    selectedMenuId,
    currentSelectedResourcesIds,
}: {
    props: PageProps;
    selectedMenuId: React.Key;
    currentSelectedResourcesIds: string[];
}): AppThunk {
    return (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {
            selectedResourceIds,
            selectedMenuId: prevSelectedMenuId,
            menuResourceIds,
        } = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);
        dispatch(
            actions.set({
                selectedMenuId,
            }),
        ); // 当前没有选中的菜单

        if (!selectedMenuId) return; // 找到菜单下所有的资源

        const resourceIdsInMenu = menuResourceIds[prevSelectedMenuId] || [];
        const clone = [...selectedResourceIds];

        _.remove(clone, (resourceId: string) =>
            resourceIdsInMenu.includes(resourceId),
        );

        dispatch(
            actions.set({
                selectedResourceIds: [...clone, ...currentSelectedResourcesIds],
            }),
        );
        dispatch(
            updateResources({
                props,
                selectedMenuId,
            }),
        );
    };
}

// 根据用户id获取资源
export function thunkGetMenuSourceByMenuRole({
    props,
    selectedMenuId,
}: {
    props: PageProps;
    selectedMenuId: React.Key;
}): AppThunk {
    return async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {selectedRecord, selectedResourceIds} = getPageState(
            getState(),
            id,
        );
        const {data} = await getMenuSourceByMenuRole({
            menuId: selectedMenuId,
            roleId: selectedRecord.id,
        });
        const {biMenuSourceDTOS} = data;
        const recordBIIds: any = [];
        biMenuSourceDTOS.forEach((item: any) => {
            recordBIIds.push(
                `bi-$-${item.bimsourceType}-$-${item.bimsourceId}`,
            );
        });
        const actions = getPageSimpleActions(id);
        dispatch(
            actions.set({
                selectedResourceIds: recordBIIds.concat(selectedResourceIds),
            }),
        );
    };
}

// 提交功能权限

interface SubmitProps {
    props: PageProps;
    values: {
        menuIds: number[];
        resourceIds: string[];
    };
    record: any;
}
export function submitFunctionPermission({
    props,
    values,
    record,
}: SubmitProps): AppThunk {
    return async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id, title, menu} = props;
        const {menuIds, resourceIds} = values;
        const {
            selectedResourceIds,
            selectedMenuId: prevSelectedMenuId,
            menuResourceIds,
            flatMenuMapById,
            menus,
            allSystemList,
            biMenuSourceDTOS,
        } = getPageState(getState(), id);
        const {biResourceMap, menuResourceMap} = getPageState(
            getState(),
            'app',
        );
        const actions = getPageSimpleActions(id);
        const appActions = getPageSimpleActions('app'); // 找到菜单下所有的资源

        const resourceIdsInMenu = menuResourceIds[prevSelectedMenuId] || [];
        const clone = [...selectedResourceIds];

        _.remove(clone, (resourceId: string) =>
            resourceIdsInMenu.includes(resourceId),
        );

        const allResourceIds = [...clone, ...resourceIds];
        const roleId = record.id;
        const tempSubmitData: {
            [key: string]: any;
        } = {};

        // 过滤掉所有非叶子结点 menuId包含系统id
        Array.from(new Set(menuIds)).forEach((menuId) => {
            const menu = flatMenuMapById[menuId];
            // 此处添加判断条件，过滤不是一级节点，并且不是叶子节点的节点
            if (
                menu &&
                typeof flatMenuMapById[menuId].children === 'undefined'
            ) {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                const {applicationCode} = menu;

                if (!tempSubmitData.hasOwnProperty(applicationCode)) {
                    tempSubmitData[applicationCode] = {
                        menuIds: [],
                        mSourceIds: [],
                        bIMSourceIds: [],
                    };
                }

                // 这里后段要求把父节点也提供
                // eslint-disable-next-line @typescript-eslint/naming-convention
                // const {_treeKeys} = menu;
                // const parentKeys = [..._treeKeys].splice(0, _treeKeys.length - 1);

                // 这里会把menu的父级结构也带上
                tempSubmitData[applicationCode].menuIds.push(menuId);
            } else if (menus.findIndex((i: any) => i.id === menuId) >= 0) {
                // 针对没有子节点的一级目录，menuIds固定上传[0]
                const index = menus.findIndex((i: any) => i.id === menuId);
                const applicationCode = menus[index].code;

                if (!tempSubmitData.hasOwnProperty(applicationCode)) {
                    tempSubmitData[applicationCode] = {
                        menuIds: [0],
                        mSourceIds: [],
                        bIMSourceIds: [],
                    };
                }
            } else {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                const {applicationCode} = menu;

                if (!tempSubmitData.hasOwnProperty(applicationCode)) {
                    tempSubmitData[applicationCode] = {
                        menuIds: [],
                        mSourceIds: [],
                        bIMSourceIds: [],
                    };
                }

                // 这里后段要求把父节点也提供
                // eslint-disable-next-line @typescript-eslint/naming-convention
                // const {_treeKeys} = menu;
                // const parentKeys = [..._treeKeys].splice(0, _treeKeys.length - 1);

                // 这里会把menu的父级结构也带上
                tempSubmitData[applicationCode].menuIds.push(menuId);
            }
        });

        allResourceIds.forEach((resourceId) => {
            const [resourceType, , rId] = resourceId.split('-$-');

            if (resourceType === 'bi') {
                // 根据菜单获取的BI资源过滤，不从app状态数获取
                // const resource = biResourceMap[rId];
                let biMenuSource;
                biMenuSourceDTOS.forEach((item: any) => {
                    if (Number(rId) === item.bimsourceId) {
                        biMenuSource = item;
                    }
                });
                if (biMenuSource) {
                    const {bimenuId} = biMenuSource;
                    const menu1 = flatMenuMapById[bimenuId];

                    if (menu1) {
                        const {applicationCode} = menu1;

                        if (!tempSubmitData.hasOwnProperty(applicationCode)) {
                            tempSubmitData[applicationCode] = {
                                menuIds: [],
                                mSourceIds: [],
                                bIMSourceIds: [],
                            };
                        }

                        tempSubmitData[applicationCode].bIMSourceIds.push(
                            Number(rId),
                        );
                    }
                }
            } else {
                const resource = menuResourceMap[rId];

                if (resource) {
                    const {menuId} = resource;
                    const menu = flatMenuMapById[menuId];

                    if (menu) {
                        const {applicationCode} = menu;

                        if (!tempSubmitData.hasOwnProperty(applicationCode)) {
                            tempSubmitData[applicationCode] = {
                                menuIds: [],
                                mSourceIds: [],
                                bIMSourceIds: [],
                            };
                        }

                        tempSubmitData[applicationCode].mSourceIds.push(
                            Number(rId),
                        );
                    }
                }
            }
        }); //

        const submitData = {
            roleId,
            roleFunPrivilegesDetails: Object.keys(tempSubmitData).map(
                (productCode: string) => {
                    const product = allSystemList.find(
                        (system) => system.code === productCode,
                    );
                    return {
                        productId: product.id,
                        ...tempSubmitData[productCode],
                    };
                },
            ),
        };
        report.action({
            id: 'functionPermissionAssignment',
            module: id,
            position: [menu?.menuName ?? '', t('权限分配'), t('保存')],
            action: 'modify',
            wait: true,
        });
        const action = {
            id: 'functionPermissionAssignment',
            module: id,
            desc: `${t('更新功能权限')}：${record?.name}`,
        };
        const {code} = await updateRoleProductMenu(submitData);
        if (code === '200') {
            report.success(action);
            message.info(t(`功能权限更新成功`));

            dispatch(
                actions.set({
                    isPermissionEdited: {
                        ...getPageState(getState(), id).isPermissionEdited,
                        function: false,
                    },
                }),
            );
        } else {
            report.fail(action);
        }
    };
} // 获取全量菜单信息

export function getMenuTree(props: PageProps, roleType: string): AppThunk {
    return async (dispatch, getState, {getPageSimpleActions}) => {
        const actions = getPageSimpleActions(props.id);
        const {code, data} = await fetchAuthMenuTree(0);

        dispatch(actions.set({allSystemList: data}));

        if (code === '200' && data) {
            // 子系统 & 菜单树
            let menus = data.map(({menuTreelVOS, id, name, ...args}) => ({
                id,
                key: id,
                title: name,
                children: loopToAntdTreeData({
                    treeData: menuTreelVOS || [],
                    keyPropName: 'menuId',
                    titlePropName: 'menuName',
                    attachNodeProps: (result) => ({
                        path: String(result.menuRoutingPath).trim(),
                    }),
                }),
                ...args,
            })); // 排序

            menus = menus.map((system: any) => ({
                ...system,
                children: sortByKey(system.children || [], 'menuSort', 'asc'),
            }));
            const flatMenuMapById = tree2Flat({
                treeData: menus.reduce(
                    (prev: any[], curr: any) => [...prev, ...curr.children],
                    [],
                ),
            }); // 处理不同角色类型菜单不可操作的逻辑

            const loopMenu = (menuData: any) => {
                const newData = menuData.map((ele: any) => ({
                    ...ele,
                    disabled: ele.menuType && roleType !== ele.menuType, // 没有menuType则是系统，非菜单
                    children: ele.children && loopMenu(ele.children),
                }));

                return newData;
            };

            menus = loopMenu(menus); // 增加一个只针对第一层系统级别的处理,下级没有菜单则不允许勾选

            dispatch(
                actions.set({
                    menus,
                    flatMenuMapById,
                    subSystems: data.map(({menuTreelVOS, ...args}) => ({
                        ...args,
                    })),
                }),
            );
        }
    };
} // 初始化

export function onInit(props: PageProps, record: any): AppThunk {
    return async (dispatch) => {
        const {roleType} = record;
        await dispatch(getMenuTree(props, roleType));
        await dispatch(getResourcesByMenu(props));
        await dispatch(
            fetchFunctionPrivilege({
                props,
                record,
            }),
        );
    };
}
