import React from 'react';
import {connect} from 'react-redux';
import {Button, Modal, Upload, message} from 'antd';
import PortalIcon from '@/components/icon';
import {i18nIns} from '@/app/i18n';
import {addNumberFieldToListFunctions} from '../../common/utils/add_number_field_to_list';
import ResizeableTable from '../../components/resizeable_table/index';
import {deleteAttachment, uploadAttachmentAction} from './actions';

const {t} = i18nIns;

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            checkFileSize,
            fileList,
            uploadAttachment,
            attachmentUploading,
            getColumns,
        } = this.props;
        return (
            <div>
                <div
                    style={{
                        marginBottom: 10,
                    }}
                >
                    <Upload
                        name="modelRunBase"
                        withCredentials
                        showUploadList={false}
                        beforeUpload={(file) => checkFileSize(file, fileList)}
                        customRequest={(params) => uploadAttachment(params)}
                    >
                        <Button
                            id="doc_form_upload"
                            type="primary"
                            loading={attachmentUploading}
                        >
                            {attachmentUploading ? (
                                `${t('上传中')}` // '上传中'
                            ) : (
                                <span>
                                    {/* 上传附件 */}
                                    {t('上传附件')}
                                    {/* <MyIcon type="icon_Choice" /> 上传附件 */}
                                </span>
                            )}
                        </Button>
                    </Upload>
                </div>
                <ResizeableTable
                    id="doc_attachment_table"
                    rowKey="attachmentID"
                    bordered
                    dataSource={fileList}
                    columns={getColumns}
                    pagination={false}
                />
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    const pageState = state[props.id];
    return {
        fileList: pageState.currentDoc
            ? addNumberFieldToListFunctions(pageState.currentDoc.attachments)
            : [],
        attachmentUploading: pageState.attachmentUploading,
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const uploadAttachment = (params) => {
        dispatch(uploadAttachmentAction(props, params));
    };
    const formatArr = [
        'doc',
        'docx',
        'xls',
        'xlsx',
        'pdf',
        'zip',
        'rar',
        'jpeg',
        'gif',
        'png',
    ];
    const checkFileSize = (file, fileList) => {
        if (fileList.length === 10) {
            message.error(t('附件过多，最多支持10个附件！'));
            return false;
        }

        const limitSize = 50 * 1024 * 1024;

        if (file.size > limitSize) {
            message.error(t('附件上传大小不能超过50MB'));
            return false;
        }
        if (formatArr.indexOf(file.name.split('.')[1]) < 0) {
            message.error(`${t('支持附件格式为')}:${formatArr.join('、')}`);
            return false;
        }

        return true;
    };

    const deleteAttachments = (id) => {
        Modal.confirm({
            title: t('提示'),
            content: t('您确定要删除这个附件吗？'),
            okText: t('确认'),
            cancelText: t('取消'),

            onOk() {
                dispatch(deleteAttachment(props, id));
            },
        });
    };

    const getColumns = () => [
        {
            title: t('序号'),
            dataIndex: 'NUMBER',
            key: 'NUMBER',
            align: 'center',
            width: 100,
        },
        {
            title: t('文件名'),
            dataIndex: 'originFileName',
            width: 260,
            ellipsis: true,
        },
        {
            title: t('创建时间'),
            dataIndex: 'createTimeStr',
            width: 200,
            ellipsis: true,
        },
        {
            title: t('操作'),
            key: 'action',
            align: 'center',
            width: 100,
            render: (text, record) => (
                <span>
                    <Button
                        id="doc_form_delete"
                        title={t('删除')}
                        onClick={() => {
                            deleteAttachments(record.attachmentID);
                        }}
                    >
                        {/* <MyIcon type="icon_Delete" /> */}
                        <PortalIcon iconClass="icon-portal-delete" />
                    </Button>
                </span>
            ),
        },
    ];

    return {
        uploadAttachment,
        checkFileSize,
        deleteAttachments,
        getColumns,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
