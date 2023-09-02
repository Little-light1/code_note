/*
 * @Author: Chen.zi.wei
 * @Date: 2022-09-07 16:23:12
 * @Last Modified by:   Chen.zi.wei
 * @Last Modified time: 2022-09-07 16:23:12
 */
import request, {prefix} from '../common'; // import accountMock from './mock/account.mock.json';
//  列表数据获取

export const listData = (data: any) =>
    request({
        url: prefix('/aapp/enterprise/list'),
        method: 'post',
        data, // mock: [200, accountMock],
        // mockType: 'Mock', // 假数据模式 不会发真实请求
    }); //  应用服务数据获取

export const appNumberList = () =>
    request({
        url: prefix('/AuthorProduct/getProductListByPage'),
        method: 'post',
        data: {
            all: true,
            conditions: [
                {
                    condition: 'GE',
                    field: 'systemType',
                    value: 'AAPP',
                    valueType: 'STRING',
                },
            ],
            pageSize: 10,
            pageNum: 1,
        },
    }); // 新增

export const addData = (data: any) =>
    request({
        url: prefix('/aapp/enterprise/add'),
        method: 'post',
        data,
    }); // 根据企业id删除企业信息
// export const deleteData = (id) =>
//   request({
//     url: prefix(`/aapp/enterprise/delete`),
//     method: 'get',
//     params: {
//       enterpriseID: id,
//     },
//   });
// 编辑

export const updateForm = (data: any) =>
    request({
        url: prefix('/aapp/enterprise/update'),
        method: 'post',
        data,
    }); // 修改企业状态  id name state 必填

export const updateEnterpriseState = (data: any) =>
    request({
        url: 'aapp-portal/aapp/enterprise/updateEnterpriseState',
        method: 'post',
        data,
    });
