/*
 * @Author: zhangzhen
 * @Date: 2022-06-28 09:42:53
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-12-02 14:01:28
 *
 */
import React, {FC} from 'react';
import {Form, Input, Button} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import {useForm} from 'antd/es/form/Form';
import {useTranslation} from 'react-i18next';

type PropsType = {
    onOk: (values: any) => void;
    onCancel: () => void;
};
const formItemLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 14,
    },
};

const ChangePassWordModal: FC<PropsType> = (props) => {
    const [form] = useForm();
    const {onOk, onCancel} = props;
    const {t} = useTranslation();

    const userName = JSON.parse(
        window.localStorage.getItem('userInfo') || '{}',
    )?.loginName;
    const reg = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{8,16}$/;
    // 汉字正则
    const wordReg = /[\u4e00-\u9fa5]/;
    // 正则表情
    const emjioReg = /[\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/;
    // 密码校验
    const checkPassword = (_: any, value: string) => {
        if (value && value.length < 8) {
            return Promise.reject(new Error(t('密码长度不得小于8位')));
        }

        if (value && value.length > 16) {
            return Promise.reject(new Error(t('密码长度不得大于16位')));
        }

        if (value && !reg.test(value)) {
            return Promise.reject(
                new Error(t('密码必须包含字母、数字、符号三种字符')),
            );
        }

        if (value && wordReg.test(value)) {
            return Promise.reject(
                new Error(t('密码必须包含字母、数字、符号三种字符')),
            );
        }

        if (value && emjioReg.test(value)) {
            return Promise.reject(
                new Error(t('密码必须包含字母、数字、符号三种字符')),
            );
        }

        if (value && value.indexOf(userName) > -1) {
            return Promise.reject(new Error(t('密码不能包含用户名')));
        }

        if (value && value === form.getFieldValue('oldPassword')) {
            return Promise.reject(new Error(t('新密码不能与原密码相同')));
        }

        return Promise.resolve();
    }; // 原密码校验

    const checkOldPassword = (_: any, value: string) => {
        if (value && value.length < 8) {
            return Promise.reject(new Error(t('密码长度不得小于8位')));
        }

        if (value && value.length > 16) {
            return Promise.reject(new Error(t('密码长度不得大于16位')));
        }

        if (value && !reg.test(value)) {
            return Promise.reject(
                new Error(t('密码必须包含字母、数字、符号三种字符')),
            );
        }

        if (value && wordReg.test(value)) {
            return Promise.reject(
                new Error(t('密码必须包含字母、数字、符号三种字符')),
            );
        }

        if (value && emjioReg.test(value)) {
            return Promise.reject(
                new Error(t('密码必须包含字母、数字、符号三种字符')),
            );
        }

        return Promise.resolve();
    };

    return (
        <Form
            {...formItemLayout}
            form={form}
            onFinish={(values) => {
                onOk(values);
            }}
        >
            <Form.Item
                label={t('用户账号')}
                name="username"
                initialValue={userName}
            >
                <Input disabled />
            </Form.Item>
            <Form.Item
                label={t('原密码')}
                name="oldPassword"
                rules={[
                    {
                        required: true,
                        message: t('请输入你的原密码!'),
                    },
                    {
                        validator: checkOldPassword,
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                name="newPassword"
                label={t('新密码')}
                rules={[
                    {
                        required: true,
                        message: t('请输入你的新密码!'),
                    },
                    {
                        validator: checkPassword,
                    },
                ]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="confirm"
                label={t('确认新密码')}
                dependencies={['newPassword']}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: t('请确认你的新密码!'),
                    },
                    ({getFieldValue}) => ({
                        validator(_, value) {
                            if (
                                !value ||
                                getFieldValue('newPassword') === value
                            ) {
                                return Promise.resolve();
                            }

                            return Promise.reject(
                                new Error(t('确认新密码与新密码不一致')),
                            );
                        },
                    }),
                ]}
            >
                <Input.Password />
            </Form.Item>
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
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                    >
                        {t('保存')}
                    </Button>
                    <Button
                        style={{
                            marginLeft: '10px',
                        }}
                        type="dashed"
                        onClick={() => {
                            onCancel();
                        }}
                    >
                        {t('取消')}
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
};

export default ChangePassWordModal;
