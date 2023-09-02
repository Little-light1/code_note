/*
 * @Author: gxn
 * @Date: 2022-03-26 11:37:37
 * @LastEditors: gxn
 * @LastEditTime: 2022-03-29 17:02:49
 * @Description: container
 */
import React from 'react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { connectAction } from '@gwaapp/ease';
import View from './view'; // eslint-disable-next-line import/no-cycle

import { actions } from './redux';

const mapStateToProps = (state, {
  id
}) => {
  const pageState = state[id];
  return {
    jumpPageToken: pageState.jumpPageToken
  };
};

const mapDispatchToProps = dispatch => ({
  initTableList() {
    dispatch(actions.getBigDataToken());
  },

  resetPage() {},

  jumpPage() {}

});

class Component extends React.PureComponent {
  componentDidMount() {
    const {
      initTableList
    } = this.props;
    initTableList();
  }

  componentWillUnmount() {
    const {
      resetPage
    } = this.props;
    resetPage();
  }

  render() {
    return <View {...this.props} />;
  }

}

export default hot(module)(connectAction(connect(mapStateToProps, mapDispatchToProps)(Component)));