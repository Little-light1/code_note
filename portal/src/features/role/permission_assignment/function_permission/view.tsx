import React, {FC, MutableRefObject, useEffect, useMemo} from 'react';
import {Form, FormInstance} from 'antd';
import {SelectTable as Table} from '@components/table';
import {SearchTree} from '@components/tree';
import {useMount} from 'ahooks';
import {shallowEqual} from 'react-redux';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {PageProps} from '@gwaapp/ease';
import {i18nIns} from '@/app/i18n';
import {onInit, selectMenu} from './actions';
import {dynamicColumns} from './constant';
import styles from './styles.module.scss';

const {t} = i18nIns;

const FunctionPermission: FC<{
    pageProps: PageProps;
    record: any;
    functionForm: MutableRefObject<FormInstance | null>;
    onEdit: () => void;
}> = ({pageProps, record, functionForm, onEdit}) => {
    const {id} = pageProps;
    const dispatch = useAppDispatch();
    const {
        menus,
        menuResources,
        selectedMenuId,
        selectedResourceIds,
        selectedMenuIds,
        resourceTypes,
    } = useAppSelector((state) => state[id], shallowEqual);
    const columns = useMemo(
        () =>
            dynamicColumns({
                resourceTypes,
                t,
            }),
        [resourceTypes],
    ); // 初始化

    useMount(() => {
        dispatch(onInit(pageProps, record));
    }); // 恢复表单表格数据

    useEffect(() => {
        functionForm.current?.setFieldsValue({
            resourceIds: selectedResourceIds,
        });
    }, [selectedResourceIds, functionForm]);
    useEffect(() => {
        functionForm.current?.setFieldsValue({
            menuIds: selectedMenuIds,
        });
    }, [selectedMenuIds, functionForm]);

    const onChange = () => {
        onEdit();
    };

    return (
        <Form
            ref={functionForm}
            className={styles.view}
            initialValues={{
                menuIds: [],
                resourceIds: [],
            }}
            // changedValues, values
            onValuesChange={() => {
                onEdit();
            }}
            // onFinish={(values) => {
            //     dispatch(
            //         submitFunctionPermission({
            //             props: pageProps,
            //             values,
            //             record,
            //         }),
            //     );
            // }}
        >
            <div className={styles.left}>
                <div className={styles.title}>{t('功能目录')}</div>

                <Form.Item
                    name="menuIds"
                    valuePropName="checkedKeys"
                    trigger="onCheck"
                    className={`${styles.fomItem} ${styles.searchTreeArea}`}
                >
                    <SearchTree // checkStrictly
                        treeData={menus}
                        checkable
                        isShowSearch={false}
                        selectedKeys={[selectedMenuId]}
                        onSelect={(
                            selectedKeys: React.Key[],
                            selectedNodes: any,
                        ) =>
                            dispatch(
                                selectMenu({
                                    props: pageProps,
                                    selectedMenuId:
                                        selectedNodes[0]?.menuId ?? '',
                                    currentSelectedResourcesIds:
                                        functionForm.current?.getFieldsValue()
                                            .resourceIds ?? [],
                                }),
                            )
                        }
                    />
                </Form.Item>
            </div>

            <div className={styles.right}>
                <div className={styles.title}>{t('页面资源权限')}</div>

                <Form.Item
                    name="resourceIds"
                    valuePropName="selectedRowKeys"
                    trigger="onSelect"
                    className={styles.fomItem}
                >
                    <Table
                        dropdownPrefixCls="role_permission_assignment"
                        columns={columns}
                        indexWidth={50}
                        dataSource={
                            selectedMenuId && menuResources[selectedMenuId]
                                ? menuResources[selectedMenuId]
                                : []
                        }
                        onChange={onChange}
                        showIndex
                        rowKey="id"
                    />
                </Form.Item>
            </div>
        </Form>
    );
};

export default FunctionPermission;
