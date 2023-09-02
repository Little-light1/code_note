import { useAppDispatch, useAppSelector } from '@/app/runtime';
import { usePage } from '@gwaapp/ease';
import { Button } from 'antd';
import React, { FC } from 'react';
import { shallowEqual } from 'react-redux';
import { thunkClick, thunkInit } from './actions';
import ChildComponent from './child_component';

const Test: FC<any> = props => {
  const {
    id
  } = props;
  const dispatch = useAppDispatch();
  const {
    loading
  } = useAppSelector(state => state[id], shallowEqual);
  usePage({
    init: () => dispatch(thunkInit(props))
  });
  console.log('render parent');
  return <div>
            {loading}
            <Button onClick={() => {
      dispatch(thunkClick(props));
    }}>
        点击
            </Button>

            <ChildComponent {...props} />
        </div>;
};

export default Test;