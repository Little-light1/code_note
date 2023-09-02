// import LogicFlow from '@logicflow/core';
/*
 * @Author: zhangzhen
 * @Date: 2022-08-29 18:42:01
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-11-24 15:59:29
 *
 */
// App组件
export {App, EaseRouter, useAction, connectAction} from './components/Runtime/App';
export type {ActionContext, Handlers} from './components/Runtime/App';

// 运行时
export {Runtime, getUniqueKey, initI18n} from './components/Runtime/Constructor';
export type {Extra, PageConfig, HistoryManager, RichRoute, IAction, I18nResources} from './components/Runtime/Constructor';

// 运行时配套组件&方法
export {Page, PageContainer, PageContainerContext, PageContext, usePage, connectPage, connectRouter} from './components/Page';
export type {PageProps} from './components/Page';

// 懒加载组件
export {default as LazyLoader} from './components/LazyLoader';

// 标准axios封装
export {GRequest, isAxiosError} from './components/Request';
export type {GRequestProps, StandardResponse, AxiosError} from './components/Request';

// 模态窗口组件
export {Modal, ModalProvider, ModalContext, useModal} from './components/Modal';
export type {ModalProps, ModalProviderProps, IsShowGlobalMask} from './components/Modal';

// excel读取组件
export {XlsxReader} from './components/Xlsx';
export type {XlsxReaderInstance} from './components/Xlsx';

// 表格组件
export {Table, EditableTable, VirtualTable, EditableVirtualTable} from './components/Table';
export type {
    EaseTableProps,
    EaseEditableTableProps,
    EaseVirtualTableProps,
    EaseEditableTableInstance,
    EditStatus,
} from './components/Table/types';

// 树组件
export {SearchTree, SearchTreeSelect, utils as TreeUtils} from './components/Tree';
export type {SearchTreeProps, SearchTreeSelectProps} from './components/Tree';

// 自适应容器组件
export {default as FlexContainer} from './components/FlexContainer';

// 用户行为
export {ReactElementAction} from './components/UserAction';
export type {Action, UserAction, InitReactTrack} from './components/UserAction';
