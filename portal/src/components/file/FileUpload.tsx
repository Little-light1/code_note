import React, {FC} from 'react';
import {baseURL, prefix} from '@services/common';
import {AuthCookieKey} from '@common/init/configs';
import {getLocal} from '@common/utils/storage';
import {i18nIns} from '@/app/i18n';
import {Upload, message} from 'antd';

const {t} = i18nIns;
/**
 * 文件上传组件
 * 扩展手动上传功能
 * <FileUpload {...uploadProps}>
 *     <Button size="middle" icon={<UploadOutlined />}>上传附件</Button>
 *   </FileUpload>
 * @param props
 */

const FileUpload: FC = (props) => {
    // 上传地址设置
    const uploadUrlProps = {
        name: 'mfile',
        action: `${baseURL}/${prefix('/upload', 'fileUpload')}`,
        accept: '.pdf,.doc,.docx,.xls,.xlsx,.rar,.zip,.tar,.tar.gz,.tar.xz,.png,.jpg,.jpeg,.gif',
        maxCount: props.maxCount || 9,
    }; // 是否自动上传处理

    const _beforeUpload = props.beforeUpload;

    const beforeUpload = (file) => {
        file.status = 'none';
        const isLt2M = file.size / 1024 / 1024 < 100;

        if (!isLt2M) {
            message.error(t('文件大小应小于100MB!'));
            return false;
        }

        console.log('props.fileList', props.fileList, uploadUrlProps.maxCount);

        if ((props.fileList || []).length >= uploadUrlProps.maxCount) {
            message.error(t('已达到最大文件上传数量!'));
            return;
        }

        const ret = _beforeUpload && _beforeUpload(file);

        return props.auto ? ret : false;
    }; // 设置header

    const headers = {
        ...props.headers,
        [AuthCookieKey]: getLocal(AuthCookieKey),
    };
    return (
        <Upload
            {...uploadUrlProps}
            {...props}
            headers={headers}
            beforeUpload={beforeUpload}
        >
            {props.children}
        </Upload>
    );
};

export default FileUpload;
