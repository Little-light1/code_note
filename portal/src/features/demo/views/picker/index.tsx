import {LazyLoader} from '@gwaapp/ease';

const component = LazyLoader(() => import('./view'));
export const key = 'pickerDemo';
export const title = 'picker';
export const route = {
    key,
    title,
    path: '/picker',
    component,
    exact: true,
};
export default component;
