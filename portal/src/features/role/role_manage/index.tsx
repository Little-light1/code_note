/*
 * @Author: sds
 * @Date: 2022-01-04 10:02:16
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-09-02 09:43:30
 */
import React, {useState, useEffect} from 'react';
import {Form, Input, message, Spin, Switch, Select} from 'antd';
import {Modal, useModal, PageProps} from '@gwaapp/ease';
import * as roleServices from '@services/role';
import {checkEmoji, checkEmojiMsg} from '@utils/reg';
import {shallowEqual} from 'react-redux';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {report} from '@utils/clientAction';
import {i18nIns} from '@/app/i18n';
import styles from './styles.module.scss';
import {ROLE_MODAL_ID} from '../constant';
import * as actions from '../actions';
import {LogActionID} from '../types';

const {t} = i18nIns;

const formItemLayout = {
    labelCol: {
        span: 6,
    }, // wrapperCol: {span: 18},
};
interface Props {
    pageProps: PageProps;
}

const UserManage = ({pageProps}: Props) => {
    const {id} = pageProps;

    const dispatch = useAppDispatch();
    const roleTypeList = useAppSelector(
        (state) => state[id].roleTypeList,
        shallowEqual,
    );
    const [form] = Form.useForm();
    const {closeModal, state} = useModal();
    const {type, record} = state[ROLE_MODAL_ID] || {};
    const isEdited = type === 'edit';
    const title = isEdited ? t('编辑') : t('新建');
    const actionID = isEdited ? LogActionID.Modify : LogActionID.Add;
    const serviceMethod = isEdited ? 'updateRole' : 'addRole';
    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        form.resetFields();
    };

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                setLoading(true);
                isEdited && (values.id = record.id); // 1 禁用 0 激活

                values.state = values.state === true ? 0 : 1;
                const actionRoleName = isEdited ? record.name : values.name;
                const msgTitle = isEdited ? t('编辑角色') : t('新增角色');
                const action = {
                    id: actionID,
                    module: id,
                    desc: `${msgTitle}: ${actionRoleName}`,
                };
                roleServices[serviceMethod](values)
                    .then((res) => {
                        const {code} = res;

                        if (code === '200') {
                            dispatch(actions.getRoleList(pageProps));
                            message.info(`${msgTitle}: ${t('成功')}`);
                            closeModal(ROLE_MODAL_ID);
                            report.success(action);
                        } else {
                            report.fail(action);
                        }
                    })
                    .catch(() => {
                        report.fail(action);
                    })
                    .finally(() => {
                        setLoading(false); // form.resetFields();
                    });
            })
            .catch((errorInfo) => {
                console.log(errorInfo);
            });
    };

    useEffect(() => {
        if (isEdited) {
            form.setFieldsValue({
                code: record?.code,
                name: record?.name,
                state: record?.state?.value === 0,
                // 1 禁用 0 激活
                roleType: Number(record?.roleType),
            });
        } else {
            form.setFieldsValue({
                code: Math.random().toString(36).slice(-8),
                name: '',
                state: true,
                roleType: null,
            });
        }
    }, [type]);
    return (
        <Modal
            id={ROLE_MODAL_ID}
            title={title}
            destroyOnClose
            width={560}
            onOk={handleOk}
            onCancel={handleCancel}
            confirmLoading={loading}
        >
            <Spin spinning={loading} wrapperClassName={styles.userManage}>
                <Form {...formItemLayout} form={form}>
                    <Form.Item
                        name="code"
                        label={t('角色编码')}
                        rules={[
                            {
                                type: 'string',
                                required: true,
                                validator: (rule, value) => {
                                    if (!value) {
                                        const roleCodeIsNull =
                                            t('请输入角色编码');
                                        return Promise.reject(roleCodeIsNull);
                                    }

                                    if (!/^[a-zA-Z0-9]{1,50}$/.test(value)) {
                                        const roleCodeIsIllegal = t(
                                            '请输入1-50位数字、字母或其组合，字母区分大小写',
                                        );
                                        return Promise.reject(
                                            roleCodeIsIllegal,
                                        );
                                    }

                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input
                            placeholder={t('请输入角色编码')}
                            maxLength={50}
                            style={{
                                width: 300,
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label={t('角色名称')}
                        rules={[
                            {
                                type: 'string',
                                required: true,
                                validator: (rule, value) => {
                                    if (!value) {
                                        const roleNameIsNull =
                                            t('请输入角色名称');
                                        return Promise.reject(roleNameIsNull);
                                    }

                                    if (value.length > 50) {
                                        const roleNameIsIllegal =
                                            t('请输入1-50字符');
                                        return Promise.reject(
                                            roleNameIsIllegal,
                                        );
                                    }

                                    if (checkEmoji(value)) {
                                        return Promise.reject(checkEmojiMsg);
                                    }

                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input
                            placeholder={t('请输入角色名称')}
                            maxLength={50}
                            style={{
                                width: 300,
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="roleType"
                        label={t('角色类型')}
                        rules={[
                            {
                                type: 'string',
                                required: true,
                                validator: (rule, value) => {
                                    if (!value) {
                                        const roleNameIsNull =
                                            t('请选择角色类型');
                                        return Promise.reject(roleNameIsNull);
                                    }

                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Select
                            placeholder={t('请选择角色类型')}
                            disabled={isEdited}
                            optionFilterProp="name"
                            showSearch
                            showArrow
                            allowClear
                            style={{
                                width: 300,
                            }}
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
                    </Form.Item>
                    <Form.Item
                        name="state"
                        label={t('状态')}
                        valuePropName="checked"
                        rules={[
                            {
                                type: 'boolean',
                                required: true,
                            },
                        ]}
                    >
                        <Switch
                            checkedChildren={t('启用')}
                            unCheckedChildren={t('禁用')}
                            defaultChecked
                        />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default UserManage;
