import {fetchDictModelVOPageByTypeCode} from '@services/data_dict_config';
import {
    getMessagePage,
    markNoticeAsRead,
    getMessageDetail,
    markAllNoticeAsRead,
    fetchFileMap,
} from '@services/notice_center';
import {Modal} from 'antd';
import {PageProps} from '@gwaapp/ease';
import {AppThunk} from '@/app/runtime';
import {i18nIns} from '@/app/i18n';
import moment from 'moment';
import {forEach} from 'lodash';

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
        if (mySearchParams.timeRange.length > 0) {
            const startTime = moment(mySearchParams.timeRange[0]);
            const endTime = moment(mySearchParams.timeRange[1]);
            mySearchParams.timeRange = [startTime, endTime];
        }
        if (type === 0) {
            mySearchParams.title = value;
        } else if (type === 1) {
            mySearchParams.noticeType = value;
        } else if (type === 2) {
            mySearchParams.timeRange = value;
        } else if (type === 3) {
            mySearchParams.umReadStatus = value;
        }
        dispatch(actions.set({searchParams: mySearchParams}));
    };
/**
 * 获取信息列表数据
 * @param props
 * @returns
 */

export const getNoticeList =
    (
        props:
            | PageProps
            | {
                  id: string;
              },
    ): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {searchParams, pagination} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);
        let startTime = '';
        let endTime = '';

        if (searchParams.timeRange && searchParams.timeRange.length > 1) {
            startTime = moment(searchParams.timeRange[0]).format(
                'YYYY-MM-DD HH:mm:ss',
            );
            endTime = moment(searchParams.timeRange[1]).format(
                'YYYY-MM-DD HH:mm:ss',
            );
        }

        const searchCondition = {
            conditionDto: {
                msgTitle: searchParams.title,
                msgType: searchParams.noticeType,
                umCreateTimeStart: startTime,
                umCreateTimeEnd: endTime,
                umReadStatus: searchParams.umReadStatus,
            },
            pageNum: pagination.pageNumber,
            pageSize: pagination.pageSize,
        };
        const {data}: any = await getMessagePage({
            data: searchCondition,
        });

        if (data) {
            data.list.forEach((item: any) => {
                item.msgSenderName = item.msgSender
                    ? item.msgSender.loginName
                    : '--';
                item.msgSenderOrgName = item.msgSenderOrg
                    ? item.msgSenderOrg.name
                    : '--';
                item.msgStatusName = item.umReadStatus.desc;
                item.msgStatus = item.umReadStatus.value;
                item.msgCreateTime = moment(item.umCreateTime).format(
                    'YYYY-MM-DD HH:mm:ss',
                );
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
        dispatch(getNoticeList(props));
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
 * 获取详细数据
 * @param props
 * @param record
 * @returns
 */

export const thunkGetMessageDetail =
    (props: PageProps, record: any): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {code, msg, data}: any = await getMessageDetail(record.msgId);

        if (code === '200') {
            const msgDetail = {
                msgTitle: data.msgTitle,
                msgTypeName: data.msgTypeName,
                msgCreateTime: moment(data.umCreateTime).format(
                    'YYYY-MM-DD HH:mm:ss',
                ),
                msgSenderName: data.msgSender ? data.msgSender.loginName : '--',
                msgSenderOrgName: data.msgSenderOrg
                    ? data.msgSenderOrg.name
                    : '--',
                msgContent: data.msgContent,
                fileList: [],
            };
            dispatch(
                actions.set({
                    noticeContent: msgDetail,
                }),
            );
            if (data?.fileTokenList.length !== 0) {
                const filesData = await fetchFileMap(data?.fileTokenList);

                if (filesData.code === '200' && filesData.data) {
                    const fileList = Object.values(filesData.data).map(
                        (file) => {
                            return {
                                id: file.id,
                                name: file.originFileName,
                                fileToken: file.fileToken,
                            };
                        },
                    );
                    dispatch(
                        actions.set({
                            noticeContent: {...msgDetail, fileList},
                        }),
                    );
                }
            }
        } else {
            Modal.error({
                title: msg,
            });
        }
    };

export const handledowloadAttachment =
    (name: string): AppThunk =>
    () => {
        window.open(`aapp-api/aapp-fileupload/file/download?token=${name}`);
    }; // 点击左侧目录选择文档

/**
 * 更新启用状态
 * @param props
 * @param record
 * @returns
 */

export const afterRead =
    (props: PageProps, record: any): AppThunk =>
    async (dispatch) => {
        const {code, msg} = await markNoticeAsRead(record.msgId);

        if (code === '200') {
            dispatch(getNoticeList(props));
            dispatch(thunkGetMessageDetail(props, record));
        } else {
            Modal.error({
                title: msg,
            });
        }
    };
/**
 * 更新全部已读状态
 * @param props
 * @param record
 * @returns
 */

export const readAllNotice =
    (props: PageProps): AppThunk =>
    async (dispatch) => {
        const {code, msg} = await markAllNoticeAsRead();

        if (code === '200') {
            dispatch(getNoticeList(props));
        } else {
            Modal.error({
                title: msg,
            });
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
        dispatch(getNoticeList(props));
        dispatch(thunkGetDictDataTreePageByTypeCode(props, 'NOTICE_TYPE'));
        dispatch(thunkGetDictDataTreePageByTypeCode(props, 'WAIT_DEAL_TYPE'));
    };
