import React, {FC, useRef} from 'react';
import {shallowEqual} from 'react-redux';
import BraftEditor from 'braft-editor';
import Table from 'braft-extensions/dist/table';
import HeaderId from 'braft-extensions/dist/header-id';
import {Button, Input, Modal, Spin} from 'antd';
import $ from 'jquery';
import {Guid} from '@common/utils/guid';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useAction, usePage, PageProps} from '@gwaapp/ease';
import PortalIcon from '@/components/icon';
import {useTranslation} from 'react-i18next';
import DocAddForm from './doc_add_form';
import DocAttachmentForm from './doc_attachment_form';
import LeftMenu from './left_menu';
import DocContent from './doc_content';
import styles from './styles.module.scss';
import {
    onInit,
    saveDocument,
    editDocument,
    deleteDocument,
    addDocOk,
    addFormRef,
} from './actions';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css'; // Input.defaultProps = {
//     ...Input.defaultProps,
//     maxLength: 2,
// };

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
BraftEditor.use(Table(options)); // import styles from './';

const Help: FC<PageProps> = (props) => {
    const {id} = props;
    const {
        docMenu,
        edit,
        currentDoc,
        docLoading,
        editTitle,
        addModalShow,
        attachmentModalShow,
    } = useAppSelector((state) => state[id], shallowEqual);
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const {getPageSimpleActions} = useAction();
    const actions = getPageSimpleActions(id);
    const content = currentDoc ? currentDoc.content : '';
    let title: string;

    if (edit) {
        title = editTitle;
    } else {
        title = currentDoc ? currentDoc.title : '';
    }

    const editorState = BraftEditor.createEditorState(content || '');
    const editorRef = useRef();
    usePage({...props, init: (pageProps) => dispatch(onInit(pageProps))});

    const handelTitleChange = (e) => {
        dispatch(
            actions.set({
                editTitle: e.target.value,
            }),
        );
    }; // 保存文档

    const handleSaveDoc = () => {
        const state = editorRef.current.getValue();
        const html = state.toHTML(); // 处理标题id

        const $html = $(html);
        $html.filter('h1,h2,h3,h4,h5,h6').each((index, value) => {
            $(value).attr('id', Guid.NewGuid().ToString());
        });
        const wrapper = $('<div>');
        wrapper.append($html);
        dispatch(saveDocument(props, title, wrapper.html()));
    }; // 设置模式开关

    const setEdit = (newEdit) => {
        dispatch(editDocument(props, newEdit));
    }; // 确认添加文档

    const handleAddOk = () => {
        dispatch(addDocOk(props));
    }; // 新建

    const addModal = (
        <Modal
            id="doc_add_modal"
            title={t('新建')}
            visible={addModalShow}
            destroyOnClose
            onCancel={() =>
                dispatch(
                    actions.set({
                        addModalShow: false,
                    }),
                )
            }
            onOk={handleAddOk}
            maskClosable={false}
        >
            <DocAddForm ref={(ref) => addFormRef(ref)} parentList={docMenu} />
        </Modal>
    ); // 上传附件

    const attachmentModal = (
        <Modal
            id="doc_attachment_modal"
            title={t('附件管理')}
            visible={attachmentModalShow}
            onCancel={() => {
                dispatch(
                    actions.set({
                        attachmentModalShow: false,
                    }),
                );
            }}
            width={800}
            footer={null}
            className={styles.attachmentModal}
        >
            <DocAttachmentForm {...props} />
        </Modal>
    );
    return (
        <div className={styles.helpView}>
            <div className={styles.panel}>
                <div className={styles.slideMenu}>
                    <LeftMenu pageProps={props} />
                </div>
                <div className={styles.content}>
                    {edit && (
                        <div className={styles.toolbar}>
                            <div className={styles.toolbarLeft}>
                                <Button
                                    id="doc_save"
                                    type="primary"
                                    onClick={handleSaveDoc}
                                >
                                    <PortalIcon iconClass="icon-portal-save" />
                                    {/* 保存 */}
                                    {t('保存')}
                                </Button>
                                <Button
                                    id="doc_cancel"
                                    onClick={() => {
                                        setEdit(false);
                                    }}
                                >
                                    {/* 取消 */}
                                    {t('取消')}
                                </Button>
                                <Button
                                    id="doc_manage"
                                    onClick={() => {
                                        dispatch(
                                            actions.set({
                                                attachmentModalShow: true,
                                            }),
                                        );
                                    }}
                                >
                                    {/* 附件管理 */}
                                    {t('附件管理')}
                                </Button>
                            </div>
                            <div className={styles.toolbarRight}>
                                {currentDoc ? (
                                    <Button
                                        id="doc_delete"
                                        onClick={() => {
                                            dispatch(deleteDocument(props));
                                        }}
                                    >
                                        <PortalIcon iconClass="icon-portal-delete" />
                                    </Button>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    )}
                    {currentDoc &&
                        (edit ? (
                            <Spin spinning={docLoading}>
                                <div className={styles.docEditor}>
                                    <BraftEditor
                                        value={editorState}
                                        ref={editorRef}
                                        componentBelowControlBar={
                                            <div className={styles.titleInput}>
                                                <Input
                                                    placeholder={t('标题')}
                                                    value={title}
                                                    maxLength={25}
                                                    onChange={handelTitleChange}
                                                />
                                            </div>
                                        }
                                    />
                                </div>
                            </Spin>
                        ) : (
                            <DocContent pageProps={props} />
                        ))}
                </div>
            </div>
            {addModal}
            {attachmentModal}
        </div>
    );
};

export default Help;
