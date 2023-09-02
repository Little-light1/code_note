import Cookies from 'js-cookie';
import {AuthCookieKey} from '@common/init/configs';
import {logUnAuthError} from '@services/abnormal_logs_view';
import {setLocal, removeLocal, getLocal} from './storage';

// 获取cookie中token值
// hasAuth不能判断cookie中的值，该值会在浏览器关闭后清空
export const hasAuth = () => !!getLocal(AuthCookieKey);

export const removeAuth = () => {
    removeLocal(AuthCookieKey);
    Cookies.remove(AuthCookieKey);
}; 

// export const setAuth = (token: string) => Cookies.set(AuthCookieKey, token);
export const setAuth = (token: string) => {
    setLocal(AuthCookieKey, token);
    Cookies.set(AuthCookieKey, token);
};

 // 记录越权访问
export const logUnauthorizedAccess = async (path: string) =>
    logUnAuthError(path);
