import React, {useState} from 'react';
import {Form, Input, message} from 'antd';
import {Modal, useModal, PageProps} from '@gwaapp/ease';
import {shallowEqual} from 'react-redux';
import {copyOrgTemplate} from '@services/organization_type_attribute_configuration';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useTranslation} from 'react-i18next';
import {report} from '@/common/utils/clientAction';
import {COPY_MODAL_ID} from '../constant';
import {tagsData} from '../actions';

interface IProps {
    pageProps: PageProps;
}

const CopyModel = ({pageProps}: IProps) => {
    const {id} = pageProps;
    const {selectedTemplateId} = useAppSelector(
        (state) => state[id],
        shallowEqual,
    );
    const [form] = Form.useForm();
    const {closeModal} = useModal();
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const {t} = useTranslation();

    const handleCancel = () => {
        form.resetFields();
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            setLoading(true);
            const action = {
                id: 'addUpdate',
                module: 'organizationTypeConfiguration',
                desc: `${t('复制新建框架名称')}:${values.templateName}`,
            };
            copyOrgTemplate({
                templateId: selectedTemplateId,
                templateName: values.templateName,
            })
                .then((res) => {
                    const {code} = res;

                    if (code === '200') {
                        message.success(t('复制新建成功'));
                        dispatch(tagsData(pageProps));
                        form.resetFields();
                        closeModal(COPY_MODAL_ID);
                        report.success(action);
                    } else {
                        report.fail(action);
                    }
                })
                .catch((res) => {
                    message.error(res.errorMsg.message);
                    report.fail(action);
                })
                .finally(() => setLoading(false));
        });
    };

    return (
        // 复制新建
        <Modal
            id={COPY_MODAL_ID}
            title={t('复制新建')}
            width={500}
            isAutoClose={false}
            onOk={handleOk}
            onCancel={handleCancel}
            confirmLoading={loading}
            okText={t('确定')}
        >
            <Form form={form}>
                {/* 框架名称 */}
                <Form.Item
                    label={t('框架名称')}
                    name="templateName"
                    rules={[
                        {
                            required: true,
                            message: t('请输入新建框架名称'),
                        },
                    ]}
                >
                    <Input autoComplete="off" maxLength={50} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CopyModel;
