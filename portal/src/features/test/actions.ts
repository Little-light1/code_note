import { AppThunk } from '@/app/runtime';
import { PageProps } from '@gwaapp/ease';
/**
 * 页面初始化
 * @param props
 * @returns
 */

export const thunkInit = (props: PageProps): AppThunk => (dispatch, getState, {
  getPageSimpleActions
}) => {
  const actions = getPageSimpleActions(props.id);
  dispatch(actions.set({
    loading: true
  }));
  setTimeout(() => {
    dispatch(actions.set({
      loading: false
    }));
  }, 2000);
};
export const thunkClick = (props: PageProps): AppThunk => (dispatch, getState, {
  getPageSimpleActions,
  getPageState
}) => {
  const {
    clickTimes
  } = getPageState(getState(), props.id);
  const actions = getPageSimpleActions(props.id);
  dispatch(actions.setClickTimes(clickTimes + 1));
};