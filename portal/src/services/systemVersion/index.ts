import request, {prefix} from '../common';

// 获取系统版本信息
export const getSystemVersionInfo = () =>
    request<any[]>({
        url: prefix('/aapp/version/latest'),
        method: 'get',
    });

// 获取大数据系统版本信息--不走通用解析了，否则老版本DP会提示报错
export const thunkGetEnv = () =>
    request<any[]>({
        url: prefix('/env/getEnv', 'bigdataplat'),
        method: 'get',
        skipErrorHandler: true,
        showError: false,
    });
