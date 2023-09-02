import _ from 'lodash';
import axios, {AxiosError, AxiosInstance, AxiosResponse} from 'axios';
import {notification} from 'antd';
import {i18nIns} from '@/app/i18n';
import {ApiBaseUrl, AuthCookieKey} from '@common/init/configs';
import MockAdapter from 'axios-mock-adapter/types'; // import {logError} from '@/common/utils/clientAction';
import initMock from './mock';
import {StandardResponse, ErrorMockTypes, MockFun, Service} from './types'; // import {errorFetchCaptured} from './helper';
// axios

const {t} = i18nIns;
export const baseURL = '/aapp-api';
const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    baseURL: ApiBaseUrl,
}); // 默认超时时间 1分钟

api.defaults.timeout = 80 * 1000; // eslint-disable-next-line arrow-body-style

const responseInterceptor = (response: AxiosResponse) => response;

const responseErrorInterceptor = (error: AxiosError) => {
    const {response, message} = error;

    if (response) {
        const {status, statusText} = response; // TODO: 有响应: 统一的错误处理,错误上报

        console.error(`${status} ${statusText}`);
    } else {
        // 无响应
        console.error(message);
    }

    return Promise.reject(error);
};

api.interceptors.response.use(responseInterceptor, responseErrorInterceptor);
api.interceptors.request.use((config) => {
    const localToken = localStorage.getItem(AuthCookieKey);
    const language = localStorage.getItem('i18nextLng');

    if (typeof config.headers === 'undefined') {
        config.headers = {};
    }

    if (localToken) {
        config.headers.Authorization = localToken;
    }
    if (language) {
        config.headers['Accept-Language'] = language;
    }

    return config;
}); // mock

let mockAdapter: MockAdapter | null = null;
let mockApi: AxiosInstance | null = null;

if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line global-require
    const {api: newMockApi, adapter: newMockAdapter} = initMock(ApiBaseUrl);

    mockAdapter = newMockAdapter;
    mockApi = newMockApi;

    if (mockApi) {
        mockApi.interceptors.response.use(
            responseInterceptor,
            responseErrorInterceptor,
        );
    }
} // service

export default async function <T>({
    mock,
    skipErrorHandler = false,
    showError = true,
    ...args
}: Service<StandardResponse<T>>): Promise<StandardResponse<T>> {
    const {method, url, mockType = 'Realtime'} = args;

    const mockMethod = _.camelCase(`on ${method}`);

    let request = () =>
        api.request<StandardResponse<T>>({...args, skipErrorHandler}); // Mock: Forcibly enable virtual data globally Adaptive: Defined by the respective request

    if (
        mockApi &&
        mockAdapter &&
        mockType !== 'Realtime' &&
        typeof mock !== 'undefined'
    ) {
        if (!Array.isArray(mock) && mock instanceof Object) {
            const {type, handle} = mock;

            if (
                [
                    'timeout',
                    'timeoutOnce',
                    'networkError',
                    'networkErrorOnce',
                ].includes(type)
            ) {
                mockAdapter[mockMethod as MockFun](url)[
                    type as ErrorMockTypes
                ]();
            } else if (handle) {
                if (Array.isArray(handle)) {
                    mockAdapter[mockMethod as MockFun](url)[type](...handle);
                } else {
                    mockAdapter[mockMethod as MockFun](url)[type](handle);
                }
            }
        } else if (Array.isArray(mock)) {
            mockAdapter[mockMethod as MockFun](url).reply(...mock);
        } else {
            mockAdapter[mockMethod as MockFun](url).reply(mock);
        }

        request = () =>
            mockApi!.request<StandardResponse<T>>({...args, skipErrorHandler});
    } // return errorFetchCaptured(request,  url, showError)

    try {
        const {headers, data} = await request();
        const {code, msg} = data;
        if (data instanceof Blob) {
            const browserUrl = window.URL.createObjectURL(data);
            const link = document.createElement('a');
            let filename = `${t('导出')}.xlsx`;

            if (headers['content-disposition']) {
                const matches =
                    headers['content-disposition'].match(/fileName=(.+)/);

                if (matches && matches[1]) {
                    filename = decodeURIComponent(matches[1]);
                }
            }

            link.href = browserUrl;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            return {
                code: '200',
            };
        } // 当前用户已经登录，强制退出

        if (code === 'SEC_AUTH_B0163') {
            window.portalHandlers.logout();
        }
        if (`${code}` !== '200' && code !== '400108') {
            showError &&
                notification.error({
                    icon: null,
                    message: t('请求报错'),
                    description: msg || (data.data && data.data.message) || '',
                });
        }

        return data;
    } catch (error: any) {
        const {code, message = 'fetch error', response} = error; // token失效跳转登陆界面

        if (response && String(response.status) === '401') {
            window.portalHandlers.logout();
            throw new Error(error.message);
        }

        if (
            code === 'ECONNABORTED' ||
            message === 'Network Error' ||
            message.includes('timeout')
        ) {
            showError &&
                notification.error({
                    message: t('请求超时'),
                    description: message,
                });
        } else {
            showError &&
                notification.error({
                    message: t('请求报错'),
                    description: message,
                });
        } // logError({error});

        throw new Error(message);
    }
}
export {default as prefix} from './service_prefix';
