import { ModalProps as AntdModalProps } from "antd";

export interface ModalProps extends Omit<AntdModalProps, "onOk" | "onCancel"> {
  id: string;
  height?: number;
  isAutoClose?: boolean;
  onOk?: () => Promise<boolean> | void | null;
  onCancel?: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => Promise<void> | void;
}

export interface ModalProviderProps {
  okText?: string;
  cancelText?: string;
  globalMaskID?: string;
  defaultGlobalMaskText?: string;
  closeableDelay?: number;
  state?: ModalState;
  updateState?: (state: ModalState) => void;
  isShowGlobalMask?: IsShowGlobalMask;
  updateIsShowGlobalMask?: (isShowGlobalMask?: IsShowGlobalMask) => void;
}

export interface ModalContext {
  okText?: string;
  cancelText?: string;
  globalMaskID?: string;
  defaultGlobalMaskText?: string;
  closeableDelay: number;
}

export type ModalState = { [key: string]: any };

export type IsShowGlobalMask = boolean | { visible: boolean; isPortal?: boolean; text?: string; timeout?: number };

export interface IModalContext {
  state: ModalState;
  configuration: ModalContext;
  openModal: (id: string, extra?: any) => void;
  closeModal: (id: string) => void;
  openGlobalMask: (isShowGlobalMask?: IsShowGlobalMask) => void;
  closeGlobalMask: () => void;
  isShowGlobalMask: IsShowGlobalMask;
}
