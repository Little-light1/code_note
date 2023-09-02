import React, {useState} from 'react';
import {Form, Input, Button, Modal} from 'antd';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {i18nIns} from '@/app/i18n';
import {SsoLoginKey} from '@common/init/configs';
import * as actions from '../../actions';
import styles from './styles.module.scss';

// 个人信息弹框
const PersonInfoModal = ({
    visibleModal,
    openUpdateInfoModal,
    onCancel,
}: any) => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const [modalState, setModalState] = useState('check');
    const {userInfo} = useAppSelector((state) => state.app);
    const isSsoLogin = Boolean(localStorage.getItem(SsoLoginKey) === 'true');

    const {t} = i18nIns;
    const savePersonInfo = () => {
        form.validateFields().then(async (values) => {
            await dispatch(
                actions.updatePersonalInfo(
                    {
                        ...userInfo,
                        loginName: values.loginName,
                        userName: values.userName,
                        phoneNumber: values.phoneNumber,
                        email: values.email,
                    },
                    setModalState,
                ),
            );
        });
    };

    return (
        <Modal
            open={visibleModal}
            title={t('个人信息')}
            width={650}
            footer={null}
            // destroyOnClose={true}
            maskClosable={false}
            onCancel={() => {
                onCancel(false);
                form.setFieldsValue({
                    loginName: userInfo.loginName,
                    userName: userInfo.userName,
                    phoneNumber: userInfo.phoneNumber,
                    email: userInfo.email,
                });
                setModalState('check');
            }}
        >
            <Form
                labelCol={{span: 8}}
                wrapperCol={{span: 12}}
                form={form}
                initialValues={{
                    loginName: userInfo.loginName,
                    userName: userInfo.userName,
                    phoneNumber: userInfo.phoneNumber,
                    email: userInfo.email,
                }}
                disabled={modalState === 'check'}
                className={styles.personInfoModel}
            >
                <Form.Item label={t('账号：')} name="loginName">
                    {modalState === 'check' ? (
                        <span className={styles.span}>
                            {userInfo.loginName}
                        </span>
                    ) : (
                        <Input disabled />
                    )}
                </Form.Item>
                <Form.Item
                    label={t('姓名：')}
                    name="userName"
                    rules={[{required: true, message: t('请输入姓名')}]}
                >
                    {modalState === 'check' ? (
                        <span className={styles.span} title={userInfo.userName}>
                            {userInfo.userName}
                        </span>
                    ) : (
                        <Input maxLength={50} />
                    )}
                </Form.Item>
                <Form.Item
                    label={t('手机号码：')}
                    name="phoneNumber"
                    rules={[
                        {required: true, message: t('请输入手机号码')},
                        {
                            type: 'string',
                            validator: async (rule, value) => {
                                if (!value) {
                                    return Promise.resolve();
                                }
                                // if (!/^(\d{1,11})*$/.test(value)) {
                                //     throw new Error(t('请输入正确的手机号码'));
                                // }

                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    {modalState === 'check' ? (
                        <span
                            className={styles.span}
                            title={userInfo.phoneNumber}
                        >
                            {userInfo.phoneNumber}
                        </span>
                    ) : (
                        <Input maxLength={11} />
                    )}
                </Form.Item>
                <Form.Item
                    label={t('邮箱：')}
                    name="email"
                    rules={[
                        {
                            type: 'string',
                            validator: async (rule, value) => {
                                if (!value) {
                                    return Promise.resolve();
                                }

                                if (
                                    !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
                                        value,
                                    )
                                ) {
                                    throw new Error(t('邮箱格式不正确'));
                                }

                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    {modalState === 'check' ? (
                        <span className={styles.span} title={userInfo.email}>
                            {userInfo.email}
                        </span>
                    ) : (
                        <Input maxLength={64} />
                    )}
                </Form.Item>
            </Form>
            <Form.Item
                wrapperCol={{
                    offset: 16,
                    span: 8,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingLeft: '10px',
                    }}
                >
                    {modalState === 'check' ? (
                        <>
                            {isSsoLogin ? null : (
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setModalState('edit');
                                    }}
                                >
                                    {t('修改')}
                                </Button>
                            )}

                            <Button
                                style={{
                                    marginLeft: '10px',
                                }}
                                type="dashed"
                                onClick={() => {
                                    openUpdateInfoModal(false);
                                    form.resetFields();
                                    setModalState('check');
                                }}
                            >
                                {t('关闭')}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                type="dashed"
                                onClick={() => {
                                    setModalState('check');
                                    form.setFieldsValue({
                                        loginName: userInfo.loginName,
                                        userName: userInfo.userName,
                                        phoneNumber: userInfo.phoneNumber,
                                        email: userInfo.email,
                                    });
                                }}
                            >
                                {t('取消')}
                            </Button>
                            {isSsoLogin ? null : (
                                <Button
                                    style={{
                                        marginLeft: '10px',
                                    }}
                                    type="primary"
                                    onClick={savePersonInfo}
                                >
                                    {t('保存')}
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </Form.Item>
        </Modal>
    );
};
export default PersonInfoModal;
