export interface LoginProps {
  code: 'string';
  language: 'string';
  password: 'string';
  type: 'string';
  username: 'string';
}
export interface LoginResponseData {
  needChangePassword: boolean;
  token: string;
}