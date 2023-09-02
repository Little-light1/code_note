import request, {prefix} from '../common'; // 获取组织机构树

export const getOrganizationTree = (params: any) =>
    request<any[]>({
        url: prefix('/aappauthor/org/getUserRightFullOrgTreeVO'),
        method: 'post',
        params,
    }); // 获取用户状态监测列表

export const getUserStatusList = (params: any, data: any, showError: boolean) =>
    request({
        url: prefix('/user/userOnlineStateList/account'),
        method: 'post',
        params,
        data,
        showError,
    });
