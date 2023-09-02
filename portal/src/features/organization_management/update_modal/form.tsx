/* eslint-disable @typescript-eslint/no-shadow */

/*
 * @Author: gxn
 * @Date: 2021-11-29 13:53:10
 * @LastEditors: gxn
 * @LastEditTime: 2023-03-03 11:51:59
 * @Description: input 输入函数
 */
import React, {useEffect, MutableRefObject} from 'react';
import {
    Select,
    Form,
    Input,
    FormInstance,
    DatePicker,
    Row,
    Col,
    InputNumber,
} from 'antd';
import moment from 'moment';
import {shallowEqual} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useModal, PageProps} from '@gwaapp/ease';
import EvenlyElements, {HideElement} from '@/components/evenly_elements';
import {submit} from './actions';
import styles from './styles.module.scss';
import {getTemplateDetail} from '../actions';

interface Props {
    data: any;
    formRef: MutableRefObject<FormInstance | null>;
    pageProps: PageProps;
    modalId: string;
    modalType: string;
}

const CommonConfigForm = ({
    data,
    formRef,
    pageProps,
    modalId,
    modalType,
}: Props) => {
    const {t} = useTranslation();
    const {id} = pageProps;
    const {closeModal} = useModal();
    const dispatch = useAppDispatch();
    const {
        dynamicRow,
        // 动态row
        orgTemplateList,
        // 模板列表
        orgInfo,
        // 节点详情
        farmList,
        // 物理场站列表
        farmTypeList, // 获取场站类型
    } = useAppSelector((state) => state[id], shallowEqual); // 组装动态row

    let fixedRow;
    // 需要进行日期格式化的form key
    const dateKeys: any[] = [];
    // 需要进行时间格式化的form key
    const dateTimeKeys: any[] = [];

    if (dynamicRow && dynamicRow.length > 0) {
        fixedRow = dynamicRow.map((field: any) => {
            const {fieldName} = field;
            const fieldNameObj = (
                <div title={fieldName} className={styles.tableItem}>
                    {fieldName}
                </div>
            ); // 可以为空

            const isNull = !field.isNull.value;

            switch (Number(field.fieldType)) {
                case 0: {
                    switch (field.dataType.value) {
                        case 0: {
                            return (
                                <Form.Item
                                    name={fieldName}
                                    label={fieldNameObj}
                                    key={fieldName}
                                    // labelAlign="right"
                                    rules={[
                                        {
                                            required: isNull,
                                            message: `${t(
                                                '请输入',
                                            )}"${fieldName}"`,
                                        },
                                    ]}
                                >
                                    <Input
                                        maxLength={255}
                                        className={styles.input}
                                    />
                                </Form.Item>
                            );
                        }

                        case 1: {
                            return (
                                <Form.Item
                                    name={fieldName}
                                    label={fieldNameObj}
                                    key={fieldName}
                                    // labelAlign="right"
                                    rules={[
                                        {
                                            required: isNull,
                                            // eslint-disable-next-line prefer-regex-literals
                                            pattern: new RegExp(
                                                /^[1-9]\d*$/,
                                                'g',
                                            ),
                                            message: `${t('请输入')}${t(
                                                '数字',
                                            )}`,
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        maxLength={255}
                                        className={styles.input}
                                    />
                                </Form.Item>
                            );
                        }

                        case 2: {
                            return (
                                <Form.Item
                                    name={fieldName}
                                    label={fieldNameObj}
                                    key={fieldName}
                                    // labelAlign="right"
                                    rules={[
                                        {
                                            required: isNull,
                                            // eslint-disable-next-line prefer-regex-literals
                                            pattern: new RegExp(
                                                /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]{1,2})$)|^(([1-9]+)$)/,
                                            ),
                                            message: `${t('请输入')}${t(
                                                '小数',
                                            )}`,
                                        },
                                    ]}
                                >
                                    <Input
                                        maxLength={255}
                                        className={styles.input}
                                    />
                                </Form.Item>
                            );
                        }

                        default:
                    }

                    break;
                }

                case 1: {
                    switch (field.fieldName) {
                        case t('电场类型'): {
                            return (
                                <Form.Item
                                    name={fieldName}
                                    label={fieldNameObj}
                                    key={fieldName}
                                    // labelAlign="right"
                                    rules={[
                                        {
                                            required: isNull,
                                            message: `${t(
                                                '请输入',
                                            )}"${fieldName}"`,
                                        },
                                    ]}
                                >
                                    <Select
                                        getPopupContainer={(triggerNode) =>
                                            triggerNode.parentNode
                                        }
                                    >
                                        {farmTypeList.map(
                                            ({
                                                dictdataName,
                                                dictdataValue,
                                            }: {
                                                dictdataName: string;
                                                dictdataValue: string;
                                            }) => (
                                                <Select.Option
                                                    key={dictdataValue}
                                                    value={dictdataValue}
                                                >
                                                    {dictdataName}
                                                </Select.Option>
                                            ),
                                        )}
                                    </Select>
                                </Form.Item>
                            );
                        }

                        case t('映射的物理电场'): {
                            return (
                                <Form.Item
                                    name={fieldName}
                                    label={fieldNameObj}
                                    key={fieldName}
                                    // labelAlign="right"
                                    // rules={[
                                    //     {
                                    //         required: isNull,
                                    //         message: `${t(
                                    //             '请输入',
                                    //         )}"${fieldName}"`,
                                    //     },
                                    // ]}
                                    rules={[
                                        {
                                            // 自定义校验规则
                                            validator: (rule, value) => {
                                                if (
                                                    isNull &&
                                                    value &&
                                                    value.length === 0
                                                ) {
                                                    return Promise.reject(
                                                        `${t(
                                                            '请输入',
                                                        )}"${fieldName}"`,
                                                    );
                                                }

                                                if (
                                                    value &&
                                                    value.length > 10
                                                ) {
                                                    return Promise.reject(
                                                        t('最多选10个'),
                                                    );
                                                }

                                                return Promise.resolve();
                                            },
                                        },
                                    ]}
                                >
                                    <Select
                                        mode="multiple"
                                        showSearch
                                        optionFilterProp="label"
                                        getPopupContainer={(triggerNode) =>
                                            triggerNode.parentNode
                                        }
                                    >
                                        {farmList.map(
                                            ({
                                                customerId,
                                                label,
                                                disabled,
                                            }: {
                                                customerId: string;
                                                label: string;
                                                disabled: boolean;
                                            }) => (
                                                <Select.Option
                                                    key={customerId}
                                                    value={customerId}
                                                    label={label}
                                                    disabled={disabled}
                                                >
                                                    {`${label}${
                                                        disabled
                                                            ? `(${t('已关联')})`
                                                            : ''
                                                    }`}
                                                </Select.Option>
                                            ),
                                        )}
                                    </Select>
                                </Form.Item>
                            );
                        }

                        default:
                    }

                    break;
                }

                case 2: {
                    dateKeys.push(fieldName);
                    return (
                        <Form.Item
                            name={fieldName}
                            label={fieldNameObj}
                            key={fieldName}
                            // labelAlign="right"
                            rules={[
                                {
                                    required: isNull,
                                    message: `${t('请输入')}"${fieldName}"`,
                                },
                            ]}
                        >
                            <DatePicker
                                format="YYYY-MM-DD"
                                className={styles.input}
                            />
                        </Form.Item>
                    );
                }

                case 3: {
                    dateTimeKeys.push(fieldName);
                    return (
                        <Form.Item
                            name={fieldName}
                            label={fieldNameObj}
                            key={fieldName}
                            // labelAlign="right"
                            rules={[
                                {
                                    required: isNull,
                                    message: `${t('请输入')}"${fieldName}"`,
                                },
                            ]}
                        >
                            <DatePicker
                                className={styles.input}
                                format="YYYY-MM-DD HH:mm:ss"
                                showTime
                            />
                        </Form.Item>
                    );
                }

                case 1000: {
                    return (
                        <Form.Item
                            name={fieldName}
                            label={fieldNameObj}
                            key={fieldName}
                            // labelAlign="right"
                            rules={[
                                {
                                    required: isNull,
                                    message: `${t('请输入')}"${fieldName}"`,
                                },
                                {
                                    // eslint-disable-next-line prefer-regex-literals
                                    pattern: new RegExp(/^[A-Za-z0-9]+$/, 'g'),
                                    message: `${t('请输入英文，数字或其组合')}`,
                                },
                            ]}
                        >
                            <Input
                                disabled={modalType === 'edit'}
                                maxLength={32}
                                className={styles.input}
                            />
                        </Form.Item>
                    );
                }

                case 1001: {
                    return (
                        <HideElement>
                            <Form.Item
                                className={styles.constraintArea}
                                name={fieldName}
                                label={fieldNameObj}
                                key={fieldName}
                                // labelAlign="right"
                                rules={[
                                    {
                                        required: isNull,
                                        message: `${t('请输入')}"${fieldName}"`,
                                    },
                                ]}
                            >
                                <Input
                                    maxLength={255}
                                    className={styles.input}
                                />
                            </Form.Item>
                        </HideElement>
                    );
                }

                case 1002: {
                    return (
                        <Form.Item
                            name={fieldName}
                            label={fieldNameObj}
                            key={fieldName}
                            // labelAlign="right"
                            rules={[
                                {
                                    required: isNull,
                                    message: `${t('请输入')}"${fieldName}"`,
                                },
                            ]}
                        >
                            <InputNumber
                                className={styles.input}
                                // className={styles.numberInput}
                                step={10}
                                min={1}
                                max={999}
                                maxLength={3}
                                precision={0}
                            />
                        </Form.Item>
                    );
                }

                default:
            }
        });
    }

    useEffect(() => {
        let fields: any = {};
        const {platformOrganization, fieldList} = orgInfo;

        if (modalType === 'add') {
            fields = {
                cconfigIsenable: true,
                sort: 1,
            };
            let constraintObj: any = null;
            dynamicRow.forEach((item: {fieldType: string}) => {
                if (item.fieldType === '1001') {
                    constraintObj = item;
                }
            });

            if (constraintObj) {
                fields[constraintObj.fieldName] = constraintObj.defaultValue;
            }
        } else {
            fields = {
                cconfigIsenable: true,
            };
            fields = {
                name: platformOrganization.name,
                remark: platformOrganization.remark,
                sort: platformOrganization.sort,
                templateID: platformOrganization.templateID,
            };

            if (fieldList && fieldList.length > 0) {
                const fieldObj: any = {};
                fieldList.forEach((field: any) => {
                    // 过滤需要转换格式的表单内容，字段类型为 2、3 时为日期、时间格式，需要初始化
                    switch (Number(field.fieldType)) {
                        case 2:
                        case 3:
                            if (field.fieldValue) {
                                fieldObj[field.fieldName] = moment(
                                    field.fieldValue,
                                );
                            }
                            break;
                        default:
                            fieldObj[field.fieldName] = field.fieldValue;
                    }
                });
                Object.assign(fields, fieldObj);
            } // fieldList存在则组装对应数据
        }

        formRef && formRef.current && formRef.current.setFieldsValue(fields);
    }, [orgInfo, formRef, modalType, dynamicRow]);
    // const formItemLayout = {
    //     labelCol: {
    //         xs: {
    //             span: 24,
    //         },
    //         sm: {
    //             span: 7,
    //         },
    //     },
    //     wrapperCol: {
    //         xs: {
    //             span: 24,
    //         },
    //         sm: {
    //             span: 16,
    //         },
    //     },
    // };
    return (
        <div className={styles.view}>
            <Form
                ref={formRef}
                // {...formItemLayout}
                name="organization_management_form"
                initialValues={{
                    cconfigIsenable: true,
                }}
                layout="vertical"
                // labelAlign="left"
                // labelCol={{span: 9}}
                // wrapperCol={{span: 15}}
                onFinish={(fieldsValue) => {
                    const values = {
                        ...fieldsValue,
                    };
                    dateTimeKeys.forEach((key: any) => {
                        values[key] = values[key].format('YYYY-MM-DD HH:mm:ss');
                    });
                    dateKeys.forEach((key: any) => {
                        if (values[key] !== undefined && values[key] !== null) {
                            values[key] = values[key].format('YYYY-MM-DD');
                        } else {
                            values[key] = '';
                        }
                    });
                    // eslint-disable-next-line guard-for-in
                    for (const key in values) {
                        if (values[key] !== undefined && values[key] !== null) {
                            values[key] =
                                typeof values[key] === 'object'
                                    ? values[key].toString()
                                    : values[key];
                        } else {
                            values[key] = '';
                        }
                    }
                    dispatch(submit(values, modalType, pageProps)).then(() =>
                        closeModal(modalId),
                    );
                }}
            >
                {/* <Row>
                    <Col span={24}> */}
                <Form.Item
                    name="templateID"
                    label={t('组织类型')}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        disabled={modalType === 'edit'}
                        onChange={(e) => {
                            formRef.current?.resetFields();
                            formRef.current?.setFieldsValue({templateID: e});
                            dispatch(getTemplateDetail(pageProps, e));
                        }}
                        getPopupContainer={(triggerNode) =>
                            triggerNode.parentNode
                        }
                    >
                        {orgTemplateList.map(
                            ({id, name}: {id: string; name: string}) => (
                                <Select.Option key={id} value={id}>
                                    {name}
                                </Select.Option>
                            ),
                        )}
                    </Select>
                </Form.Item>
                {/* </Col>
                </Row> */}
                <EvenlyElements count={2}>{fixedRow}</EvenlyElements>
            </Form>
        </div>
    );
};

export default CommonConfigForm;
