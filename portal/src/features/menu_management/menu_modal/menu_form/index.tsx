import React, {useCallback, useEffect, useState} from 'react';
import {shallowEqual} from 'react-redux';
import {Row, Col, Form, Input, Switch, Select, message, Button} from 'antd';
import {useModal, useAction} from '@gwaapp/ease';
import {
    checkAbsUrl,
    checkRelUrl,
    // onlyCnEnNo,
    // onlyCnEnNoMsg,
    regNoCnEnPu,
    regNoCnEnPuMsg,
} from '@utils/reg';
import SortInput from '@/components/sort_input';
import {UploadImage} from '@/components/upload';
import {SearchTreeSelect} from '@/components/tree';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {validateFile} from '@/common/utils/file';
import {Events} from '@common/events';
import {useTranslation} from 'react-i18next';
import {submit} from '../actions';
import styles from './styles.module.scss';
import {MenuTypeModel} from '../../types';
// import {getMenuTypes} from '../../actions';

const MenuForm = ({
    pageProps,
    formRef,
    parent,
    modalType,
    modalId,
    record,
}: any) => {
    const {id} = pageProps;
    const dispatch = useAppDispatch();
    const {closeModal} = useModal();
    const {t} = useTranslation();
    const {menuTree, flatMenuTree, editMenuTree, menuTypes, targetTypes} =
        useAppSelector((state) => state[id], shallowEqual);
    const {
        handlers: {trigger},
        getPageSimpleActions,
    } = useAction();
    const appAction = getPageSimpleActions('app');
    const {modalState: menuFormModelState} = useAppSelector(
        (state) => state.app,
        shallowEqual,
    );
    const actions = getPageSimpleActions(id);
    const [internalParent, setInternalParent] = useState(null);
    const [internalMenuType, setInternalMenuType] = useState(-1);
    const [internalTargetType, setInternalTargetType] = useState(-1);
    const location = window.document.location;
    const checkValidate = useCallback(
        (file) =>
            validateFile({
                file,
                types: ['image/jpeg', 'image/png', 'image/gif'],
                // 'image/svg+xml', 'image/x-icon'
                size: [100, 'KB'],
                picture: {
                    height: 48,
                    width: 48,
                },
            }),
        [],
    ); // 初始化选择状态

    useEffect(() => {
        let fields: {
            [key: string]: any;
        } = {}; // 初始化当前选中parent

        if (parent) {
            setInternalParent(parent);
            fields.menuParentid = [parent.key];
        } // 父有可能取不到，没有配置父的权限
        else if (record && record.menuParentid !== 0) {
            setInternalParent(flatMenuTree[record.menuParentid]);
            fields.menuParentid = [record.menuParentid];
        } else {
            setInternalParent(menuTree[0]);
            fields.menuParentid = [menuTree[0].key];
        }

        if (record) {
            const menuType = Number(record.menuType);

            if (menuType) {
                setInternalMenuType(Number(menuType));
                fields.menuType = Number(menuType);
            }
        } else if (menuTypes && menuTypes.length > 0) {
            // 默认类型为操作类 dictdataValue值为 2
            const defaultValue = 4;
            const filterMenuTypes = menuTypes.filter(
                (item: any) => item.dictdataValue === defaultValue,
            );
            let defaultMenuType = menuTypes[0];

            if (filterMenuTypes && filterMenuTypes.length > 0) {
                defaultMenuType = filterMenuTypes[0];
            }

            const {dictdataValue} = defaultMenuType;
            setInternalMenuType(dictdataValue);
            fields.menuType = dictdataValue;
        } // 编辑态
        if (record) {
            const targetType = Number(record.targetType);

            if (targetType) {
                setInternalTargetType(Number(targetType));
                fields.targetType = Number(targetType);
            }
        }

        // TODO 后续优化跳转类型默认值逻辑
        // else if (targetTypes && targetTypes.length > 0) {
        //     // 默认跳转类型为内部 dictdataValue值为 0
        //     const defaultTargetTypeValue = 0;
        //     const filterTargetTypes = targetTypes.filter(
        //         (item: any) => item.dictdataValue === defaultTargetTypeValue,
        //     );
        //     let defaultTargetType = targetTypes[0];

        //     if (filterTargetTypes && filterTargetTypes.length > 0) {
        //         defaultTargetType = filterTargetTypes[0];
        //     }

        //     const dictdataMenuValue = defaultTargetType.dictdataValue;
        //     setInternalTargetType(Number(dictdataMenuValue));
        //     fields.targetType = Number(dictdataMenuValue);
        // }
        if (modalType === 'edit' && record) {
            fields = {...record, ...fields};
        }

        formRef.current && formRef.current.setFieldsValue(fields);
    }, [
        flatMenuTree,
        formRef,
        menuTree,
        menuTypes,
        targetTypes,
        modalType,
        parent,
        record,
    ]);

    const onFill = () => {
        const path = encodeURI(
            formRef.current.getFieldsValue()?.menuRoutingPath || '',
        );
        const portalPath = window.aappAmbariConfigs.aapp_gateway_path;
        if (path.indexOf(portalPath) !== -1) {
            message.warning(t('已引用地址无法重复一键引用'));
            return;
        }
        formRef.current &&
            formRef.current.setFieldsValue({
                menuRoutingPath: `${portalPath}/aapp-bi/bi/white/getRedirectBiReportUrl?url=${path}`,
            });
    };

    return (
        <Form
            ref={formRef}
            className={styles.form}
            name="menu_management_update_modal"
            validateTrigger="onBlur"
            labelCol={{span: 10}}
            initialValues={{
                menuSort: 1,
                menuIconEnable: true,
                menuEnable: true,
                menuVisible: true,
            }}
            onFinish={(values) => {
                // 禁止全路径跳转本系统
                if (values.menuRoutingPath?.includes(location.host)) {
                    message.error(t('跳转本系统界面，请填写相对路径路由地址'));
                    return;
                }
                // 跳转类型选择外部时,路由地址必须是http或者https开头
                if (values.targetType === 1) {
                    if (!checkAbsUrl(values.menuRoutingPath)) {
                        message.error(
                            t(
                                '跳转类型为外部时，路由地址必须是带协议的完整地址',
                            ),
                        );
                        return;
                    }
                } else if (values.targetType === 0) {
                    if (checkAbsUrl(values.menuRoutingPath)) {
                        // 禁止经门户网关转发时配置http或仅配置http网址
                        if (
                            values.menuRoutingPath.indexOf(
                                window.aappAmbariConfigs.aapp_gateway_path,
                            ) !== -1 &&
                            values.menuRoutingPath?.split('url=').length > 1
                        ) {
                            const redirectUrl =
                                values.menuRoutingPath?.split('url=')[1];
                            if (redirectUrl.indexOf('https') === -1) {
                                message.error(
                                    t('内部跳转的路由地址必须为https协议'),
                                );
                                return;
                            }
                        } else {
                            const redirectUrl =
                                values.menuRoutingPath?.split('url=')[0];
                            if (redirectUrl.indexOf('https') === -1) {
                                message.error(
                                    t('内部跳转的路由地址必须为https协议'),
                                );
                                return;
                            }
                        }
                    }
                }
                dispatch(submit(pageProps, values, record)).then(
                    ({isRefreshFrameMenus, isCloseModal = false}) => {
                        isRefreshFrameMenus &&
                            trigger(Events.update_product_menus);

                        if (isCloseModal) {
                            closeModal(modalId);
                            dispatch(
                                actions.set({
                                    currentMenu: null,
                                }),
                            );
                        } else {
                            const menuManagement = {
                                parent: internalParent,
                                type: menuFormModelState.menuManagement.type,
                            };
                            dispatch(
                                appAction.set({
                                    modalState: {
                                        menuManagement,
                                    },
                                }),
                            );
                        }
                    },
                );
            }}
        >
            <Row>
                <Col span={11}>
                    {/* 上级菜单 */}
                    <Form.Item
                        name="menuParentid"
                        label={t('上级菜单')}
                        trigger="onSelect"
                        valuePropName="selectedKeys"
                    >
                        <SearchTreeSelect
                            treeData={
                                modalType === 'edit' ? editMenuTree : menuTree
                            }
                            checkable={false}
                            value={internalParent?.title ?? ''}
                            defaultExpandedKeys={[menuTree[0].key]}
                            onSelect={(selectedKeys, selectedNodes: any[]) => {
                                const [node] = selectedNodes;
                                if (!node) return;
                                formRef.current &&
                                    formRef.current.setFieldsValue({
                                        ...formRef.current.getFieldsValue(),
                                        menuParentid: selectedKeys,
                                    });
                                setInternalParent(node);
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={11}>
                    {/* 菜单名称 */}
                    <Form.Item
                        name="menuName"
                        label={t('菜单名称')}
                        rules={[
                            {
                                required: true,
                            },
                            {
                                pattern: regNoCnEnPu,
                                message: regNoCnEnPuMsg,
                            },
                        ]}
                    >
                        <Input maxLength={20} />
                    </Form.Item>
                </Col>
                <Col span={11} offset={1}>
                    {/* 排序 */}
                    <Form.Item
                        name="menuSort"
                        label={t('排序')}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <SortInput />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={22}>
                    {/* 路由地址 */}
                    <Form.Item
                        labelCol={{span: 5}}
                        name="menuRoutingPath"
                        label={t('路由地址')}
                        rules={[
                            // {required: true},
                            {
                                validator: async (rule, value) => {
                                    if (!value) {
                                        return true;
                                    }
                                    if (
                                        checkAbsUrl(value) ||
                                        checkRelUrl(value)
                                    ) {
                                        return true;
                                    }
                                    throw new Error(
                                        t(
                                            '请输入相对路径或者绝对路径,绝对路径需包含协议',
                                        ),
                                    ); // 请输入相对路径或者绝对路径,绝对路径需包含协议
                                },
                            },
                        ]}
                    >
                        <Input maxLength={300} allowClear />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={22} className={styles.tip}>
                    <span className={styles.span}>
                        {t(
                            '说明：若配置bi报表地址，在录完地址后需要带入BI后缀，点此',
                        )}
                    </span>
                    <span className={styles.fillin} onClick={onFill}>
                        {t('一键引用')}
                    </span>
                </Col>
            </Row>
            <Row>
                <Col span={11}>
                    {/* 图标 */}
                    <Form.Item name="menuIconToken" label={t('图标')}>
                        <UploadImage
                            checkValidate={checkValidate}
                            className={styles.upload}
                            showHint={t(
                                '文件格式为: .png、.jpg、.gif, 图片分辨率为: 48 * 48, 大小不超过100k',
                            )}
                        />
                    </Form.Item>
                </Col>
                <Col span={11} offset={1}>
                    {/* 状态 */}
                    <Form.Item
                        name="menuEnable"
                        label={t('状态')}
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren={t('启用')}
                            unCheckedChildren={t('禁用')}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={11}>
                    {/* 类型 */}
                    <Form.Item name="menuType" label={t('类型')}>
                        <Select
                            value={internalMenuType}
                            disabled={modalType === 'edit'}
                        >
                            {menuTypes.map((item: MenuTypeModel) => (
                                <Select.Option
                                    key={item.dictdataValue}
                                    value={item.dictdataValue}
                                >
                                    {item.dictdataName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={11}>
                    {/* 跳转类型 */}
                    <Form.Item
                        name="targetType"
                        label={t('跳转类型')}
                        rules={[{required: true, message: t('请选择跳转类型')}]}
                    >
                        <Select
                            placeholder={t('请选择')}
                            value={internalTargetType}
                            options={targetTypes.map(
                                (targetType: MenuTypeModel) => ({
                                    label: targetType.dictdataName,
                                    value: targetType.dictdataValue,
                                }),
                            )}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={11}>
                    {/* 显示菜单 */}
                    <Form.Item
                        name="menuVisible"
                        label={t('显示菜单')}
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren={t('显示')}
                            unCheckedChildren={t('隐藏')}
                        />
                    </Form.Item>
                </Col>
                <Col span={11} offset={1}>
                    {/* 显示图标 */}
                    <Form.Item
                        name="menuIconEnable"
                        label={t('显示图标')}
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren={t('显示')}
                            unCheckedChildren={t('隐藏')}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default MenuForm;
