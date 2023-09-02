import React, {
    FC,
    MutableRefObject,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    Form,
    FormInstance,
    Input,
    Button,
    Row,
    Col,
    Upload,
    message,
    Modal as AntdModal,
} from 'antd';
import {useMount} from 'ahooks';

import FileUploadPreview from '@components/file/FileUploadPreview';
import Table from 'braft-extensions/dist/table';
import HeaderId from 'braft-extensions/dist/header-id';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css';
import BraftEditor from 'braft-editor';
import {shallowEqual} from 'react-redux';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {PageProps, useModal, useAction} from '@gwaapp/ease';
import {i18nIns} from '@/app/i18n';
import {type} from 'os';
import * as noticeService from '@services/notice_center';
import {openModal} from '@/components/modal';
import {forEach} from 'lodash';
import {async} from '@/features/login';
import styles from './styles.module.scss';
import {getLocal} from '../../../common/utils/storage';
import {UPDATE_MODAL_ID} from '../constant';
import {SELECT_SCOPE_MODAL_ID} from './select_scope_model/constant';
import {getFileInfos} from '../actions';
import {SELECT_TIME_MODAL_ID} from './select_time/constant';

const {t} = i18nIns;

BraftEditor.use(HeaderId());
const options = {
    defaultColumns: 3,
    // 默认列数
    defaultRows: 3,
    // 默认行数
    withDropdown: true,
    // 插入表格前是否弹出下拉菜单
    columnResizable: true,
    // 是否允许拖动调整列宽，默认false
    exportAttrString: '', // 指定输出HTML时附加到table标签上的属性字符串
};
BraftEditor.use(Table(options));
const CreateNoticeForm: FC<{
    pageProps: PageProps;
    record: any;
    modalId: any;
    modalType: any;
}> = ({pageProps, record, modalId, modalType}) => {
    const {id} = pageProps;
    const spanNumber = 20;
    const {openModal} = useModal();
    const [files, setFiles] = useState([]);

    const [editorState, setEditorState] = useState({
        editorState: BraftEditor.createEditorState(''),
        outputHTML: '',
    });
    const {getPageSimpleActions} = useAction();
    const actions = getPageSimpleActions(id);
    const dispatch = useAppDispatch();
    const {userIds, currentMsg, orgMap, userMap, selectScopeName, fileList} =
        useAppSelector((state) => state[id], shallowEqual);
    const {closeModal} = useModal();
    const [messageForm] = Form.useForm();
    const uploadFaceProps = {
        auto: true,
        fileList: files,
        accept: '.rar,.zip,.doc,.docx,.pdf',

        onChange(info) {
            // dispatch(actions.set({fileList: info.fileList}));
            setFiles(info.fileList.filter((f) => f.status !== 'none'));
        },
    };
    useEffect(() => {
        messageForm.setFieldsValue({
            orgNames: selectScopeName.map((i) => i?.name).join(','),
        });
    }, [selectScopeName]);
    useEffect(() => {
        setFiles(fileList);
    }, [fileList]);
    useMount(() => {
        if (modalType === 'edit') {
            const orgNames = [];
            record.umOrgIdLidt?.forEach((item) => {
                orgNames.push(orgMap[item]);
            });
            record.umUserIds?.forEach((item) => {
                orgNames.push(userMap[item]);
            });

            messageForm.setFieldsValue({
                msgTitle: record.msgTitle,
                // orgNames: orgNames.map((i) => i.name).join(',') || '',
            });
            dispatch(actions.set({selectScopeName: orgNames}));
            if (record.msgContent) {
                setEditorState(
                    BraftEditor.createEditorState(record.msgContent),
                );
                messageForm.setFieldsValue({
                    msgContent: BraftEditor.createEditorState(
                        record.msgContent,
                    ),
                    // orgNames: orgNames.map((i) => i.name).join(',') || '',
                });
            }

            dispatch(getFileInfos(pageProps, record.fileTokenList));
        } else {
            record = {
                msgId: '',
                fileTokenList: '',
                msgContent: '',
                msgSendTime: '',
                msgState: '',
                msgTitle: '',
                msgType: '',
                umOrgIdLidt: [],
                umUserIds: [],
            };
        }
    });

    const handleChange = (editorState1) => {
        if (editorState1.toHTML() !== '<p></p>') {
            setEditorState({
                editorState: editorState1,
                outputHTML: editorState1.toHTML(),
            });
        }
    };
    // 删除通知公告
    const deleteMessage = () => {
        AntdModal.confirm({
            title: t('您确定要删除这条记录吗?'),
            okText: t('确定'),
            cancelText: t('取消'),
            onOk: () => {
                noticeService
                    .delSendBoxMsg([].concat(Number(record.msgId)))
                    .then((res) => {
                        const {code} = res;
                        if (code === '200') {
                            message.success(t('删除成功'));
                            dispatch(closeModal(UPDATE_MODAL_ID));
                        } else {
                            message.error(t('删除失败'));
                        }
                    });
            },
        });
    };

    const sendDraftMessage = () => {
        const params = {
            // fileTokenList: files.map((item) => {
            //     item.response.data;
            // }),
            msgId: record?.msgId || '',
            fileTokenList: '',
            msgContent:
                editorState?.outputHTML !== '<p></p>'
                    ? editorState?.outputHTML
                    : '',
            msgSendTime: '',
            msgState: '0',
            msgTitle: record?.msgTitle || '',
            msgType: '2',
            umOrgIdLidt: [''],
            umUserIds: [''],
        };
        const values = messageForm.getFieldsValue();
        const umOrgIdLidt = [];
        const umUserIds = [];
        selectScopeName.forEach((item) => {
            if (item.resourceType === 'AAPP_ORG') {
                umOrgIdLidt.push(item.id);
            } else {
                umUserIds.push(item.id);
            }
        });
        params.umOrgIdLidt = umOrgIdLidt;
        params.umUserIds = umUserIds;
        params.msgTitle = values.msgTitle;
        params.fileTokenList = files.map((i) => i.response.data).join(',');
        noticeService.createSendBoxDraftMsg(params).then((res) => {
            const {code} = res;

            if (code === '200') {
                // dispatch(actions.getRoleList(pageProps));
                message.info(`${t('通知公告已保存草稿')}`);
                closeModal(UPDATE_MODAL_ID); // 请求绑定用户数据
            }
        });
    };

    // 发送通知公告
    const sendMessage = (msgState: any, type?: any) => {
        const params = {
            // fileTokenList: files.map((item) => {
            //     item.response.data;
            // }),
            msgId: record?.msgId || '',
            fileTokenList: '',
            msgContent:
                editorState?.outputHTML !== '<p></p>'
                    ? editorState?.outputHTML
                    : '',
            msgSendTime: '',
            msgState,
            msgTitle: record?.msgTitle || '',
            msgType: '2',
            umOrgIdLidt: [''],
            umUserIds: [''],
        };
        messageForm.validateFields().then((values) => {
            if (!params.msgContent?.length) {
                message.error(t('请填写公告内容'));
                return;
            }
            const umOrgIdLidt = [];
            const umUserIds = [];
            selectScopeName.forEach((item) => {
                if (item.resourceType === 'AAPP_ORG') {
                    umOrgIdLidt.push(item.id);
                } else {
                    umUserIds.push(item.id);
                }
            });
            params.umOrgIdLidt = umOrgIdLidt;
            params.umUserIds = umUserIds;
            params.msgTitle = values.msgTitle;
            params.fileTokenList = files.map((i) => i.response.data).join(',');
            if (type === true) {
                dispatch(actions.set({paramsTime: params}));
                openModal(SELECT_TIME_MODAL_ID, {
                    type: 'add',
                });
            } else {
                noticeService.createSendBoxMsg(params).then((res) => {
                    const {code} = res;

                    if (code === '200') {
                        // dispatch(actions.getRoleList(pageProps));
                        message.info(`${t('通知公告已发送')}`);
                        closeModal(UPDATE_MODAL_ID); // 请求绑定用户数据
                    }
                });
            }
        });
        // const aa = messageForm.getFieldsValue();
        // console.log(aa);
    };
    return (
        <Form form={messageForm} className={styles.view}>
            <Row>
                <Col span={spanNumber}>
                    <Form.Item
                        label={t('公告标题')}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        name="msgTitle"
                    >
                        <Input
                            maxLength={50}
                            disabled={record?.msgState === '1'}
                        />
                    </Form.Item>
                </Col>
                <Col span={spanNumber}>
                    <Form.Item
                        label={t('发送范围')}
                        name="orgNames"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input disabled />
                    </Form.Item>
                </Col>
                <Col>
                    <Button
                        disabled={record?.msgState === '1'}
                        onClick={() => {
                            dispatch(
                                actions.set({selectScope: selectScopeName}),
                            );
                            openModal(SELECT_SCOPE_MODAL_ID, {
                                type: 'edit',
                                node: record,
                            });
                        }}
                        className={styles.random}
                    >
                        {t('选择')}
                    </Button>
                </Col>
                <Col span={24}>
                    <div
                        className={
                            record?.msgState !== '1' ? styles.editArea : ''
                        }
                    >
                        <Form.Item
                            name="msgContent"
                            required
                            label={t('公告内容')}
                        >
                            {record?.msgState !== '1' ? (
                                <BraftEditor
                                    value={editorState}
                                    onChange={handleChange}
                                    language={getLocal('i18nextLng')}
                                />
                            ) : (
                                <div
                                    className={styles.showArea}
                                    dangerouslySetInnerHTML={{
                                        __html: `${
                                            record.msgContent
                                                ? record.msgContent
                                                : ''
                                        }`,
                                    }}
                                />
                            )}
                        </Form.Item>
                    </div>
                </Col>
                <Col span={24}>
                    <Form.Item label={t('附件')} className={styles.upload}>
                        <FileUploadPreview
                            disabled={record?.msgState === '1'}
                            {...uploadFaceProps}
                            maxSizeB={20}
                            maxCount={3}
                        />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <div className={styles.groupButton}>
                        {record?.msgState !== '1' && (
                            <Button
                                className={styles.normal}
                                onClick={() => {
                                    sendMessage('1');
                                }}
                            >
                                {t('立即发送')}
                            </Button>
                        )}
                        {record?.msgState !== '1' && (
                            <Button
                                className={styles.export}
                                onClick={() => {
                                    sendMessage('1', true);
                                }}
                            >
                                {t('定时发送')}
                            </Button>
                        )}
                        {record?.msgState !== '1' && (
                            <Button
                                className={styles.export}
                                onClick={() => {
                                    sendDraftMessage('0');
                                }}
                            >
                                {t('存为草稿')}
                            </Button>
                        )}
                        {(record?.msgState === '0' ||
                            record?.msgState === '1') && (
                            <Button
                                className={styles.delete}
                                onClick={() => {
                                    deleteMessage();
                                }}
                            >
                                {t('删除')}
                            </Button>
                        )}
                    </div>
                </Col>
            </Row>
        </Form>
    );
};

export default CreateNoticeForm;
