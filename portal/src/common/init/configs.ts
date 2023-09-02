export const MicroContainerDomID = 'aapp-micro-container';
export const AppBasePath = '/';
const apiHost = '';
const apiPath = '/aapp-api';
export const ApiBaseUrl = apiHost + apiPath;
export const SsoLoginKey = 'isSsoLogin'; // 单点登录标记
export const SsoLoginTypeKey = 'ssoLoginType'; // 单点登录类型 4A cas
export const AuthCookieKey = 'authorization'; // 读取静态配置

export function getStaticConfigs(key: string): undefined | any {
    const {portalConfigs} = window;

    if (portalConfigs && portalConfigs.hasOwnProperty(key)) {
        return portalConfigs[key];
    }

    return undefined;
} // 皮肤

export const SkinMap = {
    default: {
        path: '/public/skin/default.css',
        title: '深色',
        key: 'default',
    },
    light: {
        path: '/public/skin/light.css',
        title: '淡色',
        key: 'light',
    },
};
