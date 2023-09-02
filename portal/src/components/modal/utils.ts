import { Modal, ModalFuncProps } from 'antd';
import styles from './styles.module.scss';

const info = (props: ModalFuncProps) => Modal.info({
  className: styles.portalModal,
  ...props
});

const success = (props: ModalFuncProps) => Modal.success({
  className: styles.portalModal,
  ...props
});

const error = (props: ModalFuncProps) => Modal.error({
  className: styles.portalModal,
  ...props
});

const warning = (props: ModalFuncProps) => Modal.warning({
  className: styles.portalModal,
  ...props
});

const confirm = (props: ModalFuncProps) => Modal.confirm({
  className: styles.portalModal,
  ...props
});

const Utils = {
  info,
  success,
  error,
  warning,
  confirm
};
export default Utils;