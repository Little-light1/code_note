import {LazyLoader} from '@gwaapp/ease';

const component = LazyLoader(() => import('./view'));
export const key = 'pages';
export const title = '所有页面';
export const route = {
    key,
    title,
    path: '/pages',
    component,
    exact: true,
};
export default component;
