import React, {useState, useRef, useEffect, useCallback} from 'react';
import {InfoCircleOutlined} from '@ant-design/icons';
import {
    Row,
    Col,
    Form,
    Input,
    Switch,
    FormInstance,
    Select,
    message,
} from 'antd';
import {Modal, useModal} from '@gwaapp/ease';
import {useTranslation} from 'react-i18next'; // import {shallowEqual} from 'react-redux';

import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {UploadImage} from '@/components/upload'; // 封装的图片上传 upload 组件
import EvenlyElements from '@components/evenly_elements';
import {validateFile} from '@/common/utils/file';
import {emoji} from '@/common/utils/reg';
import styles from './styles.module.scss';
import {addSubmit} from './actions';
import Systems from './systems';
import {passWordClick} from './utils';

const {Option} = Select;
const formItemLayout = {
    labelCol: {
        span: 9,
    },
    wrapperCol: {
        span: 15,
    },
};
const spanNumber = 12;
interface IProps {
    id: string;
    addModalId: string;
}

const AddRole = ({id, addModalId}: IProps) => {
    const {t} = useTranslation(); // 存储Form对象

    const formRef = useRef<FormInstance | null>(null);
    const {state: modalState} = useModal();
    const {node: selectedNode, type: modalType} = modalState[addModalId] || {};
    const actionI18n = modalType === 'add' ? t('新建') : t('编辑');
    const [currentType] = useState<any>(null);
    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state) => state.app.userInfo);
    const parentID = userInfo.enterpriseID; // console.log( userInfo, '拿到当前登录的租户')

    // 检测上传图片合法性 提供了通用方法
    const checkValidate = useCallback(
        (file) =>
            validateFile({
                file,
                types: ['image/jpeg', 'image/png'],
                size: [100, 'KB'],
                picture: {
                    height: 32,
                    width: 32,
                },
            }),
        [],
    );
    const {closeModal} = useModal();
    const [internalSelectedNode, setInternalSelectedNode] =
        useState(selectedNode); // 初始化内部选择

    useEffect(() => {
        setInternalSelectedNode(selectedNode);
    }, [selectedNode]); // 表单初始化、回显操作

    useEffect(() => {
        let fields = {};

        if (selectedNode) {
            if (modalType === 'edit') {
                const {
                    logo,
                    name,
                    shortName,
                    // type,
                    state,
                    productList = [],
                    administrator = [],
                } = selectedNode;
                const newProductList = [...productList];

                // 用户权限组件调整，这边可能为多个
                const firstAdministrator = administrator[0] || {};

                fields = {
                    addModalId,
                    logo,
                    shortName,
                    account: !state.value,
                    // type: type.value,
                    name,
                    // 账号名称
                    loginName: firstAdministrator.loginName
                        ? firstAdministrator.loginName
                        : '',
                    // 账号密码
                    password: firstAdministrator.password
                        ? firstAdministrator.password
                        : '',
                    //  账号状态
                    AccountStatus: !firstAdministrator?.state?.value,
                    // 账号状态
                    productList: newProductList,
                };
            }
        }

        formRef && formRef.current && formRef.current.setFieldsValue(fields);
    }, [addModalId, modalType, selectedNode, formRef]);

    if (selectedNode === null) {
        return null;
    }
    // 复制功能 因为用户组建影响暂时拿不到密码 暂时注释掉复制功能
    // const copyIcon = async () => {
    //     const {loginName, password} = formRef.current?.getFieldsValue() ?? {};
    //     const aux = document.createElement('input');
    //     aux.setAttribute(
    //         'value',
    //         `${t('登录姓名')}: ${loginName}  ${t('账号密码')}: ${password}`,
    //     );
    //     document.body.appendChild(aux);
    //     aux.select();
    //     document.execCommand('copy');
    //     document.body.removeChild(aux);

    //     if (aux) {
    //         message.info(t('复制成功'));
    //     } else {
    //         message.info(t('复制失败，请手动复制'));
    //     }
    // };

    return (
        <Modal
            id={addModalId}
            title={`${actionI18n}`}
            width={950}
            isAutoClose={false}
            okText={t('确定')}
            cancelText={t('取消')}
            onCancel={() => {
                formRef.current && formRef.current.resetFields();
            }}
            onOk={() => {
                if (formRef.current) {
                    formRef.current.submit();
                }
            }}
        >
            <Form
                ref={formRef}
                // {...formItemLayout}
                layout="vertical"
                onFinish={(values) => {
                    dispatch(
                        addSubmit({
                            values,
                            id: addModalId,
                            type: currentType,
                            parentID,
                            selectedNode: internalSelectedNode,
                            modalType,
                        }),
                    ).then(() => {
                        closeModal(addModalId);
                        formRef.current.resetFields();
                    });
                }}
                // layout="inline"
                initialValues={{
                    name: '',
                    // 企业名称
                    shortName: '',
                    // 企业简称
                    // type: 4,
                    // // 账户性质
                    logo: '',
                    // 企业logo
                    // system: '', // 系统名称
                    loginName: '',
                    // 账号名称
                    password: passWordClick(),
                    // 账号密码
                    AccountStatus: true,
                    // 账号状态
                    account: true,
                    // 账户状态启用禁用
                    productList: [],
                }}
            >
                <div className={styles.num}>
                    <span className={styles.header} />
                    <span className={styles.body}>
                        {/* 基本信息 */}
                        <span>{t('基本信息')}</span>
                    </span>
                </div>
                <div className={styles.bgcPanel}>
                    <EvenlyElements count={2}>
                        {/* <Row> */}
                        {/* 企业名称 */}
                        {/* <Col span={spanNumber}> */}
                        <Form.Item
                            className={styles.inputSty}
                            name="name"
                            label={t('企业名称')}
                            rules={[
                                {
                                    required: true,
                                    validator: (rule, value1) => {
                                        if (
                                            value1.trim() === undefined ||
                                            value1.trim() === ''
                                        ) {
                                            return Promise.reject(
                                                new Error(
                                                    t(
                                                        '请输入企业名称/企业简称',
                                                    ),
                                                ),
                                            );
                                        }

                                        if (value1.length > 100) {
                                            return Promise.reject(
                                                new Error(
                                                    t(
                                                        '企业名称长度不可以大于100字符',
                                                    ),
                                                ),
                                            );
                                        }

                                        if (emoji.test(value1.trim())) {
                                            return Promise.reject(
                                                new Error(
                                                    t('标签名称不能输入表情'),
                                                ),
                                            );
                                        }

                                        return Promise.resolve();
                                    },
                                },
                            ]}
                            validateTrigger="onBlur"
                        >
                            <Input placeholder={t('请输入')} maxLength={100} />
                        </Form.Item>
                        {/* </Col> */}
                        {/* 企业简称 */}
                        {/* <Col span={spanNumber}> */}
                        <Form.Item
                            className={styles.inputSty}
                            label={t('企业简称')}
                            name="shortName"
                            rules={[
                                {
                                    type: 'string',
                                    required: true,
                                    validator: (rule, value2) => {
                                        if (
                                            value2.trim() === undefined ||
                                            value2.trim() === ''
                                        ) {
                                            return Promise.reject(
                                                new Error(t('请输入企业简称')),
                                            );
                                        }

                                        if (value2.length > 50) {
                                            return Promise.reject(
                                                new Error(
                                                    t(
                                                        '企业简称长度不可以大于50字符',
                                                    ),
                                                ),
                                            );
                                        }

                                        if (emoji.test(value2.trim())) {
                                            return Promise.reject(
                                                new Error(
                                                    t('企业简称不能输入表情'),
                                                ),
                                            );
                                        }

                                        return Promise.resolve();
                                    },
                                },
                            ]}
                            validateTrigger="onBlur"
                        >
                            <Input placeholder={t('请输入')} maxLength={50} />
                        </Form.Item>
                        {/* </Col> */}
                        {/* </Row> */}

                        {/* <Row> */}
                        {/* 账户性质 */}
                        {/* <Col span={spanNumber}>
                            <Form.Item
                                className={styles.inputSty}
                                name="type"
                                label={t('账户性质')}
                                rules={[
                                    {
                                        type: 'string',
                                        required: true,
                                        validator: (rule, value3) => {
                                            if (
                                                value3 === undefined ||
                                                value3 === ''
                                            ) {
                                                return Promise.reject(
                                                    new Error(
                                                        t('账户性质不可以为空'),
                                                    ),
                                                );
                                            }

                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <Select
                                    placeholder={t('请选择账户性质')}
                                    style={{
                                        width: '296px',
                                    }}
                                >
                                    <Option disabled value={2}>
                                        {t('平台企业')}
                                    </Option>
                                    <Option value={4}>{t('应用企业')}</Option>
                                </Select>
                            </Form.Item>
                        </Col> */}
                        {/* 账户状态 */}
                        {/* <Col span={spanNumber}> */}
                        <Form.Item
                            className={styles.inputSty}
                            name="account"
                            label={t('账户状态')}
                            valuePropName="checked"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Switch
                                checkedChildren={t('启用')}
                                unCheckedChildren={t('禁用')}
                            />
                        </Form.Item>
                        {/* </Col> */}

                        {/* <Col span={spanNumber}> */}
                        <Form.Item
                            name="logo"
                            label={t('企业logo')}
                            rules={[
                                {
                                    required: true,
                                    validator: (rule, value4) => {
                                        if (
                                            value4 === undefined ||
                                            value4 === ''
                                        ) {
                                            return Promise.reject(
                                                new Error(t('请上传企业logo')),
                                            );
                                        }

                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <UploadImage
                                checkValidate={checkValidate}
                                className={styles.upload}
                            />
                        </Form.Item>
                        <div />
                        <span
                            style={{
                                color: '#899da4',
                                width: '328px',
                                display: 'inline-block',
                            }}
                        >
                            <InfoCircleOutlined
                                style={{
                                    fontSize: '14px',
                                }}
                            />
                            &nbsp;&nbsp;
                            {t(
                                '文件格式为:png、jpg,图片分辨率:32x32px,大小不超过 100k',
                            )}
                        </span>
                        {/* </Col> */}
                        {/* </Row> */}
                    </EvenlyElements>

                    {/* TODO: 这个字段名列表里暂时隐藏，后期需求可能会添加 */}
                    {/* <Col span={spanNumber}>
              <Form.Item
                style={{margin: '0 -18px 21px -3px', height: '30px'}}
                name="system"
                label={t('account:system')}
                rules={[
                  {
                    type: 'string',
                    required: true,
                    validator: (rule, value) => {
                      if (value === undefined || value === '') {
                        return Promise.reject(new Error('系统名称不可以为空'));
                      }
                      if (value.length > 50) {
                        return Promise.reject(new Error('系统名称长度不可以大于50字符'));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}>
                <Input placeholder="请输入系统名称" maxLength={50} />
              </Form.Item>
            </Col> */}
                </div>

                <div className={styles.num}>
                    <span className={styles.header} />
                    <span className={styles.body}>
                        <span className={styles.bodyTitle}>
                            {t('默认管理员账号')}
                        </span>
                        <span className={styles.decorativeLine} />
                        {/* 因为用户组建影响暂时拿不到密码 暂时注释掉复制功能 */}
                        {/* <span className={styles.addToBorder}>
                            <span className={styles.addTo} onClick={copyIcon} />
                        </span> */}
                    </span>
                </div>

                <div className={styles.bgcPanel}>
                    <EvenlyElements count={2} rowStyle={{marginBottom: 10}}>
                        {/* 账号名称 */}

                        <Form.Item
                            className={styles.inputSty}
                            name="loginName"
                            label={t('账号名称')}
                            rules={[
                                {
                                    required: true,
                                    validator: (rule, value5) => {
                                        if (
                                            value5.trim() === undefined ||
                                            value5.trim() === ''
                                        ) {
                                            return Promise.reject(
                                                new Error(t('请输入账号名称')),
                                            );
                                        }

                                        if (emoji.test(value5.trim())) {
                                            return Promise.reject(
                                                new Error(
                                                    t('账号名称不能输入表情'),
                                                ),
                                            );
                                        }

                                        return Promise.resolve();
                                    },
                                },
                            ]}
                            validateTrigger="onBlur"
                        >
                            <Input
                                className={styles.inputFrame}
                                placeholder={t('请输入')}
                                maxLength={64}
                                readOnly={modalType === 'edit'}
                            />
                        </Form.Item>

                        {/* 账号密码 */}
                        <Form.Item
                            className={styles.inputSty}
                            name="password"
                            label={t('账号密码')}
                            rules={[
                                {
                                    // AAPP 门户 V6.2.100.0 B79210 需求变更 由于用户组件改变了返回内容，造成门户无法显示用户密码 所以密码改为非必填
                                    // required: true,
                                    validator: (rule, value, callback) => {
                                        const reg =
                                            /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{8,16}$/;
                                        // 汉字正则
                                        const wordReg = /[\u4e00-\u9fa5]/;
                                        // 正则表情
                                        const emjioReg =
                                            /[\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/;

                                        if (value && value.length < 8) {
                                            return Promise.reject(
                                                new Error(
                                                    t('密码长度不得小于8位'),
                                                ),
                                            );
                                        }

                                        if (value && value.length > 16) {
                                            return Promise.reject(
                                                new Error(
                                                    t('密码长度不得大于16位'),
                                                ),
                                            );
                                        }

                                        if (value && !reg.test(value)) {
                                            return Promise.reject(
                                                new Error(
                                                    t(
                                                        '密码必须包含字母、数字、符号三种字符',
                                                    ),
                                                ),
                                            );
                                        }

                                        if (value && wordReg.test(value)) {
                                            return Promise.reject(
                                                new Error(
                                                    t(
                                                        '密码必须包含字母、数字、符号三种字符',
                                                    ),
                                                ),
                                            );
                                        }

                                        if (value && emjioReg.test(value)) {
                                            return Promise.reject(
                                                new Error(
                                                    t(
                                                        '密码必须包含字母、数字、符号三种字符',
                                                    ),
                                                ),
                                            );
                                        }
                                        const {loginName} =
                                            formRef.current?.getFieldsValue() ??
                                            {};
                                        if (value && value === loginName) {
                                            return Promise.reject(
                                                new Error(
                                                    t(
                                                        '账号名称和账号密码不能重复',
                                                    ),
                                                ),
                                            );
                                        }

                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            {modalType !== 'edit' ? (
                                <Input.Password
                                    bordered={false}
                                    maxLength={16}
                                    className={`${styles.inputPassWord} ${styles.inputFrame}`}
                                />
                            ) : (
                                <Input
                                    bordered={false}
                                    className={`${styles.inputPassWord} ${styles.inputFrame}`}
                                    maxLength={16}
                                    placeholder="********"
                                />
                            )}
                        </Form.Item>

                        {/* 账号状态 */}
                        {modalType === 'edit' ? (
                            <Form.Item
                                className={styles.inputSty}
                                label={t('账号状态')}
                                name="AccountStatus"
                                valuePropName="checked"
                            >
                                <Switch
                                    checkedChildren={t('启用')}
                                    unCheckedChildren={t('禁用')}
                                    defaultChecked
                                />
                            </Form.Item>
                        ) : (
                            ''
                        )}
                    </EvenlyElements>
                </div>

                <div className={styles.num}>
                    <span className={styles.header} />
                    <span className={styles.body}>
                        {/* 启用服务使用时效 */}
                        <span
                            style={{
                                marginLeft: '15px',
                            }}
                        />
                        {t('产品服务使用时效')}
                    </span>
                </div>
                <div className={styles.bgcPanel}>
                    <Form.Item name="productList">
                        <Systems id={id} />
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
};

export default AddRole;
