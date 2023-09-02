/*
 * @Author: sds
 * @Date: 2021-12-01 15:39:20
 * @Last Modified by: gongzunbao
 * @Last Modified time: 2023-06-28 20:25:12
 */
import React, {useCallback, useState} from 'react';
import {shallowEqual} from 'react-redux';
import {
    Form,
    Input,
    message,
    TreeSelect,
    Switch,
    Select,
    Row,
    Col,
    Spin,
    DatePicker,
    Radio,
} from 'antd';
import {Modal, useModal, useAction, PageProps} from '@gwaapp/ease';
import * as userServices from '@services/user';
import {checkEmoji, checkEmojiMsg} from '@utils/reg';
import {AppThunk, useAppDispatch, useAppSelector} from '@/app/runtime';
import {report} from '@utils/clientAction';
import {handleFormItemLabel} from '@utils/label';
import moment from 'moment';
import {UploadImage} from '@/components/upload';
import {validateFileInRangeSize} from '@/common/utils/file';
import {useTranslation} from 'react-i18next';
import {encryptionPassword} from '@/common/utils/encryption';
import styles from './styles.module.scss';
import {
    USER_MODAL_ID,
    USER_STATE,
    SYS_USER,
    LOCAL_AND_SON_LEVEL,
} from '../constant';
import EncryptInput, {EncryptInputType} from '../encryptInput';
import {uuid2} from '../helper';

const formItemLayout = {
    labelCol: {
        span: 8,
    },
};
const {RangePicker} = DatePicker;
const spanNumber = 12;

interface Props {
    pageProps: PageProps;
}

const UserManage = ({pageProps}: Props) => {
    const {t} = useTranslation();
    const {id} = pageProps;
    const dispatch = useAppDispatch();
    const {getPageSimpleActions} = useAction();
    const simpleActions = getPageSimpleActions(id);
    const selectTreeData = useAppSelector(
        (state) => state[id].selectTreeData,
        shallowEqual,
    );
    const totalTree = useAppSelector(
        (state) => state[id].totalTree,
        shallowEqual,
    );
    const allRoleList = useAppSelector(
        (state) => state[id].allRoleList,
        shallowEqual,
    );
    const allLabelList = useAppSelector(
        (state) => state[id].allLabelList,
        shallowEqual,
    );
    const linkedRoles = useAppSelector(
        (state) => state[id].linkedRoles,
        shallowEqual,
    );
    const selectedKeys = useAppSelector(
        (state) => state[id].selectedKeys,
        shallowEqual,
    );
    const isIDCardIsRequired = useAppSelector(
        (state) => state[id].isIDCardIsRequired,
        shallowEqual,
    );
    const update = useAppSelector((state) => state[id].update, shallowEqual);
    const [form] = Form.useForm();
    const {closeModal, state} = useModal();
    const {type, record} = state[USER_MODAL_ID] || {};
    const isEdited = type === 'edit';
    const title = isEdited ? t('编辑') : t('新建');
    const serviceMethod = isEdited ? 'updateSingleUser' : 'addUser';
    const [loading] = useState(false);
    const defaultDate = [
        moment().subtract(0, 'days'),
        moment().subtract(-90, 'days'),
    ];
    let sysFlag = false;
    let treeDefaultExpandedKeys: any = [];

    if (isEdited) {
        sysFlag = SYS_USER.includes(record?.loginName);
        form.setFieldsValue({
            loginName: record?.loginName,
            userName: record?.userName,
            organizationID: record?.organizationID,
            roleIds: linkedRoles.reduce(
                (pre: any, cur: any) => pre.concat([cur.id]),
                [],
            ),
            phoneNumber: record?.phoneNumber,
            tagIds: record?.tagList.reduce(
                (pre: any, cur: any) => pre.concat([cur.id]),
                [],
            ),
            email: record?.email,
            identityCard: record.identityCard,
            state: record?.state?.enum,
            forceModifyPassword: record?.forceModifyPassword?.value === 0,
            timeLimit: record?.timeLimit?.value === 0,
            date: record?.startDate
                ? [moment(record?.startDate), moment(record?.endDate)]
                : null,
            logo: record?.logo,
        });
        treeDefaultExpandedKeys = [record?.organizationID];
    } else {
        const roleIds = allRoleList.filter(
            (ele: any) => ele.code === LOCAL_AND_SON_LEVEL,
        )[0]?.id;
        form.setFieldsValue({
            organizationID: selectedKeys[0],
            state: USER_STATE.ENABLE.enum,
            roleIds: roleIds ? [roleIds] : [],
        });
        treeDefaultExpandedKeys = selectedKeys;
    }

    const checkValidate = useCallback(
        (file) =>
            validateFileInRangeSize({
                file,
                types: ['image/jpeg', 'image/png'],
                minSize: [200, 'KB'],
                maxSize: [4, 'MB'],
            }),
        [],
    );

    const handleCancel = () => {
        form.resetFields();
    };

    const handleOk = (props: {id: string}): AppThunk => {
        return (dispatch, getState, {getPageState}) => {
            const {userInfo} = getPageState(getState(), 'app');

            _handleOk(userInfo);
        };
    };

    const _handleOk = (userInfo: any) => {
        form.validateFields()
            .then((values) => {
                if (
                    values.password &&
                    values.password.indexOf(values.loginName) > -1
                ) {
                    return message.info(t('账号密码不能包含用户账号'));
                }

                isEdited && (values.id = record.id);
                values.timeLimit = values.timeLimit ? 'FOREVER' : 'LIMITED';
                values.forceModifyPassword = values.forceModifyPassword
                    ? 'YES'
                    : 'NO';
                values.startDate =
                    (values.date && values.date[0]?.format('YYYY-MM-DD')) || '';
                values.endDate =
                    (values.date && values.date[1]?.format('YYYY-MM-DD')) || '';

                // 密码AES加密
                values.password &&
                    (values.password = encryptionPassword(values.password));

                const msgTitle = isEdited ? t('编辑用户') : t('新增用户');

                const action = {
                    id: 'addOrUpdate',
                    module: id,
                    desc: `${msgTitle}:${values.loginName}`,
                };

                // 编辑用户时, 如果当前用户休眠了自己的账号, 则禁止
                if (
                    isEdited &&
                    record?.id === userInfo?.id &&
                    values.state === USER_STATE.SLEEP.enum
                ) {
                    message.info(t('禁止休眠登录用户'));
                    return;
                }

                userServices[serviceMethod](values)
                    .then((res) => {
                        const {code} = res;

                        if (code === '200') {
                            dispatch(
                                simpleActions.set({
                                    update: !update,
                                    selectedRowKeys: [],
                                    selectedRows: [],
                                }),
                            );
                            message.info(`${msgTitle}: ${t('成功')}`);
                            form.resetFields();
                            closeModal(USER_MODAL_ID);
                            report.success(action);
                        } else {
                            report.fail(action);
                        }
                    })
                    .catch(() => report.fail(action));
            })
            .catch((errorInfo) => {
                console.log(errorInfo);
            });
    };

    const getRandomPassword = () => {
        const password = uuid2();
        form.setFieldsValue({
            password,
        });
    };

    const timeLimitOnChange = (e: boolean) => {
        if (e) {
            form.setFieldsValue({
                date: undefined,
            });
        } else {
            form.setFieldsValue({
                date: defaultDate,
            });
        }
    };

    return (
        <Modal
            id={USER_MODAL_ID}
            title={title}
            destroyOnClose
            width={1030}
            okText={t('保存')}
            cancelText={t('关闭')}
            onOk={() => dispatch(handleOk(pageProps))}
            onCancel={handleCancel}
            confirmLoading={loading}
        >
            <Spin spinning={loading} wrapperClassName={styles.userManage}>
                <Form {...formItemLayout} form={form} labelAlign="right">
                    <Row>
                        <Col span={spanNumber}>
                            <Form.Item
                                name="loginName"
                                label={t('用户账号')}
                                rules={[
                                    {
                                        type: 'string',
                                        required: true,
                                        validator: async (rule, value) => {
                                            if (!value || !value.trim()) {
                                                throw new Error(
                                                    t('请输入用户账号'),
                                                );
                                            }

                                            if (value.length > 64) {
                                                throw new Error(
                                                    t('请输入1-64位字符'),
                                                );
                                            }

                                            if (checkEmoji(value)) {
                                                return Promise.reject(
                                                    checkEmojiMsg,
                                                );
                                            }

                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <Input
                                    placeholder={t('请输入')}
                                    disabled={isEdited}
                                    maxLength={64}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={spanNumber}>
                            <Form.Item
                                name="userName"
                                label={t('用户名称')}
                                rules={[
                                    {
                                        type: 'string',
                                        required: true,
                                        validator: async (rule, value) => {
                                            if (!value || !value.trim()) {
                                                throw new Error(
                                                    t('请输入用户名称'),
                                                );
                                            }

                                            if (value.length > 50) {
                                                throw new Error(
                                                    t('请输入1-50位字符'),
                                                );
                                            }

                                            if (checkEmoji(value)) {
                                                return Promise.reject(
                                                    checkEmojiMsg,
                                                );
                                            }

                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <Input
                                    placeholder={t('请输入')}
                                    maxLength={50}
                                />
                            </Form.Item>
                        </Col>

                        {!isEdited && (
                            <>
                                <Col span={spanNumber}>
                                    <Form.Item
                                        name="password"
                                        label={handleFormItemLabel(
                                            t('账号密码'),
                                        )}
                                        rules={[
                                            {
                                                type: 'string',
                                                required: true,
                                                validator: async (
                                                    rule,
                                                    value,
                                                ) => {
                                                    const reg =
                                                        /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{8,16}$/; // 汉字正则

                                                    const wordReg =
                                                        /[\u4e00-\u9fa5]/; // 正则表情

                                                    const emjioReg =
                                                        /[\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/; // 密码校验

                                                    if (
                                                        !value ||
                                                        !value.trim()
                                                    ) {
                                                        throw new Error(
                                                            t('请输入账号密码'),
                                                        );
                                                    }

                                                    if (
                                                        value &&
                                                        value.length < 8
                                                    ) {
                                                        return Promise.reject(
                                                            new Error(
                                                                t(
                                                                    '密码长度不得小于8位,请重新输入！',
                                                                ),
                                                            ),
                                                        );
                                                    }

                                                    if (
                                                        value &&
                                                        value.length > 16
                                                    ) {
                                                        return Promise.reject(
                                                            new Error(
                                                                t(
                                                                    '密码长度不得大于16位，请重新输入！',
                                                                ),
                                                            ),
                                                        );
                                                    }

                                                    if (
                                                        value &&
                                                        !reg.test(value)
                                                    ) {
                                                        return Promise.reject(
                                                            new Error(
                                                                t(
                                                                    '密码必须包含字母、数字、符号三种字符，请重新输入！',
                                                                ),
                                                            ),
                                                        );
                                                    }

                                                    if (
                                                        value &&
                                                        wordReg.test(value)
                                                    ) {
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
                                                        emjioReg.test(value)
                                                    ) {
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
                                                        value.indexOf(
                                                            record?.loginName,
                                                        ) > -1
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
                                            placeholder={t('请输入')}
                                            disabled={isEdited}
                                            maxLength={16}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <div
                                        onClick={getRandomPassword}
                                        className={styles.random}
                                    >
                                        {t('随机')}
                                    </div>
                                </Col>
                            </>
                        )}

                        <Col span={spanNumber}>
                            <Form.Item
                                name="organizationID"
                                label={handleFormItemLabel(t('所属组织机构'))}
                                rules={[
                                    {
                                        type: 'string',
                                        required: true,
                                        validator: async (rule, value) => {
                                            if (!value) {
                                                throw new Error(
                                                    t('请选择所属组织机构'),
                                                );
                                            }

                                            if (
                                                totalTree[value].isRight === 0
                                            ) {
                                                throw new Error(
                                                    t(
                                                        '所选择所属组织机构无权限',
                                                    ),
                                                );
                                            }

                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <TreeSelect
                                    showSearch
                                    placeholder={t('请选择')}
                                    dropdownStyle={{
                                        maxHeight: 400,
                                        minWidth: 160,
                                        overflow: 'auto',
                                    }}
                                    allowClear
                                    treeDefaultExpandedKeys={
                                        treeDefaultExpandedKeys
                                    }
                                    treeNodeFilterProp="title"
                                    treeData={selectTreeData}
                                    getPopupContainer={(triggerNode) =>
                                        triggerNode.parentNode
                                    }
                                    dropdownMatchSelectWidth={326}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={spanNumber}>
                            <Form.Item
                                name="roleIds"
                                label={t('所属角色')}
                                rules={[
                                    {
                                        validator: async (rule, value) => {
                                            if (value && value.length) {
                                                const typeA: string[] = [];
                                                value.forEach(
                                                    (element: any) => {
                                                        allRoleList.forEach(
                                                            (ele: any) => {
                                                                if (
                                                                    ele.id ===
                                                                    element
                                                                ) {
                                                                    typeA.push(
                                                                        ele.roleType,
                                                                    );
                                                                }
                                                            },
                                                        );
                                                    },
                                                );
                                                const filterTypeA = Array.from(
                                                    new Set(typeA),
                                                );

                                                if (
                                                    filterTypeA.length > 2 ||
                                                    (filterTypeA.length === 2 &&
                                                        !filterTypeA.includes(
                                                            5,
                                                        ))
                                                ) {
                                                    throw new Error(
                                                        t(
                                                            '除数据权限外，请选择同类型角色',
                                                        ),
                                                    );
                                                }
                                            }

                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder={t('请选择')}
                                    optionFilterProp="name"
                                    showSearch
                                    showArrow
                                    disabled={sysFlag}
                                    maxTagCount={'responsive' as const}
                                >
                                    {allRoleList.map((ele: any) => (
                                        <Select.Option
                                            key={ele.id}
                                            value={ele.id}
                                            name={
                                                ele.roleTypeValue
                                                    ? `${ele.name}（${ele.roleTypeValue}）`
                                                    : `${ele.name}`
                                            }
                                        >
                                            {ele.roleTypeValue
                                                ? `${ele.name}（${ele.roleTypeValue}）`
                                                : `${ele.name}`}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={spanNumber}>
                            <Form.Item
                                name="phoneNumber"
                                label={t('手机号码')}
                                rules={[
                                    {
                                        type: 'string',
                                        required: true,
                                        validator: async (rule, value) => {
                                            if (!value) {
                                                throw new Error(
                                                    t('请输入手机号码'),
                                                );
                                            }

                                            // if (!/^(\d{1,11})*$/.test(value)) {
                                            //     throw new Error(
                                            //         t('手机号码不合法'),
                                            //     );
                                            // }

                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <EncryptInput
                                    placeholder={t('请输入')}
                                    type={EncryptInputType.Phone}
                                    maxLength={11}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={spanNumber}>
                            <Form.Item name="tagIds" label={t('添加标签')}>
                                <Select
                                    mode="multiple"
                                    placeholder={t('请选择')}
                                    optionFilterProp="name"
                                    showSearch
                                    showArrow
                                    maxTagCount={'responsive' as const}
                                >
                                    {allLabelList.map((ele: any) => (
                                        <Select.Option
                                            key={ele.id}
                                            value={ele.id}
                                            name={ele.name}
                                        >
                                            {ele.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={spanNumber}>
                            <Form.Item
                                name="email"
                                label={t('邮箱')}
                                rules={[
                                    {
                                        type: 'string',
                                        required: true,
                                        validator: async (rule, value) => {
                                            if (!value) {
                                                throw new Error(
                                                    t('请输入邮箱'),
                                                );
                                            }

                                            if (value.length > 64) {
                                                throw new Error(
                                                    t('请输入1-64位字符'),
                                                );
                                            }

                                            if (
                                                !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
                                                    value,
                                                )
                                            ) {
                                                throw new Error(
                                                    t('邮箱格式不正确'),
                                                );
                                            }

                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <EncryptInput
                                    placeholder={t('请输入')}
                                    maxLength={64}
                                    type={EncryptInputType.Email}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={spanNumber}>
                            <Form.Item
                                name="identityCard"
                                label={handleFormItemLabel(t('身份证号'))}
                                rules={[
                                    {
                                        type: 'string',
                                        required: isIDCardIsRequired,
                                        validator: async (rule, value) => {
                                            if (isIDCardIsRequired && !value) {
                                                throw new Error(
                                                    t('请输入身份证号'),
                                                );
                                            }

                                            if (
                                                value &&
                                                !/^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
                                                    value,
                                                )
                                            ) {
                                                throw new Error(
                                                    t('身份证格式不正确'),
                                                );
                                            }

                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <EncryptInput
                                    placeholder={t('请输入')}
                                    maxLength={18}
                                    disabled={isEdited}
                                    type={EncryptInputType.IDCard}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={spanNumber}>
                            <Form.Item
                                name="forceModifyPassword"
                                label={handleFormItemLabel(
                                    t('首次登录强制修改密码'),
                                )}
                                valuePropName="checked"
                                initialValue={false}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Switch
                                    checkedChildren={t('是')}
                                    unCheckedChildren={t('否')}
                                    style={{
                                        width: 106,
                                    }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={spanNumber}>
                            <Form.Item
                                name="state"
                                label={t('使用状态')}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Radio.Group name="radiogroup">
                                    <Radio value={USER_STATE.ENABLE.enum}>
                                        {USER_STATE.ENABLE.name}
                                    </Radio>
                                    <Radio
                                        value={USER_STATE.SLEEP.enum}
                                        disabled={!isEdited}
                                    >
                                        {USER_STATE.SLEEP.name}
                                    </Radio>
                                    <Radio
                                        value={USER_STATE.LOGOUT.enum}
                                        disabled={!isEdited}
                                    >
                                        {USER_STATE.LOGOUT.name}
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>

                        <Col span={spanNumber}>
                            <Form.Item
                                name="timeLimit"
                                label={t('使用周期')}
                                valuePropName="checked"
                                initialValue
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Switch
                                    checkedChildren={t('永久')}
                                    unCheckedChildren={t('有限')}
                                    defaultChecked
                                    style={{
                                        width: 106,
                                    }}
                                    onChange={timeLimitOnChange}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={spanNumber}>
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, curValues) =>
                                    prevValues.timeLimit !== curValues.timeLimit
                                }
                            >
                                {({getFieldValue}) => {
                                    const timeLimitFlag =
                                        getFieldValue('timeLimit');
                                    return (
                                        <Form.Item
                                            name="date"
                                            label={t('使用期限')}
                                            rules={[
                                                {
                                                    required: !timeLimitFlag,
                                                    validator: async (
                                                        rule,
                                                        value,
                                                    ) => {
                                                        if (
                                                            !timeLimitFlag &&
                                                            !value
                                                        ) {
                                                            throw new Error(
                                                                t(
                                                                    '请选择使用期限',
                                                                ),
                                                            );
                                                        }

                                                        return Promise.resolve();
                                                    },
                                                },
                                            ]}
                                        >
                                            <RangePicker
                                                style={{
                                                    width: 328,
                                                }}
                                                disabled={timeLimitFlag}
                                            />
                                        </Form.Item>
                                    );
                                }}
                            </Form.Item>
                        </Col>
                        {/* 人脸图片 */}
                        <Col span={spanNumber}>
                            <Form.Item name="logo" label={t('人脸图片')}>
                                <UploadImage
                                    checkValidate={checkValidate}
                                    className={styles.upload}
                                />
                            </Form.Item>
                            <div>
                                {t(
                                    '人脸图片要求：200KB至4MB图片大小、半身近照、图片类型为JPG、PNG或JPEG，不能有遮挡物',
                                )}
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </Modal>
    );
};

export default UserManage;
