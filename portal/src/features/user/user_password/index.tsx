/*
 * @Author: sds
 * @Date: 2021-12-15 11:21:47
 * @Last Modified by: selwyn.bishanwen
 * @Last Modified time: 2022-11-18 17:56:07
 */
import React, {useState} from 'react';
import {Form, Input, message, Spin} from 'antd';
import {ReloadOutlined} from '@ant-design/icons';
import * as userServices from '@services/user';
import {Modal, useModal, PageProps} from '@gwaapp/ease';
import {useAppDispatch} from '@/app/runtime';
import {report} from '@utils/clientAction';
import {useTranslation} from 'react-i18next';
import {USER_PASSWORD_MODAL_ID} from '../constant';
import * as actions from '../actions';
import styles from './styles.module.scss';
import {encryptionPassword} from '../../../common/utils/encryption';

// const formItemLayout = {
//   labelCol: {span: 10},
//   wrapperCol: {span: 18},
// };

interface Props {
    pageProps: PageProps;
}

const UserPassword = ({pageProps}: Props) => {
    const {t} = useTranslation();
    const {id} = pageProps;
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const {closeModal, state} = useModal();
    const {record} = state[USER_PASSWORD_MODAL_ID] || {};
    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        form.resetFields();
    };

    const handleOk = () => {
        // TODO:改成为同步调用
        form.validateFields()
            .then((values) => {
                setLoading(true);
                values.newPassword = encryptionPassword(values.newPassword);

                const data = Object.assign(values, {
                    id: record?.id,
                    encryptType: 'BASE64',
                });
                const action = {
                    id: 'resetPassword',
                    module: id,
                    desc: `${t('更新用户密码')}:${record?.loginName}`,
                };
                userServices
                    .resetPassWord(data)
                    .then((res) => {
                        const {code} = res;

                        if (code === '200') {
                            message.info(t('密码修改成功'));
                            form.resetFields();
                            closeModal(USER_PASSWORD_MODAL_ID);
                            report.success(action);
                        } else {
                            report.fail(action);
                        }
                    })
                    .catch(() => {
                        report.fail(action);
                    })
                    .finally(() => setLoading(false));
            })
            .catch((errorInfo) => {
                console.log(errorInfo);
            });
    };

    const getDefaultPassWord = () => {
        dispatch(actions.getDefaultPassword(pageProps, form));
    };

    return (
        <Modal
            id={USER_PASSWORD_MODAL_ID}
            title={t('密码重置')}
            width={500}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={t('保存')}
            cancelText={t('关闭')}
            confirmLoading={loading}
            destroyOnClose
        >
            <Spin spinning={loading}>
                <Form form={form} className={styles.password}>
                    <Form.Item
                        name="newPassword"
                        label={t('账户密码')}
                        rules={[
                            {
                                type: 'string',
                                required: true,
                                validator: (rule, value) => {
                                    const reg =
                                        /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{8,16}$/; // 汉字正则

                                    const wordReg = /[\u4e00-\u9fa5]/g; // 正则表情

                                    const emjioReg =
                                        /[\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;

                                    if (value && value.length < 8) {
                                        return Promise.reject(
                                            new Error(
                                                t(
                                                    '密码长度不得小于8位,请重新输入！',
                                                ),
                                            ),
                                        );
                                    }

                                    if (value && value.length > 16) {
                                        return Promise.reject(
                                            new Error(
                                                t(
                                                    '密码长度不得大于16位，请重新输入！',
                                                ),
                                            ),
                                        );
                                    }

                                    if (value && !reg.test(value)) {
                                        return Promise.reject(
                                            new Error(
                                                t(
                                                    '密码必须包含字母、数字、符号三种字符，请重新输入！',
                                                ),
                                            ),
                                        );
                                    }

                                    if (value && wordReg.test(value)) {
                                        return Promise.reject(
                                            new Error(
                                                t(
                                                    '密码只能包含字母、数字、符号三种字符，请重新输入！',
                                                ),
                                            ),
                                        );
                                    }

                                    if (value && emjioReg.test(value)) {
                                        return Promise.reject(
                                            new Error(
                                                t(
                                                    '密码只能包含字母、数字、符号三种字符，请重新输入！',
                                                ),
                                            ),
                                        );
                                    }

                                    if (
                                        value &&
                                        value.indexOf(record?.loginName) > -1
                                    ) {
                                        return Promise.reject(
                                            new Error(
                                                t(
                                                    '密码不能包含用户名，请重新输入！',
                                                ),
                                            ),
                                        );
                                    }

                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input
                            placeholder={t('请输入密码')}
                            suffix={
                                <ReloadOutlined
                                    style={{
                                        color: '#fff',
                                    }}
                                    onClick={getDefaultPassWord}
                                />
                            }
                        />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default UserPassword;
