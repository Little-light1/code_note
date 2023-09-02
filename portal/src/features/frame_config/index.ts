import {LazyLoader} from '@gwaapp/ease';
import i18nJson from './i18n.json';

const component = LazyLoader(() => import('./view'));
export const key = 'frameConfig';
export const title = '框架配置';
export const route = {
    key,
    title,
    path: '/frameConfig',
    component,
    exact: true,
};
export const reducers = {
    bgPics: {
        initialState: [],
    },
    commonConfigs: {
        initialState: [],
    },
    frame: {
        initialState: {
            top: true,
            left: true,
        },
    },
    logo: {
        initialState: {},
    },
    frameResponse: {
        initialState: {},
    },
};
export const i18n = i18nJson;
export default component;
