import React, {FC, useEffect} from 'react';
import {baseURL, prefix} from '@services/common';
import {getLocal} from '@common/utils/storage';
import {i18nIns} from '@/app/i18n';
import {Upload, message, Modal} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {AuthCookieKey} from '@common/init/configs';
import defaultFileImg from '/public/image/file.png';
import {uploadAction} from './common';
import './styles.scss';

const {t} = i18nIns;
/**
 * 文件上传及预览组件
 * @param props
 */

const FileUploadPreview: FC = (props) => {
    const {
        maxSizeB,
        fileList = [],
        maxCount = 0,
        disabled,
        accept = '.pdf,.doc,.docx,.xls,.xlsx,.rar,.zip,.tar,.tar.gz,.tar.xz,.png,.jpg,.jpeg,.gif',
    } = props; // 回显地址
    useEffect(() => {
        if (!window.navigator.onLine) {
            message.error('上传失败');
        }
    }, [window.navigator.onLine]);
    // 门户文件下载有token认证，关闭文件下载
    // fileList
    //     .filter((f) => !f.url)
    //     .map(
    //         (f) =>
    //             (f.url = `${baseURL}/${prefix(
    //                 '/download?token=',
    //                 'fileUpload',
    //             )}${f.fileId || f.response?.mediaid || f.response?.data}`),
    //     );
    // 文件处理

    fileList.map((f) => {
        console.log(f);

        if (f.type.indexOf('image') < 0 && !f.thumbUrl) {
            // f.thumbUrl = "/public/image/file.png"
            f.thumbUrl = defaultFileImg;
        }

        if (f.error) {
            f.error.message = f.name;
        }
    }); // 上传header

    const headers = {
        [AuthCookieKey]: getLocal(AuthCookieKey),
    }; // 是否自动上传处理

    const _beforeUpload = props.beforeUpload;

    const beforeUpload = (file) => {
        file.status = 'none';
        const isLt2M = file.size / 1024 / 1024 < maxSizeB;

        if (!isLt2M) {
            message.error(t(`文件大小应小于${maxSizeB}MB!`));
            return false;
        }

        if (file.size == 0) {
            message.error(t(`上传文件不能为空`));
            return false;
        }

        const index = file.name.lastIndexOf('.');
        const suffix = file.name.substring(index).toLocaleLowerCase();
        if (accept.indexOf(suffix) === -1) {
            message.error(t(`不支持文件【${file.name}】的类型。`));
            return false;
        }

        const ret = _beforeUpload && _beforeUpload(file);

        return props.auto ? ret : false;
    }; // 上传地址设置

    const showDeleteConfirm = async () => {
        const s = new Promise((resolve, reject) => {
            Modal.confirm({
                title: t('确定删除吗?'),
                onOk() {
                    return resolve(true);
                },
                onCancel() {
                    return reject();
                },
            });
        });
        return s;
    };

    const uploadUrlProps = {
        name: 'file',
        listType: 'picture',
        action: uploadAction,
        accept,
    }; // 上传按钮

    const uploadButton = (
        <div className="fileBtn">
            <PlusOutlined />
            <div>{t('上传附件')}</div>
        </div>
    );
    return (
        <Upload
            {...uploadUrlProps}
            {...props}
            headers={{...props.headers, ...headers}}
            beforeUpload={beforeUpload}
            onRemove={showDeleteConfirm}
            className="fileUploadPreviewStyle"
        >
            {!disabled &&
                maxCount > 0 &&
                fileList.length < maxCount &&
                uploadButton}
        </Upload>
    );
};

export default FileUploadPreview;
