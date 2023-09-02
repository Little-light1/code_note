/*
 * @Author: sun.t
 * @Date: 2022-01-05 16:30:02
 * @Last Modified by: gongzunbao
 * @Last Modified time: 2023-06-28 11:00:08
 */
import React, {FC, useCallback, useRef} from 'react';
import {Tabs, Spin, FormInstance, Button} from 'antd';
import {Modal, useModal, useAction, PageProps} from '@gwaapp/ease';
import {useTranslation} from 'react-i18next';
import {shallowEqual} from 'react-redux';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {ROLE_COMPETENCE_MODAL_ID} from '../constant';
import DataPermission from './data_permission/view';
import FunctionPermission from './function_permission/view';
import styles from './styles.module.scss';
import {submitPermission, recover, reset} from './actions';

interface PermissionAssignmentProps {
    pageProps: PageProps;
}
const {TabPane} = Tabs;

const PermissionAssignment: FC<PermissionAssignmentProps> = ({pageProps}) => {
    const functionForm = useRef<FormInstance | null>(null);
    const dataForm = useRef<FormInstance | null>(null);
    const {isRoleLoading, isPermissionEdited, activeKey} = useAppSelector(
        (state) => state[pageProps.id],
        shallowEqual,
    );
    const {id} = pageProps;
    const dispatch = useAppDispatch();
    const {getPageSimpleActions} = useAction();
    const actions = getPageSimpleActions(id);
    const {t} = useTranslation();
    const {state} = useModal();
    const {record = {}} = state[ROLE_COMPETENCE_MODAL_ID] || {};
    const {roleType} = record; // 数据权限角色隐藏功能模块

    const functionIsHidden = Number(roleType) === 5;
    const onEdit = useCallback(
        (key: string, value: Object | boolean = true) => {
            // if (isPermissionEdited[key]) return;
            dispatch(
                actions.set({
                    isPermissionEdited: {...isPermissionEdited, [key]: value},
                }),
            );
        },
        [actions, dispatch, isPermissionEdited],
    );
    return (
        <Modal
            height={600}
            width={activeKey === 'function' ? 800 : 1300}
            id={ROLE_COMPETENCE_MODAL_ID}
            title={`[${record.name}] ${t('权限分配')}`}
            okText={t('保存')}
            destroyOnClose
            maskClosable={false}
            isAutoClose={false}
            onOk={() => {
                dispatch(
                    submitPermission(pageProps, record, functionForm, dataForm),
                );
            }}
            onCancel={() => {
                dispatch(reset(pageProps));
            }}
        >
            <Spin spinning={isRoleLoading} wrapperClassName={styles.loading}>
                <Tabs
                    activeKey={activeKey}
                    type="card"
                    className={styles.view}
                    onChange={(value) => {
                        dispatch(
                            actions.set({
                                activeKey: value,
                            }),
                        );
                    }}
                    tabBarExtraContent={
                        activeKey === 'data' && (
                            <div className={styles.recover}>
                                <Button
                                    size="small"
                                    danger
                                    onClick={() => {
                                        dispatch(recover(pageProps, record));
                                    }}
                                >
                                    {t('重置')}
                                </Button>
                            </div>
                        )
                    }
                >
                    {!functionIsHidden && (
                        <TabPane
                            tab={
                                <div className={styles.tabTitle}>
                                    {t('功能权限')}
                                    {isPermissionEdited.function ? (
                                        <div
                                            className={
                                                styles.commonStatusEdited
                                            }
                                        />
                                    ) : null}
                                </div>
                            }
                            key="function"
                            className={styles.content}
                        >
                            <FunctionPermission
                                pageProps={pageProps}
                                record={record}
                                onEdit={() => onEdit('function')}
                                functionForm={functionForm}
                            />
                        </TabPane>
                    )}

                    <TabPane
                        tab={
                            <div className={styles.tabTitle}>
                                {t('数据权限')}
                                {isPermissionEdited.data &&
                                Object.keys(isPermissionEdited.data).length ? (
                                    <div
                                        className={styles.commonStatusEdited}
                                    />
                                ) : null}
                            </div>
                        }
                        key="data"
                        className={styles.content}
                    >
                        {/* <Spin spinning={isRoleLoading} wrapperClassName={styles.loading}> */}
                        <DataPermission
                            pageProps={pageProps}
                            record={record}
                            onEdit={(systemEdited) =>
                                onEdit('data', systemEdited)
                            }
                            dataForm={dataForm}
                            isEdited={isPermissionEdited.data}
                        />
                        {/* </Spin> */}
                    </TabPane>
                </Tabs>
            </Spin>
        </Modal>
    );
};

export default PermissionAssignment;
