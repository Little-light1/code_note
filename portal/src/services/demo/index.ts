import request from '../common';
import treeMock from './mock/tree.mock.json'; // 获取数据字典模型列表(树) 废弃

export const fetchThingDevices = () =>
    request<any>({
        url: '/demo/getThingDevices',
        method: 'post',
        mock: [200, treeMock],
        mockType: 'Mock',
    });
