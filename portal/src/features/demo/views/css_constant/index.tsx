import {LazyLoader} from '@gwaapp/ease';

const component = LazyLoader(() => import('./view'));
export const key = 'cssConstant';
export const title = 'css变量';
export const route = {
    key,
    title,
    path: '/cssConstant',
    component,
    exact: true,
};
export default component;
