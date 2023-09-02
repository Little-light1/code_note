/*
 * @Descripttion:
 * @Author: gxn
 * @Date: 2023-03-10 08:50:09
 */
import React, {useState, useEffect, MutableRefObject} from 'react';
import {Form, FormInstance} from 'antd';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useModal, PageProps} from '@gwaapp/ease';

import styles from './styles.module.scss';
import DeviceSelectItem from './device_select_item';

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
    const userInfo = useAppSelector((state) => state.app.userInfo);
    const parentID = userInfo.enterpriseID; // 初始化内部选择

    useEffect(() => {
        setInternalSelectedNode(selectedNode);
    }, [selectedNode]); // 表单初始化、回显操作

    useEffect(() => {
        let fields = {};

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
    }, [addModalId, modalType, selectedNode, formRef]);

    if (selectedNode === null) {
        return null;
    }

    return (
        <div className={styles.viewStyle}>
            <Form
                className={styles.form}
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
                    ).then(() => closeModal(addModalId));
                }}
                layout="inline"
                initialValues={{
                    name: '',
                    // 标签名称
                    userList: [],
                    remark: '',
                }}
            >
                <Form.Item
                    name="userList"
                    style={{
                        marginRight: 0,
                    }}
                >
                    <DeviceSelectItem pageProps={pageProps} />
                </Form.Item>
            </Form>
        </div>
    );
};

export default CustomForm;
