/*
 * @Author: sds
 * @Date: 2021-12-02 09:15:18
 * @Last Modified by: gongzunbao
 * @Last Modified time: 2023-07-07 22:36:08
 */
import {message, Modal} from 'antd';
import * as userServices from '@services/user';
import {AppThunk} from '@/app/runtime';
import {PageProps} from '@gwaapp/ease';
import {utils} from '@components/tree';
import {report} from '@utils/clientAction';
import {fetchDictModelVOPageByTypeCode} from '@services/data_dict_config';
import {i18nIns} from '@/app/i18n';
import {USER_STATE} from './constant';

const {t} = i18nIns;

const {tree2Flat} = utils;

/**
 * 组装新建（编辑）面板组织机构树
 * @param {object} props 页面props
 */
function assemblySelectTreeData(props: {id: string}): AppThunk {
    return (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const simpleActions = getPageSimpleActions(id);
        const {treeData} = getPageState(getState(), id);
        const loop = (data: any[]) => {
            const test: any[] = [];
            data.forEach((ele) => {
                const sEle = {
                    value: ele?.id,
                    title: ele?.name,
                    key: ele?.id,
                    isRight: ele?.isRight,
                    disabled: !ele?.isRight,
                    children: loop(ele?.children ? ele?.children : []),
                };
                test.push(sEle);
            });
            return test;
        };
        const selectTreeData = loop(treeData);
        const totalTree = tree2Flat({
            treeData,
            keyPropName: 'id',
            toType: 'object',
        });
        dispatch(
            simpleActions.set({
                selectTreeData,
                treeData: selectTreeData,
                totalTree,
            }),
        );
    };
}

/**
 * 获取组织机构树
 * @param {object} props 页面props
 */
function getOrganizationTree(props: {id: string}): AppThunk {
    return async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const simpleActions = getPageSimpleActions(id);
        const params = {
            proCode: 'OC',
            showUser: false,
        };

        dispatch(simpleActions.set({isTreeLoading: true}));
        userServices
            .getOrganizationTree(params)
            .then(async (res) => {
                const {data, code} = res;

                if (code === '200' && data?.length) {
                    const firstKey = data[0].id;
                    const flatTreeDataMap = tree2Flat({
                        treeData: data,
                        keyPropName: 'id',
                        toType: 'object',
                    });
                    let selectedObj = {
                        id: '',
                    };
                    for (const key in flatTreeDataMap) {
                        if (flatTreeDataMap[key].isRight === 1) {
                            selectedObj = flatTreeDataMap[key];
                            break;
                        }
                    }
                    await dispatch(
                        simpleActions.set({
                            treeData: data,
                            selectedKeys: [selectedObj.id],
                            expandedKeys: [firstKey, selectedObj.id],
                        }),
                    );
                    dispatch(assemblySelectTreeData(props));
                } else if (code === '200' && !data?.length) {
                    message.info(t('无组织机构数据'));
                }
            })
            .catch((e) => console.log(e))
            .finally(() => dispatch(simpleActions.set({isTreeLoading: false})));
    };
}

/**
 * 获取角色列表
 * @param {object} props 页面props
 */
export function getRoleList(props: {id: string}): AppThunk {
    return async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const simpleActions = getPageSimpleActions(id);
        const pageInfo = {all: true};

        userServices
            .getRoleList(pageInfo)
            .then((res) => {
                const {data} = res;
                const allRoleList = data?.list || [];
                dispatch(simpleActions.set({allRoleList}));
            })
            .catch((e) => console.log(e));
    };
}

/**
 * 获取标签列表
 * @param {object} props 页面props
 */
function getLableList(props: {id: string}): AppThunk {
    return (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const simpleActions = getPageSimpleActions(id);

        const pageInfo = {all: true};

        userServices
            .getLableList(pageInfo)
            .then((res) => {
                const {data} = res;
                const allLabelList = data?.list || [];
                dispatch(simpleActions.set({allLabelList}));
            })
            .catch((e) => console.log(e));
    };
}

/**
 * 激活、休眠、注销
 * @param {object} props 页面props
 * @param {string} type 激活、休眠、注销
 * @param {object=} row 选择行
 */
export function updateUser(
    props: {id: string},
    type: string,
    row?: any,
): AppThunk {
    return (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const simpleActions = getPageSimpleActions(id);
        const updateUserInfo = {
            users: <{[index: string]: any}>[],
        };
        const pageState = getPageState(getState(), id);
        const {userInfo} = getPageState(getState(), 'app');
        const {update} = pageState;
        let {selectedRows} = pageState;
        let successMessage = '';

        if (row) {
            selectedRows = [row];
        }

        if (!selectedRows.length) {
            message.info(t('请先选择用户'));
            return;
        }

        const userSelf = selectedRows.filter(
            (ele: any) => ele.id === userInfo.id,
        );
        switch (type) {
            case USER_STATE.ENABLE.enum:
                successMessage = t('激活用户');
                break;
            case USER_STATE.SLEEP.enum:
                successMessage = t('休眠用户');

                if (userSelf.length) {
                    message.info(t('禁止休眠登录用户'));
                    return;
                }
                break;
            case USER_STATE.LOGOUT.enum:
                successMessage = USER_STATE.LOGOUT.name;
                break;

            default:
                break;
        }

        selectedRows.forEach((element: any) => {
            updateUserInfo.users.push({id: element.id, state: type});
        });
        const action = {
            id: 'activeOrDisable',
            module: id,
            desc: `${successMessage}: ${selectedRows
                .map((ele: any) => ele.loginName)
                .toString()}`,
        };

        userServices
            .updateUser(updateUserInfo)
            .then(async (res) => {
                const {code} = res;
                if (code === '200') {
                    dispatch(
                        simpleActions.set({
                            selectedRowKeys: [],
                            selectedRows: [],
                            update: !update,
                        }),
                    );
                    message.info(`${successMessage}: ${t('成功')}`);
                    report.success(action);
                } else {
                    report.fail(action);
                }
            })
            .catch((e) => {
                console.log(e);
                report.fail(action);
            });
    };
}

/**
 * 注销用户
 * @param {object} props 页面props
 * @param {object} record 选择的行
 */
export function deleteUser(props: {id: string}, record?: any): AppThunk {
    return (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const simpleActions = getPageSimpleActions(id);
        const pageState = getPageState(getState(), id);
        const {update} = pageState;
        let {selectedRowKeys, selectedRows} = pageState;

        if (record) {
            selectedRows = [record];
            selectedRowKeys = [record.id];
        }

        if (!selectedRows.length) {
            message.info(t('请先选择要注销的数据'));
            return;
        }
        if (selectedRows.find((ele: any) => ele?.type?.value === 0)) {
            message.info(t('管理员账号禁止注销，请重新选择'));
            return;
        }
        // if (selectedRows.find((ele: any) => ele?.state?.value === 0)) {
        //     message.info(t('激活用户禁止删除，请重新选择'));
        //     return;
        // }
        if (selectedRows.find((ele: any) => ele?.state?.value === 3)) {
            message.info(t('包含已被注销的数据，不能进行批量注销操作'));
            return;
        }
        const action = {
            id: 'delete',
            module: id,
            desc: `${t('注销用户')}：${selectedRows
                .map((ele: any) => ele.loginName)
                .toString()}`,
        };

        const onOk = () => {
            userServices
                .deleteUser({ids: selectedRowKeys})
                .then(async (res) => {
                    const {code} = res;
                    if (code === '200') {
                        dispatch(
                            simpleActions.set({
                                selectedRowKeys: [],
                                selectedRows: [],
                                update: !update,
                            }),
                        );
                        message.info(t('注销成功'));
                        report.success(action);
                    } else {
                        report.fail(action);
                    }
                })

                .catch((e) => {
                    console.log(e);
                    report.fail(action);
                });
        };
        Modal.confirm({
            title: t('是否确定注销选中的用户'),
            okText: t('是'),
            cancelText: t('否'),
            onOk,
        });
    };
}

/**
 * 下载模板
 * @param {object} props 页面props
 */
export function downloadTemplate(props: {id: string}): AppThunk {
    return () => {
        const {id} = props;

        const action = {
            id: 'download',
            module: id,
            desc: t('模板下载'),
        };
        userServices
            .downloadTemplate()
            .then((res) => {
                const {code} = res;
                if (code === '200') {
                    message.info(t('下载模板成功'));
                    report.success(action);
                } else {
                    report.fail(action);
                }
            })
            .catch((e) => {
                console.log(e);
                report.fail(action);
            });
    };
}
/**
 * 导出数据
 * @param {object} props 页面props
 */
export function exportExcel(props: {id: string}): AppThunk {
    return (dispatch, getState, {getPageState}) => {
        const {id} = props;
        const {selectedKeys, searchKey, timeLimitKey, userStateKey} =
            getPageState(getState(), id);
        const orgId = selectedKeys[0];
        const params = {
            proCode: 'OC',
            param: searchKey,
            state: userStateKey,
            timeLimit: timeLimitKey,
        };

        const action = {
            id: 'export',
            module: id,
            desc: `${t('导出用户列表')}`,
        };

        userServices
            .exportExcel(orgId, params)
            .then((res) => {
                const {code} = res;
                if (code === '200') {
                    message.info(t('导出成功'));
                    report.success(action);
                } else {
                    report.fail(action);
                }
            })
            .catch((e) => {
                console.log(e);
                report.fail(action);
            });
    };
}

/**
 * 获取默认密码
 * @param {object} props 页面props
 * @param {object} form 表单
 */
export function getDefaultPassword(props: {id: string}, form: any): AppThunk {
    return (dispatch, getState, {getPageState}) => {
        const {userInfo} = getPageState(getState(), 'app');
        const params = {
            dconfigCode: 'DEFAULT_PASSWORD',
            tenantId: userInfo?.enterpriseID,
        };

        userServices
            .getDefaultPassword(params)
            .then((res) => {
                const {data, code} = res;
                if (code === '200') {
                    form.setFieldsValue({newPassword: data.dconfigValue});
                }
            })
            .catch((e) => console.log(e));
    };
}

/**
 * 获取用户关联的角色信息
 * @param {object} props 页面props
 * @param {object} record 选择的行
 */
export function getLinkedRole(props: {id: string}, record: any): AppThunk {
    return (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const simpleActions = getPageSimpleActions(id);

        const params = {
            userId: record.id,
        };

        userServices
            .getLinkedRoleByUser(params)
            .then((res) => {
                const {data, code} = res;
                if (code === '200') {
                    dispatch(simpleActions.set({linkedRoles: data || []}));
                }
            })
            .catch((e) => console.log(e));
    };
}

/**
 * 获取角色类型list
 * @param {object} props 页面props
 */
export function getRoleTypeList(props: {id: string}): AppThunk {
    return async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const simpleActions = getPageSimpleActions(id);

        const bData = {all: true};
        const typeCode = 'ROLE_TYPE';

        fetchDictModelVOPageByTypeCode(typeCode, bData)
            .then((res) => {
                const {data} = res;
                const listData = data || [];

                dispatch(simpleActions.set({roleTypeList: listData}));
            })
            .catch((e) => console.log(e));
    };
}

/**
 * 获取角色类型list
 * @param {object} props 页面props
 */
export function getIDCardIsRequiredFun(props: {id: string}): AppThunk {
    return async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const simpleActions = getPageSimpleActions(id);

        const {data, code} = await userServices.getIDCardIsRequired();

        if (code === '200' && data) {
            dispatch(
                simpleActions.set({
                    isIDCardIsRequired: data,
                }),
            );
        }
    };
}

/**
 * 页面初始化
 * @param {object} props 页面props
 */
export function onInit(props: PageProps): AppThunk {
    return (dispatch) => {
        dispatch(getOrganizationTree(props));
        // 延迟异步请求资源
        setTimeout(() => {
            dispatch(getRoleList(props));
            dispatch(getLableList(props));
            dispatch(getRoleTypeList(props));
            dispatch(getIDCardIsRequiredFun(props));
        }, 1000);
    };
}

/**
 * 页面初始化
 * @param {object} props 页面props
 */
export function onUpdate(props: PageProps): AppThunk {
    return (dispatch) => {
        dispatch(getRoleList(props));
        dispatch(getLableList(props));
        dispatch(getRoleTypeList(props));
    };
}
