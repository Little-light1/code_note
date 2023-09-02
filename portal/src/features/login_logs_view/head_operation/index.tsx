/*
 * @Author: Tomato.Bei
 * @Date: 2022-08-05 15:34:49
 * @Last Modified by: selwyn.bishanwen
 * @Last Modified time: 2022-12-02 14:10:06
 */
import React from 'react';
import {useTranslation} from 'react-i18next';
import {shallowEqual} from 'react-redux';
import moment from 'moment';
import {Button, Form, Input, Select, DatePicker, Row, Col} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import {useAction, PageProps} from '@gwaapp/ease';
import {report} from '@utils/clientAction';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import styles from './styles.module.scss';
import * as actions from '../actions';

interface HeadOperationProps {
    pageProps: PageProps;
}
const {Option} = Select;
const {RangePicker} = DatePicker;

const HeadOperation = ({pageProps}: HeadOperationProps) => {
    const {id} = pageProps;
    const {t} = useTranslation();
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const {getPageSimpleActions} = useAction();
    const simpleActions = getPageSimpleActions(id);
    const {changeTime, searchCondition, pagination, searchTime} =
        useAppSelector((state) => state[id], shallowEqual); // 按条件查询

    const onSearch = () => {
        const paginationClone = JSON.parse(JSON.stringify(pagination));
        form.validateFields().then((values) => {
            delete values.date;
            dispatch(
                simpleActions.set({
                    searchTime: changeTime,
                }),
            );
            dispatch(
                simpleActions.set({
                    searchCondition: values,
                }),
            );
            dispatch(
                simpleActions.set({
                    pagination: {...paginationClone, current: 1},
                }),
            );
            dispatch(actions.getLoginLogList(pageProps));
        });
    }; // 过滤input内容中的空格

    const filterSpace = (e: {
        target: {
            value: string;
        };
    }) => e.target.value.trim(); // 导出excel

    const logExcel = () => {
        dispatch(actions.logExcel(pageProps));
    }; // 日期改变触发的函数

    const onchange = (date: any, dateString: any) => {
        const [startTime, endTime] = dateString;
        dispatch(
            simpleActions.set({
                changeTime: {
                    startTime,
                    endTime,
                },
            }),
        );
    }; // 日期选择器禁止选择当天之后的日期

    const disabledDate = (current: any) => current > moment().endOf('day');

    return (
        <div className={styles.view}>
            <Form
                form={form}
                initialValues={{
                    loginUser: searchCondition.loginUser,
                    loginType: searchCondition.loginType,
                    loginName: searchCondition.loginName,
                    loginIp: searchCondition.loginIp,
                    loginStatus: searchCondition.loginStatus,
                    date: [
                        moment(searchTime.startTime),
                        moment(searchTime.endTime),
                    ],
                }}
            >
                <Row justify="space-between">
                    <Col className="gutter-row">
                        <Form.Item
                            label={`${t('登录账号')}:`}
                            name="loginUser"
                            getValueFromEvent={filterSpace}
                        >
                            <Input placeholder={t('请输入')} />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row">
                        <Form.Item label={`${t('登录方式')}:`} name="loginType">
                            <Select
                                placeholder={t('请选择')}
                                style={{width: '150px'}}
                            >
                                <Option value="">{t('全部')}</Option>
                                {/* <Option value="APP">APP</Option> */}
                                <Option value="PC">PC</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row">
                        <Form.Item
                            name="date"
                            label={`${t('时间选择')}:`}
                            rules={[
                                {
                                    validator: (rule, value) => {
                                        if (!value) {
                                            return Promise.reject(
                                                t('请选择操作时间'),
                                            );
                                        }

                                        if (value.length === 2) {
                                            if (
                                                moment(value[1]).diff(
                                                    moment(value[0]),
                                                    'day',
                                                ) >= 31
                                            ) {
                                                return Promise.reject(
                                                    t(
                                                        '最大时间选择范围为31天，请重新选择操作时间',
                                                    ),
                                                );
                                            }

                                            return Promise.resolve();
                                        }

                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <RangePicker
                                showTime
                                onChange={onchange}
                                disabledDate={disabledDate}
                            />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row">
                        <Form.Item
                            label={`${t('登录姓名')}:`}
                            name="loginName"
                            getValueFromEvent={filterSpace}
                        >
                            <Input placeholder={t('请输入')} />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row">
                        <Form.Item
                            label={`${t('登录机器IP')}:`}
                            name="loginIp"
                            getValueFromEvent={filterSpace}
                        >
                            <Input placeholder={t('请输入')} />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item
                            label={`${t('登录状态')}:`}
                            name="loginStatus"
                        >
                            <Select
                                placeholder={t('请选择')}
                                style={{width: '150px'}}
                            >
                                <Option value="">{t('全部')}</Option>
                                <Option value="0">{t('成功')}</Option>
                                <Option value="1">{t('失败')}</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col>
                        <div className={styles.btn}>
                            <div
                                className={styles.button}
                                style={{marginRight: '20px'}}
                            >
                                <Button
                                    icon={<SearchOutlined />}
                                    onClick={onSearch}
                                    type="primary"
                                    action={{
                                        id: 'query',
                                        module: id,
                                        position: [
                                            pageProps.menu?.menuName ?? '',
                                            t('查询'),
                                        ],
                                        action: 'query',
                                        wait: true,
                                    }}
                                >
                                    {t('查询')}
                                </Button>
                            </div>
                            <div className={styles.button}>
                                <Button
                                    onClick={logExcel}
                                    type="primary"
                                    action={{
                                        id: 'export',
                                        module: id,
                                        position: [
                                            pageProps.menu?.menuName ?? '',
                                            t('导出'),
                                        ],
                                        action: 'export',
                                        wait: true,
                                    }}
                                >
                                    {t('导出')}
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
                {/* <Row justify="space-between"> */}

                {/* </Row> */}
            </Form>
        </div>
    );
};

export default HeadOperation;
