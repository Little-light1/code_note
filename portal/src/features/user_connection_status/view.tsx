/*
 * @Author: selwyn.bishanwen
 * @Date: 2022-08-01 15:38:58
 * @Last Modified by: selwyn.bishanwen
 * @Last Modified time: 2022-12-02 08:53:58
 */
import React, {FC, useMemo, useRef} from 'react';
import {shallowEqual} from 'react-redux';
import {getUniqueKey, PageProps, useAction, usePage} from '@gwaapp/ease';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {PAGE_SIZE_OPTIONS, Table} from '@components/table';
import {useTranslation} from 'react-i18next';
import styles from './styles.module.scss';
import SearchForm from './search_form';
import {clearTimer, getTableData, onInit, resetTimer} from './actions';
import {nullToDoubleBar} from './constants';

const Component: FC<PageProps> = (props) => {
    const {id} = props;
    const {getPageSimpleActions} = useAction();
    const actions = getPageSimpleActions(id);
    const dispatch = useAppDispatch(); // 获取状态树中的数据
    const {t} = useTranslation();

    const {listData, total, pageNum, pageSize, listLoading} = useAppSelector(
        (state) => state[getUniqueKey(id)],
        shallowEqual,
    ); // 定时器，3秒轮询当前页面数据

    const timerRef = useRef();
    const columns: any = useMemo(
        () => [
            {
                title: t('序号'),
                dataIndex: 'index',
                key: 'index',
                align: 'center',
                ellipsis: true,
                width: 120,
                render: (text: any, record: any, index: any) => {
                    const number = (pageNum - 1) * pageSize + index + 1;
                    return number;
                },
            },
            {
                // 用户账号
                title: t('用户账号'),
                dataIndex: 'loginName',
                key: 'loginName',
                width: 200,
                align: 'center',
                ellipsis: true,
                render: (value: any) => nullToDoubleBar(value),
            },
            {
                // 用户姓名
                title: t('用户名称'),
                dataIndex: 'userName',
                key: 'userName',
                width: 200,
                align: 'center',
                ellipsis: true,
                render: (value: any) => nullToDoubleBar(value),
            },
            {
                // 组织机构
                title: t('所属组织机构'),
                dataIndex: 'organization',
                key: 'organization',
                width: 200,
                align: 'center',
                ellipsis: true,
                render: (value: any) => nullToDoubleBar(value?.name),
            },
            {
                // 用户类型
                title: t('用户类型'),
                dataIndex: 'type',
                key: 'type',
                width: 200,
                align: 'center',
                ellipsis: true,
                render: (value: any) => nullToDoubleBar(value?.desc),
            },
            {
                // 使用周期
                title: t('使用周期'),
                dataIndex: 'timeLimit',
                key: 'timeLimit',
                width: 200,
                align: 'center',
                ellipsis: true,
                render: (value: any) => nullToDoubleBar(value?.desc),
            },
            {
                // 连接状态
                title: t('连接状态'),
                dataIndex: 'onlineState',
                key: 'onlineState',
                width: 200,
                align: 'center',
                ellipsis: true,
                render: (value: any) => nullToDoubleBar(value?.desc),
            },
        ],
        [pageNum, pageSize, t],
    );
    usePage({
        ...props,
        init: (pageProps) => dispatch(onInit(pageProps)),
        activate: (pageProps) => {
            dispatch(
                actions.set({
                    canResetTimer: true,
                }),
            );
            dispatch(resetTimer(pageProps));
        },
        inactivate: () => {
            dispatch(
                actions.set({
                    canResetTimer: false,
                }),
            );
            dispatch(clearTimer());
        },
        close: () => {
            dispatch(
                actions.set({
                    canResetTimer: false,
                }),
            );
            dispatch(clearTimer());
        },
    });

    const onTableChange = (page: number, size: number) => {
        dispatch(
            actions.set({
                pageNum: page,
                pageSize: size,
            }),
        );
        dispatch(getTableData(props, true, true));
    };

    return (
        <div className={styles.searchView}>
            {/* 搜索栏 */}
            <SearchForm props={props} timerRef={timerRef} />
            <div className={styles.tableArea}>
                <Table
                    loading={listLoading}
                    columns={columns}
                    dataSource={listData}
                    pagination={{
                        total,
                        // showTotal: () => `${t('共')} ${total} ${t('条')}`,
                        showTotal: (total: any) =>
                            t(`共{{total}}条`, {total: total}),
                        pageSize,
                        current: pageNum,
                        pageSizeOptions: PAGE_SIZE_OPTIONS,
                        onChange: onTableChange,
                    }}
                />
            </div>
        </div>
    );
};

export default Component;
