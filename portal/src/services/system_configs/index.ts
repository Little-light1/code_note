import request, {prefix} from '../common';
import fetchIndexPicListNoAuthMock from './mock/fetchIndexPicListNoAuth.mock.json';
import fetchLogNoAuthMock from './mock/fetchLogNoAuth.mock.json';

// 获取轮播图(登录前)
export const fetchIndexPicListNoAuth = () =>
    request({
        url: prefix('/comConfig/getEnableIndecPic'),
        method: 'post',
        mock: [200, fetchIndexPicListNoAuthMock],
    });

// 根据id获取浏览器logo(登录前)
export const fetchLogNoAuth = () =>
    request({
        url: prefix('/comConfig/getLogoConfigById'),
        method: 'post',
        params: {id: 1},
        mock: [200, fetchLogNoAuthMock],
    });
