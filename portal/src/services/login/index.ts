/*
 * @Author: zhangzhen
 * @Date: 2022-06-22 08:49:21
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-08-26 12:27:04
 *
 */
import request, {prefix} from '../common';
import {LoginProps, LoginResponseData} from './types';
import loginMock from './mock/login.mock.json';
import checkTokenMock from './mock/checkToken.mock.json'; // 有验证码登录

export const fetchLogin = (values: LoginProps) =>
    request<LoginResponseData>({
        // url: prefix('/login/ngspLogin'),
        url: prefix('/login/captchaLogin'),
        method: 'post',
        data: values,
        mock: [200, loginMock], // mockType: 'Mock',
    }); // 无验证码登录

export const fetchNgspLogin = (values: LoginProps) =>
    request<LoginResponseData>({
        url: prefix('/login/ngspLogin'),
        // url: prefix('/login/captchaLogin'),
        method: 'post',
        data: values,
        mock: [200, loginMock], // mockType: 'Mock',
    }); // 检查token

export const checkToken = () =>
    request({
        url: prefix('/login/validateNoParam'),
        method: 'post',
        mock: [200, checkTokenMock],
        // mockType: 'Mock',
        showError: false,
    }); // TODO: 登出

export const fetchLogout = () =>
    request({
        url: prefix('/login/userLogout'),
        method: 'post',
        mock: [
            200,
            {
                code: '200',
            },
        ],
        showError: false,
    }); // 获取当前用户信息

export const fetchSelf = () =>
    request({
        url: prefix('/user/getSelf'),
        method: 'get',
        mock: [200, {}],
    }); // 获取当前用户信息

export const fetchKaptcha = () =>
    request({
        url: prefix('/login/kaptcha'),
        method: 'post',
        mock: [200, {}],
        showError: false,
    });

    // prefix('/comConfig/getDictDataConfig'),


// export const fetchDownloadAppInfo = () => {

//     const paramsAndriod = {
//       dconfigCode: 'Android_APP',
//       tenantId: 'TenantId',
//     };
//     const paramsIOS = {
//       dconfigCode: 'IOS_APP',
//       tenantId: 'TenantId',
//     };
//     return request({
//       url: prefix('/comConfig/getDictDataConfig'),
//       method: 'post',
//       mock: [200, {}],
//       params: paramsAndriod
//     });

//   }