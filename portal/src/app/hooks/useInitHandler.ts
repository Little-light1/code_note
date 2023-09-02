import {useCallback, useMemo, useRef} from 'react';
import {logUnauthorizedAccess, removeAuth} from '@utils/auth';
import {clearSession} from '@/common/utils/storage';
import {SsoLoginKey, SsoLoginTypeKey} from '@common/init/configs';
import {TabInterface} from '@/features/index/header/tabs/types';
// import HistoryManager from '@/common/utils/route';
import {fetchLogout} from '@/services/login';
import {message} from 'antd';
import {generatePath} from 'react-router';
import {Events} from '@common/events';
import {report} from '@/common/utils/clientAction';
import {logError} from '@utils/logDatabase';
import _, {forEach} from 'lodash';
import {useMount} from 'ahooks';
import {runtime} from '../runtime';
import {
    // thunkInitLoginPics,
    thunkInit,
    thunkInitFrameConfigs,
    thunkInitCommonConfigs,
    thunkInitMenus, // thunkInitBiResources,
    thunkInitMenuResources,
    bootstrapMicro,
} from '../actions'; // import {useAppDispatch} from '../hooks';
// import store, {getPageSimpleActions, getPageState} from '../store';

import {BootstrapMicroProps, EventsCache} from '../types';
import {ActionTypes} from '../reducers'; // 注册app响应事件
import {i18nIns} from '../i18n';

const appEvents = {
    [Events.update_product_menus]: () =>
        runtime.store.dispatch(thunkInitMenus()),
    [Events.update_frame_configs]: () =>
        runtime.store.dispatch(thunkInitFrameConfigs()),
    [Events.update_frame_common]: () =>
        runtime.store.dispatch(thunkInitCommonConfigs()),
    [Events.update_menu_resources]: () =>
        runtime.store.dispatch(thunkInitMenuResources()),
}; // 事件枚举类
// const Events: (keyof EventsCache)[] = ['beforeClose', 'afterClose', 'beforeRefresh', 'afterRefresh'];
// 初始化

export const useInitHandler = () => {
    const {historyManager} = runtime;
    const {dispatch} = runtime.store;
    const indexActions = runtime.getPageSimpleActions('index');
    const tab = useRef<null | TabInterface>(null); // beforeClose: {}, afterClose: {}, beforeRefresh: {}, afterRefresh: {}

    const eventsCache = useRef<EventsCache>({}); // 权限页面跳转
    const {t} = i18nIns;

    const openPage = useCallback(
        ({key, params = {}, search = {}, options = {}, path, state}) => {
            const {flatMenuMapByPath, flatMenuMapById} =
                runtime.store.getState().app; // 组装成完整的地址

            if (params && Object.keys(params)) {
                path = generatePath(path, params);
            }

            if (
                flatMenuMapByPath[path] ||
                (search?.menuId &&
                    path === '/iframeOpen' &&
                    flatMenuMapById[search.menuId])
            ) {
                historyManager.pushPath({
                    key,
                    params,
                    search,
                    options,
                    path,
                    state,
                });
            } else {
                // 记录越权行为
                logUnauthorizedAccess(path).then(() => {
                    console.log('越权记录成功');
                });
                message.warning(t('没有访问权限，请联系管理员'));
            }
        },
        [historyManager, t],
    ); // 微应用装载成功

    const bootstrap = useCallback(
        (props: BootstrapMicroProps) => dispatch(bootstrapMicro(props)),
        [dispatch],
    ); // Tab关闭拦截

    const beforeCloseTab = useCallback((routePath: string) => {
        if (
            eventsCache.current.beforeClose &&
            eventsCache.current.beforeClose[routePath]
        ) {
            return eventsCache.current.beforeClose[routePath]();
        }

        return Promise.resolve();
    }, []); // Tab关闭回调

    const afterCloseTab = useCallback((routePath: string) => {
        eventsCache.current.afterClose &&
            eventsCache.current.afterClose[routePath] &&
            eventsCache.current.afterClose[routePath]();
    }, []); // Tab刷新

    const afterRefreshTab = useCallback((routePath: string) => {
        if (
            eventsCache.current.afterRefresh &&
            eventsCache.current.afterRefresh[routePath]
        ) {
            return eventsCache.current.afterRefresh[routePath]();
        }

        return Promise.resolve();
    }, []); // Tab刷新拦截

    const beforeRefreshTab = useCallback((routePath: string) => {
        if (
            eventsCache.current.beforeRefresh &&
            eventsCache.current.beforeRefresh[routePath]
        ) {
            return eventsCache.current.beforeRefresh[routePath]();
        }

        return Promise.resolve();
    }, []); // 事件注册

    const register = useCallback(
        (
            key: string,
            handler: () => void | Promise<void>,
            type: keyof EventsCache,
        ) => {
            if (typeof eventsCache.current[type] === 'undefined') {
                eventsCache.current[type] = {};
            }

            if (typeof eventsCache.current[type][key] !== 'undefined') {
                // eslint-disable-next-line no-console
                console.warn(
                    `事件被替换：类型[${type}] , 路由地址/唯一键值[${key}]`,
                );
            }

            eventsCache.current[type][key] = handler;
        },
        [],
    ); // 取消注册

    const deregister = useCallback((key: string, type: keyof EventsCache) => {
        if (eventsCache.current[type] && eventsCache.current[type][key]) {
            delete eventsCache.current[type][key];
        }
    }, []);

    /**
     * 触发事件
     * @param type 事件类型
     * @param key 精准触发，一般不需要
     * @param props 需要传递的参数，一般不需要，但是注意如果要传递 key要给定undefined
     */
    const trigger = useCallback((type: keyof EventsCache, props?: any) => {
        if (typeof type === 'undefined') {
            // eslint-disable-next-line no-console
            console.error(`事件触发：类型[${type}] , 请提供事件类型.`);
            return;
        }

        const events = eventsCache.current[type];

        if (typeof events === 'undefined') {
            // eslint-disable-next-line no-console
            console.warn(`事件触发：类型[${type}] , 该事件类型下没有注册事件.`);
            return;
        }

        // 触发所有该类型事件
        Object.keys(events).forEach((k) => events[k](props));
    }, []); // 记录micro页面状态

    const setMicroPageStatus = useCallback(
        (
            appId: string,
            status: {
                [key: string]: any;
            },
        ) => {
            dispatch({
                type: ActionTypes.UpdateImmerMicroPageStatus,
                payload: {
                    [appId]: status,
                },
            });
        },
        [dispatch],
    ); // 获取micro页面状态

    const getMicroPagesStatus = useCallback((appId) => {
        const {microPageStatus} = runtime.getPageState(
            runtime.store.getState(),
            'app',
        );
        return microPageStatus[appId] || {};
    }, []); // 登出

    const logout = useCallback(
        _.throttle(
            (__, socket) => {
                fetchLogout().then(() => {
                    // 退出socket连接
                    if (socket) {
                        socket.close();
                    }

                    removeAuth(); // 清理

                    clearSession(); // 清理状态，以免业务逻辑中存在事后设置状态的场景，将清理逻辑放到下一个事件循环

                    trigger('logout');
                    const isSsoLogin = Boolean(
                        localStorage.getItem(SsoLoginKey) === 'true',
                    );
                    const ssoLoginType = localStorage.getItem(SsoLoginTypeKey);
                    const portalPath =
                        window.aappAmbariConfigs.aapp_gateway_path;
                    setTimeout(() => {
                        if (!isSsoLogin) {
                            // 解决多语言静态定义失效的问题，直接采取刷新界面手段
                            // 原则上上述的"logout"事件也没有必要触发了
                            window.location.reload();
                        } else {
                            window.location.replace(
                                `${portalPath}/aapp-portal/aapp/sso/logout/${ssoLoginType}`,
                            );
                        }
                        // const allActions = runtime.getPageSimpleActions();
                        // Object.values(allActions).forEach(({reset}) =>
                        //     dispatch(reset()),
                        // ); // 重新初始化未授权系统信息

                        // dispatch(
                        //     thunkInit({
                        //         routes: historyManager.routeDictByPath,
                        //     }),
                        // );
                        // historyManager?.pushPath({
                        //     key: 'login',
                        // }); // 分发事件

                        // trigger('logout');
                    });
                });
            },
            1000 * 5,
            {
                trailing: false,
            },
        ),
        [dispatch, historyManager, runtime, trigger],
    ); // 全屏

    const enterFullScreen = useCallback(() => {
        dispatch(
            indexActions.set({
                siderCollapsed: true,
                headerVisible: false,
            }),
        );
    }, [dispatch, indexActions]); // 退出全屏

    const exitFullScreen = useCallback(() => {
        dispatch(
            indexActions.set({
                siderCollapsed: false,
                headerVisible: true,
            }),
        );
    }, [dispatch, indexActions]); // 注册全局响应事件

    useMount(() => {
        Object.keys(appEvents).forEach((eventKey) => {
            register('portal', appEvents[eventKey], eventKey);
        });
    }); // 全局handlers

    const handlers = useMemo(
        () => ({
            report,
            logError,
            openPage,
            logout,
            bootstrap,
            beforeCloseTab,
            afterCloseTab,
            afterRefreshTab,
            beforeRefreshTab,
            register,
            deregister,
            trigger,
            enterFullScreen,
            exitFullScreen,
            tab,
            history: historyManager,
            micro: {
                setPageStatus: setMicroPageStatus,
                getPageStatus: getMicroPagesStatus,
            },
        }),
        [
            openPage,
            logout,
            bootstrap,
            beforeCloseTab,
            afterCloseTab,
            afterRefreshTab,
            beforeRefreshTab,
            register,
            deregister,
            trigger,
            enterFullScreen,
            exitFullScreen,
            historyManager,
            setMicroPageStatus,
            getMicroPagesStatus,
        ],
    );
    return {
        tab,
        handlers,
    };
};
