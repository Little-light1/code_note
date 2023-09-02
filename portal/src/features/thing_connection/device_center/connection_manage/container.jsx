/*
 * @Author: gxn
 * @Date: 2022-03-26 11:37:37
 * @LastEditors: gxn
 * @LastEditTime: 2022-03-26 13:42:27
 * @Description: container
 */
import React from 'react';
import { connect } from 'react-redux';
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

export default connectAction(connect(mapStateToProps, mapDispatchToProps)(Component));