import React, {FC} from 'react';
import {ApiBaseUrl} from '@common/init/configs';
import {prefix} from '@services/common';
import {Table, Button, Popconfirm} from 'antd';
import {i18nIns} from '@/app/i18n';
import {byteSize} from '@/common/utils/file';
import './styles.scss';

const {t} = i18nIns;

export const uploadStatus = {
    none: t('未上传'),
    uploading: t('上传中'),
    done: t('上传完成'),
    error: t('上传失败'),
};
/**
 * 表格形式展示文件列表
 * @param props
 */

const FileTable: FC = (props) => {
    const {files = [], onAction, disabled} = props; // 回显地址

    files
        .filter((f) => !f.url)
        .map((f) => {
            f.url = `${ApiBaseUrl}/${prefix('/download', 'fileUpload')}/${
                f.fileId || f.response?.mediaid
            }`;
            f.fileId = f.fileId || f.response?.mediaid;
        }); // 表格组件属性

    const tableProps = {
        columns: [
            {
                title: t('序号'),
                dataIndex: 'no',
                width: 70,
                render: (_, record, index) => index + 1,
            },
            {
                title: t('文件名'),
                ellipsis: true,
                render: (_, record) => <div target="_blank">{record.name}</div>,
            },
            {
                title: t('文件大小'),
                width: 100,
                render: (_, record) => byteSize(record.size),
            },
            {
                title: t('状态'),
                width: 100,
                render: (_, record) => uploadStatus[record.status],
            },
            {
                title: t('操作'),
                width: 100,
                render: (_, record, index) =>
                    !disabled && (
                        <Popconfirm
                            key={index}
                            title={t('确定移除附件吗？')}
                            placement="topLeft"
                            okText={t('确定')}
                            cancelText={t('取消')}
                            onConfirm={() =>
                                onAction && onAction('delete', record)
                            }
                        >
                            <Button size="small" type="primary" danger>
                                {t('移除')}
                            </Button>
                        </Popconfirm>
                    ),
            },
        ],
        rowKey: 'fileId',
        size: 'small',
        bordered: true,
        dataSource: files,
        pagination: false,
    };
    return (
        <div className="file-table-box">
            <Table {...tableProps} />
        </div>
    );
};

export default FileTable;
