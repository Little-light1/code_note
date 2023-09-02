/*
 * @Author: gxn
 * @Date: 2022-04-04 17:17:44
 * @LastEditors: gxn
 * @LastEditTime: 2022-04-08 16:53:05
 * @Description: file content
 */
import request, {prefix} from '../common'; // 获取通知列表

export const getMessagePage = (args = {}) =>
    request<any[]>({
        url: prefix('/messageManager/page'),
        method: 'post',
        ...args,
    }); // 设置消息已读

export const markNoticeAsRead = (msgId: string) =>
    request<any[]>({
        url: prefix(`/messageManager/${msgId}`),
        method: 'post',
    });

// 设置全部消息已读

export const markAllNoticeAsRead = () =>
    request<any[]>({
        url: prefix(`/messageManager/readAll`),
        method: 'post',
    });
// 获取详细消息
export const getMessageDetail = (msgId: string) =>
    request<any[]>({
        url: prefix(`/messageManager/${msgId}`),
        method: 'get',
    }); // 获取通知列表

export const saveMessageNotice = (args = {}) =>
    request<any[]>({
        url: prefix('/messageManager/send'),
        method: 'post',
        ...args,
    }); // 获取信箱中 未读消息数量

export const newMsgNum = () =>
    request({
        url: prefix('/messageManager/get/newMsgNum'),
        method: 'get',
        showError: false,
    });

// 条件分页获取登陆用户消息列表按时间倒序
export const getSendBoxList = (args = {}) =>
    request<any[]>({
        url: prefix('/messageManager/page/sendBox'),
        method: 'post',
        ...args,
    });

// 公告新建接口,(如果非草稿状态,存在接收人或组织，可直接发送)
export const createSendBoxMsg = (data = {}) =>
    request<any[]>({
        url: prefix('/messageManager/createMsg'),
        method: 'post',
        data,
    });

// 公告草稿保存接口
export const createSendBoxDraftMsg = (data = {}) =>
    request<any[]>({
        url: prefix('/messageManager/createDraftMsg'),
        method: 'post',
        data,
    });
// 公告删除接口
export const delSendBoxMsg = (data = []) =>
    request<any[]>({
        url: prefix('/messageManager/del'),
        method: 'delete',
        data,
    });
// 获取用户所属组织机构树
export const getThingTreeByEnterpriseId = (params: {}) =>
    request<any[]>({
        url: prefix('/aappauthor/org/getUserRightFullOrgTreeVO'),
        method: 'post',
        params, // mock: [200, testTreeData],
        // mockType: 'Mock',
    });

export const getUserListByFarmId = (orgIds: any) =>
    request({
        url: prefix('/aapp/organization/getUserListByFarmId'),
        method: 'post',
        data: orgIds, // mock: [200, userLabelMock],
        // mockType: 'Mock', // 假数据模式 不会发真实请求
    });

export const fetchFileMap = (tokens: string) =>
    request({
        url: prefix('/file/getFileMap', 'fileUpload'),
        method: 'post',
        params: {
            tokens,
        },
    });
