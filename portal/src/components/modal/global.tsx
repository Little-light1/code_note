/* eslint-disable no-underscore-dangle */

/* eslint-disable @typescript-eslint/naming-convention */
import React, { FC, PureComponent } from 'react';
import { Modal, ModalProps, Spin } from 'antd';
import ReactDOM from 'react-dom';
import { useAppSelector } from '@/app/runtime';
import styles from './styles.module.scss';
export const GLOBAL_MODAL = 'aapp-global';
export const GlobalMask: FC<ModalProps> = () => {
  const isShowGlobalMask = useAppSelector(state => state.app.isShowGlobalMask);
  let _visible = isShowGlobalMask;
  let _isPortal = false;
  let _loadingText = 'Loading...';

  if (typeof isShowGlobalMask === 'object') {
    const {
      visible,
      isPortal = false,
      loadingText = 'Loading...'
    } = isShowGlobalMask;
    _visible = visible;
    _isPortal = isPortal;
    _loadingText = loadingText;
  }

  return <Modal footer={null} className={styles.portalModal} visible={_visible} maskClosable={false} keyboard={false} closable={false} zIndex={9999}>
            <div id={GLOBAL_MODAL}>{!_isPortal ? <Spin tip={_loadingText} style={{
        height: 80,
        width: '100%',
        padding: 15
      }} /> : null}</div>
        </Modal>;
};
export class GlobalPortal extends PureComponent {
  render() {
    const {
      children
    } = this.props;
    const el = document.getElementById(GLOBAL_MODAL);
    return el ? ReactDOM.createPortal(children, el) : null;
  }

}