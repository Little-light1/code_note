import {fetchDictModelVOPageByTypeCode} from '@services/data_dict_config';
import {getWaitDealPage} from '@services/wait_deal';
import {Modal} from 'antd';
import {PageProps} from '@gwaapp/ease';
import {AppThunk} from '@/app/runtime';
import {i18nIns} from '@/app/i18n';

const {t} = i18nIns;

/**
 * 修改查询条件
 * @param props
 * @param record
 * @returns
 */

export const changeSearchVal =
    (props: PageProps, value: any, type: Number): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {searchParams} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);
        const mySearchParams = JSON.parse(JSON.stringify(searchParams));
        if (type === 0) {
            mySearchParams.proCode = value;
        } else if (type === 1) {
            mySearchParams.status = value;
        }
        dispatch(actions.set({searchParams: mySearchParams}));
    };
/**
 * 获取信息列表数据
 * @param props
 * @returns
 */

export const getWaitDealList =
    (
        props:
            | PageProps
            | {
                  id: string;
                  searchParse: string;
              },
    ): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {searchParams, pagination} = getPageState(getState(), id);
        const {subSystems} = getPageState(getState(), 'app');
        const actions = getPageSimpleActions(id);

        const searchCondition = {
            all: false,
            conditions: [
                {
                    condition: 'EQ',
                    field: 'status',
                    value: searchParams.status,
                    valueType: 'STRING',
                },
            ],
            pageNum: pagination.pageNumber,
            pageSize: pagination.pageSize,
        };
        if (searchParams.proCode) {
            searchCondition.conditions = searchCondition.conditions.concat({
                condition: 'EQ',
                field: 'proCode',
                value: searchParams.proCode,
                valueType: 'STRING',
            });
        }
        const {data}: any = await getWaitDealPage({
            data: searchCondition,
        });

        if (data) {
            data.list.forEach((item: any) => {
                const businessData = JSON.parse(item.businessData);
                item.businessId = businessData.businessId;
                item.businessStateStr = businessData.businessStateStr
                    ? businessData.businessStateStr
                    : '--';
                item.businessType = businessData.businessType
                    ? businessData.businessType
                    : '--';
                item.businessNo = businessData.businessNo
                    ? businessData.businessNo
                    : item.name;
                item.proName = subSystems.find(
                    (system: any) => system.code === item.proCode,
                )?.name;
            });
            dispatch(
                actions.set({
                    tableDataSource: data.list,
                }),
            );
            const myPage = {
                pageNumber: pagination.pageNumber,
                pageSize: pagination.pageSize,
                total: data.total,
            }; // pagination.total = data.total;

            dispatch(
                actions.set({
                    pagination: myPage,
                }),
            );
        }
    };
/**
 * 修改查询条件
 * @param props
 * @param record
 * @returns
 */

export const handelSearch =
    (
        props:
            | PageProps
            | {
                  id: string;
              },
    ): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {pagination} = getPageState(getState(), id);
        pagination.pageNumber = 1;
        const actions = getPageSimpleActions(id);
        dispatch(
            actions.set({
                pagination,
            }),
        );
        dispatch(getWaitDealList(props));
    };

/**
 * 获取字典项
 * @param props
 * @param record
 * @returns
 */

export const thunkGetDictDataTreePageByTypeCode =
    (props: PageProps, dictCode: any): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        dispatch(
            actions.set({
                isTableLoading: true,
            }),
        );
        const {code, msg, data}: any = await fetchDictModelVOPageByTypeCode(
            dictCode,
            {},
        );

        if (code === '200') {
            const totalList = [
                {
                    dictdataValue: '',
                    dictdataName: t('全部'),
                },
            ];
            if (dictCode === 'NOTICE_TYPE') {
                dispatch(
                    actions.set({
                        noticeTypeList: totalList.concat(data || []),
                    }),
                );
            } else if (dictCode === 'WAIT_DEAL_TYPE') {
                dispatch(
                    actions.set({
                        waitDealTypeList: data || [],
                    }),
                );
            }
            dispatch(
                actions.set({
                    isTableLoading: false,
                }),
            );
        } else {
            Modal.error({
                title: msg,
            });
            dispatch(
                actions.set({
                    isTableLoading: false,
                }),
            );
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
        dispatch(getWaitDealList(props));
        dispatch(thunkGetDictDataTreePageByTypeCode(props, 'WAIT_DEAL_TYPE'));
    };
