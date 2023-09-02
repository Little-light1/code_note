import request, { prefix } from '../common'; // import maintenanceMock from './mock/maintenance.mock.json';
//  列表数据获取

export const list = data => request({
  url: prefix('/aapp/appservice/list'),
  method: 'post',
  data // mock: [200, accountMock],
  // mockType: 'Mock', // 假数据模式 不会发真实请求

}); // 删除

export const deleteDataList = id => request({
  url: prefix(`/aapp/appservice/delete`),
  method: 'get',
  params: {
    id
  }
}); // 修改企业状态   必填

export const updateApplicationServiceState = data => request({
  url: 'aapp-portal/aapp/appservice/updateApplicationServiceState',
  method: 'post',
  data
}); // 新增

export const addAppData = data => request({
  url: prefix('/aapp/appservice/add'),
  method: 'post',
  data
}); // 编辑

export const updateAppData = data => request({
  url: prefix('/aapp/appservice/update'),
  method: 'post',
  data
});