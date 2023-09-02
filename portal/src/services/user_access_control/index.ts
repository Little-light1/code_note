import request, {prefix} from '../common'; // 获取用户访问时间控制列表

export const getTimeList = (params: any, data: any) =>
    request({
        url: prefix('/visit/timelist'),
        method: 'post',
        params,
        data,
    }); // 获取用户访问地址控制列表

export const getIPList = (params: any, data: any) =>
    request({
        url: prefix('/visit/iplist'),
        method: 'post',
        params,
        data,
    }); // 新增用户访问时间控制

export const addTime = (data: any) =>
    request({
        url: prefix('/visit/addtime'),
        method: 'post',
        data,
    }); // 新增用户访问地址控制

export const addIP = (data: any) =>
    request({
        url: prefix('/visit/addip'),
        method: 'post',
        data,
    }); // 更新用户访问时间控制

export const updateTime = (data: any) =>
    request({
        url: prefix('/visit/updatetime'),
        method: 'post',
        data,
    }); // 更新用户访问地址控制

export const updateIP = (data: any) =>
    request({
        url: prefix('/visit/updateip'),
        method: 'post',
        data,
    }); // 删除用户访问时间控制

export const deleteTime = (data: any) =>
    request({
        url: prefix('/visit/deletetime'),
        method: 'delete',
        data,
    }); // 删除用户访问地址控制

export const deleteIP = (data: any) =>
    request({
        url: prefix('/visit/deleteip'),
        method: 'delete',
        data,
    }); // 当前登录用户有权限的用户列表

export const getUserListEx = (params: any, data: any) =>
    request({
        url: prefix('/visit/getUserListEx'),
        method: 'post',
        params,
        data,
    }); // 获取已选择用户列表

export const getUserListByIds = (data: any) =>
    request({
        url: prefix('/user/getUserListByIds1'),
        method: 'post',
        data,
    });
