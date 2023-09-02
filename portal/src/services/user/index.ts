/*
 * @Author: sds
 * @Date: 2021-12-07 14:59:17
 * @Last Modified by: gongzunbao
 * @Last Modified time: 2023-04-18 09:58:58
 */
import request, {prefix} from '../common';

// 获取组织机构树
export const getOrganizationTree = (params: any) =>
    request<any[]>({
        url: prefix('/aappauthor/org/getUserRightFullOrgTreeVO'),
        method: 'post',
        params, // mock: [200, testTreeData],
        // mockType: 'Mock',
    });

// 获取用户列表
export const getUserListByOrganization = (
    orgId: string | number,
    pageInfo: Object,
) =>
    request<any>({
        url: prefix('/user/get/childOrg'),
        method: 'post',
        params: {
            orgId,
        },
        data: pageInfo,
    });

// 获取角色列表
export const getRoleList = (pageInfo: Object) =>
    request<any>({
        url: prefix('/role/getRoleList'),
        method: 'post',
        data: pageInfo,
    });

// 获取标签列表
export const getLableList = (pageInfo: Object) =>
    request<any>({
        url: prefix('/user/userUpdateTagList'),
        method: 'post',
        data: pageInfo,
    });

// 更新用户（启用、禁用、编辑）
export const updateUser = (users: Object) =>
    request<any>({
        url: prefix('/user/update/list'),
        method: 'put',
        data: users,
    });

// 删除用户
export const deleteUser = (ids: object) =>
    request<any>({
        url: prefix('/user/delete/ids'),
        method: 'delete',
        data: ids,
    });

// 新增用户
export const addUser = (user: object) =>
    request<any>({
        url: prefix('/user/add'),
        method: 'post',
        data: user,
    });

// 查询用户
export const searchUser = (params: object, pageInfo: object) =>
    request<any>({
        url: prefix('/user/userList/account'),
        method: 'post',
        params,
        data: pageInfo,
    });

// 下载模板
export const downloadTemplate = () =>
    request<any>({
        url: prefix('/user/export/exportUserAddTemplate'),
        method: 'get',
        responseType: 'blob',
    });

// 导出excel
export const exportExcel = (id: any, params: Object) =>
    request<any>({
        url: prefix(`/user/export/exportUser/${id}`),
        method: 'post',
        responseType: 'blob',
        params,
    });

// 导入excel
export const importExcel = () =>
    request<any>({
        url: prefix('/user/import/upload'),
        method: 'post',
    });

// 更新单个用户信息（包括重置密码）
export const updateSingleUser = (user: any) =>
    request<any>({
        url: prefix('/user/update'),
        method: 'put',
        data: user,
    });

export const updateSingleUserInfo = (user: any) =>
    request<any>({
        url: prefix('/user/updateUserInfo'),
        method: 'put',
        data: user,
    });

// 获取默认密码
export const getDefaultPassword = (params: any) =>
    request<any>({
        url: prefix('/comConfig/getDictDataConfig'),
        method: 'post',
        params,
    });

// 获取用户角色信息
export const getLinkedRoleByUser = (params: any) =>
    request<any>({
        url: prefix('/role/getRoleList'),
        method: 'get',
        params,
    });

// 修改密码
export const changePassWord = <T>(data: any) =>
    request<T>({
        url: prefix('/user/pawd'),
        method: 'put',
        data,
    });

// 重置密码
export const resetPassWord = <T>(data: any) =>
    request<T>({
        url: prefix('/user/resetPassword'),
        method: 'put',
        data,
    });

// 身份证是否必填
export const getIDCardIsRequired = <T>() =>
    request<T>({
        url: prefix('/user/identityCardRequired'),
        method: 'get',
    });
