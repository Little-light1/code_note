import request, {prefix} from '../common'; // import userLabelMock from './mock/userLabel.mock.json';
//  列表数据获取

export const listData = (data: any) =>
    request({
        url: prefix('/user/tag/list'),
        method: 'post',
        data,
    }); // 删除

export const deleteDataList = (data: any) =>
    request({
        url: prefix(`/user/tag/delete?tagIds=${data.tagIds}`),
        method: 'delete',
    }); // 根据登录用户所在企业ID获取组织及子组织架构信息 树选项 传个token就可以  根据用户id，应用code获取组织机构

export const getUserOrgRightResource = (data: any) =>
    request({
        url: prefix(
            `/aapp/organization/getUserOrgTreeVO?productCode=${data.productCode}&userId=${data.userId}`,
        ),
        method: 'get', // data,
    }); // 根据组织id列表获取绑定的用户列表

export const getUserListByFarmId = (orgIds: any) =>
    request({
        url: prefix('/aapp/organization/getUserListByFarmId'),
        method: 'post',
        data: orgIds, // mock: [200, userLabelMock],
        // mockType: 'Mock', // 假数据模式 不会发真实请求
    }); // 新增用户标签、并关联用户

export const addUserLabelList = (data: any) =>
    request({
        url: prefix('/user/tag/add'),
        method: 'post',
        data,
    }); // 根据用户标签id更新用户标签

export const updateUserLabelList = (data: any) =>
    request({
        url: prefix('/user/tag/update'),
        method: 'post',
        data,
    });
