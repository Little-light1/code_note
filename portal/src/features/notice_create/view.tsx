import React, {FC, useCallback, useEffect} from 'react';
import {shallowEqual} from 'react-redux';
import {PlusOutlined} from '@ant-design/icons';
import {Button, Col, List, Radio, RadioChangeEvent, Row} from 'antd';
import {PAGE_SIZE_OPTIONS} from '@components/table';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useAction, usePage, PageProps, useModal} from '@gwaapp/ease';
import {UPDATE_MODAL_ID} from './constant';
import NoticeModel from './notice_modal';
import styles from './styles.module.scss';
import {onInit, changeSearchVal, getSendBoxData, getOrgTree} from './actions';
import SelectSope from './notice_modal/select_scope_model/index';
import SelectTime from './notice_modal/select_time/index';

const DataDictConfig: FC<PageProps> = (props) => {
    const {id} = props;
    const {tableDataSource, pagination, searchParams, userMap, orgMap} =
        useAppSelector((state) => state[id], shallowEqual);
    const dispatch = useAppDispatch();
    const {getPageSimpleActions} = useAction();
    const {t} = useTranslation();
    const modeLabel = {
        1: t('已发送'),
        2: t('待发送'),
        0: t('草稿'),
    };
    const {openModal} = useModal();
    const actions = getPageSimpleActions(id);
    const onChangePage = useCallback(
        (page: any, pageSize: any) => {
            const pageInfo = {...pagination, pageNumber: page, pageSize};
            dispatch(
                actions.set({
                    pagination: pageInfo,
                }),
            );
            dispatch(getSendBoxData(props));
        },
        [actions, dispatch, pagination, props],
    );
    usePage({...props, init: (pageProps) => dispatch(onInit(pageProps))});
    useEffect(() => {
        dispatch(getOrgTree(props));
    }, []);
    const onChangeReadStatus = (e: RadioChangeEvent) => {
        dispatch(
            actions.set({
                pagination: {
                    pageNumber: 1,
                    pageSize: 20,
                    total: 0,
                },
            }),
        );
        dispatch(changeSearchVal(props, e.target.value, 0));
        dispatch(getSendBoxData(props));
    };

    const onItemClick = (e: any, messageItem: any) => {
        openModal(UPDATE_MODAL_ID, {
            type: 'edit',
            record: messageItem,
        });
        const orgs = messageItem?.umOrgIdLidt.map((i) => orgMap[i]);
        const users = messageItem?.umUserIds.map((i) => userMap[i]);
        dispatch(
            actions.set({
                selectScopeName: [].concat[orgs].concat[users],
            }),
        );
    };

    return (
        <div className={styles.view}>
            <div className={styles.content}>
                <NoticeModel pageProps={props} modalId={UPDATE_MODAL_ID} />
                <div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() =>
                            openModal(UPDATE_MODAL_ID, {
                                type: 'add',
                            })
                        }
                    >
                        {/* 新建 */}
                        {t('新建')}
                    </Button>
                </div>
                <div className={styles.right}>
                    <Radio.Group
                        className={styles.select}
                        defaultValue=""
                        buttonStyle="solid"
                        value={searchParams.msgState}
                        onChange={onChangeReadStatus}
                    >
                        <Radio.Button value="">{t('全部')}</Radio.Button>
                        <Radio.Button value="1">{t('已发送')}</Radio.Button>
                        <Radio.Button value="2">{t('待发送')}</Radio.Button>
                        <Radio.Button value="0">{t('草稿')}</Radio.Button>
                    </Radio.Group>
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
                                    {item.msgTitle}
                                </span>
                                <div className={styles.right}>
                                    <span>
                                        {item.msgState === '2'
                                            ? item.msgSendTime
                                            : item.msgCreateTime}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.msgRow}>
                                <span className={styles.msgContent}>
                                    {item.msgContentStr}
                                </span>
                                <span className={styles.pushRight}>
                                    {modeLabel[item.msgState]}
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
            <SelectSope pageProps={props} />
            <SelectTime pageProps={props} />
        </div>
    );
};

export default DataDictConfig;
