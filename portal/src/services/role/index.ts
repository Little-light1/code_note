/*
 * @Author: sds
 * @Date: 2022-01-04 10:19:58
 * @Last Modified by: selwyn.bishanwen
 * @Last Modified time: 2022-11-18 19:09:21
 */
import request, {prefix} from '../common'; // 获取角色列表

export const getRoleList = (params: Object, bData: Object) =>
    request<any>({
        url: prefix('/role/getRoleListByValue'),
        method: 'post',
        params,
        data: bData,
    }); // 新增角色

export const addRole = (data: Object) =>
    request<any>({
        url: prefix('/role/insertRole'),
        method: 'post',
        data,
    }); // 更新角色

export const updateRole = (data: Object) =>
    request<any>({
        url: prefix('/role/update'),
        method: 'post',
        data,
    }); // 刪除角色

export const deleteRole = (param: Object) =>
    request<any>({
        url: prefix('/role/delete'),
        method: 'get',
        params: param,
    }); // 获取角色关联用户

export const getLinkedUsers = (param: Object) =>
    request<any>({
        url: prefix('/UserRole/getUserListByRoleId'),
        method: 'post',
        params: param,
    }); // 获取角色未关联用户

export const getUnLinkedUsers = (param: Object) =>
    request<any>({
        url: prefix('/UserRole/getUserListExRoleId'),
        method: 'post',
        params: param,
    }); // 保存角色关联的用户

export const saveRoleLinkedUsers = (data: Object) =>
    request<any>({
        url: prefix('/UserRole/updateUserRoleRelation'),
        method: 'post',
        data,
    }); // 获取该角色的所有功能权限的ids--菜单、资源、bi资源

export const fetchRoleFunctionPrivilege = (params: Object) =>
    request<any>({
        url: prefix('/role/getRoleFunctionPrivilege'),
        method: 'post',
        params,
    }); // 获取该角色的所有功能权限的ids--菜单、资源、bi资源(替换)

export const fetchAuthRoleFunctionPrivilege = (params: Object) =>
    request<any>({
        url: prefix('/role/getRoleAuthMenuIds'),
        method: 'post',
        params,
    });

// 获取角色产品下有权限的菜单
export const getRoleProductMenu = (params: Object) =>
    request<any>({
        url: prefix('/role/getRoleProductMenu'),
        method: 'post',
        params,
    });

// 获取该角色的对应产品的组织机构权限
export const fetchRoleOrgIds = (params: Object) =>
    request<any>({
        url: prefix('/role/getRoleOrgIds'),
        method: 'post',
        params,
    }); // 更新功能权限

export const submitFunctionPrivilege = (data: Object) =>
    request<any>({
        url: prefix('/policy/updateRoleFunctionPrivilege'),
        method: 'post',
        data,
    });

// 更新功能权限（解决没有子节点的菜单的提交问题）
export const updateRoleProductMenu = (data: Object) =>
    request<any>({
        url: prefix('/policy/updateRoleProductMenu'),
        method: 'post',
        data,
    });

// 判断是否配置过数据权限
export const fetchHaveDataPrivilege = (roleId: string) =>
    request<any>({
        url: prefix('/policy/haveRoleDataPrivilege'),
        method: 'post',
        params: {
            roleId,
        },
    }); // 判断是否配置过数据权限

export const fetchRoleDevices = (params: {
    orgId: string;
    proCode: string;
    roleId: string;
}) =>
    request<any>({
        url: prefix('/rights/getRoleDeviceIds'),
        method: 'post',
        params,
    }); // 更新数据权限

export const updateRoleDataPrivileges = (
    data: {
        roleDataPrivilegesDTO: any;
    },
    proCode: string,
) =>
    request<any>({
        url: prefix('/policy/updateRoleDataPrivileges'),
        method: 'post',
        data,
        params: {
            proCode,
        },
    }); // 更新数据策略

export const insertRoleDataPurviewType = (params: {
    proCode: string;
    purviewTypeValue: number;
    roleId: string;
}) =>
    request<any>({
        url: prefix('/policy/insertRoleDataPurviewType'),
        method: 'post',
        params,
    }); // 清空数据权限

export const delRoleDataPrivileges = (params: {
    proCode: string;
    roleId: string;
}) =>
    request<any>({
        url: prefix('/policy/delRoleDataPrivileges'),
        method: 'post',
        params,
    }); // 角色管理-权限分配-获取当前用户全量组织机构

export const fetchAuthUserOrgTree = (params: {proCode: string}) =>
    request({
        url: prefix(`/aappauthor/org/getAuthUserRightFullOrgTreeVO`),
        method: 'post',
        params,
    }); // 角色管理权限分配菜单

export const fetchAuthMenuTree = (isShowDisabled = 1) =>
    request({
        url: prefix('/AuthorProduct/getAuthUserProductMenuTree'),
        method: 'post',
        params: {
            isDisable: isShowDisabled,
        }, // mockType: 'Mock',
    });
