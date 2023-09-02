import React, {FC, useCallback, useMemo} from 'react';
import {shallowEqual} from 'react-redux';
import {
    Col,
    Row,
    Button,
    Input,
    Select,
    DatePicker,
    List,
    Radio,
    RadioChangeEvent,
    Badge,
    message,
} from 'antd';
import {PAGE_SIZE_OPTIONS, Table} from '@components/table';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {parseSearchParams} from '@/common/utils/url';
import {useModal, useAction, usePage, PageProps} from '@gwaapp/ease';
import {getMessageDetail} from '@services/notice_center';
import {dynamicColumns, UPDATE_MODAL_ID} from './constant';
import styles from './styles.module.scss';
import {
    onInit,
    changeSearchVal,
    getNoticeList,
    afterRead,
    readAllNotice,
} from './actions';
import UpdateModal from './update_modal';

const {RangePicker} = DatePicker;

const DataDictConfig: FC<PageProps> = (props) => {
    const {id} = props;
    const {
        tableDataSource,
        isTableLoading,
        pagination,
        searchParams,
        noticeTypeList,
        waitDealTypeList,
    } = useAppSelector((state) => state[id], shallowEqual);
    const dispatch = useAppDispatch();
    const {getPageSimpleActions, handlers} = useAction();
    const {openPage} = handlers;
    const actions = getPageSimpleActions(id);
    const {openModal} = useModal();
    const {t} = useTranslation(); // 生成列配置

    const onChangePage = useCallback(
        (page: any, pageSize: any) => {
            const pageInfo = {...pagination, pageNumber: page, pageSize};
            dispatch(
                actions.set({
                    pagination: pageInfo,
                }),
            );
            dispatch(getNoticeList(props));
        },
        [actions, dispatch, pagination, props],
    );
    usePage({...props, init: (pageProps) => dispatch(onInit(pageProps))});

    const inputChange = (e: any) => {
        dispatch(
            actions.set({
                pagination: {
                    pageNumber: 1,
                    pageSize: 20,
                    total: 0,
                },
            }),
        );
        dispatch(changeSearchVal(props, e, 1));
        dispatch(getNoticeList(props));
    };

    const onChangeReadStatus = (e: RadioChangeEvent) => {
        console.log(`radio checked:${e.target.value}`);
        dispatch(
            actions.set({
                pagination: {
                    pageNumber: 1,
                    pageSize: 20,
                    total: 0,
                },
            }),
        );
        dispatch(changeSearchVal(props, e.target.value, 3));
        dispatch(getNoticeList(props));
    };

    const skipWaitDeal = async (messageItem: any) => {
        const {code, msg, data}: any = await getMessageDetail(
            messageItem.msgId,
        );
        const msgContent = JSON.parse(data.msgContent);
        const businessData = JSON.parse(msgContent.businessData);
        const waitDealType = waitDealTypeList.find(
            (item) => item.dictdataCode === businessData.businessType,
        );
        if (waitDealType && waitDealType.dictdataDesc) {
            const tempRoutePath = waitDealType.dictdataDesc;
            let fieldObj: any = {};
            const routeSearch = {
                id: businessData.businessId,
                tabName: businessData.businessNo || businessData.taskName,
            };
            const path = tempRoutePath.split('?')[0];
            const queryParam = parseSearchParams(tempRoutePath);
            if (Object.keys(queryParam).length) {
                if (queryParam[Object.keys(queryParam)[0]] === '') {
                    fieldObj[Object.keys(queryParam)[0]] =
                        businessData.businessId;
                } else {
                    fieldObj = Object.assign(queryParam);
                }
            }

            if (businessData.businessType.includes('Process')) {
                fieldObj.processId = businessData.businessType;
            }

            openPage({
                path,
                search: Object.assign(fieldObj, routeSearch),
            });
        } else {
            message.info(t('未配置该类型代办，请联系管理员'));
        }
    };

    const onItemClick = async (e: any, messageItem: any) => {
        // TODO 按照消息类型打开模态框还是跳转代办对应的子页面
        dispatch(afterRead(props, messageItem));
        // 待办类型，需要获取代办详情
        if (messageItem.msgType !== '9') {
            openModal(UPDATE_MODAL_ID, {
                type: 'edit',
                node: messageItem,
            });
            return;
        }
        skipWaitDeal(messageItem);
    };

    return (
        <>
            <div className={styles.view}>
                <div className={styles.content}>
                    <div>
                        <span className={styles.searchTitle}>
                            {t('消息类型')}
                        </span>
                        <Select
                            className={styles.noticeSearch}
                            value={searchParams.noticeType}
                            onChange={(e) => inputChange(e)}
                        >
                            {noticeTypeList.map(
                                ({
                                    dictdataName,
                                    dictdataValue,
                                    dictdataId,
                                }: any) => (
                                    <Select.Option
                                        key={dictdataId}
                                        value={dictdataValue}
                                    >
                                        {dictdataName}
                                    </Select.Option>
                                ),
                            )}
                        </Select>
                    </div>
                    <div className={styles.right}>
                        <Radio.Group
                            className={styles.select}
                            defaultValue=""
                            buttonStyle="solid"
                            value={searchParams.umReadStatus}
                            onChange={onChangeReadStatus}
                        >
                            <Radio.Button value="">{t('全部')}</Radio.Button>
                            <Radio.Button value="0">{t('未读')}</Radio.Button>
                            <Radio.Button value="1">{t('已读')}</Radio.Button>
                        </Radio.Group>
                        <Button
                            className={styles.search}
                            type="primary" // icon={<PortalIcon iconClass="icon-portal-delete" className={styles.commonOperationIcon} style={{ marginRight: 5 }} />}
                            danger
                            onClick={() => dispatch(readAllNotice(props))}
                            action={{
                                id: 'readAllNotice',
                                module: id,
                                position: [
                                    props.menu?.menuName || t('消息中心'),
                                    t('一键已读'),
                                ],
                                action: 'modify',
                                wait: true,
                            }}
                        >
                            {t('一键已读')}
                        </Button>
                    </div>
                </div>
                <List
                    split={false}
                    dataSource={tableDataSource}
                    renderItem={(item: any, index: any) => (
                        <List.Item
                            key={item.id}
                            onClick={(e) => onItemClick(e, item)}
                        >
                            <div className={styles.list}>
                                <div className={styles.rowItem}>
                                    <span className={styles.msgType}>
                                        {item.msgTypeName}
                                    </span>
                                    <div className={styles.right}>
                                        <span>{item.msgCreateTime}</span>
                                        {!item.msgStatus && <Badge dot />}
                                    </div>
                                </div>
                                <div className={styles.rowItem}>
                                    <span className={styles.msgContent}>
                                        {item.msgTitle}
                                    </span>
                                </div>
                            </div>
                        </List.Item>
                    )}
                    pagination={{
                        current: pagination.pageNumber,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        // showTotal: (total: any) =>
                        //     `${t('共')} ${total} ${t('条')}`,
                        showTotal: (total: any) => t(`共{{total}}条`, {total}),
                        pageSizeOptions: PAGE_SIZE_OPTIONS,
                        showQuickJumper: true,
                        onChange: onChangePage,
                        showSizeChanger: true,
                        position: 'bottom',
                    }}
                />
            </div>
            <UpdateModal modalId={UPDATE_MODAL_ID} />
        </>
    );
};

export default DataDictConfig;
