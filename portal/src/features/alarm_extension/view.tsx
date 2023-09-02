/*
 * @Author: shimmer
 * @Date: 2022-05-11 16:56:44
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-09-19 10:46:55
 */
import {PageProps, usePage, getUniqueKey} from '@gwaapp/ease';
import {Button, Checkbox, Table, Input, Form, message} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {FC, useState} from 'react';
import {SaveOutlined} from '@ant-design/icons';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {shallowEqual} from 'react-redux';
import {useTranslation} from 'react-i18next';
import styles from './styles.module.scss';
import AlarmTipModal from './modal/modal';
import {
    onInit,
    setAlarmProductUrl,
    setAlarmProductConfigFun,
    setAlarmProductIsShow,
} from './actions';
import {DataType} from './types';
import {checkAbsUrl, checkRelUrl} from './constant';

const AlarmExtensionPage: FC<PageProps> = (props) => {
    const {id} = props;
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const {alarmProductConfig, isLoading} = useAppSelector(
        (state) => state[getUniqueKey(id)],
        shallowEqual,
    );
    const {t} = useTranslation();
    const [visible, setVisible] = useState<boolean>(false);
    usePage({
        ...props,
        // 页面初始化逻辑
        init: () => {
            dispatch(onInit(props));
        },
    });

    const onFinish = (record: any) => {
        form.validateFields().then((values) => {
            const url = `url${record.index - 1}`;
            dispatch(setAlarmProductUrl(props, record.index - 1, values[url]));
        });
    };

    const tableColumns: ColumnsType<DataType> = [
        {
            title: t('序号'),
            dataIndex: 'index',
            width: '250px',
            align: 'center',
            render: (text: string | number | null) => text || '--',
        },
        {
            title: t('业务应用'),
            dataIndex: 'noticeConfigProName',
            width: '250px',
            align: 'center',
            render: (text: string | number | null) => text || '--',
        },
        {
            title: t('告警跳转地址'),
            dataIndex: 'noticeConfigUrl',
            width: '250px',
            align: 'center',
            render: (text: string | number, record: any) => (
                <Form onFinish={onFinish} form={form}>
                    <Form.Item
                        initialValue={text || ''}
                        style={{
                            marginBottom: 0,
                        }}
                        name={`url${record.index - 1}`}
                        label=""
                        rules={[
                            // {required: true},
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
                                        t(
                                            '请输入相对路径或者绝对路径,绝对路径需包含协议',
                                        ),
                                    );
                                },
                            },
                        ]}
                    >
                        <Input
                            disabled={record.noticeConfigIsShow}
                            maxLength={200}
                            bordered={false}
                            onBlur={() => {
                                onFinish(record);
                            }}
                        />
                    </Form.Item>
                </Form>
            ),
        },
        {
            title: t('显示'),
            dataIndex: 'noticeConfigIsShow',
            width: '250px',
            align: 'center',
            render: (text: boolean, record: any) => (
                <Checkbox
                    defaultChecked={text}
                    checked={text}
                    onChange={(e) => {
                        if (
                            record.noticeConfigUrl &&
                            record.noticeConfigUrl !== ''
                        ) {
                            dispatch(
                                setAlarmProductIsShow(
                                    props,
                                    record.index - 1,
                                    e.target.checked,
                                ),
                            );
                        } else {
                            message.warning(t('请先输入告警跳转地址！'));
                        }
                    }}
                />
            ),
        },
    ];
    return (
        <div className={styles.alarmBox}>
            <div className={styles.saveBox}>
                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={isLoading}
                    onClick={() => {
                        dispatch(setAlarmProductConfigFun(props, form));
                    }}
                    action={{
                        id: 'saveAlarmExtension',
                        module: id,
                        position: [props.menu?.menuName ?? '', t('保存')],
                        action: 'modify',
                        wait: true,
                    }}
                >
                    {t('保存')}
                </Button>
            </div>
            <Table
                size="small"
                rowKey="index"
                columns={tableColumns}
                dataSource={alarmProductConfig}
            />
            <AlarmTipModal
                visible={visible}
                onCancel={() => {
                    setVisible(false);
                }}
            />
        </div>
    );
};

export default AlarmExtensionPage;
