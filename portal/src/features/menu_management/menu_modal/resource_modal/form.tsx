import React, {useEffect, MutableRefObject} from 'react';
import {shallowEqual} from 'react-redux';
import {Row, Col, Form, Select, FormInstance, Input, Switch} from 'antd';
import {
    onlyNoEnUnder,
    onlyCnEnNo,
    onlyCnEnNoMsg,
    onlyNoEnUnderMsg,
} from '@utils/reg';
import {useModal, PageProps} from '@gwaapp/ease';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import SortInput from '@/components/sort_input';
import {useTranslation} from 'react-i18next';
import styles from './styles.module.scss';
import {submit} from './actions';

interface ResourceFormProps {
    record: null | any;
    pageProps: PageProps;
    formRef: MutableRefObject<FormInstance<any> | null>;
    modalId: string;
    modalType: 'add' | 'edit'; // 模态窗口类型
}

const ResourceForm = ({
    pageProps,
    record,
    formRef,
    modalId,
    modalType,
}: ResourceFormProps) => {
    const {id} = pageProps;
    const dispatch = useAppDispatch();
    const {closeModal} = useModal();
    const {t} = useTranslation();
    const {resourceTypes} = useAppSelector((state) => state[id], shallowEqual); // 初始化选择状态

    useEffect(() => {
        let fields: any = {};
        fields.msourceSort = 1;

        if (modalType === 'add' && resourceTypes.length) {
            fields.msourceType = resourceTypes[0].dictdataCode;
        }

        if (modalType === 'edit') {
            fields = {...record};
        }

        formRef.current && formRef.current.setFieldsValue(fields);
    }, [formRef, modalType, record, resourceTypes]);
    return (
        <div className={styles.view}>
            <Form
                ref={formRef}
                validateTrigger="onBlur"
                name="data_dict_config_update_modal"
                initialValues={{
                    msourceEnable: true,
                }}
                onFinish={(values) => {
                    dispatch(submit(pageProps, values, modalType, record)).then(
                        () => closeModal(modalId),
                    );
                }}
                labelCol={{span: 8}}
            >
                <Row>
                    <Col span={11}>
                        <Form.Item
                            name="msourceName"
                            label={t('资源名称')}
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    pattern: onlyCnEnNo,
                                    message: onlyCnEnNoMsg,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={11} offset={1}>
                        <Form.Item
                            name="msourceCode"
                            label={t('权限标识')}
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    pattern: onlyNoEnUnder,
                                    message: onlyNoEnUnderMsg,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <Form.Item
                            name="msourceSort"
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
                    <Col span={11} offset={1}>
                        <Form.Item
                            name="msourceType"
                            label={t('资源类型')}
                            rules={[
                                {
                                    required: true,
                                    message: t('请选择'),
                                },
                            ]}
                        >
                            <Select>
                                {resourceTypes.map(
                                    ({dictdataCode, dictdataName}) => (
                                        <Select.Option
                                            key={dictdataCode}
                                            value={dictdataCode}
                                        >
                                            {dictdataName}
                                        </Select.Option>
                                    ),
                                )}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <Form.Item
                            name="msourceEnable"
                            label={t('状态')}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                            valuePropName="checked"
                        >
                            <Switch
                                checkedChildren={t('启用')}
                                unCheckedChildren={t('禁用')}
                                defaultChecked
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default ResourceForm;
