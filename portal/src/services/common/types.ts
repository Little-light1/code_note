import { AxiosRequestConfig } from 'axios';
export interface StandardResponse<T> {
  code: string;
  data?: T;
  msg?: string;
}
export type CallbackResponseSpecFunc = (config: AxiosRequestConfig) => any[] | Promise<any[]>;
export type MockTypes = 'reply' | 'timeout' | 'timeoutOnce' | 'networkError' | 'networkErrorOnce';
export type ErrorMockTypes = Exclude<MockTypes, 'reply'>;
export type MockObject<T> = {
  type: MockTypes;
  handle?: number | [number, T] | CallbackResponseSpecFunc;
};
export type MockFun = 'onGet' | 'onPost' | 'onPut' | 'onHead' | 'onDelete' | 'onPatch' | 'onList' | 'onOptions' | 'onAny';
export interface Service<T = any> extends AxiosRequestConfig {
  mock?: MockObject<T> | number | [number, T];
  mockType?: 'Realtime' | 'Mock';
  skipErrorHandler?: boolean;
  showError?: boolean;
}