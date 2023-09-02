import React, {useState, useEffect, MutableRefObject} from 'react';
import {Row, Col, Form, Input, FormInstance, Select} from 'antd';
import {shallowEqual} from 'react-redux';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useModal, PageProps} from '@gwaapp/ease';
import {useTranslation} from 'react-i18next';
import styles from './styles.module.scss';
import {addSubmitData} from '../actions';

const {TextArea} = Input;
interface IProps {
    addModalId: string;
    modalType: 'add' | 'edit'; // 模态窗口类型

    formRef: MutableRefObject<FormInstance<any> | null>;
    pageProps: PageProps;
    selectedNode: null | any;
}
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        // * <576p
        sm: {
            span: 6,
        }, // * ≥576px
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 18,
        },
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
    const {selectedTemplateId, typeControlList} = useAppSelector(
        (state) => state[id],
        shallowEqual,
    );
    const [currentType] = useState<any>(null);
    const dispatch = useAppDispatch();
    const {closeModal} = useModal();
    const [internalSelectedNode, setInternalSelectedNode] =
        useState(selectedNode);
    const userInfo = useAppSelector((state) => state.app.userInfo);
    const parentID = userInfo.enterpriseID;
    const {t} = useTranslation(); // 初始化内部选择

    useEffect(() => {
        setInternalSelectedNode(selectedNode);
    }, [selectedNode]);
    useEffect(() => {
        let fields: {
            [key: string]: any;
        } = {};

        if (selectedNode) {
            if (modalType === 'edit') {
                const {
                    dataType,
                    isNull,
                    defaultValue,
                    fieldName,
                    fieldType,
                    remark,
                } = selectedNode;
                const dataTypeString = dataType.value;
                const isNullString = isNull.value;
                fields = {
                    dataType: dataTypeString.toString(),
                    // 数据类型
                    defaultValue,
                    // 默认值
                    fieldName,
                    // 字段名称
                    fieldType,
                    //  控件类型
                    isNull: isNullString.toString(),
                    // 是否必填
                    remark, // 描述
                };
            }
        }

        formRef && formRef.current && formRef.current.setFieldsValue(fields);
    }, [addModalId, modalType, selectedNode, formRef, selectedTemplateId]);

    if (selectedNode === null) {
        return null;
    }

    return (
        <div className={styles.viewStyle}>
            <Form
                // {...formItemLayout}
                labelAlign="right"
                className={styles.form}
                ref={formRef}
                onFinish={(values) => {
                    dispatch(
                        addSubmitData({
                            values,
                            addModalId,
                            type: currentType,
                            selectedNode: internalSelectedNode,
                            modalType,
                            pageProps,
                            parentID,
                            selectedTemplateId,
                        }),
                    ).then(() => {
                        // dispatch(tagsTree(pageProps));
                        closeModal(addModalId);
                    });
                }}
                layout="inline"
                initialValues={{
                    dataType: '',
                    // 数据类型：int、boolean等；来自字典表
                    defaultValue: '',
                    // 默认值
                    fieldName: '',
                    // 字段名称
                    fieldType: '',
                    //  控件类型：文本、数字等；来自字典表
                    isNull: '',
                    // 是否必填
                    remark: '', // 描述
                }}
            >
                <Row>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        {/* 字段名称 */}
                        <Form.Item
                            className={styles.inputStyle}
                            label={t('字段名称')}
                            name="fieldName"
                            rules={[
                                {
                                    required: true,
                                    message: t('请输入字段名称'),
                                },
                            ]}
                        >
                            {/**/}
                            <Input
                                autoComplete="off"
                                maxLength={10}
                                className={styles.inputLength}
                            />
                        </Form.Item>
                    </Col>
                    {/* 控件类型 */}
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Form.Item
                            className={styles.inputStyle}
                            label={t('控件类型')}
                            name="fieldType"
                            rules={[
                                {
                                    required: true,
                                    message: t('请选择控件类型'),
                                },
                            ]}
                        >
                            <Select>
                                {typeControlList.map((i: any) => (
                                    <Select.Option
                                        key={i.dictValue}
                                        value={i.dictValue}
                                    >
                                        {i.dictLabel}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    {/* 数据类型 */}
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Form.Item
                            className={styles.inputStyle}
                            label={t('数据类型')}
                            name="dataType"
                            rules={[
                                {
                                    required: true,
                                    message: t('请选择数据类型'),
                                },
                            ]}
                        >
                            <Select>
                                {/* 字符 数字 小数 */}
                                <Select.Option value="0">
                                    {t('字符')}
                                </Select.Option>
                                <Select.Option value="1">
                                    {t('数字')}
                                </Select.Option>
                                <Select.Option value="2">
                                    {t('小数')}
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    {/* 是否必填 */}
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Form.Item
                            className={styles.inputStyle}
                            label={t('是否必填')}
                            name="isNull"
                            rules={[
                                {
                                    required: true,
                                    message: t('请选择是否必填'),
                                },
                            ]}
                        >
                            {/* className={styles.inputLength} */}
                            <Select>
                                {/* 非必填 必填 */}
                                <Select.Option value="1">
                                    {t('非必填')}
                                </Select.Option>
                                <Select.Option value="0">
                                    {t('必填')}
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    {/* 默认值
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Form.Item
                            className={styles.inputStyle}
                            label={t('默认值')}
                            name="defaultValue"
                        >
                            <Input
                                autoComplete="off"
                                maxLength={50}
                                className={styles.inputLength}
                            />
                        </Form.Item>
                    </Col> */}
                    {/* 描述 */}
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Form.Item
                            label={t('描述')}
                            name="remark"
                            className={styles.inputStyle}
                        >
                            <TextArea
                                autoSize={{
                                    minRows: 2,
                                }}
                                maxLength={50}
                                placeholder={t('最大长度为50个字符')}
                                style={{
                                    resize: 'none',
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default CustomForm;
