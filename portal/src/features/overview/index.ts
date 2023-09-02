import { LazyLoader } from '@gwaapp/ease';

const component = LazyLoader(() => import('./view'));

export const key = 'overview';

export const title = '门户首页';

export const route = {
    key,
    title,
    path: '/index',
    component,
    exact: true,
};

export default component