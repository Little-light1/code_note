/*
 * @Author: sds
 * @Date: 2021-12-02 09:10:43
 * @Last Modified by: gongzunbao
 * @Last Modified time: 2023-06-26 19:14:48
 */
import React from 'react';
import {shallowEqual} from 'react-redux';
import {Spin, Button, Input, Select} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    PlaySquareOutlined,
    PoweroffOutlined,
} from '@ant-design/icons';
import {useModal, useAction, PageProps} from '@gwaapp/ease';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useTranslation} from 'react-i18next';
import {report} from '@utils/clientAction';
import styles from './styles.module.scss';
import {
    USER_MODAL_ID,
    USER_IMPORT_MODAL_ID,
    USER_STATE,
    USER_LIFE_CYCLE,
    USER_STATE_LIST,
} from '../constant';
import * as actions from '../actions';

interface HeadOperationProps {
    pageProps: PageProps;
    className?: string;
}

const HeadOperation = ({pageProps, className}: HeadOperationProps) => {
    const {id, title, menu} = pageProps;
    const isTreeLoading = useAppSelector(
        (state) => state[id].isTreeLoading,
        shallowEqual,
    );
    const searchKey = useAppSelector(
        (state) => state[id].searchKey,
        shallowEqual,
    );
    const timeLimitKey = useAppSelector(
        (state) => state[id].timeLimitKey,
        shallowEqual,
    );
    const userStateKey = useAppSelector(
        (state) => state[id].userStateKey,
        shallowEqual,
    );
    const dispatch = useAppDispatch();
    const {getPageSimpleActions} = useAction();
    const simpleActions = getPageSimpleActions(id);
    const {openModal} = useModal();
    const {t} = useTranslation();

    // 新增
    const addUser = () => {
        openModal(USER_MODAL_ID, {
            type: 'add',
        });
    };

    // 注销
    const deleteUser = () => {
        dispatch(actions.deleteUser(pageProps));
    };

    // 激活、休眠、注销
    const updateState = (type: string) => {
        dispatch(actions.updateUser(pageProps, type));
    };

    // 导入
    const importExcel = () => {
        openModal(USER_IMPORT_MODAL_ID); // dispatch(actions.importExcel(pageProps));
    };

    // 导出
    const exportExcel = () => {
        dispatch(actions.exportExcel(pageProps));
    };

    // 下载模板
    const downloadTemplateExcel = () => {
        dispatch(actions.downloadTemplate(pageProps));
    };

    // 使用期限过滤
    const onTimeLimitChange = (e) => {
        report.action({
            id: 'search',
            module: id,
            position: [menu?.menuName ?? '', t('使用期限过滤')],
            action: 'query',
            wait: true,
        });
        dispatch(
            simpleActions.set({
                timeLimitKey: e,
                current: 1,
            }),
        );
    };

    // 使用期限过滤清除
    const onTimeLimitClear = () => {
        dispatch(
            simpleActions.set({
                timeLimitKey: null,
            }),
        );
    };

    // 使用状态过滤
    const onUserStateChange = (e) => {
        report.action({
            id: 'search',
            module: id,
            position: [menu?.menuName ?? '', t('使用状态过滤')],
            action: 'query',
            wait: true,
        });
        dispatch(
            simpleActions.set({
                userStateKey: e,
                current: 1,
            }),
        );
    };

    // 使用状态过滤清除
    const onUserStateClear = () => {
        dispatch(
            simpleActions.set({
                userStateKey: null,
                current: 1,
            }),
        );
    };

    // 搜索
    const onSearch = async (value: string) => {
        report.action({
            id: 'search',
            module: id,
            position: [menu?.menuName ?? '', t('搜索')],
            action: 'query',
            wait: true,
        });
        dispatch(
            simpleActions.set({
                searchKey: value.trim(),
                current: 1,
            }),
        );
    };

    return (
        <Spin
            spinning={isTreeLoading}
            wrapperClassName={`${styles.view} ${className}`}
        >
            <div className={styles.content}>
                <div className={styles.groupButton}>
                    <Button
                        className={styles.normal}
                        onClick={addUser}
                        icon={<PlusOutlined />}
                        action={{
                            id: 'addOrUpdate',
                            module: id,
                            position: [
                                menu?.menuName ?? '',
                                t('新建'),
                                t('保存'),
                            ],
                            action: 'add',
                            wait: true,
                        }}
                    >
                        {t('新建')}
                    </Button>
                    <Button
                        className={styles.delete}
                        onClick={deleteUser}
                        icon={<DeleteOutlined />}
                        action={{
                            id: 'delete',
                            module: id,
                            position: [
                                menu?.menuName ?? '',
                                t('注销'),
                                t('是'),
                            ],
                            action: 'delete',
                            wait: true,
                        }}
                    >
                        {t('注销')}
                    </Button>
                    <Button
                        className={styles.normal}
                        onClick={() => updateState(USER_STATE.ENABLE.enum)}
                        icon={<PlaySquareOutlined />}
                        action={{
                            id: 'activeOrDisable',
                            module: id,
                            position: [
                                menu?.menuName ?? '',
                                USER_STATE.ENABLE.name,
                            ],
                            action: 'modify',
                            wait: true,
                        }}
                    >
                        {t('激活')}
                    </Button>
                    <Button
                        className={styles.normal}
                        onClick={() => updateState(USER_STATE.SLEEP.enum)}
                        icon={<PoweroffOutlined />}
                        action={{
                            id: 'activeOrDisable',
                            module: id,
                            position: [
                                menu?.menuName ?? '',
                                USER_STATE.SLEEP.name,
                            ],
                            action: 'modify',
                            wait: true,
                        }}
                    >
                        {t('休眠')}
                    </Button>
                    <Button
                        className={styles.export}
                        onClick={importExcel}
                        action={{
                            id: 'import',
                            module: id,
                            position: [
                                menu?.menuName ?? '',
                                t('导入'),
                                t('上传文件'),
                            ],
                            action: 'import',
                            wait: true,
                        }}
                    >
                        {t('导入')}
                    </Button>
                    <Button
                        className={styles.export}
                        onClick={exportExcel}
                        action={{
                            id: 'export',
                            module: id,
                            position: [menu?.menuName ?? '', t('导出')],
                            action: 'export',
                            wait: true,
                        }}
                    >
                        {t('导出')}
                    </Button>
                    <Button
                        className={styles.export}
                        onClick={downloadTemplateExcel}
                        action={{
                            id: 'download',
                            module: id,
                            position: [menu?.menuName ?? '', t('模板下载')],
                            action: 'export',
                            wait: true,
                        }}
                    >
                        {t('模板下载')}
                    </Button>
                    <span>
                        {`${t('使用周期')}:`}
                        <Select
                            placeholder={t('请选择')}
                            showArrow
                            allowClear
                            value={timeLimitKey}
                            onClear={onTimeLimitClear}
                            onChange={onTimeLimitChange}
                            style={{
                                width: 130,
                            }}
                        >
                            {USER_LIFE_CYCLE.map((ele: any) => (
                                <Select.Option key={ele.key} value={ele.value}>
                                    {ele.text}
                                </Select.Option>
                            ))}
                        </Select>
                    </span>
                    <span>
                        {`${t('使用状态')}:`}
                        <Select
                            placeholder={t('请选择')}
                            showArrow
                            allowClear
                            value={userStateKey}
                            onClear={onUserStateClear}
                            onChange={onUserStateChange}
                            style={{
                                width: 130,
                            }}
                        >
                            {USER_STATE_LIST.map((ele: any) => (
                                <Select.Option key={ele.key} value={ele.value}>
                                    {ele.text}
                                </Select.Option>
                            ))}
                        </Select>
                    </span>
                    <Input.Search
                        className={styles.search}
                        defaultValue={searchKey}
                        onSearch={onSearch}
                        placeholder={`${t('用户账号')}/${t('用户名称')}`}
                        enterButton
                    />
                </div>
            </div>
        </Spin>
    );
};

export default HeadOperation;
