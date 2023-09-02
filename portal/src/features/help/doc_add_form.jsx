/**
 * 权限点添加表单
 * Created by ljf on 2020/3/9.
 */
import {Form} from '@ant-design/compatible';
import {i18nIns} from '@/app/i18n';
import {Input, TreeSelect} from 'antd';
import React from 'react'; //  import validator from '@utils/validator';

const {t} = i18nIns;

class DocAddForm extends React.PureComponent {
    render() {
        const {form, parentList} = this.props;
        const formItemLayout = {
            labelCol: {
                xs: {
                    span: 24,
                },
                sm: {
                    span: 6,
                },
            },
            wrapperCol: {
                xs: {
                    span: 24,
                },
                sm: {
                    span: 16,
                },
            },
        };
        return (
            <Form {...formItemLayout}>
                <Form.Item label={t('父节点')}>
                    {form.getFieldDecorator('parentDocID', {
                        rules: [],
                    })(
                        <TreeSelect
                            id="doc_add_form_parent_id"
                            style={{
                                width: '100%',
                            }}
                            dropdownStyle={{
                                maxHeight: 400,
                                overflow: 'auto',
                            }}
                            treeData={parentList}
                            treeDefaultExpandAll
                            allowClear
                        />,
                    )}
                </Form.Item>
                <Form.Item label={t('标题')}>
                    {form.getFieldDecorator('title', {
                        rules: [
                            {
                                required: true,
                                message: t('请输入标题'),
                            },
                        ],
                    })(
                        <Input
                            id="doc_add_form_title"
                            autoComplete="off"
                            maxLength={25}
                        />,
                    )}
                </Form.Item>
            </Form>
        );
    }
}

const DocAddFormWrapper = Form.create({
    name: 'docAddForm',

    mapPropsToFields(props) {
        return {
            title: Form.createFormField({
                value: props.title,
            }),
            parentDocID: Form.createFormField({
                value: props.parentDocID,
            }),
        };
    },
})(DocAddForm);
export default DocAddFormWrapper;
