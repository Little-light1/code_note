import {ActionCreatorWithPayload, AnyAction, CaseReducer, PayloadActionCreator, Reducer} from '@reduxjs/toolkit';
// import { PathRouteProps, LayoutRouteProps, IndexRouteProps } from "react-router-dom";

export interface IAction<State = any> {
    // actionType: TypedActionCreator<string> | string;
    actionType: any;
    action: CaseReducer<State, AnyAction>;
}

export interface Reducers {
    [key: string]: {
        initialState: any;
        actions?: IAction[];
        reducer?: Reducer<any, AnyAction>;
    };
}

export interface PageAction {
    [key: string]: PayloadActionCreator<any, string>;
    set: ActionCreatorWithPayload<any, string>;
    reset: ActionCreatorWithPayload<void, string>;
}

export interface ActionsCache {
    [key: string]: PageAction;
}

export interface Combiner {
    [key: string]: Reducers | undefined;
}

export type GetPageState<RootState = {[key: string]: any}> = (state: RootState, id: string) => {[key: string]: any};
export interface GetPageSimpleActions {
    (id: string): PageAction;
    (): ActionsCache;
}

export interface Extra<RootState, PageState = {[key: string]: any}> {
    getPageSimpleActions(id: string, search?: string): PageAction;
    getPageSimpleActions(): ActionsCache;
    getPageState: (state: RootState, id: string, search?: string) => PageState;
}

// 页面多语言配置
export interface I18n {
    [key: string]: {[key: string]: string};
}

// 页面路由配置
export interface Route {
    key: string;
    title?: string;
    path: string;
    exact?: boolean;
    component: (props: any) => JSX.Element;
    subRoutes?: Route[];
}

// 页面整体配置
export interface PageConfig {
    route: Route;
    reducers?: Reducers;
    key: string;
    title?: string;
    i18n?: I18n;
    async?: boolean;
    [key: string]: any;
}

export interface I18nResources {
    [key: string]: {[key: string]: {[key: string]: any}};
}
