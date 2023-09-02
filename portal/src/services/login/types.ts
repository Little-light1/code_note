/*
 * @Author: zhangzhen
 * @Date: 2022-05-25 08:52:14
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-09-01 17:30:36
 *
 */
export interface LoginProps {
  code?: 'string';
  language: 'string';
  password: 'string';
  type: 'string';
  username: 'string';
  forceQuit: string;
}
export interface LoginResponseData {
  needChangePassword: boolean;
  token: string;
  userProperties: {
    expired: number;
    passwordProperties: {
      expired: number;
    };
  };
  user: any;
}