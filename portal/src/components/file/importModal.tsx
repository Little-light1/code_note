/*
 * @Descripttion:
 * @version: 1.0
 * @Author: wangzhiqiang
 * @Date: 2023-03-16 18:22:36
 * @LastEditors: wangzhiqiang
 * @LastEditTime: 2023-04-11 15:15:20
 */
import React, {FC, useEffect, useImperativeHandle, useState} from 'react';
import {Form, Upload, Button, Modal, message} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {useAppDispatch} from '@/app/runtime';

const {confirm} = Modal;
const importModal: FC = React.forwardRef((props, ref) => {
    const {visible, onChangeImportModalOpen, uploadProps, handleDownload} =
        props;
    const {t} = useTranslation();
    const dispatch = useAppDispatch();

    // 关闭
    const onClosed = () => {};
    useImperativeHandle(ref, () => ({
        // 关闭弹框
        closeModal: onClosed,
    }));

    const handleCancel = () => {
        confirm({
            content: '请确认是否要关闭当前页面？',
            onOk() {
                onChangeImportModalOpen(false);
            },
        });
    };

    // modal props
    const modalProps = {
        width: 500,
        title: t('导入'),
        forceRender: true,
        visible,
        maskClosable: false,
        footer: [
            <Button
                // loading={submitLoading}
                key="submit"
                type="primary"
                onClick={() => {
                    handleDownload();
                }}
            >
                {t('下载导入模板')}
            </Button>,
            <Button
                key="cancel"
                type="default"
                onClick={() => {
                    handleCancel();
                }}
            >
                {t('取消')}
            </Button>,
        ],
        onCancel: handleCancel,
    };

    const onChange = (info) => {
        if (info.file.status === 'done') {
            if (info.file.response.success) {
                onChangeImportModalOpen(false);
            }
        }
        uploadProps.onChange(info);
    };

    return (
        <Modal {...modalProps}>
            <Upload {...uploadProps} onChange={onChange}>
                <Button icon={<UploadOutlined />}>{t('选择文件')}</Button>
            </Upload>
            <div className="uploadText">
                {t(`只能上传后缀为xls或xlsx的文件，一次只能上传一个文件`)}
            </div>
        </Modal>
    );
});
export default importModal;
