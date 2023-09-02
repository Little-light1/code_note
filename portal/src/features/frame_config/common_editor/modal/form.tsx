import React, {useCallback, useEffect, MutableRefObject} from 'react';
import {Switch, Form, Input, FormInstance, Row, Col, message} from 'antd';
import {validateFile} from '@utils/file';
import {
    onlyEnNo,
    onlyEnNoMsg,
    onlyCnEnNo,
    onlyCnEnNoMsg,
    checkAbsUrl,
    checkRelUrl,
} from '@utils/reg';
import {UploadImage} from '@/components/upload';
import {useAppSelector, useAppDispatch} from '@/app/runtime';
import {useModal, useAction, PageProps} from '@gwaapp/ease';
import SortInput from '@/components/sort_input';
import {Events} from '@common/events';
import {useTranslation} from 'react-i18next';
import {submit} from '../actions';
import styles from './styles.module.scss';
import {uuid2} from './helper';

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
    const {closeModal} = useModal();
    const dispatch = useAppDispatch();
    const {handlers} = useAction();
    const {trigger} = handlers;
    const {t} = useTranslation();
    const checkValidate = useCallback(
        (file) =>
            validateFile({
                file,
                types: ['image/jpeg', 'image/png'],
                size: [100, 'KB'],
                picture: {
                    height: 48,
                    width: 48,
                },
            }),
        [],
    );
    const commonConfigs = useAppSelector((state) => state.app.commonConfigs);
    useEffect(() => {
        let fields = {};

        if (modalType === 'add') {
            fields = {
                cconfigIsenable: true,
                cconfigCode: uuid2(),
            };
        } else if (modalType === 'edit') {
            fields = {
                cconfigCode: data.cconfigCode,
                cconfigUrlpath: data.cconfigUrlpath,
                cconfigIsenable: data.cconfigIsenable,
                cconfigName: data.cconfigName,
                cconfigFiletoken: data.cconfigFiletoken,
                cconfigSort: data.cconfigSort,
            };
        }

        formRef && formRef.current && formRef.current.setFieldsValue(fields);
    }, [data, formRef, modalType]); // const getRandomPassword = () => {
    //   const cconfigCode = uuid2();
    //   console.log(cconfigCode);
    //   formRef && formRef.current && formRef.current.setFieldsValue({ cconfigCode })
    //   // form.setFieldsValue({ password });
    // };

    return (
        <div className={styles.view}>
            <Form
                ref={formRef}
                className={styles.form}
                name="data_dict_config_update_modal"
                initialValues={{
                    cconfigIsenable: true,
                }}
                onFinish={(values) => {
                    const isUseConfigs = commonConfigs.filter(
                        (item: any) => !!item.cconfigIsenable,
                    ).length;

                    if (values.cconfigIsenable && isUseConfigs === 5) {
                        message.warning(t('最多启用五个'));
                        return;
                    }
                    dispatch(submit(pageProps, values, modalType, data)).then(
                        () => {
                            closeModal(modalId);
                            trigger(Events.update_frame_common);
                        },
                    );
                }}
            >
                <Row>
                    {/* 编码 */}
                    <Col span={8}>
                        <Form.Item
                            name="cconfigCode"
                            label={t('编码')}
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    pattern: onlyEnNo,
                                    message: onlyEnNoMsg,
                                },
                            ]}
                        >
                            <Input maxLength={20} />
                        </Form.Item>
                    </Col>
                    {/* <Col span={3} offset={1}> <div onClick={getRandomPassword} className={styles.random}> 随机 </div></Col> */}
                    {/* URL地址 */}
                    <Col span={14} offset={1}>
                        <Form.Item
                            name="cconfigUrlpath"
                            label={t('URL地址')}
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    validator: async (rule, value) => {
                                        if (!value) {
                                            return true;
                                        }

                                        if (
                                            checkAbsUrl(value) ||
                                            checkRelUrl(value)
                                        ) {
                                            return true;
                                        }

                                        throw new Error(
                                            t('请输入正确的URL格式'),
                                        );
                                    },
                                },
                            ]}
                        >
                            <Input maxLength={255} />
                        </Form.Item>
                    </Col>
                </Row>
                {/* 功能名称 */}
                <Row>
                    <Col span={8}>
                        <Form.Item
                            name="cconfigName"
                            label={t('功能名称')}
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
                            <Input maxLength={10} />
                        </Form.Item>
                    </Col>
                    {/* 图标 */}
                    <Col span={14} offset={1}>
                        <Form.Item
                            name="cconfigFiletoken"
                            label={t('图标')}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <UploadImage
                                checkValidate={checkValidate}
                                className={styles.upload}
                            />
                        </Form.Item>
                        <span>
                            {t(
                                '文件格式为: .png, .jpg 图片分辨率为: 48 * 48px, 大小不超过100k',
                            )}
                        </span>
                    </Col>
                </Row>
                <Row>
                    {/* 顺序 */}
                    <Col span={8}>
                        <Form.Item
                            name="cconfigSort"
                            label={t('顺序')}
                            rules={[
                                {
                                    required: true,
                                    message: t('请输入'),
                                },
                            ]}
                        >
                            <SortInput />
                        </Form.Item>
                    </Col>
                    {/* 状态 */}
                    <Col span={14} offset={1}>
                        <Form.Item
                            name="cconfigIsenable"
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
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default CommonConfigForm;
