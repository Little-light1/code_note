/*
 * @Author: zhangzhen
 * @Date: 2022-05-30 09:02:49
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-12-02 14:52:14
 */
import React, {FC, forwardRef, useImperativeHandle, useMemo} from 'react';
import {Form, Select, DatePicker, Input, Button, TreeSelect} from 'antd';
import {SearchOutlined, RedoOutlined} from '@ant-design/icons';
import moment from 'moment';
import {i18nIns} from '@/app/i18n';
import {FormPropsAttr, FormItemType, FormActionItemType} from './types';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const FormConfig: FC<any> = forwardRef(({config}: FormPropsAttr, ref) => {
    const {t} = i18nIns;
    const [form] = Form.useForm();
    const {formItem, actionItem} = config; // 暴露出form实例

    useImperativeHandle(ref, () => ({
        formRef: form,
    })); // 提交表单事件

    const onFinish = (values: any) => {
        config.onFinish(values, form);
    }; // 表单项

    const resultItem = useMemo(() => {
        // 表单项的change事件
        const onFormItemChange = (value: any, fun: any) => {
            if (fun) {
                fun(value, form);
            }
        }; // 时间控件的onChange事件

        const onRangePickerChange = (
            dates: [moment.Moment, moment.Moment] | moment.Moment | null,
            dateStrings: [string, string] | string,
            fun: any,
        ) => {
            fun(dates, dateStrings, form);
        }; // 操作项的点击

        const onActionItemClick = (fun: any) => {
            fun(form);
        }; // 渲染表单项

        const formItemResult = formItem.map((item) => {
            switch (item.type) {
                case FormItemType.Input:
                    return (
                        <Form.Item
                            key={item.key}
                            name={item.key}
                            label={item.label}
                            rules={item.rules || []}
                            initialValue={item.defaultValue}
                        >
                            <Input
                                disabled={item.disabled}
                                style={{
                                    width: item.width || 220,
                                }}
                                onChange={(e) => {
                                    onFormItemChange(e, item.onChange);
                                }}
                                placeholder={item.placeholder}
                            />
                        </Form.Item>
                    );

                case FormItemType.Select:
                    return (
                        <Form.Item
                            key={item.key}
                            name={item.key}
                            label={item.label}
                            rules={item.rules || []}
                            initialValue={item.defaultValue}
                        >
                            <Select
                                disabled={item.disabled}
                                style={{
                                    width: item.width || 120,
                                }}
                                placeholder={item.placeholder}
                                onChange={(e) => {
                                    onFormItemChange(e, item.onChange);
                                }}
                            >
                                {(item.option || []).map((op) => (
                                    <Option value={op.value} key={op.value}>
                                        {op.text}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    );

                case FormItemType.RangePicker:
                    return (
                        <Form.Item
                            key={item.key}
                            name={item.key}
                            label={item.label}
                            rules={item.rules || []}
                            initialValue={item.defaultValue}
                        >
                            <RangePicker
                                disabled={item.disabled}
                                disabledDate={item.disabledDate}
                                onChange={(dates, dateStrings) => {
                                    onRangePickerChange(
                                        dates,
                                        dateStrings,
                                        item.onDatePickerChange,
                                    );
                                }}
                                format={item.format}
                                picker={item.picker || 'date'}
                            />
                        </Form.Item>
                    );

                case FormItemType.DatePicker:
                    return (
                        <Form.Item
                            key={item.key}
                            name={item.key}
                            label={item.label}
                            rules={item.rules || []}
                            initialValue={item.defaultValue}
                        >
                            <DatePicker
                                disabled={item.disabled}
                                disabledDate={item.disabledDate}
                                placeholder={item.placeholder}
                                format={item.format}
                                picker={item.picker || 'date'}
                                onChange={(dates, dateStrings) => {
                                    onRangePickerChange(
                                        dates,
                                        dateStrings,
                                        item.onDatePickerChange,
                                    );
                                }}
                            />
                        </Form.Item>
                    );

                case FormItemType.TreeSelect:
                    return (
                        <Form.Item
                            key={item.key}
                            name={item.key}
                            label={item.label}
                            rules={item.rules || []}
                            initialValue={item.defaultValue}
                        >
                            <TreeSelect
                                disabled={item.disabled}
                                treeData={item?.TreeSelectAttr?.treeData}
                                treeCheckable={
                                    item?.TreeSelectAttr?.treeCheckable
                                }
                                maxTagPlaceholder={
                                    item?.TreeSelectAttr?.maxTagPlaceholder
                                }
                                placeholder={item?.TreeSelectAttr?.placeholder}
                                maxTagCount={0}
                                style={item.style}
                                dropdownStyle={
                                    item?.TreeSelectAttr?.dropdownStyle || {
                                        minWidth: '300px',
                                    }
                                }
                                onChange={(e) => {
                                    onFormItemChange(e, item.onChange);
                                }}
                                treeDefaultExpandAll={
                                    item?.TreeSelectAttr?.treeDefaultExpandAll
                                }
                                listHeight={item?.TreeSelectAttr?.listHeight}
                                fieldNames={
                                    item?.TreeSelectAttr?.fieldNames || {
                                        label: 'orgName',
                                        value: 'orgId',
                                    }
                                }
                            />
                        </Form.Item>
                    );

                default:
                    break;
            }

            return null;
        }); // 渲染操作项;

        const actionItemResult = (
            <Form.Item>
                {actionItem &&
                    actionItem.map((item) => {
                        switch (item.actionType) {
                            case FormActionItemType.Submit:
                                return (
                                    <Button
                                        style={{
                                            marginRight: '10px',
                                        }}
                                        type="primary"
                                        icon={<SearchOutlined />}
                                        action={item.action}
                                        htmlType={item.actionType}
                                        disabled={item.disabled}
                                    >
                                        {item.text || t('查询')}
                                    </Button>
                                );

                            case FormActionItemType.Reset:
                                return (
                                    <Button
                                        style={{
                                            marginRight: '10px',
                                        }}
                                        type="primary"
                                        icon={<RedoOutlined />}
                                        disabled={item.disabled}
                                        action={item.action}
                                        onClick={() => {
                                            onActionItemClick(item.onClick);
                                        }}
                                    >
                                        {item.text || t('重置')}
                                    </Button>
                                );

                            case FormActionItemType.Export:
                                return (
                                    <Button
                                        style={{
                                            marginRight: '10px',
                                        }}
                                        type="dashed"
                                        icon={item.icon}
                                        disabled={item.disabled}
                                        action={item.action}
                                        onClick={() => {
                                            onActionItemClick(item.onClick);
                                        }}
                                    >
                                        {t('导出')}
                                    </Button>
                                );

                            case FormActionItemType.Custom:
                                return (
                                    <Button
                                        style={{
                                            marginRight: '10px',
                                        }}
                                        type="primary"
                                        icon={item.icon}
                                        disabled={item.disabled}
                                        action={item.action}
                                        onClick={() => {
                                            onActionItemClick(item.onClick);
                                        }}
                                    >
                                        {item.text}
                                    </Button>
                                );

                            default:
                                break;
                        }

                        return null;
                    })}
            </Form.Item>
        );
        return [...formItemResult, actionItemResult];
    }, [formItem, actionItem, form, t]);
    return (
        <Form
            form={form}
            initialValues={config.initialValues}
            layout={config.layout || 'inline'}
            onFinish={onFinish}
            onValuesChange={config.onValuesChange}
            requiredMark={config.requiredMark}
        >
            {resultItem.map((dom) => dom)}
        </Form>
    );
});
export default FormConfig;
