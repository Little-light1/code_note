import axios, {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {camelCase, merge} from 'lodash';
import {ErrorMockTypes, MockFun, GRequestProps, Service, StandardResponse, OnErrorType, ServiceErrorTrack} from './types';
import {getLocal} from './utils';

class GRequest {
    mockAdapter: MockAdapter | null;

    mockAxiosInstance: AxiosInstance | null;

    axiosInstance: AxiosInstance;

    axiosConfig: AxiosRequestConfig;

    responseErrorInterceptor: ((error: AxiosError<any, any>) => AxiosError<any, any>) | undefined;

    onError: OnErrorType | undefined;

    isBusinessError: (resData: StandardResponse<any>) => boolean;

    authorization: string;

    requestInterceptor: ((config: AxiosRequestConfig) => AxiosRequestConfig) | undefined;

    constructor({
        baseURL,
        config = {},
        responseInterceptor,
        responseErrorInterceptor,
        requestInterceptor,
        authorization = 'authorization',
        onError,
        isMock = false,
        timeout,
        isBusinessError,
    }: GRequestProps) {
        this.axiosConfig = merge(
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                baseURL,
            },
            config,
        );

        this.responseErrorInterceptor = responseErrorInterceptor;
        this.requestInterceptor = requestInterceptor;
        this.onError = onError;
        this.authorization = authorization;
        this.mockAdapter = null;

        this.axiosInstance = axios.create(this.axiosConfig);

        if (timeout) {
            this.axiosInstance.defaults.timeout = timeout;
        }

        this.axiosInstance.interceptors.response.use(responseInterceptor, this.responseErrorInterceptor);
        // eslint-disable-next-line no-underscore-dangle
        this.axiosInstance.interceptors.request.use(this._requestInterceptor.bind(this));

        // mock
        this.mockAxiosInstance = axios.create(this.axiosConfig);
        if (isMock) {
            this.mockAdapter = new MockAdapter(this.mockAxiosInstance, {delayResponse: 2000});
            this.mockAxiosInstance.interceptors.response.use(responseInterceptor, responseErrorInterceptor);
        }

        // 业务出错通用逻辑
        this.isBusinessError =
            isBusinessError ||
            function (resData: StandardResponse<any>) {
                const {code} = resData;
                return typeof code !== 'undefined' && String(code) !== '200';
            };
    }

    // eslint-disable-next-line no-underscore-dangle
    _requestInterceptor(config: AxiosRequestConfig) {
        const localToken = getLocal(this.authorization);
        if (localToken) {
            !config.headers && (config.headers = {});
            config.headers.Authorization = localToken;
        }

        return this.requestInterceptor ? this.requestInterceptor(config) : config;
    }

    async request<T>(args: Service<StandardResponse<T>>): Promise<StandardResponse<T>> {
        const {method, url, mockType = 'Realtime', skipErrorHandler = false, mock} = args;

        const mockMethod = camelCase(`on ${method}`);

        let requestHandler = () => this.axiosInstance.request<StandardResponse<T>>({...args, skipErrorHandler});

        // Mock: Forcibly enable virtual data globally Adaptive: Defined by the respective request
        if (this.mockAxiosInstance && this.mockAdapter && mockType !== 'Realtime' && typeof mock !== 'undefined') {
            if (!Array.isArray(mock) && mock instanceof Object) {
                const {type, handle} = mock;
                if (['timeout', 'timeoutOnce', 'networkError', 'networkErrorOnce'].includes(type)) {
                    this.mockAdapter[mockMethod as MockFun](url)[type as ErrorMockTypes]();
                } else if (handle) {
                    if (Array.isArray(handle)) {
                        this.mockAdapter[mockMethod as MockFun](url)[type](...handle);
                    } else {
                        this.mockAdapter[mockMethod as MockFun](url)[type](handle);
                    }
                }
            } else if (Array.isArray(mock)) {
                this.mockAdapter[mockMethod as MockFun](url).reply(...mock);
            } else {
                this.mockAdapter[mockMethod as MockFun](url).reply(mock);
            }
            requestHandler = () => this.mockAxiosInstance!.request<StandardResponse<T>>({...args, skipErrorHandler});
        }

        try {
            // headers,
            const axiosResponse = await requestHandler();
            // statusText, status, headers, config, request
            const {data} = axiosResponse;

            const {msg} = data;

            // 业务出错,统一封装一层,存在code则做标准业务判断
            if (this.isBusinessError(data) && this.onError) {
                let message = '';
                if (typeof msg === 'undefined') {
                    const serviceErrorTrack = data.data as ServiceErrorTrack;
                    if (typeof serviceErrorTrack.message !== 'undefined') {
                        message = serviceErrorTrack.message;
                    }
                } else {
                    message = msg;
                }

                const error = new Error(message);
                // const axiosError: AxiosError = Object.assign(error, {
                //   config,
                //   code,
                //   request,
                //   response: axiosResponse,
                //   isAxiosError: false,
                //   toJSON: () => ({}),
                // });

                this.onError(error, args);
            }

            return data;
        } catch (error: any) {
            this.onError && this.onError(error, args);
            throw error;

            // if (axios.isAxiosError(error)) {
            //   const { response, message } = error;
            //   this.onError && this.onError(error, args);
            //   throw error;

            //   // return { code: response.status, msg: message };
            //   // if (error.response) {
            //   //   // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
            //   // } else if (error.request) {
            //   //   // 请求已经成功发起，但没有收到响应
            //   //   // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
            //   //   // 而在node.js中是 http.ClientRequest 的实例
            //   // }
            // } else {
            //   // Just a stock error
            //   this.onError && this.onError(error, args);
            //   throw new Error(error);
            // }
        }
    }
}

export default GRequest;
