/*
 * @Author: zhangyu
 * @Date: 2022-10-30 12:03:04
 * @LastEditors: zhangyu
 * @LastEditTime: 2022-11-03 19:07:48
 * @Description:
 *
 */
import {Runtime, Extra} from '@gwaapp/ease';
import {AnyAction, ThunkAction} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import combiner, {login, index} from '@/features/combine';
// import zh from '@common/i18n/locales/zh.json';
// import en from '@common/i18n/locales/en.json';
// import es from '@common/i18n/locales/es.json';
import {mountWindowRuntime} from '@/common/utils/window';
import appReducers from './reducers';
import {i18nIns} from './i18n';
// import getResource from './getResource'; // 初始化runtime

export const runtime = new Runtime({
    pages: [...combiner, login, index],
    basename: '',
    i18n: i18nIns,
    defaultI18n: 'zh',
    appReducers,
    // i18nOptions: {
    //     ns: ['oc', 'common'],
    //     defaultNS: 'oc',
    // },
    // constructI18nResources: () => getResource(),
    // constructI18nResources: (defaultI18n, pageConfigs) => {
    //     const resources: I18nResources = {
    //         zh: {
    //             oc: {
    //                 common: zh,
    //             },
    //         },
    //         en: {
    //             oc: {
    //                 common: en,
    //             },
    //         },
    //         es: {
    //             oc: {
    //                 common: es,
    //             },
    //         },
    //     };
    //     pageConfigs.forEach(({key, i18n: pageI18n}) => {
    //         if (pageI18n) {
    //             Object.keys(pageI18n).forEach((i18nKey) => {
    //                 typeof resources[i18nKey] === 'undefined' &&
    //                     (resources[i18nKey] = {
    //                         oc: {},
    //                     });
    //                 resources[i18nKey].oc[key] = pageI18n[i18nKey];
    //             });
    //         }
    //     });
    //     return resources;
    // },
}); // const i18nObj = getResource();
// console.log(i18nObj, '<==============');
// runtime.i18nResources = getResource();

export const getPageSimpleActions = runtime.getPageSimpleActions.bind(runtime);
export const {getPageState} = runtime;
export const injectAsyncReducer = runtime.injectAsyncReducer.bind(runtime);
export const i18n = runtime.i18nNext; // 保留子系统的运行时

mountWindowRuntime('portal', runtime);
export type RootState = ReturnType<typeof runtime.store.getState>;
export type AppDispatch = typeof runtime.store.dispatch;
export type AppThunk<ReturnType = void | Promise<any>> = ThunkAction<
    ReturnType,
    RootState,
    Extra<RootState>,
    AnyAction
>;
export const useAppDispatch = () => useDispatch<any>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
