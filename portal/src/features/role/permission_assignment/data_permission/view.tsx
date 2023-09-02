import React, {FC, MutableRefObject, useEffect} from 'react';
import {FormInstance, Radio, Space, Form} from 'antd';
import {CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import {useMount} from 'ahooks';
import {shallowEqual} from 'react-redux';
import {SelectTable as Table} from '@components/table';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useAction, PageProps} from '@gwaapp/ease';
import {i18nIns} from '@/app/i18n';
import SearchTreeWrapper from './search_tree_wrapper';
import {
    onInit,
    toggleSystem,
    toggleScope,
    selectOrg,
    submitSystem,
    submit,
    cancelSystem,
} from './actions';
import {CUSTOM_SCOPE, columns} from './constant';
import {useHelper} from './hooks';
import styles from './styles.module.scss';

const {t} = i18nIns;

interface DataPermissionProps {
    pageProps: PageProps;
    record: any;
    onEdit: (props: {[key: string]: boolean}) => void;
    dataForm: MutableRefObject<FormInstance | null>;
    isEdited:
        | false
        | {
              [key: string]: boolean;
          };
}

const DataPermission: FC<DataPermissionProps> = ({
    pageProps,
    record,
    dataForm,
    isEdited,
    onEdit,
}) => {
    const {id} = pageProps;
    const dispatch = useAppDispatch();
    const {getPageSimpleActions} = useAction();
    const {
        activeSystem,
        systems,
        activeScope,
        scopes,
        productOrgTree,
        orgIds,
        deviceIds,
        selectedOrgId,
        devices,
        expandOrgKeys,
    } = useAppSelector((state) => state[id], shallowEqual);
    const {filterTable} = useHelper();
    useMount(() => {
        dispatch(onInit(pageProps, record));
    });
    useEffect(() => {
        dataForm.current?.setFieldsValue({
            orgIds,
        });
    }, [dataForm, orgIds]);
    useEffect(() => {
        dataForm.current?.setFieldsValue({
            deviceIds: deviceIds[selectedOrgId] || [],
        });
    }, [dataForm, deviceIds, selectedOrgId]);
    return (
        <div className={styles.view}>
            <div className={styles.tabs}>
                {systems.map((system: any) => (
                    <div
                        className={`${styles.tabTitle} ${
                            activeSystem && activeSystem.id === system.id
                                ? styles.active
                                : ''
                        }`}
                        key={system.id}
                        onClick={() => {
                            dispatch(
                                submit(
                                    pageProps,
                                    dataForm.current?.getFieldsValue(),
                                ),
                            );
                            dispatch(toggleSystem(pageProps, system, record));
                        }}
                    >
                        {activeSystem && activeSystem.id === system.id ? (
                            <div className={styles.activeBlock} />
                        ) : null}

                        <div className={styles.title}>
                            <span className={styles.span}>{system.name}</span>
                            {isEdited && isEdited[system.code] ? (
                                <>
                                    <div
                                        className={styles.commonStatusEdited}
                                        style={{
                                            left: 5,
                                        }}
                                    />
                                    <div className={styles.iconGroup}>
                                        <CheckCircleOutlined
                                            className={styles.icon}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                dispatch(
                                                    submit(
                                                        pageProps,
                                                        dataForm.current?.getFieldsValue(),
                                                    ),
                                                );
                                                const appActions =
                                                    getPageSimpleActions('app');
                                                const actions =
                                                    getPageSimpleActions(id);
                                                const submitStatus: any = {
                                                    isSubmitting: true,
                                                    queue: [system.code],
                                                    count: 1,
                                                };
                                                dispatch(
                                                    appActions.set({
                                                        isShowGlobalMask: {
                                                            visible: true,
                                                            text: t(
                                                                '数据提交中,请稍候....',
                                                            ),
                                                        },
                                                    }),
                                                );
                                                dispatch(
                                                    actions.set({
                                                        submitStatus,
                                                    }),
                                                );
                                                dispatch(
                                                    submitSystem(
                                                        pageProps,
                                                        system,
                                                        record,
                                                    ),
                                                );
                                            }}
                                        />
                                        <CloseCircleOutlined
                                            className={styles.icon}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                dispatch(
                                                    cancelSystem(
                                                        pageProps,
                                                        system,
                                                        record,
                                                    ),
                                                );
                                            }}
                                        />
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div className={styles.divider} />
                    </div>
                ))}
            </div>

            <div className={styles.scope}>
                <div className={styles.title}>{t('权限范围')}</div>
                <div className={styles.content}>
                    <Radio.Group
                        value={activeScope && activeScope.value}
                        onChange={(e) => {
                            onEdit(
                                isEdited
                                    ? {...isEdited, [activeSystem.code]: true}
                                    : {
                                          [activeSystem.code]: true,
                                      },
                            );
                            dispatch(toggleScope(pageProps, e.target.value));
                        }}
                    >
                        <Space direction="vertical" size={20}>
                            {scopes.map(({title, value}) => (
                                <Radio value={value} key={value}>
                                    {title}
                                </Radio>
                            ))}
                        </Space>
                    </Radio.Group>
                </div>
            </div>

            {/* 自定义 */}
            <Form
                ref={dataForm}
                className={`${styles.allocation} ${styles.formArea}`}
                initialValues={{
                    orgIds: [],
                    deviceIds: [],
                }}
                onValuesChange={() => {
                    onEdit(
                        isEdited
                            ? {...isEdited, [activeSystem.code]: true}
                            : {
                                  [activeSystem.code]: true,
                              },
                    );
                }}
                onFinish={(values) => {
                    dispatch(submit(pageProps, values));
                }}
            >
                {activeScope && activeScope.value === CUSTOM_SCOPE.value ? (
                    <>
                        <div className={styles.organization}>
                            <div className={styles.title}>{t('组织机构')}</div>
                            <Form.Item
                                name="orgIds"
                                valuePropName="checkedKeys"
                                trigger="onCheck"
                                className={styles.fomItem}
                            >
                                <SearchTreeWrapper
                                    pageProps={pageProps}
                                    treeData={productOrgTree}
                                    expandedKeys={expandOrgKeys}
                                    selectedKeys={[selectedOrgId]}
                                    onSelect={(selectedKeys: React.Key[]) => {
                                        if (!selectedKeys.length) {
                                            return;
                                        }

                                        dispatch(
                                            selectOrg(
                                                pageProps,
                                                selectedKeys.length
                                                    ? selectedKeys[0]
                                                    : '',
                                                dataForm.current?.getFieldsValue()
                                                    .deviceIds ?? [],
                                                record,
                                            ),
                                        );
                                    }}
                                />
                            </Form.Item>
                        </div>

                        <div className={styles.device}>
                            <div className={styles.title}>{t('设备列表')}</div>
                            <Form.Item
                                name="deviceIds"
                                valuePropName="selectedRowKeys"
                                trigger="onSelect"
                                className={`${styles.fomItem} ${styles.formItemNoBorder}`}
                                style={{
                                    paddingTop: 5,
                                }}
                            >
                                <Table
                                    className={styles.tableArea}
                                    columns={columns}
                                    indexWidth={50}
                                    dataSource={devices}
                                    showIndex
                                    rowKey="id"
                                    showSearch={`${t(
                                        '请输入设备类型/设备名称/设备型号',
                                    )}`}
                                    onFilter={filterTable}
                                />
                            </Form.Item>
                        </div>
                    </>
                ) : null}
            </Form>
        </div>
    );
};

export default DataPermission;
