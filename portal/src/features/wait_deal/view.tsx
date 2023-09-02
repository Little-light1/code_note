import React, {FC, useCallback} from 'react';
import {shallowEqual} from 'react-redux';
import {Button, Select, List, Radio, RadioChangeEvent, message} from 'antd';
import {PAGE_SIZE_OPTIONS} from '@components/table';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useAction, usePage, PageProps} from '@gwaapp/ease';
import {parseSearchParams} from '@/common/utils/url';
import styles from './styles.module.scss';
import {onInit, changeSearchVal, getWaitDealList} from './actions';

const DataDictConfig: FC<PageProps> = (props) => {
    const {id} = props;
    const {tableDataSource, pagination, searchParams, waitDealTypeList} =
        useAppSelector((state) => state[id], shallowEqual);
    const {subSystems} = useAppSelector((state) => state.app, shallowEqual);
    const dispatch = useAppDispatch();
    const {getPageSimpleActions, handlers} = useAction();
    const {openPage} = handlers;
    const actions = getPageSimpleActions(id);
    const {t} = useTranslation(); // 生成列配置
    const systems = [{code: '', name: t('全部')}].concat(subSystems);
    const onChangePage = useCallback(
        (page: any, pageSize: any) => {
            const pageInfo = {...pagination, pageNumber: page, pageSize};
            dispatch(
                actions.set({
                    pagination: pageInfo,
                }),
            );
            dispatch(getWaitDealList(props));
        },
        [actions, dispatch, pagination, props],
    );
    usePage({...props, init: (pageProps) => dispatch(onInit(pageProps))});

    const inputChange = (e: any, type: Number) => {
        if (type === 0) {
            dispatch(changeSearchVal(props, e, 0));
        } else if (type === 1) {
            dispatch(changeSearchVal(props, e, 1));
        }
        dispatch(getWaitDealList(props));
    };

    const onItemClick = (e: any, messageItem: any) => {
        const waitDealType = waitDealTypeList.find(
            (item) => item.dictdataCode === messageItem.businessType,
        );
        if (waitDealType && waitDealType.dictdataDesc) {
            const tempRoutePath = waitDealType.dictdataDesc;
            let fieldObj: any = {};
            const routeSearch = {
                id: messageItem.businessId,
                tabName: messageItem.businessNo || messageItem.taskName,
            };
            const path = tempRoutePath.split('?')[0];
            const queryParam = parseSearchParams(tempRoutePath);
            if (Object.keys(queryParam).length) {
                if (queryParam[Object.keys(queryParam)[0]] === '') {
                    fieldObj[Object.keys(queryParam)[0]] =
                        messageItem.businessId;
                } else {
                    fieldObj = Object.assign(queryParam);
                }
            }

            if (messageItem.businessType.includes('Process')) {
                fieldObj.processId = messageItem.businessType;
            }

            openPage({
                path,
                search: Object.assign(fieldObj, routeSearch),
            });
        } else {
            message.info(t('未配置该类型代办，请联系管理员'));
        }
    };

    return (
        <div className={styles.view}>
            <div className={styles.content}>
                <div>
                    <span className={styles.searchTitle}>{t('来源')}</span>
                    <Select
                        className={styles.noticeSearch}
                        value={searchParams.proCode}
                        onChange={(e) => inputChange(e, 0)}
                    >
                        {systems.map(({code, name}: any) => (
                            <Select.Option key={code} value={code}>
                                {name}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </div>
            <List
                split={false}
                dataSource={tableDataSource}
                renderItem={(item: any) => (
                    <List.Item
                        key={item.id}
                        onClick={(e) => onItemClick(e, item)}
                    >
                        <div className={styles.list}>
                            <div className={styles.rowItem}>
                                <span className={styles.msgType}>
                                    {item.name}
                                </span>
                                <div className={styles.right}>
                                    <span>{item.businessStateStr}</span>
                                </div>
                            </div>
                            <div className={styles.rowItem}>
                                <span className={styles.msgContent}>
                                    {item.createTime}
                                </span>
                                <span className={styles.msgContent}>
                                    {t('来源：') + item.proName}
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
                    onChange: onChangePage,
                    showSizeChanger: true,
                    position: 'bottom',
                }}
            />
        </div>
    );
};

export default DataDictConfig;
