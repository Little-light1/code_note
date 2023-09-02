import {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';

declare function onError(error: AxiosError | Error, props: Service<StandardResponse<any>>): void;

export type OnErrorType = typeof onError;

export interface GRequestProps {
    baseURL?: string;
    config?: Object;
    responseInterceptor?: (response: AxiosResponse) => any;
    responseErrorInterceptor?: (error: AxiosError) => AxiosError;
    requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
    authorization?: string;
    onError?: OnErrorType;
    isMock: boolean;
    timeout?: number;
    isBusinessError?: (response: StandardResponse<any>) => boolean;
}

export type MockTypes = 'reply' | 'timeout' | 'timeoutOnce' | 'networkError' | 'networkErrorOnce';

export type CallbackResponseSpecFunc = (config: AxiosRequestConfig) => any[] | Promise<any[]>;

export type MockObject<T> = {
    type: MockTypes;
    handle?: number | [number, T] | CallbackResponseSpecFunc;
};

export type ErrorMockTypes = Exclude<MockTypes, 'reply'>;

export interface Service<T = any> extends AxiosRequestConfig {
    mock?: MockObject<T> | number | [number, T];
    mockType?: 'Realtime' | 'Mock';
    skipErrorHandler?: boolean;
    showError?: boolean;
    [key: string]: any;
}

export type MockFun = 'onGet' | 'onPost' | 'onPut' | 'onHead' | 'onDelete' | 'onPatch' | 'onList' | 'onOptions' | 'onAny';

// 后端错误栈
export type ServiceErrorTrack = {message?: string};

export interface StandardResponse<T> {
    code: string;
    data?: T | ServiceErrorTrack;
    msg?: string;
}
