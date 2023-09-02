import {
    listData,
    appNumberList,
    addData,
    updateEnterpriseState,
    updateForm,
} from '@services/account';
import {Modal, message} from 'antd';
import {PageProps} from '@gwaapp/ease';
import {AppThunk} from '@/app/runtime';
import {report} from '@utils/clientAction';
import {i18nIns} from '@/app/i18n';
import {encryptionPassword} from '@/common/utils/encryption';
import {boolean2Int, BooleanTransform} from './boolean';

// 列表数据获取
const {t} = i18nIns;
export const handData =
    (props: PageProps): AppThunk =>
    (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {page, pageSize, searchName} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);
        listData({
            all: false,
            conditions: [
                {
                    condition: 'APPLY',
                    value: `name like '%${searchName.trim()}%'  or shortName like '%${searchName.trim()}%'`,
                },
            ],
            pageSize,
            pageNum: page,
        }).then((res) => {
            if (res.code === '200') {
                const {data, msg} = res;
                const {total, list} = data;

                if (list instanceof Array) {
                    const newList = [];

                    for (let i = 0; i < list.length; i += 1) {
                        // 先解构再赋值list
                        newList.push({...list[i].enterprise});
                        newList[i].administrator = list[i].administrator;
                        newList[i].productList = list[i]?.productList;
                    }

                    dispatch(
                        actions.set({
                            tableDataSource: newList,
                            isTableLoading: false,
                            total,
                        }),
                    );
                } else {
                    // message.error(msg || t('请求报错'));
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
        dispatch(handData(props));
    };

// 企业服务列表
export const fetchAppData =
    (props: PageProps): AppThunk =>
    (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        appNumberList().then((res) => {
            const {code, data} = res;

            if (code === '200' && data.list) {
                dispatch(
                    actions.set({
                        appServiceData: data.list,
                        isTableLoading: false,
                    }),
                );
            }
        });
    };

// 查询
export const searchData =
    (props: PageProps, value: any): AppThunk =>
    (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        dispatch(
            actions.set({
                searchName: value,
            }),
        );

        const action = {
            id: 'addUpdate',
            module: 'account',
            // desc: `${t('查询')}：${value.trim()}`,
            desc: t('查询企业账户列表'),
        };

        if (value === '' || null || undefined) {
            dispatch(handData(props));
        } else {
            listData({
                all: false,
                conditions: [
                    {
                        condition: 'APPLY',
                        value: `name like '%${value.trim()}%'  or shortName like '%${value.trim()}%'`,
                    },
                ],
            }).then((res) => {
                const {code, data} = res;
                if (data.list && data.list.length !== 0) {
                    if (code === '200' && !data.list?.length) {
                        dispatch(
                            actions.set({
                                tableDataSource: [],
                                page: 1,
                                pageSize: 20,
                                total: 0,
                            }),
                        );
                    }
                }

                if (code === '200') {
                    const newSearch = [];
                    report.success(action);
                    if (data.list && data.list.length !== 0) {
                        for (let i = 0; i < data.list.length; i += 1) {
                            newSearch.push(data.list[i].enterprise);
                            newSearch[i].administrator =
                                data.list[i].administrator;
                            newSearch[i].productList =
                                data.list[i]?.productList;
                        }
                    }

                    dispatch(
                        actions.set({
                            tableDataSource: newSearch,
                            isTableLoading: false,
                            total: data.total,
                        }),
                    );
                    message.success(t('查询成功'));
                } else {
                    report.fail(action);
                }
            });
        }
    };

// 新增
export const addSubmit =
    (props: any): AppThunk =>
    (dispatch) =>
        new Promise((resolve, reject) => {
            const {modalType, values, parentID, selectedNode} = props; // 操作结果埋点 desc描述信息id

            const action = {
                id: 'addUpdate',
                module: 'account',
                desc: t('{{verb}}控件名称:{{name}}', {
                    verb: modalType === 'add' ? t('新建') : t('编辑'),
                    name:
                        modalType === 'add'
                            ? `${t('新建企业')}：${values.name}`
                            : `${t('编辑企业')}：${selectedNode.name}`,
                }),
            };

            if (modalType === 'add') {
                const objList = {
                    enterprise: {
                        // encryptType: 'BASE64',
                        address: '', // 租户地址
                        domain: values.name, // 租戶域名
                        logo: values.logo,
                        name: values.name,
                        remark: '',
                        parentID,
                        shortName: values.shortName,
                        state: boolean2Int(values.account),
                        // type: values.type,
                        systemTemplate: {
                            id: 1,
                            productIds: values.productList.map(
                                (item: {productID: any}) => item.productID,
                            ),
                        },
                        loginName: values.loginName,
                        password: encryptionPassword(values.password),
                    },
                    productList: values.productList.map(
                        ({productName, ...args}) => args,
                    ), // names
                };

                if (values.loginName === values.password) {
                    message.info(t('账号名称和账号密码不能重复'));
                } else {
                    addData(objList).then((res) => {
                        const {code, data} = res;

                        if (code === '200') {
                            message.success(t('新增成功'));
                            dispatch(handData(props));
                            report.success(action); // 操作结果埋点 成功

                            resolve();
                        } else {
                            report.fail(action); // 操作结果埋点失败

                            reject(new Error(data.message));
                        }
                    });
                }
            } else {
                const objData = {
                    enterprise: {
                        address: '', // 租户地址
                        domain: selectedNode.domain, // 租戶域名
                        id: selectedNode.id,
                        remark: '',
                        logo: values.logo,
                        name: values.name,
                        shortName: values.shortName,
                        state: boolean2Int(values.account),
                    },
                    productList: values.productList.map(
                        ({productName, ...args}) => args,
                    ),
                    administrator: {
                        id: selectedNode.administrator[0].id,
                        // 0 & 1 禁用（用户权限组件已将该枚举量删除） 传1会导致报错
                        // 1临时改成3（注销）
                        state: boolean2Int(values.AccountStatus, {
                            true: 0,
                            false: 3,
                        }),
                        loginName: values.loginName,
                        password:
                            values.password === '' ? null : values.password,
                    },
                };
                updateForm(objData).then((res) => {
                    const {code, data} = res;

                    if (code === '200') {
                        message.success(t('更新成功'));
                        dispatch(handData(props));
                        report.success(action);
                        resolve();
                    } else {
                        report.fail(action);
                        reject(new Error(data.message));
                    }
                });
            }
        });

// 企业状态修改
export const updateState =
    (props: PageProps, record: any, value: boolean): AppThunk =>
    async (dispatch) => {
        const action = {
            id: 'addUpdate',
            module: 'account',
            desc: t('修改应用状态: {{name}}', {
                name: record.name,
            }),
        };
        const submitParams = {
            state: BooleanTransform[String(value) as 'true' | 'false'],
        };
        const {code, msg} = await updateEnterpriseState({
            state: submitParams.state,
            id: record.id,
            name: record.name,
        });

        if (code === '200') {
            message.success(t('更新成功'));
            report.success(action);
            dispatch(handData(props));
        } else {
            report.fail(action);
            Modal.error(
                {
                    title: msg,
                } || t('请求报错'),
            );
        }
    };
/**
 * 页面初始化
 * @param props
 * @returns
 */

export const onInit =
    (props: PageProps): AppThunk<Promise<void>> =>
    (dispatch) =>
        new Promise((resolve) => {
            dispatch(handData(props));
            dispatch(fetchAppData(props));
            resolve();
        });
