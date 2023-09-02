import { LazyLoader } from '@gwaapp/ease';
const component = LazyLoader(() => import('./view'));
export const key = 'test';
export const title = 'test';
export const route = {
  key,
  title,
  path: '/test',
  component,
  exact: true
};
export const reducers = {
  loading: {
    initialState: false
  },
  clickTimes: {
    initialState: 0
  }
};
export default component;