/*
 * @Author: sun.t
 * @Date: 2021-12-14 17:10:18
 * @Last Modified by: gongzunbao
 * @Last Modified time: 2023-03-02 10:31:36
 */
import {
    fetchMenuByProdCode,
    fetchUpdateMenu,
    fetchDeleteMenu,
    getProductListByPage,
} from '@services/menu_management';
import {fetchMenuResourceByMenuId} from '@services/resource';
import {fetchDictModelVOPageByTypeCode} from '@services/data_dict_config';
import {message, Modal} from 'antd';
import {utils} from '@components/tree';
import {sortByKey} from '@utils/sort';
import {PageProps} from '@gwaapp/ease';
import {AppThunk} from '@/app/runtime';
import {boolean2Int} from '@/common/utils/boolean';
import {PAGE_RESOURCE_DICT_KEY} from '@/common/constant';
import {report} from '@/common/utils/clientAction';
import {i18nIns} from '@/app/i18n';
import {LogActionID, ProductItemModel} from './types';

const {t} = i18nIns;

const {loopToAntdTreeData, tree2Flat, filterData} = utils;

/**
 * 获取菜单列表
 * @param props
 * @returns
 */

export const asyncMenuList =
    (props: PageProps, prodCode?: string): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions, getPageState}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {currentTabKey, authProductList} = getPageState(getState(), id);
        const {userInfo} = getPageState(getState(), 'app');
        const {id: userId} = userInfo;
        const tempProdCode = prodCode || currentTabKey;
        dispatch(actions.setIsLoading(true));
        const {data, code} = await fetchMenuByProdCode(tempProdCode, userId);
        const sortData = sortByKey(data, 'menuSort', 'asc');

        if (code === '200' && sortData) {
            const tableDataSource = loopToAntdTreeData({
                treeData: sortData,
                keyPropName: 'menuId',
                titlePropName: 'menuName',
            }); // 附带产品作为根节点

            const product = authProductList.find(
                (system) => system.code === tempProdCode,
            );
            const menuTree = [
                {
                    key: tempProdCode,
                    title: product ? product.name : '',
                    type: 'product',
                    children: tableDataSource,
                },
            ]; // 扁平化结构方便读取

            const flatMenuTree = tree2Flat({
                treeData: menuTree,
                keyPropName: 'key',
                toType: 'object',
            });
            dispatch(
                actions.set({
                    tableDataSource,
                    menuTree,
                    flatMenuTree,
                }),
            );
        }

        dispatch(actions.setIsLoading(false));
    };
/**
 * 获取资源列表
 * @param props
 * @param value
 * @param record
 * @returns
 */

export const asyncResourceList =
    (props: PageProps): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions, getPageState}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {currentMenu, resourceTypes} = getPageState(getState(), id);
        const {userInfo} = getPageState(getState(), 'app');
        const {id: userId} = userInfo;

        if (!currentMenu) {
            return;
        }

        const resourceTypesMap = resourceTypes.reduce(
            (prev, curr) => ({...prev, [curr.dictdataCode]: curr}),
            {},
        );
        const {code, data} = await fetchMenuResourceByMenuId({
            menuId: currentMenu.menuId,
        });

        if (code === '200' && data) {
            dispatch(
                actions.set({
                    resourceTableDataSource: data.map((resource) => ({
                        ...resource,
                        msourceTypeI18n:
                            resourceTypesMap[resource.msourceType]
                                ?.dictdataName ?? resource.msourceType,
                    })),
                }),
            );
        }
    };
/**
 * 切换系统
 * @param props
 * @returns
 */

export const changeSystem =
    (props: PageProps, prodCode: string): AppThunk =>
    (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        dispatch(asyncMenuList(props, prodCode));
        dispatch(actions.setCurrentTabKey(prodCode));
    };
/**
 * 启用/禁用
 * @param props
 * @returns
 */

export const toggleEnable =
    (props: PageProps, enable: boolean, record: any): AppThunk<Promise<void>> =>
    (dispatch) =>
        new Promise((resolve, reject) => {
            const action = {
                id: 'modifyMenuStatus',
                module: props.id,
                desc: t('修改菜单状态：{{name}}', {
                    name: record.menuName,
                }),
            };
            fetchUpdateMenu({...record, menuEnable: boolean2Int(enable)})
                .then(({code}) => {
                    if (code === '200') {
                        message.info(t('保存成功'));
                        dispatch(asyncMenuList(props));
                        resolve();
                        report.success(action);
                    } else {
                        reject();
                        report.fail(action);
                    }
                })
                .catch((error) => {
                    reject(error);
                    report.fail(action);
                });
        });
/**
 * 获取页面资源类型
 * @param props
 * @returns
 */

const getResourceTypes =
    (props: PageProps): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {code, data} = await fetchDictModelVOPageByTypeCode(
            PAGE_RESOURCE_DICT_KEY,
        );

        if (code === '200') {
            dispatch(
                actions.set({
                    resourceTypes: data,
                }),
            );
        }
    };
/**
 * 获取菜单类型
 * @param props
 * @returns
 */

export const getMenuTypes =
    (id: any): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const actions = getPageSimpleActions(id);
        const {code, data} = await fetchDictModelVOPageByTypeCode('MENU_TYPE');

        if (code === '200') {
            dispatch(
                actions.set({
                    menuTypes: data,
                }),
            );
        }
    };

/**
 * 获取菜单打开类型
 * @param props
 * @returns
 */

export const getMenuOpenTypes =
    (id: any): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const actions = getPageSimpleActions(id);
        const {code, data} = await fetchDictModelVOPageByTypeCode(
            'MENU_OPEN_TYPE',
        );

        if (code === '200') {
            dispatch(
                actions.set({
                    targetTypes: data,
                }),
            );
        }
    };
/**
 * 删除菜单
 * @param props
 * @param menuId
 * @returns
 */

export const deleteMenu =
    (
        props: PageProps,
        menuId: string,
        menuName: string,
    ): AppThunk<Promise<void>> =>
    (dispatch) =>
        new Promise((resolve, reject) => {
            const {id} = props;
            const action = {
                id: LogActionID.Delete,
                module: id,
                desc: t('删除菜单：{{name}}', {
                    name: menuName,
                }),
            };
            Modal.confirm({
                title: t('确定要删除吗'),
                onOk: async () => {
                    const {code} = await fetchDeleteMenu(menuId).catch(() => {
                        report.fail(action);
                    });

                    if (code === '200') {
                        message.info(t('删除成功'));
                        dispatch(asyncMenuList(props));
                        resolve();
                        report.success(action);
                    } else {
                        reject();
                        report.fail(action);
                    }
                },
            });
        });
/**
 * 开始修改菜单
 * @param props
 * @param menuId
 * @returns
 */

export const startEditMenu =
    (props: PageProps, menu: any): AppThunk =>
    (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {menuTree} = getPageState(getState(), id);
        const myMenuTree = JSON.parse(JSON.stringify(menuTree));
        const editMenuTree = filterData(myMenuTree, menu.menuId);
        dispatch(
            actions.set({
                currentMenu: menu,
                editMenuTree,
            }),
        ); // 请求当前菜单资源

        dispatch(asyncResourceList(props));
    };

export const getProductList =
    (props: PageProps): AppThunk =>
    (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        dispatch(actions.set({isTableLoading: true}));

        getProductListByPage({
            all: true,
        }).then(async (res) => {
            if (res.code === '200') {
                const {list} = res.data;
                const productList = (list as ProductItemModel[]) || [];
                const authProductList = productList.filter((item) => {
                    // 内部应用 或 第三方应用无ip，也认为为内部应用
                    return (
                        item.state.value === 0 &&
                        (item.gwFlag.value === 0 || !item.piUrl)
                    );
                });

                if (authProductList.length > 0) {
                    await dispatch(
                        actions.set({
                            authProductList,
                        }),
                    );
                    const code = authProductList[0].code;
                    dispatch(asyncMenuList(props, code));
                    dispatch(actions.setCurrentTabKey(code));
                }
            }
        });
    };

/**
 * 页面初始化
 * @param props
 * @returns
 */

export const onInit =
    (props: PageProps): AppThunk =>
    (dispatch) => {
        const {id} = props;

        dispatch(getProductList(props));

        dispatch(getResourceTypes(props));
        dispatch(getMenuTypes(id));
        dispatch(getMenuOpenTypes(id));
    };

/**
 * 重置刷新页面数据
 * @param props 页面属性
 * @returns
 */
export const refreshPage =
    (props: PageProps): AppThunk =>
    (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        actions.reset();
        dispatch(onInit(props));
    };
