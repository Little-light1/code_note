import React, {FC, useEffect, useState} from 'react';
import {Row, Col, Form, DatePicker, Spin, message} from 'antd';
import {shallowEqual} from 'react-redux';
import moment from 'moment';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {Modal, useModal, PageProps, getUniqueKey} from '@gwaapp/ease';
import {useTranslation} from 'react-i18next';
import styles from '../styles.module.scss';
import UserSelected from '../userSelected';
import {TIME_CONTROL_MODAL_ID} from '../constant';
import {addOrUpdateTimeControl, getTimeList} from './actions';
import {ModalActionType} from '../types';

const AddForm: FC<PageProps> = (props) => {
    const {id} = props;
    const [form] = Form.useForm(); // 获取状态树中的数据

    const {selectedUsersData} = useAppSelector(
        (state) => state[getUniqueKey(id)],
        shallowEqual,
    );
    const dispatch = useAppDispatch();
    const {state, closeModal} = useModal();
    const {type, record} = state[TIME_CONTROL_MODAL_ID] || {};
    const [loading, setLoading] = useState(false);
    const {t} = useTranslation();

    useEffect(() => {
        form.setFieldsValue({
            startTime: record?.startTime
                ? moment(record?.startTime, 'HH:mm:ss')
                : null,
            endTime: record?.endTime
                ? moment(record?.endTime, 'HH:mm:ss')
                : null,
            userList: selectedUsersData,
        });
    }, [form, record?.endTime, record?.startTime, selectedUsersData, type]);
    return (
        <Modal
            id={TIME_CONTROL_MODAL_ID}
            title={type === ModalActionType.Add ? t('新建') : t('编辑')}
            destroyOnClose
            width={1350}
            isAutoClose={false}
            cancelText={t('取消')}
            okText={t('保存')}
            onOk={() => {
                form && form.submit();
            }}
        >
            <Spin spinning={loading}>
                <Form
                    className={styles.form}
                    form={form}
                    onFinish={(values) => {
                        const {startTime, endTime, userList} = values;
                        const startTimeValue = startTime.format('HH:mm:ss');
                        const endTimeValue = endTime.format('HH:mm:ss');
                        const userIds =
                            userList?.map((item: any) => item.id) || [];

                        if (userIds.length === 0) {
                            message.error(t('请选择用户'));
                            return;
                        }

                        setLoading(true);
                        dispatch(
                            addOrUpdateTimeControl(
                                props,
                                startTimeValue,
                                endTimeValue,
                                userIds,
                                type,
                                record?.ids || [],
                                record?.startTime,
                                record?.endTime,
                            ),
                        )
                            .then(() => {
                                message.info(t('保存成功'));
                                dispatch(getTimeList(props));
                                closeModal(TIME_CONTROL_MODAL_ID);
                            })
                            .finally(() => {
                                setLoading(false);
                            });
                    }}
                    layout="inline"
                    requiredMark={false}
                >
                    <Row
                        style={{
                            width: '100%',
                            marginTop: '10px',
                            marginBottom: '10px',
                        }}
                    >
                        {/* 可访问起始时间 */}
                        <Col span={11}>
                            <Form.Item
                                name="startTime"
                                label={`${t('可访问起始时间')}：`}
                                rules={[
                                    {
                                        required: true,
                                        validator: (_, value) => {
                                            if (!value) {
                                                return Promise.reject(
                                                    new Error(
                                                        t(
                                                            '请选择可访问起始时间',
                                                        ),
                                                    ),
                                                );
                                            }

                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <DatePicker
                                    placeholder={t('请选择')}
                                    picker="time"
                                />
                            </Form.Item>
                        </Col>
                        {/* 可访问结束时间 */}
                        <Col span={11} offset={1}>
                            <Form.Item
                                name="endTime"
                                label={`${t('可访问结束时间')}：`}
                                dependencies={['startTime']}
                                rules={[
                                    ({getFieldValue}) => ({
                                        validator(_, value) {
                                            if (!value) {
                                                return Promise.reject(
                                                    new Error(
                                                        t(
                                                            '请选择可访问结束时间',
                                                        ),
                                                    ),
                                                );
                                            }

                                            const startTime =
                                                getFieldValue('startTime');

                                            if (
                                                startTime &&
                                                startTime.diff(
                                                    value,
                                                    'seconds',
                                                ) > 0
                                            ) {
                                                return Promise.reject(
                                                    new Error(
                                                        t(
                                                            '可访问结束时间必须大于可访问起始时间！',
                                                        ),
                                                    ),
                                                );
                                            }

                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker
                                    placeholder={t('请选择')}
                                    picker="time"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Form.Item name="userList" required={false}>
                            <UserSelected props={props} />
                        </Form.Item>
                    </Row>
                </Form>
            </Spin>
        </Modal>
    );
};

export default AddForm;
