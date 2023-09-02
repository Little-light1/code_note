import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {configureStore} from '@reduxjs/toolkit';
import {i18n as i18nClass} from 'i18next';
// import { initReactI18next } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";
import type {AnyAction, CombinedState, Reducer} from '@reduxjs/toolkit';
import {buildReducer} from './reducer';
import HistoryManager from './HistoryManager';
import type {ActionsCache, Combiner, PageAction, PageConfig, Reducers} from './types';
import {Handlers} from '../App';
// import { log } from "../../../utils/log";

interface RuntimeConstructor {
    pages: PageConfig[];
    basename?: string;
    i18n?: i18nClass;
    // i18nOptions?: InitOptions;
    defaultI18n?: string;
    appReducers?: Reducers;
    immer?: boolean;
    // constructI18nResources?: (i18n: I18nResources, pages: PageConfig[]) => I18nResources;
}

export function getUniqueKey(key: string, search?: String) {
    if (!search || typeof search !== 'string') {
        return key;
    }

    return `${key}_${search}`;
}

// // 默认组装函数，页面为独立的命名空间
// export function constructDefaultI18nResources(i18n: I18nResources, pages: PageConfig[]) {
//   const resources = i18n;

//   pages.forEach(({ key, i18n: pageI18n }) => {
//     if (pageI18n) {
//       Object.keys(pageI18n).forEach((i18nKey) => {
//         typeof resources[i18nKey] === "undefined" && (resources[i18nKey] = {});
//         resources[i18nKey][key] = pageI18n[i18nKey];
//       });
//     }
//   });

//   return resources;
// }

class Runtime {
    handlers: Handlers | null;

    actions: ActionsCache;

    buildReducers: {[key: string]: Reducer<CombinedState<{[x: string]: any}>, AnyAction>};

    staticReducers: Combiner;

    asyncReducers: Combiner;

    store: ReturnType<Runtime['createStore']>;

    historyManager: HistoryManager;

    basename: string | undefined;

    // i18nResources: I18nResources;

    // defaultI18n: string;

    i18nNext?: i18nClass;
    // i18nNext: typeof i18nNext;

    immer: boolean;

    getPageState: (state: {[key: string]: any}, id: string, search?: string) => any;

    constructor({
        pages,
        basename,
        i18n,
        // i18n = { zh: {}, en: {} },
        // defaultI18n = "zh",
        appReducers = {},
        immer = true,
    }: // i18nOptions,
    // constructI18nResources,
    RuntimeConstructor) {
        this.handlers = null;
        this.actions = {};
        this.buildReducers = {};
        this.basename = basename;
        // this.defaultI18n = defaultI18n;
        // this.i18nResources = i18n;
        this.immer = immer;
        this.staticReducers = {app: appReducers};
        this.asyncReducers = {};

        // 同步则生成reducer
        pages.forEach(({key, reducers, async = true}) => {
            if (!async) {
                this.staticReducers[key] = reducers;
            }
        });

        // 初始化多语言实例
        // this.i18nResources = constructI18nResources ? constructI18nResources(i18n, pages) : constructDefaultI18nResources(i18n, pages);

        // this.i18nNext = this.initI18n(i18nOptions);
        this.i18nNext = i18n;

        // 初始化history
        this.historyManager = new HistoryManager({
            featuresRoutes: pages.map((config) => config.route),
            basename,
        });

        // 创建store
        this.store = this.createStore();

        // 实例对象上绑定getPageState
        this.getPageState = Runtime.getPageState;
    }

    static getPageState(state: {[key: string]: any}, id: string, search?: String) {
        return state[getUniqueKey(id, search)];
    }

    getPageSimpleActions(id: string, search?: String): PageAction;
    getPageSimpleActions(): ActionsCache;
    getPageSimpleActions(id?: string, search?: String) {
        return id ? this.actions[getUniqueKey(id, search)] : this.actions;
    }

    injectAsyncReducer({key, reducers, search}: {key: string; reducers?: Reducers; search: string}) {
        if (typeof reducers === 'undefined') {
            return;
        }

        const uniqueKey = getUniqueKey(key, search);

        // 不重复注入
        if (this.asyncReducers[uniqueKey]) {
            return;
        }

        this.asyncReducers[uniqueKey] = reducers;

        const builder = buildReducer({reducers, key: uniqueKey, immer: this.immer});
        if (builder) {
            const {reducers: buildReducers, simpleMultiAction, simpleActions, simpleResetAction} = builder;
            this.buildReducers[uniqueKey] = buildReducers;
            this.actions[uniqueKey] = {set: simpleMultiAction, reset: simpleResetAction, ...simpleActions};

            this.buildReducers[uniqueKey] = buildReducers;

            this.store.replaceReducer(
                combineReducers({
                    ...this.buildReducers,
                }),
            );
        }
    }

    // initI18n(i18nOptions = {}) {
    //   i18nNext
    //     // https://github.com/i18next/i18next-browser-languageDetector
    //     .use(LanguageDetector)
    //     .use(initReactI18next)
    //     .init({
    //       // https://www.i18next.com/principles/fallback#language-fallback
    //       fallbackLng: this.defaultI18n, // 默认当前语言环境
    //       interpolation: {
    //         escapeValue: false, // escapes passed in values to avoid XSS injection, not needed for react as it escapes by default
    //       },
    //       // ns: Object.keys(zhCNResources),
    //       resources: this.i18nResources,
    //       detection: {
    //         caches: ["localStorage", "sessionStorage", "cookie"],
    //       },
    //       saveMissing: true,
    //       // extra props: updateMissing, options
    //       missingKeyHandler: (lngs, ns, key, fallbackValue) => {
    //         log({ module: "I18n", sketch: `missing i18n: ${lngs.join(",")}-${ns}-${key}, fallbackValue:${fallbackValue}`, type: "warn" });
    //       },
    //       ...i18nOptions,
    //     });

    //   this.i18nNext = i18nNext;
    //   return i18nNext;
    // }

    createStore() {
        Object.keys(this.staticReducers).forEach((key: string) => {
            const reducers = this.staticReducers[key];
            const builder = buildReducer({reducers, key, immer: this.immer});
            if (builder) {
                const {reducers: buildReducers, simpleMultiAction, simpleActions, simpleResetAction} = builder;
                this.buildReducers[key] = buildReducers;
                this.actions[key] = {set: simpleMultiAction, reset: simpleResetAction, ...simpleActions};
            }
        });

        const getPageSimpleActions = this.getPageSimpleActions.bind(this);

        if (!this.immer) {
            return createStore(
                combineReducers(this.buildReducers),
                applyMiddleware(
                    thunkMiddleware.withExtraArgument({
                        getPageState: Runtime.getPageState,
                        getPageSimpleActions,
                    }),
                ),
            );
        }

        const store = configureStore({
            reducer: this.buildReducers,
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware({
                    thunk: {
                        extraArgument: {
                            getPageState: Runtime.getPageState,
                            getPageSimpleActions,
                        },
                    },
                }),
            // enhancers:[
            //   () => createStore
            // ]
        });

        return store;
    }
}

export default Runtime;
