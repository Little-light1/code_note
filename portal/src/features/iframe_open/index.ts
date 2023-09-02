import {LazyLoader} from '@gwaapp/ease';

const component = LazyLoader(() => import('./view'));
export const key = 'iframeOpen';
export const title = '内部菜单名称';
export const route = {
    key,
    title,
    path: '/iframeOpen',
    component,
    exact: false,
};
export const reducers = {
    // 路由地址
    url: {
        initialState: '',
    },
    pageName: {
        initialState: '',
    },
};
export default component;
