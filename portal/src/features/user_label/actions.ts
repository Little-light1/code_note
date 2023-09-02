/*
 * @Author: mikey.zhaopeng
 * @Date: 2021-12-06 13:58:44
 * @Last Modified by: selwyn.bishanwen
 * @Last Modified time: 2022-12-13 10:52:41
 */
import {
    listData,
    deleteDataList,
    getUserListByFarmId,
    addUserLabelList,
    updateUserLabelList,
} from '@services/userLabel';
import {fetchUserOrgTree} from '@services/resource';
import {logError, report} from '@/common/utils/clientAction';
import {message, Modal as AntdModal} from 'antd';
import {utils} from '@components/tree';
import {debounce} from 'lodash';
import {PageProps} from '@gwaapp/ease';
import {AppThunk} from '@/app/runtime';
import {i18nIns} from '@/app/i18n';

const {t} = i18nIns;

const {loopToAntdTreeData} = utils; // 列表数据获取

export const tagsData =
    (props: PageProps): AppThunk =>
    (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {page, pageSize} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);
        listData({
            pageSize,
            pageNum: page,
        }).then((res) => {
            if (res.code === '200') {
                const {total, list, msg} = res.data;

                if (list instanceof Array) {
                    const newData = list;
                    dispatch(
                        actions.set({
                            tableDataSource: newData,
                            isTableLoading: false,
                            total,
                        }),
                    );
                } else {
                    message.error(msg);
                }
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
        dispatch(tagsData(props));
    };

// 查询
export const searchData =
    (props: PageProps, value: any): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);

        if (value === '' || null || undefined) {
            dispatch(tagsData(props));
        } else {
            const action = {
                id: 'addUpdate',
                module: 'userLabel',
                desc: t('查询用户标签列表'),
            };
            listData({
                all: true,
                conditions: [
                    {
                        condition: 'LIKE',
                        field: 'name',
                        value: value.trim(),
                    },
                ],
            }).then((res) => {
                const {code, msg, data} = res;

                if (code === '200') {
                    const newSearch = [];

                    for (let i = 0; i < data.list.length; i += 1) {
                        newSearch.push(data.list[i]);
                    }

                    dispatch(
                        actions.set({
                            tableDataSource: newSearch,
                            isTableLoading: false,
                            total: data.total,
                        }),
                    );
                    message.success(t('查询成功'));
                    report.success(action);
                } else {
                    report.fail(action);
                    message.error(msg || t('数据查询失败'));
                }
            });
        }
    };

// 删除
export const deleteData =
    (props: PageProps, record?: any): AppThunk =>
    async (dispatch) => {
        // 操作结果埋点 desc描述信息id
        const action = {
            id: 'addUpdate',
            module: 'userLabel',
            desc: `${t('删除标签')}：${record.name}`,
        };
        AntdModal.confirm({
            title: t('是否确定删除选中的记录?'),
            okText: t('是'),
            cancelText: t('否'),
            onOk: async () => {
                try {
                    const {code, msg} = await deleteDataList({
                        tagIds: record.id,
                    });

                    if (code === '200') {
                        report.success(action);
                        message.success(t('删除成功'));
                        dispatch(tagsData(props));
                    } else {
                        report.fail(action);
                        AntdModal.error(
                            {
                                title: msg,
                            } || t('请求报错'),
                        );
                    }
                } catch (error: any) {
                    logError(error);
                }
            },
        });
    };

// 弹框列表获取
export const thunkGetUsersByOrgIds =
    (props: PageProps, keys: any): AppThunk =>
    (dispatch, getState, {getPageSimpleActions, getPageState}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {newType, userData} = getPageState(getState(), id);
        dispatch(
            actions.set({
                checkedKeys: keys,
            }),
        ); // 防抖函數

        debounce(() => {
            if (keys.length === 0) {
                dispatch(
                    actions.set({
                        usersInOrgs: [],
                    }),
                );
            } else {
                getUserListByFarmId(keys).then((res) => {
                    const {data, code} = res;

                    if (newType === 'edit' && code === '200' && data?.length) {
                        const newUser = data.filter(
                            (x: {loginName: any}) =>
                                !userData.some(
                                    (item: {loginName: any}) =>
                                        x.loginName === item.loginName,
                                ),
                        );
                        dispatch(
                            actions.set({
                                usersInOrgs: newUser,
                                isTableLoading: false,
                            }),
                        );
                    } else {
                        dispatch(
                            actions.set({
                                usersInOrgs: data,
                            }),
                        );
                    }
                });
            }
        }, 2000)();
    };

// 树选择数据获取
function lookForAllId(d = [], arr = []) {
    for (const item of d) {
        arr.push(item.id);
        if (item.children && item.children.length)
            lookForAllId(item.children, arr);
    }

    return arr;
} // console.log(lookForAllId(newList), '获取了 所有树节点 id');

export const tagsTree =
    (props: PageProps): AppThunk =>
    (dispatch, getState, {getPageSimpleActions}) => {
        const {id, menu} = props;
        const codes = menu ? menu.applicationCode : 'OC'; // 拿到菜单所在的code

        const {app} = getState(id); // 拿到当前你选择的产品传入左上角产品选择功能

        const actions = getPageSimpleActions(id);
        fetchUserOrgTree({
            proCode: codes,
            userId: app.userInfo.id,
        }).then((res) => {
            const {code, data, msg} = res;

            if (code === '200') {
                const newList = res.data; // eslint-disable-next-line no-inner-declarations, @typescript-eslint/no-shadow

                const treeKeysAll = lookForAllId(newList);
                dispatch(thunkGetUsersByOrgIds(props, treeKeysAll));

                if (data) {
                    const newTreeList = loopToAntdTreeData({
                        treeData: data,
                        keyPropName: 'id',
                        titlePropName: 'name',
                    });
                    dispatch(
                        actions.set({
                            userTableDataSource: newTreeList,
                            isTableLoading: false,
                        }),
                    );
                }
            } else {
                message.error(msg);
            }
        });
    };

// 新增
export const addSubmitData =
    (props: {
        values: Record<string, any>;
        modalType: string;
        parentID: string;
    }): AppThunk =>
    (dispatch) =>
        new Promise((resolve, reject) => {
            const {modalType, values, parentID, pageProps, selectedNode} =
                props; // 操作结果埋点 desc描述信息id

            const action = {
                id: 'addUpdate',
                module: 'userLabel',
                desc:
                    modalType === 'add'
                        ? `${t('新建标签')}：${values.name}`
                        : `${t('编辑标签')}：${selectedNode.name}`,
            };
            const userKeysData: any[] = [];
            values.userList.forEach((item: any) => {
                userKeysData.push(item.id);
            }); // 数组去重 set过滤重复数据

            const newList = new Set(userKeysData);
            const userKeys = [...newList];

            if (modalType === 'add') {
                const objList = {
                    enterpriseID: parentID,
                    name: values.name,
                    remark: values.remark,
                    type: 'USER',
                    userIDs: userKeys,
                };
                addUserLabelList(objList).then((res) => {
                    const {code, data} = res;

                    if (code === '200') {
                        report.success(action);
                        message.success(t('新增成功'));
                        dispatch(tagsData(pageProps));
                        dispatch(tagsTree(pageProps));
                        resolve();
                    } else {
                        report.fail(action);
                        reject(new Error(data.message));
                    }
                });
            } else {
                const objData = {
                    id: selectedNode.id,
                    remark: values.remark,
                    name: values.name,
                    userIDs:
                        userKeys !== [] || null || undefined ? userKeys : '',
                };
                updateUserLabelList(objData).then((res) => {
                    const {code, data} = res;

                    if (code === '200') {
                        report.success(action);
                        message.success(t('更新成功'));
                        dispatch(tagsData(pageProps));
                        resolve();
                    } else {
                        report.fail(action);
                        reject(new Error(data.message));
                    }
                });
            }
        });

export const startEdit =
    (props: PageProps, record: any, callback: () => void): AppThunk =>
    (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {usersInOrgs} = getPageState(getState(), id);
        const usersInOrgsList = [...usersInOrgs];

        for (let i = 0; i < record.userList.length; i += 1) {
            for (let j = 0; j < usersInOrgsList.length; j += 1) {
                if (record.userList[i].id === usersInOrgsList[j].id) {
                    usersInOrgsList.splice(j, 1);
                    j -= 1;
                }
            }
        }

        dispatch(
            actions.set({
                usersInOrgs: usersInOrgsList,
            }),
        );
        callback && callback();
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
        dispatch(tagsTree(props));
    };
