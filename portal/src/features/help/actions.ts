import _ from 'lodash';
import {message, Modal} from 'antd';
import moment from 'moment';
import {PageProps} from '@gwaapp/ease'; // import {subjoinExtraProps} from './helper';

import {AppThunk} from '@/app/runtime';
import {
    getDocumentAttachments,
    deleteDocumentAttachment,
    getMenu,
    getDocument,
    updateDocument,
    deleteDoc,
    addDocument,
    uploadAttachmentServer,
} from '@/services/helpDoc';
import {report} from '@/common/utils/clientAction';
import {i18nIns} from '@/app/i18n';
import {listToTree} from './helper';

const {t} = i18nIns;

declare let window: Window & {
    docAddFormRef: any;
};

const updateUrl = (title, type) => {
    if (title) {
        // eslint-disable-next-line no-restricted-globals
        const newUrl = location.href.replace(
            /#\/help.*/,
            `#/help?title=${encodeURIComponent(title)}`,
        );

        if (type === 'replace') {
            window.history.replaceState(null, null, newUrl);
        } else {
            window.history.pushState(null, null, newUrl);
        }
    }
}; // 下载附件

export const handledowloadAttachment =
    (name: string): AppThunk =>
    () => {
        window.open(`aapp-api/aapp-fileupload/file/download?token=${name}`);
    }; // 点击左侧目录选择文档

export const selectDocument =
    (props: PageProps, docId: number): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {data} = await getDocument(docId);
        dispatch(
            actions.set({
                currentDoc: {
                    title: data.title,
                    docID: data.docID,
                    editCount: data.editCount,
                    updateTime: data.updateTime,
                    updateUsername: data.updateUsername,
                    attachments: data.attachments.map((attachment: any) => ({
                        ...attachment,
                        createTimeStr: moment(attachment.createTime).format(
                            'YYYY-MM-DD HH:mm:ss',
                        ),
                    })),
                    updateTimeStr: moment(data.updateTime).format(
                        'YYYY-MM-DD HH:mm:ss',
                    ),
                },
                edit: false,
            }),
        );
    };
export const getmenus =
    (props: PageProps): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {data} = await getMenu();
        const tree = listToTree(_.cloneDeep(data));
        dispatch(
            actions.set({
                docMenu: tree,
            }),
        );
    };
/**
 * 根据左侧树选中节点获取列表数据
 * @param props
 * @returns
 */

export const initDictDataList =
    (
        props:
            | PageProps
            | {
                  id: string;
              },
    ): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id, query} = props;
        const actions = getPageSimpleActions(id);
        const {data} = await getMenu();
        const tree = listToTree(_.cloneDeep(data));
        dispatch(
            actions.set({
                docMenu: tree,
            }),
        );
        const openKeys = [];

        const foundParent = (docID) => {
            for (const m of data) {
                if (m.docID === docID) {
                    openKeys.push(`${m.docID}`);

                    if (m.parentDocID) {
                        foundParent(m.parentDocID);
                        return;
                    }
                }
            }
        };

        if (data.length) {
            const foundMenu = query
                ? data.find((i) => i.title === query.title)
                : null;
            let title;

            if (foundMenu) {
                title = foundMenu.title;
                dispatch(selectDocument(props, foundMenu.docID));
                foundParent(foundMenu.docID);
                dispatch(
                    actions.set({
                        openKeys,
                    }),
                );
            } else {
                title = tree[0].title;
                dispatch(selectDocument(props, tree[0].docID));
                foundParent(tree[0].docID);
                dispatch(
                    actions.set({
                        openKeys,
                    }),
                );
            }

            updateUrl(title, 'replace');
        }
    }; // 新增文档

export const addDocOk =
    (props: PageProps): AppThunk =>
    (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        dispatch(
            actions.set({
                addModalShow: true,
            }),
        );
        window.docAddFormRef.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                const action = {
                    id: 'addHelpDocument',
                    module: id,
                    desc: `${t('新增帮助文档')}${values.title}`,
                };
                report.action({
                    id: 'addHelpDocument',
                    module: id,
                    position: [
                        props.menu?.menuName ?? '',
                        `${t('新增')}-${t('确定')}`,
                    ],
                    action: 'add',
                    wait: true,
                });
                const {code, msg} = await addDocument({...values, content: ''});

                if (code === '200') {
                    message.info(t('新增成功'));
                    dispatch(
                        actions.set({
                            addModalShow: false,
                        }),
                    );
                    dispatch(getmenus(props));
                    report.success(action);
                } else {
                    message.error(msg);
                    report.fail(action);
                }
            }
        });
    };
export const addFormRef = (ref: any) => {
    window.docAddFormRef = ref;
}; // 保存文档

export const saveDocument =
    (props: PageProps, title: string, html: string): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {currentDoc} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);

        if (title === null || title === undefined || title === '') {
            message.error(t('请输入标题'));
            return;
        }

        if (/(^\s+)|(\s+$)/.test(title)) {
            message.error(t('请删除输入值的首尾空格'));
            return;
        }

        if (currentDoc === null) {
            return;
        }

        const action = {
            id: 'saveHelpDocument',
            module: id,
            desc: `${t('修改帮助文档')}:${title}`,
        };
        report.action({
            id: 'saveHelpDocument',
            module: id,
            position: [props.menu?.menuName ?? '', `${t('编辑')}-${t('保存')}`],
            action: 'modify',
            wait: true,
        });
        const {code, msg} = await updateDocument({
            docID: currentDoc.docID,
            title,
            content: html,
        });

        if (code === '200') {
            dispatch(
                actions.set({
                    edit: false,
                }),
            );
            dispatch(selectDocument(props, currentDoc.docID));
            dispatch(getmenus(props));
            message.info(t('保存成功'));
            report.success(action);
        } else {
            action.desc = `${t('修改帮助文档')}:${currentDoc.title}`;
            message.error(msg);
            report.fail(action);
        }
    }; // 进入文档编辑模式

export const editDocument =
    (props: PageProps, _edit: boolean): AppThunk =>
    (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {currentDoc} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);

        if (_edit) {
            currentDoc &&
                dispatch(
                    actions.set({
                        editTitle: currentDoc.title,
                    }),
                );
        } else {
            dispatch(
                actions.set({
                    editTitle: '',
                }),
            );
        }

        dispatch(
            actions.set({
                edit: _edit,
            }),
        );
    }; // 删除文档

export const deleteDocument =
    (props: PageProps): AppThunk =>
    (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {currentDoc} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);
        Modal.confirm({
            title: t('提示'),
            content: t('是否删除文档？'),
            okText: t('确认'),
            cancelText: t('取消'),

            async onOk() {
                const action = {
                    id: 'deleteHelpDocument',
                    module: id,
                    desc: `${t('删除帮助文档')}:${currentDoc.title}`,
                };
                report.action({
                    id: 'deleteHelpDocument',
                    module: id,
                    position: [
                        props.menu?.menuName ?? '',
                        `${t('删除')}-${t('文档')}-${t('确定')}`,
                    ],
                    action: 'delete',
                    wait: true,
                });
                const {code, msg} = await deleteDoc({
                    docID: currentDoc.docID,
                });

                if (code === '200') {
                    message.info(t('删除成功'));
                    report.success(action);
                    dispatch(
                        actions.set({
                            currentDoc: null,
                            edit: false,
                        }),
                    );
                    dispatch(getmenus(props));
                } else {
                    message.error(msg);
                    report.fail(action);
                }
            },
        });
    };
/**
 * 删除附件
 * @param attachmentID
 * @returns {function(*, *, {getPageSimpleActions: *, getPageState: *}): Promise<any>}
 */

export const deleteAttachment =
    (props: PageProps, attachmentID: string): AppThunk =>
    (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const state = getState();
        const {id} = props;
        const pageState = getPageState(state, props.id);
        const simpleActions = getPageSimpleActions(props.id);
        return new Promise((resolve, reject) => {
            const action = {
                id: 'deleteAttachments',
                module: id,
                desc: t('删除附件'),
            };
            report.action({
                id: 'deleteAttachments',
                module: id,
                position: [
                    props.menu?.menuName ?? '',
                    `${t('删除')}-${t('附件')}-${t('确定')}`,
                ],
                action: 'delete',
                wait: true,
            });
            deleteDocumentAttachment(attachmentID)
                .then(() => {
                    resolve(true);
                    getDocumentAttachments(pageState.currentDoc.docID).then(
                        (res2) => {
                            if (res2.data) {
                                // pageState.currentDoc.attachments = res2.data;
                                const currentDocClone = _.cloneDeep(
                                    pageState.currentDoc,
                                );

                                currentDocClone.attachments = res2.data.map(
                                    (attachment) => ({
                                        ...attachment,
                                        createTimeStr: moment(
                                            attachment.createTime,
                                        ).format('YYYY-MM-DD HH:mm:ss'),
                                    }),
                                );
                                dispatch(
                                    simpleActions.set({
                                        currentDoc: currentDocClone,
                                    }),
                                );
                            }
                        },
                    );
                    report.success(action);
                })
                .catch((e) => {
                    message.info(t('删除成功'));
                    message.error(e.msg, 2);
                    reject(e);
                    report.fail(action);
                });
        });
    };
/**
 * 上传附件
 * @param param
 * @returns {function(*=, *, {getPageSimpleActions: *, getPageState: *}): Promise<any>}
 */

export const uploadAttachmentAction =
    (props: PageProps, param: any): AppThunk =>
    (dispatch, getState, {getPageSimpleActions, getPageState}) => {
        const state = getState();
        const {id} = props;
        const pageState = getPageState(state, props.id);
        const simpleActions = getPageSimpleActions(props.id);
        return new Promise((resolve, reject) => {
            if (!pageState.currentDoc) {
                reject();
                return;
            }

            dispatch(simpleActions.setAttachmentUploading(true));
            const data = new FormData();
            data.append('id', pageState.currentDoc.docID);
            data.append('file', param.file);
            data.append('type', '0');
            const action = {
                id: 'UploadAttachments',
                module: id,
                desc: t('上传附件'),
            };
            report.action({
                id: 'UploadAttachments',
                module: id,
                position: [
                    props.menu?.menuName ?? '',
                    `${t('编辑')}-${t('附件管理')}-${t('上传附件')}`,
                ],
                action: 'import',
                wait: true,
            });
            uploadAttachmentServer(data)
                .then((res) => {
                    dispatch(simpleActions.setAttachmentUploading(false));
                    resolve(res.data);
                    getDocumentAttachments(pageState.currentDoc.docID).then(
                        (res2) => {
                            if (res2.data && res2.data.length) {
                                const currentDocClone = _.cloneDeep(
                                    pageState.currentDoc,
                                );

                                // currentDocClone.attachments = res2.data;
                                currentDocClone.attachments = res2.data.map(
                                    (attachment) => ({
                                        ...attachment,
                                        createTimeStr: moment(
                                            attachment.createTime,
                                        ).format('YYYY-MM-DD HH:mm:ss'),
                                    }),
                                );
                                dispatch(
                                    simpleActions.set({
                                        currentDoc: currentDocClone,
                                    }),
                                );
                            }
                        },
                    );
                    report.success(action);
                })
                .catch((e) => {
                    dispatch(simpleActions.setAttachmentUploading(false));
                    message.error(e.msg, 2);
                    reject(e);
                    report.fail(action);
                });
        });
    };
/**
 * 页面初始化
 * @param props
 * @returns
 */

export const onInit =
    (props: PageProps): AppThunk =>
    (dispatch) => {
        dispatch(initDictDataList(props));
    };
