import React, {
    useState,
    useEffect,
    MutableRefObject,
    useCallback,
    useMemo,
} from 'react';
import {Form, Input, Switch, FormInstance, Select, message} from 'antd';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useModal, useAction, PageProps} from '@gwaapp/ease';
import {emoji, relateUrlMsg} from '@/common/utils/reg';
import SortInput from '@/components/sort_input';
import {Events} from '@common/events';
import {UploadImage} from '@/components/upload';
import {validateFile} from '@/common/utils/file';
import {shallowEqual} from 'react-redux';
import {handleFormItemLabel} from '@utils/label';
import styles from './styles.module.scss';
import {addSubmitData} from './actions';

const {TextArea} = Input;
const {Option} = Select;
interface IProps {
    addModalId: string;
    modalType: 'add' | 'edit'; // 模态窗口类型

    formRef: MutableRefObject<FormInstance<any> | null>;
    pageProps: PageProps;
    selectedNode: null | any;
}

const formItemLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 14,
    },
};

const CustomForm = ({
    pageProps,
    selectedNode,
    formRef,
    addModalId,
    modalType,
}: IProps) => {
    const {id} = pageProps;
    const [currentType] = useState<any>(null);
    const [fields, setFields] = useState<any[]>([]);
    const dispatch = useAppDispatch();
    const {closeModal} = useModal();
    const [internalSelectedNode, setInternalSelectedNode] =
        useState(selectedNode);
    const {t} = useTranslation();
    const {loginType} = useAppSelector((state) => state[id], shallowEqual);
    const {
        handlers: {trigger},
    } = useAction(); // 初始化内部选择

    // 如下情况可以编辑:配置了外部URl & 外部应用
    // 1. 配置了外部URl & 外部应用
    let canConfigSSO = useMemo(() => {
        const piUrlValue = fields.find((v) => v.name[0] === 'piUrl');
        const currentPiUrl = piUrlValue ? piUrlValue.value || '' : '';
        const gwFlagValue = fields.find((v) => v.name[0] === 'gwFlag');
        const currentGwFlag = gwFlagValue ? gwFlagValue.value || '' : '';

        return currentPiUrl && currentGwFlag === 1;
    }, [fields]);

    useEffect(() => {
        setInternalSelectedNode(selectedNode);
    }, [selectedNode]); // 表单初始化、回显操作

    // let gwFlagShow;
    // if (modalType === 'edit') {
    //     gwFlagShow = selectedNode.gwFlag;
    // }

    useEffect(() => {
        // let tempFields = {};
        let tempFields: any[] = [];
        if (selectedNode) {
            if (modalType === 'edit') {
                const {
                    code,
                    name,
                    state,
                    remark,
                    gwFlag,
                    piUrl,
                    piRouter,
                    sort,
                    terminalType,
                    piPicture,
                    ssoType,
                    ssoInfo,
                } = selectedNode;
                if (piUrl) {
                    canConfigSSO = true;
                }

                tempFields = [
                    {name: ['code'], value: code}, // 应用编码
                    {name: ['name'], value: name}, // 应用名称
                    {name: ['remark'], value: remark}, // 应用描述
                    {name: ['state'], value: !state.value}, // 账户状态
                    {name: ['gwFlag'], value: gwFlag.value}, // 内外标识 0 内部 1 外部
                    {name: ['piUrl'], value: piUrl}, // 应用IP
                    {name: ['piRouter'], value: piRouter}, // 路由地址
                    {name: ['sort'], value: sort}, // 排序
                    {name: ['terminalType'], value: terminalType},
                    {name: ['piPicture'], value: piPicture}, // 应用图片
                    {name: ['ssoType'], value: ssoType}, // 单点登录方式
                    {name: ['ssoInfo'], value: ssoInfo}, // 单点登录参数
                ];

                // tempFields = {
                //     code, // 应用编码
                //     name, // 应用名称
                //     remark, // 应用描述
                //     state: !state.value, // 账户状态
                //     gwFlag: gwFlag.value, // 内外标识 0 内部 1 外部
                //     piUrl, // 应用IP
                //     piRouter, // 路由地址
                //     sort, // 排序
                //     terminalType,
                //     piPicture, // 应用图片
                //     ssoType, // 单点登录方式
                //     ssoInfo, // 单点登录参数
                // };
            }
        }

        // formRef &&
        //     formRef.current &&
        //     formRef.current.setFieldsValue(tempFields);
        setFields(tempFields);
    }, [addModalId, modalType, selectedNode, formRef]);

    if (selectedNode === null) {
        return null;
    }

    // 图片验证
    const checkValidate = useCallback(
        (file) =>
            validateFile({
                file,
                types: ['image/jpeg', 'image/png'],
                size: [2, 'MB'],
            }),
        [],
    );

    if (selectedNode === null) {
        return null;
    }

    // 过滤input内容中的空格
    const filterSpace = (e: {target: {value: string}}) => e.target.value.trim();

    return (
        <div className={styles.view}>
            <Form
                {...formItemLayout}
                fields={fields}
                onFieldsChange={(_, allFields) => setFields(allFields)}
                // className={styles.form}
                ref={formRef}
                onFinish={(values) => {
                    if (
                        values.piUrl?.length !== 0 &&
                        values.piRouter?.length !== 0 &&
                        !(
                            values.piUrl.substr(values.piUrl.length - 1, 1) ===
                                '/' || values.piRouter.substr(0, 1) === '/'
                        )
                    ) {
                        message.error(t('应用IP以/结尾或路由地址以/开头'));
                        return;
                    }
                    dispatch(
                        addSubmitData({
                            values,
                            addModalId,
                            type: currentType,
                            selectedNode: internalSelectedNode,
                            modalType,
                            pageProps,
                        }),
                    ).then(() => {
                        trigger(Events.update_product_menus);
                        trigger(Events.refresh_menu_manager);
                        closeModal(addModalId);
                    });
                }}
                initialValues={{
                    code: '', // 应用编码
                    name: '', // 应用名称
                    remark: '', // 应用描述
                    state: true, // 账户状态
                    gwFlag: 1, // 内外标识 0 内部 1 外部
                    piUrl: '', // 应用IP
                    piRouter: '', // 路由地址
                    sort: 1, // 排序
                    terminalType: 'PC',
                    piPicture: '',
                    ssoType: null, // 单点登录方式
                    ssoInfo: '', // 单点登录参数
                }}
            >
                {/* 应用编码 */}
                <Form.Item
                    name="code"
                    label={handleFormItemLabel(t('应用编码'))}
                    rules={[
                        {
                            required: true,
                            validator: (rule, value) => {
                                if (
                                    value.trim() === undefined ||
                                    value.trim() === ''
                                ) {
                                    return Promise.reject(
                                        new Error(t('请输入应用编码')),
                                    );
                                }

                                if (emoji.test(value.trim())) {
                                    return Promise.reject(
                                        new Error(t('应用编码不能输入表情')),
                                    );
                                }

                                return Promise.resolve();
                            },
                        },
                    ]}
                    validateTrigger="onBlur"
                >
                    <Input placeholder={t('请输入应用编码')} maxLength={64} />
                </Form.Item>

                {/* 应用名称 */}
                <Form.Item
                    name="name"
                    label={handleFormItemLabel(t('应用名称'))}
                    rules={[
                        {
                            required: true,
                            validator: (rule, value) => {
                                if (
                                    value.trim() === undefined ||
                                    value.trim() === ''
                                ) {
                                    return Promise.reject(
                                        new Error(t('请输入应用名称')),
                                    );
                                }

                                if (emoji.test(value.trim())) {
                                    return Promise.reject(
                                        new Error(t('标签名称不能输入表情')),
                                    );
                                }

                                return Promise.resolve();
                            },
                        },
                    ]}
                    validateTrigger="onBlur"
                >
                    <Input placeholder={t('请输入应用名称')} maxLength={50} />
                </Form.Item>
                {/* 顺序 */}
                <Form.Item
                    name="sort"
                    label={handleFormItemLabel(t('顺序'))}
                    rules={[
                        {
                            required: true,
                            message: t('请输入'),
                        },
                    ]}
                >
                    <SortInput />
                </Form.Item>
                {/* 应用描述 */}
                <Form.Item name="remark" label={t('应用描述')}>
                    <TextArea
                        placeholder={t('请输入255字以内的应用描述')}
                        rows={4}
                        maxLength={255}
                    />
                </Form.Item>
                {/* 应用IP */}
                <Form.Item
                    name="piUrl"
                    label={handleFormItemLabel(t('应用IP'))}
                    rules={[
                        // {
                        //   required: true,
                        //   message: t('productMaintenance.onAsIp'),
                        // },
                        {
                            pattern:
                                /^((http|https):\/\/){0,1}\d{0,200}\.\d{0,200}\.\d{0,200}\.\d{0,200}.\d{0,200}(\/){0,1}$/,
                            message: t('请输入正确的IP地址'),
                        },
                    ]}
                    validateTrigger="onBlur"
                >
                    <Input placeholder={t('请输入应用IP')} maxLength={200} />
                </Form.Item>
                {/* 路由地址 */}
                <Form.Item
                    name="piRouter"
                    label={handleFormItemLabel(t('路由地址'))}
                    rules={[
                        {
                            required: false,
                            message: t('请输入路由地址'),
                        },
                        {
                            // /xx/xxx、xx/xxx、xx/xxx/xxx.html
                            pattern:
                                /^[A-Za-z0-9/\-_&?.%#=+]+([A-Za-z0-9]+.html)?$|^(\/)$/g,
                            message: relateUrlMsg,
                        },
                    ]}
                    validateTrigger="onBlur"
                >
                    <Input placeholder={t('请输入路由地址')} maxLength={200} />
                </Form.Item>
                {/* 内外标识 */}
                <Form.Item
                    name="gwFlag"
                    label={handleFormItemLabel(t('内外标识'))}
                    rules={[
                        {
                            required: true,
                            message: t('内外标识不可以为空'),
                        },
                    ]}
                >
                    <Select placeholder={t('请选择内外标识')} disabled>
                        <Option value={0}>{t('金风内部产品')}</Option>
                        <Option value={1}>{t('第三方的产品')}</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="terminalType"
                    label={t('应用终端类型')}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        className={styles.selectLength}
                        getPopupContainer={(triggerNode) =>
                            triggerNode.parentNode
                        }
                    >
                        <Option value="PC">{t('PC端')}</Option>
                        <Option value="MOBILE">{t('移动端')}</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="state"
                    label={handleFormItemLabel(t('状态'))}
                    valuePropName="checked"
                    rules={[
                        {
                            required: true,
                            message: t('状态'),
                        },
                    ]}
                >
                    <Switch
                        checkedChildren={t('启用')}
                        unCheckedChildren={t('禁用')}
                        defaultChecked
                    />
                </Form.Item>
                {/* 应用图片 */}
                <Form.Item
                    name="piPicture"
                    label={handleFormItemLabel(t('应用图片'))}
                >
                    <UploadImage
                        checkValidate={checkValidate}
                        showHint={t(
                            '文件格式为：.png、.jpg，图片分辨率不超过1000*500px，大小不超过2M',
                        )}
                    />
                </Form.Item>
                {canConfigSSO ? (
                    <>
                        <Form.Item
                            name="ssoType"
                            label={handleFormItemLabel(t('单点登录方式'))}
                            rules={[
                                {
                                    required: true,
                                    message: t('请选择单点登录方式'),
                                },
                            ]}
                        >
                            <Select
                                className={styles.selectLength}
                                placeholder={t('请选择单点登录方式')}
                                getPopupContainer={(triggerNode) =>
                                    triggerNode.parentNode
                                }
                            >
                                {loginType.map(
                                    ({dictdataName, dictdataCode}) => (
                                        <Select.Option
                                            key={dictdataName}
                                            value={dictdataCode}
                                        >
                                            {dictdataName}
                                        </Select.Option>
                                    ),
                                )}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="ssoInfo"
                            label={handleFormItemLabel(t('单点登录参数'))}
                            rules={[
                                {
                                    validator: (rule, value) => {
                                        if (value) {
                                            try {
                                                const obj = JSON.parse(value);
                                                if (
                                                    typeof obj === 'object' &&
                                                    obj
                                                ) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    t(
                                                        '输入的参数格式有误，请检查输入的参数数据格式',
                                                    ),
                                                );
                                            } catch (e) {
                                                return Promise.reject(
                                                    t(
                                                        '输入的参数格式有误，请检查输入的参数数据格式',
                                                    ),
                                                );
                                            }
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                            getValueFromEvent={filterSpace}
                        >
                            <TextArea
                                className={styles.inputFrame}
                                placeholder={t(
                                    '请输入单点登录参数，参数格式为JSON类型，长度不超过500',
                                )}
                                rows={5}
                                maxLength={500}
                            />
                        </Form.Item>
                    </>
                ) : null}
            </Form>
        </div>
    );
};

export default CustomForm;
