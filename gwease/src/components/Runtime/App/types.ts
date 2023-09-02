// import { AnyAction, Store } from "@reduxjs/toolkit";
// import HistoryManager from "../Constructor/HistoryManager";
import {MutableRefObject} from 'react';
import type Runtime from '../Constructor/Runtime';
// import { ActionsCache } from "../Constructor/types";
// import { ActionsCache, GetPageSimpleActions, GetPageState } from "../Constructor/types";

// export interface Runtime {
//   basename?: string;
//   actions: ActionsCache;
//   store: Store<any, AnyAction>;
//   historyManager: HistoryManager;
//   getPageState: GetPageState;
//   getPageSimpleActions: GetPageSimpleActions;
// }

export type RuntimeInstance = Runtime;

export interface LogErrorProps {
    msg?: string;
    error?: Error;
}

// interface EventsCache<T = void | Promise<void>> {
//   beforeClose: {
//     [key: string]: () => T;
//   };
//   afterClose: {
//     [key: string]: () => T;
//   };
//   afterRefresh: {
//     [key: string]: () => T;
//   };
//   beforeRefresh: {
//     [key: string]: () => T;
//   };
// }

interface EventsCache<T = void | Promise<void>> {
    [key: string]: {
        [key: string]: () => T;
    };
}

export interface Handlers {
    register: (key: string, handler: (props: any) => void | Promise<void>, type: keyof EventsCache) => void;
    deregister: (key: string, type: keyof EventsCache) => void;
    trigger: (type: keyof EventsCache, props?: any) => void;
    logError: (props: LogErrorProps) => void;
    micro?: {
        setPageStatus: (appID: string, status: {[key: string]: any}) => void;
        getPageStatus: (appID: string) => any;
    };
    [key: string]: any;
}

export type Tab = MutableRefObject<any | null>;

export type Locale = Record<string, Record<string, string>>;

export interface AppProps {
    tab: Tab;
    runtime: RuntimeInstance;
    handlers?: Handlers;
    callback?: {[key: string]: (...args: any[]) => void};
    state?: any;
    locale?: Locale;
}

export interface ActionContext {
    tab: Tab;
    actions: RuntimeInstance['actions'];
    getPageState: RuntimeInstance['getPageState'];
    getPageSimpleActions: RuntimeInstance['getPageSimpleActions'];
    injectAsyncReducer: RuntimeInstance['injectAsyncReducer'];
    historyManager: RuntimeInstance['historyManager'];
    handlers: Handlers;
    callback?: {[key: string]: (...args: any[]) => void};
    state?: any;
    basename?: string;

    // basename?: string;
    // actions: ActionsCache;
    // store: Store<any, AnyAction>;
    // historyManager: HistoryManager;
    // getPageState: GetPageState;
    // getPageSimpleActions: GetPageSimpleActions;
}
