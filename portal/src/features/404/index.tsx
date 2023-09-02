import {LazyLoader} from '@gwaapp/ease';

const component = LazyLoader(() => import('./view'));
export const id = 'notFound';
export const route = {
    path: '/notFound',
    component,
};
export default component;
