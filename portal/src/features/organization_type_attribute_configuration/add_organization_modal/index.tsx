import React, {useState} from 'react';
import {Form, Input, Select, message} from 'antd';
import {Modal, useModal, PageProps} from '@gwaapp/ease';
import {shallowEqual} from 'react-redux';
import {addOrgTemplate} from '@services/organization_type_attribute_configuration';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useTranslation} from 'react-i18next';
import {report} from '@/common/utils/clientAction';
import {ADD_ORGANIZATION_MODAL} from '../constant';
import {tagsData} from '../actions';

interface IProps {
    pageProps: PageProps;
}
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
//             span: 18,
//         },
//     },
// };

const AddOrganizationModal = ({pageProps}: IProps) => {
    const {id} = pageProps;
    const {typeDataList} = useAppSelector((state) => state[id], shallowEqual);
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const {closeModal} = useModal();
    const [loading, setLoading] = useState(false);
    const {t} = useTranslation();

    const handleCancel = () => {
        form.resetFields();
    };

    const handleOk = () => {
        form.validateFields().then((values: any) => {
            setLoading(true);
            const action = {
                id: 'addUpdate',
                module: 'organizationTypeConfiguration',
                desc: `${t('新建机构类型')}：${values.templateName}`,
            };
            addOrgTemplate({
                remark: values.remark,
                templateName: values.templateName,
                type: values.type.toString(),
            })
                .then((res) => {
                    const {code} = res;

                    if (code === '200') {
                        message.success(t('框架添加成功'));
                        dispatch(tagsData(pageProps));
                        form.resetFields();
                        closeModal(ADD_ORGANIZATION_MODAL);
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
        // 添加机构类型别名
        <Modal
            id={ADD_ORGANIZATION_MODAL}
            title={t('添加机构类型别名')}
            width={600}
            isAutoClose={false}
            onOk={handleOk}
            okText={t('确定')}
            onCancel={handleCancel}
            confirmLoading={loading}
        >
            <Form form={form} layout="vertical">
                {/* 机构类型别名 */}
                <Form.Item
                    label={t('机构类型别名')}
                    name="templateName"
                    rules={[
                        {
                            required: true,
                            message: t('请输入机构类型别名'),
                        },
                    ]}
                >
                    <Input autoComplete="off" maxLength={20} />
                </Form.Item>
                {/* 机构类型 */}
                <Form.Item
                    label={t('机构类型')}
                    name="type"
                    rules={[
                        {
                            required: true,
                            message: t('请选择机构类型'),
                        },
                    ]}
                >
                    <Select>
                        {/* <Select.Option value="0">普通组织</Select.Option>
              <Select.Option value="1">业务电站</Select.Option> */}
                        {typeDataList.map((i: any) => (
                            <Select.Option
                                key={i.dictdataValue}
                                value={i.dictdataValue}
                                title={i.dictdataName}
                            >
                                {i.dictdataName}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                {/* 描述 */}
                <Form.Item label={t('描述')} name="remark">
                    <Input.TextArea
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
            </Form>
        </Modal>
    );
};

export default AddOrganizationModal;
