import { configureStore } from "@reduxjs/toolkit";
import i18nNext from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import type { Reducer } from "@reduxjs/toolkit";
import { buildReducer } from "./reducer";
import HistoryManager from "./HistoryManager";
import type { ActionsCache, Combiner, PageAction, PageConfig, Reducers } from "./types";

interface I18nResource {
  [key: string]: { [key: string]: { [key: string]: string } };
}

interface RuntimeConstructor {
  pages: PageConfig[];
  basename?: string;
  i18n?: I18nResource;
  defaultI18n?: string;
  appReducers?: Reducers;
  immer?: boolean;
}

const actions: ActionsCache = {};
const reducer: { [key: string]: Reducer } = {};

function getPageSimpleActions(id: string): PageAction;
function getPageSimpleActions(): ActionsCache;
function getPageSimpleActions(id?: string) {
  return id ? actions[id] : actions;
}

function getPageState(state: { [key: string]: any }, id: string) {
  return state[id];
}

function initI18n({ fallbackLng, resources }: { fallbackLng: string; resources: I18nResource }) {
  i18nNext
    // https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng, // 默认当前语言环境
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
      // ns: Object.keys(zhCNResources),
      resources,
      detection: {
        caches: ["localStorage", "sessionStorage", "cookie"],
      },
    });

  return i18nNext;
}

function createRuntime({
  pages,
  basename,
  i18n = { "zh-CN": {}, "en-US": {} },
  defaultI18n = "zh-CN",
  appReducers = {},
  immer = true,
}: RuntimeConstructor) {
  const reducerCombiner: Combiner = { app: appReducers, ...pages.reduce((prev, { key, reducers }) => ({ ...prev, [key]: reducers }), {}) };

  const historyManager = new HistoryManager({ featuresRoutes: pages.map((config) => config.route), basename });

  const i18nResources = i18n;

  const pageI18ns = pages.map((config) => ({ key: config.key, i18n: config.i18n }));
  pageI18ns.forEach(({ key, i18n: pageI18n }) => {
    if (pageI18n) {
      Object.keys(pageI18n).forEach((i18nKey) => {
        typeof i18nResources[i18nKey] === "undefined" && (i18nResources[i18nKey] = {});
        i18nResources[i18nKey][key] = pageI18n[i18nKey];
      });
    }
  });

  const i18nInstance = initI18n({ fallbackLng: defaultI18n, resources: i18nResources });

  Object.keys(reducerCombiner).forEach((key: string) => {
    const reducers = reducerCombiner[key];
    const builder = buildReducer({ reducers, key, immer });
    if (builder) {
      const { reducers: buildReducers, simpleMultiAction, simpleActions, simpleResetAction } = builder;
      reducer[key] = buildReducers;
      actions[key] = { set: simpleMultiAction, reset: simpleResetAction, ...simpleActions };
    }
  });

  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: {
            getPageState,
            getPageSimpleActions,
          },
        },
      }),
    // enhancers:[
    //   () => createStore
    // ]
  });

  return {
    basename,
    historyManager,
    i18nNext: i18nInstance,
    store,
    getPageSimpleActions,
    getPageState,
    actions,
  };
}

export default createRuntime;
