import {LazyLoader} from '@gwaapp/ease';

const component = LazyLoader(() => import('./view'));
export const key = 'iconfont';
export const title = 'Iconfont';
export const route = {
    key,
    title,
    path: '/iconfont',
    component,
    exact: true,
};
export default component;
