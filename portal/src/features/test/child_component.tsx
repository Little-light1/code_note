import { useAppSelector } from '@/app/runtime';
import React from 'react';
import { shallowEqual } from 'react-redux';

function ChildComponent({
  id
}) {
  console.log('render children');
  const {
    clickTimes
  } = useAppSelector(state => state[id], shallowEqual);
  return <div>{clickTimes}</div>;
}

export default ChildComponent;