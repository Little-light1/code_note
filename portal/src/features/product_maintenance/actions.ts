import {
    getProductListByPage,
    deleteDataList,
    updateApplicationServiceState,
} from '@services/product_maintenance';
import {message, Modal as AntdModall} from 'antd';
import {PageProps} from '@gwaapp/ease';
import {AppThunk} from '@/app/runtime';
import {logError, report} from '@/common/utils/clientAction'; // 列表数据获取
import {fetchDictModelVOPageByTypeCode} from '@services/data_dict_config';
import {i18nIns} from '@/app/i18n';
import {Events} from '@common/events';

const {t} = i18nIns;

export const mainData =
    (props: PageProps): AppThunk =>
    (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {page, pageSize} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);
        dispatch(actions.set({isTableLoading: true}));

        // 获取单点登录方式的数据字典
        fetchDictModelVOPageByTypeCode('ssoType', {}).then((loginTypeData) => {
            if (!loginTypeData.data) {
                return;
            }
            dispatch(
                actions.set({
                    loginType: [...loginTypeData.data],
                }),
            );
        });

        getProductListByPage({
            pageSize,
            pageNum: page,
        }).then((res) => {
            if (res.code === '200') {
                const {total, list} = res.data;

                if (list instanceof Array) {
                    const newList = list;
                    dispatch(
                        actions.set({
                            tableDataSource: newList,
                            isTableLoading: false,
                            total,
                        }),
                    );
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
        dispatch(mainData(props));
    };
// 查询
export const searchData =
    (props: PageProps, value: any): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);

        if (value === '' || null || undefined) {
            dispatch(mainData(props));
        } else {
            const action = {
                id: 'addUpdate',
                module: 'productMaintenance',
                // desc: `${t('查询')}:${value}`,
                desc: t('查询应用维护列表'),
            };
            getProductListByPage({
                all: false,
                conditions: [
                    {
                        condition: 'APPLY',
                        // 传条件语句给后端  name和code 模糊查询 中间用or连接 就是 | 的意思
                        value: `name like '%${value.trim()}%'  or code like '%${value.trim()}%'`,
                    },
                ],
            }).then((res) => {
                const {code, msg, data} = res;

                if (code === '200') {
                    const newSearch = [];

                    for (let i = 0; i < data?.list?.length; i += 1) {
                        newSearch.push(data.list[i]);
                    }

                    dispatch(
                        actions.set({
                            tableDataSource: newSearch,
                            isTableLoading: false,
                            total: data.total,
                        }),
                    );
                    report.success(action);
                    message.success(t('查询成功'));
                } else {
                    report.fail(action);
                    message.error(msg || t('数据查询失败'));
                }
            });
        }
    }; // 删除

export const deleteData =
    (
        props: PageProps,
        trigger: (type: string) => any,
        record?: any,
    ): AppThunk =>
    async (dispatch) => {
        if (record.state.value === 0) {
            return;
        }

        const action = {
            id: 'addUpdate',
            module: 'productMaintenance',
            desc: `${t('删除') + t('应用名称')}:${record.name}`,
        };
        AntdModall.confirm({
            title: t('是否确定删除选中的记录?'),
            okText: t('是'),
            cancelText: t('否'),
            onOk: async () => {
                try {
                    const {code, msg} = await deleteDataList({
                        pId: record.id,
                    });

                    if (code === '200') {
                        report.success(action);
                        message.success(t('删除成功'));
                        dispatch(mainData(props));
                        trigger(Events.refresh_menu_manager);
                    } else {
                        report.fail(action);
                        AntdModall.error({
                            title: msg,
                        });
                    }
                } catch (error: any) {
                    logError(error);
                }
            },
        });
    }; // 企业状态修改

export const updateState =
    (props: PageProps, record: any): AppThunk<Promise<void>> =>
    (dispatch) =>
        new Promise((resolve, reject) => {
            const action = {
                id: 'addUpdate',
                module: 'productMaintenance',
                desc: t('修改应用状态: {{name}}', {
                    name: record.name,
                }),
            };
            updateApplicationServiceState({
                pId: record.id,
                stateEnum: record.state.value !== 0 ? 'ENABLE' : 'DISABLE',
            }).then(({code, msg}) => {
                if (code === '200') {
                    message.success(t('更新成功'));
                    dispatch(mainData(props));
                    report.success(action);
                    resolve();
                } else {
                    report.fail(action);
                    message.error({
                        title: msg,
                    });
                    reject();
                }
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
        dispatch(mainData(props));
    };
