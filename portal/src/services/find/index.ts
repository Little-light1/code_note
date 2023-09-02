import request, {prefix} from '../common'; // 根据用户id和菜单id获取有权限卡片资源

export const getCardList = (data: any) =>
    request({
        url: prefix(
            `/biMenuSource/getUserBiMenuSourceList?menuId=${data.menuId}&userId=${data.userId}&keyword=${data.keyword}`,
        ),
        method: 'post', // data
    }); // 新增BI卡片资源

export const addCardObj = (data: any) =>
    request({
        url: prefix('/biMenuSource/addBiMenuSource'),
        method: 'post',
        data,
    }); // 修改BI卡片资源

export const putCardObj = (data: any) =>
    request({
        url: prefix('/biMenuSource/updateBiMenuSource'),
        method: 'post',
        data,
    }); // 删除BI卡片资源

export const deleteObj = (ids: any) =>
    request({
        url: prefix('/biMenuSource/delBiMenuSource'),
        method: 'post',
        data: ids,
    });

export const getBiReportUrl = (params: any) =>
    request({
        url: prefix('/bi/getBiReportUrl', 'bi'),
        method: 'get',
        showError: false,
        params,
    });
