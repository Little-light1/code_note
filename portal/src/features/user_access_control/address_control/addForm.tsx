import React, {FC, useEffect, useState} from 'react';
import {Row, Col, Form, Input, Spin, message} from 'antd';
import {shallowEqual} from 'react-redux';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {Modal, useModal, PageProps, getUniqueKey} from '@gwaapp/ease';
import {useTranslation} from 'react-i18next';
import styles from '../styles.module.scss';
import UserSelected from '../userSelected';
import {ADDRESS_CONTROL_MODAL_ID, isIpv4} from '../constant';
import {ModalActionType} from '../types';
import {addOrUpdateAddress, getAddressList} from './actions';

const AddForm: FC<PageProps> = (props) => {
    const {id} = props;
    const [form] = Form.useForm(); // 获取状态树中的数据

    const {selectedUsersData} = useAppSelector(
        (state) => state[getUniqueKey(id)],
        shallowEqual,
    );
    const dispatch = useAppDispatch();
    const {state, closeModal} = useModal();
    const {type, record} = state[ADDRESS_CONTROL_MODAL_ID] || {};
    const [loading, setLoading] = useState(false);
    const {t} = useTranslation();
    useEffect(() => {
        form.setFieldsValue({
            startAddress: record?.startIp,
            endAddress: record?.endIp,
            userList: selectedUsersData,
        });
    }, [form, record?.endIp, record?.startIp, selectedUsersData]);
    return (
        <Modal
            id={ADDRESS_CONTROL_MODAL_ID}
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
                        const {startAddress, endAddress, userList} = values;
                        const userIds =
                            userList?.map((item: any) => item.id) || [];

                        if (userIds.length === 0) {
                            message.error(t('请选择用户'));
                            return;
                        }

                        setLoading(true);
                        dispatch(
                            addOrUpdateAddress(
                                props,
                                startAddress,
                                endAddress,
                                userIds,
                                type,
                                record?.ids || [],
                                record?.startIp,
                                record?.endIp,
                            ),
                        )
                            .then(() => {
                                message.info(t('保存成功'));
                                dispatch(getAddressList(props));
                                closeModal(ADDRESS_CONTROL_MODAL_ID);
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
                        {/* 可访问起始地址 */}
                        <Col span={11}>
                            <Form.Item
                                name="startAddress"
                                label={`${t('可访问起始地址')}：`}
                                rules={[
                                    {
                                        required: true,
                                        validator: (_, value) => {
                                            if (!value) {
                                                return Promise.reject(
                                                    new Error(
                                                        t(
                                                            '请输入可访问起始地址',
                                                        ),
                                                    ),
                                                );
                                            }

                                            if (!isIpv4(value)) {
                                                return Promise.reject(
                                                    new Error(
                                                        t(
                                                            '请输入合法可访问起始地址',
                                                        ),
                                                    ),
                                                );
                                            }

                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <Input
                                    placeholder={t('请输入')}
                                    maxLength={15}
                                />
                            </Form.Item>
                        </Col>
                        {/* 可访问结束地址 */}
                        <Col span={11} offset={1}>
                            <Form.Item
                                name="endAddress"
                                label={`${t('可访问结束地址')}：`}
                                dependencies={['startAddress']}
                                rules={[
                                    ({getFieldValue}) => ({
                                        validator(_, value) {
                                            if (!value) {
                                                return Promise.reject(
                                                    new Error(
                                                        t(
                                                            '请输入可访问结束地址',
                                                        ),
                                                    ),
                                                );
                                            }

                                            if (!isIpv4(value)) {
                                                return Promise.reject(
                                                    new Error(
                                                        t(
                                                            '请输入合法可访问结束地址',
                                                        ),
                                                    ),
                                                );
                                            }

                                            const startAddress =
                                                getFieldValue('startAddress');

                                            if (isIpv4(startAddress)) {
                                                const reg = /\d{1,3}$/;
                                                const startAddressPrefix =
                                                    startAddress.replace(
                                                        reg,
                                                        '',
                                                    );
                                                const endAddressPrefix =
                                                    value.replace(reg, '');

                                                if (
                                                    startAddressPrefix !==
                                                    endAddressPrefix
                                                ) {
                                                    return Promise.reject(
                                                        new Error(
                                                            t(
                                                                '前三段地址必须保持一致！例：1.1.1.X~1.1.1.X',
                                                            ),
                                                        ),
                                                    );
                                                }

                                                const startAddressSuffix =
                                                    startAddress.match(reg);
                                                const endAddressSuffix =
                                                    value.match(reg);

                                                if (
                                                    Number(
                                                        endAddressSuffix[0],
                                                    ) <
                                                    Number(
                                                        startAddressSuffix[0],
                                                    )
                                                ) {
                                                    return Promise.reject(
                                                        new Error(
                                                            t(
                                                                '可访问起始地址要小于可访问结束地址',
                                                            ),
                                                        ),
                                                    );
                                                }
                                            }

                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <Input
                                    placeholder={t('请输入')}
                                    maxLength={15}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={{width: '100%'}}>
                        <Form.Item name="userList">
                            <UserSelected props={props} />
                        </Form.Item>
                    </Row>
                </Form>
            </Spin>
        </Modal>
    );
};

export default AddForm;
