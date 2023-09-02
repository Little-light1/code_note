import React, {useCallback, useEffect, MutableRefObject} from 'react';
import {Switch, Form, Input, FormInstance} from 'antd';
import {validateFile} from '@utils/file';
import {onlyCnEnNo} from '@utils/reg';
import {UploadImage} from '@/components/upload';
import {useAppDispatch} from '@/app/runtime';
import {useModal, PageProps} from '@gwaapp/ease';
import SortInput from '@/components/sort_input';
import {useTranslation} from 'react-i18next';
import styles from './styles.module.scss';
import {submit} from '../actions';

interface Props {
    data: any;
    formRef: MutableRefObject<FormInstance | null>;
    pageProps: PageProps;
    modalId: string;
    modalType: string;
}

const BgPicForm = ({data, formRef, pageProps, modalId, modalType}: Props) => {
    const {closeModal} = useModal();
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const checkValidate = useCallback(
        (file) =>
            validateFile({
                file,
                types: ['image/jpeg', 'image/png'],
                size: [1, 'MB'],
                picture: {
                    height: 1080,
                    width: 1920,
                },
            }),
        [],
    );
    useEffect(() => {
        let fields = {};

        if (modalType === 'add') {
            fields = {
                ipicIsenable: true,
            };
        } else {
            fields = {
                ipicIsenable: data?.ipicIsenable,
                ipicFiletoken: data?.ipicFiletoken,
                ipicName: data?.ipicName,
                ipicSort: data?.ipicSort,
            };
        }

        formRef && formRef.current && formRef.current.setFieldsValue(fields);
    }, [data, formRef, modalType]);
    return (
        <div className={styles.view}>
            <Form
                labelCol={{
                    span: 8,
                }}
                ref={formRef}
                name="data_dict_config_update_modal"
                initialValues={{
                    ipicIsenable: true,
                }}
                onFinish={(values) => {
                    dispatch(submit(pageProps, values, modalType, data)).then(
                        () => closeModal(modalId),
                    );
                }}
            >
                {/* 背景图片 */}
                <Form.Item
                    name="ipicFiletoken"
                    label={t('背景图片')}
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
                <div className={styles.desc}>
                    {t(
                        '文件格式为: .png、.jpg, 图片分辨率为: 1920 * 1080px, 大小不超过1M',
                    )}
                </div>
                {/* 图片名称 */}
                <Form.Item
                    name="ipicName"
                    label={t('图片名称')}
                    rules={[
                        {
                            required: true,
                        },
                        {
                            pattern: onlyCnEnNo,
                            message: t('不能含有特殊字符'), // 不能含有特殊字符
                        },
                    ]}
                >
                    <Input maxLength={32} />
                </Form.Item>
                {/* 顺序 */}
                <Form.Item
                    name="ipicSort"
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
                {/* 状态 */}
                <Form.Item
                    name="ipicIsenable"
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
            </Form>
        </div>
    );
};

export default BgPicForm;
