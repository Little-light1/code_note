import {LazyLoader} from '@gwaapp/ease';
import subRoutes from './sub_routes';

const component = LazyLoader(() => import('./view'));
export const key = 'demo';
export const title = 'demo';
export const route = {
    key,
    title,
    path: '/demo',
    component,
    subRoutes,
};
export default component;
