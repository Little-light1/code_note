import request, {prefix} from '../common'; // import maintenanceMock from './mock/maintenance.mock.json';
//  列表数据获取   产品管理--添加aapp应用实例

export const getProductListByPage = (data) =>
    request({
        url: prefix('/aappauthor/product/getProductListByPage'),
        method: 'post',
        data, // mock: [200, accountMock],
        // mockType: 'Mock', // 假数据模式 不会发真实请求
    }); // 删除  产品管理--用户组件原生接口

export const deleteDataList = (data) =>
    request({
        url: prefix(`/author/product/logicProduct?pId=${data.pId}`),
        method: 'post', // data: pId,
        // params: data,
    }); // 修改企业状态  产品管理--用户组件原生接口

export const updateApplicationServiceState = (data) =>
    request({
        url: prefix(
            `/author/product/enableProduct?pId=${data.pId}&stateEnum=${data.stateEnum}`,
        ),
        method: 'post', // data,
    }); // 新增  产品管理--添加aapp应用实例

export const addAppData = (data: any) =>
    request({
        url: prefix('/aappauthor/product/insertProductInstance'),
        method: 'post',
        data,
    }); // 编辑  产品管理--添加aapp应用实例

export const updateAppData = (data: any) =>
    request({
        url: prefix('/aappauthor/product/updateProduct'),
        method: 'post',
        data,
    });
