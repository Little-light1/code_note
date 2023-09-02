import {LazyLoader} from '@gwaapp/ease';

const component = LazyLoader(() => import('./view'));
export const key = 'tableDemo';
export const title = 'table';
export const route = {
    key,
    title,
    path: '/table',
    component,
    exact: true,
};
export default component;
