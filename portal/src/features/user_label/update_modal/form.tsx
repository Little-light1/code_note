import React, {useState, useEffect, MutableRefObject} from 'react';
import {Row, Col, Form, Input, FormInstance} from 'antd';
import {useTranslation} from 'react-i18next';
import {
    useAppDispatch,
    useAppSelector,
    getPageSimpleActions,
} from '@/app/runtime';
import {useModal, PageProps} from '@gwaapp/ease';
import {emoji} from '@/common/utils/reg';
import styles from './styles.module.scss';
import {addSubmitData, tagsTree} from '../actions';
import UserSelectItem from './user_select_item';

const {TextArea} = Input;
interface IProps {
    addModalId: string;
    modalType: 'add' | 'edit'; // 模态窗口类型

    formRef: MutableRefObject<FormInstance<any> | null>;
    pageProps: PageProps;
    selectedNode: null | any;
}

const CustomForm = ({
    pageProps,
    selectedNode,
    formRef,
    addModalId,
    modalType,
}: IProps) => {
    const [currentType] = useState<any>(null);
    const dispatch = useAppDispatch();
    const {closeModal} = useModal();
    const [internalSelectedNode, setInternalSelectedNode] =
        useState(selectedNode);
    const {id} = pageProps;
    const simpleAction = getPageSimpleActions(id);
    const {t} = useTranslation();
    const userInfo = useAppSelector((state) => state.app.userInfo);
    const parentID = userInfo.enterpriseID; // 初始化内部选择

    useEffect(() => {
        setInternalSelectedNode(selectedNode);
    }, [dispatch, modalType, selectedNode, simpleAction]); // 表单初始化、回显操作

    useEffect(() => {
        if (modalType === 'add') {
            dispatch(
                simpleAction.set({
                    newType: modalType,
                }),
            );
        }

        if (modalType === 'edit') {
            dispatch(
                simpleAction.set({
                    newType: modalType,
                    userData: selectedNode.userList,
                }),
            );
        }

        let fields: {
            [key: string]: any;
        } = {};
        dispatch(tagsTree(pageProps));

        if (selectedNode) {
            if (modalType === 'edit') {
                const {name, userList = [], remark} = selectedNode;
                fields = {
                    name,
                    // 标签名称
                    userList,
                    remark,
                };
            }
        }

        formRef && formRef.current && formRef.current.setFieldsValue(fields);
    }, [
        addModalId,
        modalType,
        selectedNode,
        formRef,
        dispatch,
        pageProps,
        simpleAction,
    ]);

    if (selectedNode === null) {
        return null;
    }

    return (
        <div className={styles.viewStyle}>
            <Form
                // className={styles.form}
                ref={formRef}
                onFinish={(values) => {
                    dispatch(
                        addSubmitData({
                            values,
                            addModalId,
                            type: currentType,
                            selectedNode: internalSelectedNode,
                            modalType,
                            pageProps,
                            parentID,
                        }),
                    ).then(() => {
                        dispatch(tagsTree(pageProps));
                        closeModal(addModalId);
                    });
                }}
                layout="inline"
                initialValues={{
                    name: '',
                    // 标签名称
                    userList: [],
                    remark: '',
                }}
            >
                <Row style={{width: '100%'}}>
                    {/* 标签名称 */}
                    <Col span={12}>
                        <Form.Item
                            className={styles.inputStyle}
                            name="name"
                            label={t('标签名称')}
                            rules={[
                                {
                                    required: true,
                                    validator: (rule, value) => {
                                        if (
                                            value.trim() === undefined ||
                                            value.trim() === ''
                                        ) {
                                            return Promise.reject(
                                                new Error(t('请输入标签名称')),
                                            );
                                        }

                                        if (emoji.test(value.trim())) {
                                            return Promise.reject(
                                                new Error(
                                                    t('标签名称不能输入表情'),
                                                ),
                                            );
                                        }

                                        return Promise.resolve();
                                    },
                                },
                            ]}
                            validateTrigger="onBlur"
                        >
                            <Input placeholder={t('请输入')} />
                        </Form.Item>
                    </Col>
                    {/* 标签描述 */}
                    <Col span={12}>
                        <Form.Item
                            style={{
                                margin: '0  0 23px 12px',
                                width: '500px',
                            }}
                            name="remark"
                            label={t('标签描述')}
                        >
                            <Input
                                style={{width: '324px'}}
                                maxLength={100}
                                placeholder={t('请输入')}
                                // placeholder={t('请输入100字以内的标签描述')}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Form.Item name="userList">
                        <UserSelectItem pageProps={pageProps} />
                    </Form.Item>
                </Row>
            </Form>
        </div>
    );
};

export default CustomForm;
