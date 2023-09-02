/*
 * @Author: Tomato.Bei
 * @Date: 2022-08-05 15:32:12
 * @Last Modified by: selwyn.bishanwen
 * @Last Modified time: 2022-12-02 14:12:43
 */
import React from 'react';
import {shallowEqual} from 'react-redux';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {useAction, PageProps} from '@gwaapp/ease';
import {report} from '@/common/utils/clientAction';
import {Button, Form, Input, Select, DatePicker, Row, Col} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import styles from './styles.module.scss';
import * as actions from '../actions';

interface HeadOperationProps {
    pageProps: PageProps;
}
const {RangePicker} = DatePicker;

const HeadOperation = ({pageProps}: HeadOperationProps) => {
    const {id} = pageProps;
    const {t} = useTranslation();
    const {
        busiTypeList,
        searchCondition,
        opnBehaviorList,
        searchTime,
        pagination,
        changeTime,
    } = useAppSelector((state) => state[id], shallowEqual);
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const {getPageSimpleActions} = useAction();
    const simpleActions = getPageSimpleActions(id); // 按条件查询

    const onSearch = () => {
        const paginationClone = JSON.parse(JSON.stringify(pagination));
        form.validateFields().then((values) => {
            delete values.date;
            dispatch(
                simpleActions.set({
                    searchCondition: values,
                    pagination: {...paginationClone, current: 1},
                    searchTime: changeTime,
                }),
            );
            dispatch(actions.getOperateLogList(pageProps));
        });
    }; // 导出excel

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
                    opnUser: searchCondition.opnUser,
                    opnName: searchCondition.opnName,
                    busiType: searchCondition.busiType,
                    opnBehavior: searchCondition.opnBehavior,
                    date: [
                        moment(searchTime.startTime),
                        moment(searchTime.endTime),
                    ],
                }}
            >
                <Row justify="space-between">
                    <Col>
                        <Form.Item label={`${t('操作账号')}:`} name="opnUser">
                            <Input placeholder={t('请输入')} width={200} />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item label={`${t('操作姓名')}:`} name="opnName">
                            <Input placeholder={t('请输入')} />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item label={`${t('业务应用')}:`} name="busiType">
                            <Select
                                value={searchCondition.busiType}
                                placeholder={t('请选择')}
                                style={{
                                    width: '150px',
                                }}
                            >
                                {busiTypeList.map(
                                    ({dictdataName, dictdataCode}) => (
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
                    <Col>
                        <Form.Item
                            label={`${t('操作行为')}:`}
                            name="opnBehavior"
                        >
                            <Select
                                value={searchCondition.opnBehavior}
                                placeholder={t('请选择')}
                                style={{
                                    width: '150px',
                                }}
                            >
                                {opnBehaviorList.map(
                                    ({dictdataName, dictdataCode}) => (
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
                    <Col>
                        <Form.Item
                            label={`${t('操作时间')}:`}
                            name="date"
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
                                onChange={onchange}
                                showTime
                                disabledDate={disabledDate}
                            />
                        </Form.Item>
                    </Col>

                    <Col>
                        <div className={styles.btn}>
                            <div
                                className={styles.button}
                                style={{marginRight: '20px'}}
                            >
                                <Button
                                    onClick={onSearch}
                                    type="primary"
                                    icon={<SearchOutlined />}
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
            </Form>
        </div>
    );
};

export default HeadOperation;
