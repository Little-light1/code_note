/*
 * @Author: sds
 * @Date: 2022-01-02 13:59:41
 * @Last Modified by: Tomato.Bei
 * @Last Modified time: 2022-11-14 15:39:15
 */
import React from 'react';
import {shallowEqual} from 'react-redux';
import {Spin, Button, Input, Select} from 'antd';
import {useModal, useAction, PageProps} from '@gwaapp/ease';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useTranslation} from 'react-i18next';
import {report} from '@utils/clientAction';
import styles from './styles.module.scss';
import {ROLE_MODAL_ID} from '../constant';
import * as actions from '../actions';
import {LogActionID} from '../types';

interface HeadOperationProps {
    pageProps: PageProps;
    className?: string;
}

const HeadOperation = ({pageProps, className}: HeadOperationProps) => {
    const {id, menu} = pageProps;
    const isListLoading = useAppSelector(
        (state) => state[id].isListLoading,
        shallowEqual,
    );
    const pagination = useAppSelector(
        (state) => state[id].pagination,
        shallowEqual,
    );
    const roleTypeList = useAppSelector(
        (state) => state[id].roleTypeList,
        shallowEqual,
    );
    const roleTypeSelectedKey = useAppSelector(
        (state) => state[id].roleTypeSelectedKey,
        shallowEqual,
    );
    const searchKey = useAppSelector(
        (state) => state[id].searchKey,
        shallowEqual,
    );
    const dispatch = useAppDispatch();
    const {getPageSimpleActions} = useAction();
    const simpleActions = getPageSimpleActions(id);
    const {openModal} = useModal();
    const {t} = useTranslation(); // 新增角色

    const addRole = () => {
        openModal(ROLE_MODAL_ID, {
            type: 'add',
        });
    }; // 搜索角色

    const onSearch = async (value: string) => {
        report.action({
            id: 'search',
            module: id,
            position: [menu?.menuName ?? '', t('搜索')],
            action: 'query',
            wait: true,
        });
        const searchValue = value.trim();
        const paginationClone = JSON.parse(JSON.stringify(pagination));
        await dispatch(
            simpleActions.set({
                pagination: {...paginationClone, current: 1},
                searchKey: searchValue,
            }),
        );
        dispatch(actions.getRoleList(pageProps));
    }; // search change

    const onSearchChange = (e: any) => {
        const value = e.target.value;
        dispatch(
            simpleActions.set({
                searchKey: value,
            }),
        );
    }; // select change

    const onSelectChange = (value: string) => {
        report.action({
            id: 'search',
            module: id,
            position: [menu?.menuName ?? '', t('角色类型过滤')],
            action: 'query',
            wait: true,
        });
        const paginationClone = JSON.parse(JSON.stringify(pagination));
        dispatch(
            simpleActions.set({
                pagination: {...paginationClone, current: 1},
                roleTypeSelectedKey: value || '',
            }),
        );
        dispatch(actions.getRoleList(pageProps));
    }; // 重置

    const reset = () => {
        report.action({
            id: 'search',
            module: id,
            position: [menu?.menuName ?? '', t('重置')],
            action: 'query',
            wait: true,
        });
        const paginationClone = JSON.parse(JSON.stringify(pagination));
        dispatch(
            simpleActions.set({
                pagination: {...paginationClone, current: 1},
                roleTypeSelectedKey: '',
                searchKey: '',
            }),
        );
        dispatch(actions.getRoleList(pageProps));
    };

    return (
        <Spin
            spinning={isListLoading}
            wrapperClassName={`${styles.view} ${className}`}
        >
            <div className={styles.content}>
                <div className={styles.left}>
                    <Button
                        className={styles.normalButton}
                        onClick={addRole}
                        action={{
                            id: LogActionID.Add,
                            module: id,
                            position: [
                                menu?.menuName ?? '',
                                t('新建'),
                                t('确定'),
                            ],
                            action: 'add',
                            wait: true,
                        }}
                    >
                        {t('新建')}
                    </Button>
                </div>
                <div className={styles.right}>
                    <Select
                        className={styles.select}
                        placeholder={t('请选择角色类型')}
                        optionFilterProp="roleType"
                        showSearch
                        showArrow
                        allowClear
                        value={roleTypeSelectedKey || null}
                        onChange={onSelectChange}
                    >
                        {roleTypeList.map((ele: any) => (
                            <Select.Option
                                key={ele.dictdataValue}
                                value={ele.dictdataValue}
                                name={ele.dictdataName}
                            >
                                {ele.dictdataName}
                            </Select.Option>
                        ))}
                    </Select>
                    <Input.Search
                        className={styles.search}
                        onSearch={onSearch}
                        placeholder={t('请输入角色编码/角色名称')}
                        value={searchKey}
                        onChange={onSearchChange}
                        enterButton
                        allowClear
                    />
                    <Button className={styles.normalButton} onClick={reset}>
                        {t('重置')}
                    </Button>
                </div>
            </div>
        </Spin>
    );
};

export default HeadOperation;
