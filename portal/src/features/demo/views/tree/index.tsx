import {LazyLoader} from '@gwaapp/ease';

const component = LazyLoader(() => import('./view'));
export const key = 'treeDemo';
export const title = 'tree';
export const route = {
    key,
    title,
    path: '/tree',
    component,
    exact: true,
};
export const reducers = {
    treeData: {
        initialState: [],
    },
};
export default component;
