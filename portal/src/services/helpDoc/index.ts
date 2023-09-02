import request, {prefix} from '../common';
import docMenu from './mock/docMeun.json';
import docContent from './mock/docContent.json';
import searchResult from './mock/searchResult.json'; // 获取帮助文档左侧目录

export const getMenu = () =>
    request<any>({
        url: prefix('/helpdoc/getMenu', 'aappPortal'),
        method: 'get',
        mock: [200, docMenu],
    }); // 获取帮助文档内容

export const getDocument = (id: number) =>
    request<any>({
        url: prefix('/helpdoc/getDocument', 'aappPortal'),
        method: 'get',
        mock: [200, docContent],
        params: {
            id,
        },
    }); // 更新文档

export const updateDocument = (data: {}) =>
    request<any>({
        url: prefix('/helpdoc/updateDocument', 'aappPortal'),
        method: 'post',
        mock: [200, docContent],
        data,
    }); // 删除文档

export const deleteDoc = (data: {}) =>
    request<any>({
        url: prefix('/helpdoc/deleteDocument', 'aappPortal'),
        method: 'post',
        mock: [200, docContent],
        data,
    }); // 新建文档

export const addDocument = (data: {}) =>
    request<any>({
        url: prefix('/helpdoc/addDocument', 'aappPortal'),
        method: 'post',
        mock: [200, docContent],
        data,
    }); // 搜索文档

export const searchDocument = (text: string) =>
    request<any>({
        url: prefix('/helpdoc/searchDocument', 'aappPortal'),
        method: 'get',
        mock: [200, searchResult],
        params: {
            text,
        },
    }); // 上传附件

export const uploadAttachmentServer = (data: FormData) =>
    request<any>({
        url: prefix('/helpdoc/upload', 'aappPortal'),
        method: 'post',
        data,
    }); // 附件列表

export const getDocumentAttachments = (id: number) =>
    request<any>({
        url: prefix('/helpdoc/getDocumentAttachments', 'aappPortal'),
        method: 'get',
        params: {
            id,
        },
    }); // 删除附件

export const deleteDocumentAttachment = (attachmentID: number) =>
    request<any>({
        url: prefix('/helpdoc/deleteDocumentAttachment', 'aappPortal'),
        method: 'post',
        params: {
            attachmentID,
        },
    });
