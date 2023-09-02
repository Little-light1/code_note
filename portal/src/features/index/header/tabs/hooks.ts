import _ from 'lodash';
import {
    MutableRefObject,
    useCallback,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import {useMount, useGetState, useUnmount} from 'ahooks';
import {useLocation} from 'react-router-dom';
import ReactDOM from 'react-dom';
import {useAction} from '@gwaapp/ease';
import {getSession, setSession} from '@/common/utils/storage'; // import {pathToRegexp} from 'path-to-regexp';
import {message} from 'antd';
import {SessionTabs, Tab, UseTabsProps} from './types';
import {SESSION_TABS_KEY} from './constant';
import {createTab, getUniqueKey, isUnauthorizedAccess} from './helper';

export function useTabs({
    flatMenuMapById,
    localRoutes,
    onLocationChangeCallback,
    tab: tabRef,
    getTabUniqueKey,
    t,
}: UseTabsProps) {
    const historyTrackRef = useRef<string[]>([]);
    const latestTrackRef = useRef<string | null>(null);
    const mountedRef = useRef(false);
    const loopIntervalRef = useRef<NodeJS.Timer>();
    const {
        historyManager: history,
        handlers: {
            beforeCloseTab,
            afterCloseTab,
            afterRefreshTab,
            beforeRefreshTab,
        },
    } = useAction();
    const [tabs, setTabs, getTabs] = useGetState<Tab[]>([]);
    const [activeTab, setActiveTab, getActiveTab] = useGetState<Tab | null>(
        null,
    );
    const location = useLocation();
    const setActiveTabHandler = useCallback(
        (tab: Tab | null) => {
            setActiveTab(tab);
        },
        [setActiveTab],
    );
    const setTabsHandler = useCallback(
        (tempTabs: Tab[]) => {
            const cloneTabs = _.cloneDeep(tempTabs);
            // 保留20个tabs
            setTabs(cloneTabs.reverse().splice(0, 20).reverse());
        },
        [setTabs],
    ); // 关闭前确认

    const confirmIsClose = useCallback(
        (ready2CloseTabs: Tab[]) =>
            new Promise<void>((resolve, reject) => {
                Promise.all(ready2CloseTabs.map(({key}) => beforeCloseTab(key)))
                    .then(() => {
                        resolve();
                    })
                    .catch((error) => reject(error));
            }),
        [beforeCloseTab],
    ); // 关闭后回调

    const closeCallback = useCallback(
        (closedTabs: Tab[]) => {
            closedTabs.forEach(({key}) => afterCloseTab(key));
        },
        [afterCloseTab],
    ); // 创建Tab

    const getTab = useCallback(
        ({pathname, search = ''}) => {
            // 默认以pathname&search为uniqueKey定义Tab
            const uniqueTabKey = getUniqueKey({
                pathname,
                search,
                getTabUniqueKey,
            }); // 查找是否存在已有的,这里用唯一key值做判断

            const currentTabs = getTabs();
            const tab = currentTabs.find((sTab) => sTab.key === uniqueTabKey);

            if (tab) {
                return {
                    tab,
                    tabs: currentTabs,
                };
            } // 首页返回null

            if (pathname === '/') {
                return {
                    tab: null,
                    tabs: currentTabs,
                };
            } // 不存在已有，创建新的Tab

            const newTab = createTab({
                flatMenuMapById,
                localRoutes,
                pathname,
                search,
                getTabUniqueKey,
            });
            return {
                tab: newTab,
                tabs: [...currentTabs, newTab],
            };
        },
        [flatMenuMapById, getTabUniqueKey, getTabs, localRoutes],
    ); // 记录路由栈信息

    const recordTrack = useCallback((path: string) => {
        const historyTrack = historyTrackRef.current;
        const latestTrack = historyTrack.length
            ? historyTrack[historyTrack.length - 1]
            : null;

        if (!latestTrack) {
            historyTrack.push(path);
            return;
        } // 相同的地址不重复触发

        if (_.trim(latestTrack) === _.trim(path)) {
            return;
        }

        latestTrackRef.current = latestTrack;
        historyTrack.push(path);
    }, []); // 关闭标签

    const closeTab = useCallback(
        async (tab: Tab) => {
            const {path} = tab;

            try {
                await confirmIsClose([tab]);
                const {pushPath} = history;
                const historyTrack = historyTrackRef.current;

                _.remove(tabs, (t) => t.path === path);

                _.remove(historyTrack, (tabPath) => tabPath === path);

                let tempActiveTab = activeTab;
                let readyJump = null; // 如果关闭当前活跃菜单，需要跳转

                if (activeTab && path === activeTab.path) {
                    // 跳转的上一个历史界面
                    if (historyTrack.length) {
                        readyJump = historyTrack[historyTrack.length - 1];
                        const splitUrl =
                            historyTrack[historyTrack.length - 1].split('?');
                        const pathname = splitUrl[0];
                        let search = '';

                        if (splitUrl.length > 1) {
                            search = `?${splitUrl[1]}`;
                        }

                        tempActiveTab = createTab({
                            flatMenuMapById,
                            localRoutes,
                            pathname,
                            search,
                            getTabUniqueKey,
                        });
                    } // 没有历史界面，需要跳转首页
                    else {
                        readyJump = '/';
                        tempActiveTab = null;
                    }
                } // 重新记录结果

                setSession(SESSION_TABS_KEY, {
                    tabs,
                    activeTab: tempActiveTab,
                }); // 重新设置当前Tabs

                setTabsHandler([...tabs]);
                setActiveTabHandler(tempActiveTab);
                readyJump &&
                    pushPath({
                        path: readyJump,
                    });
                closeCallback([tab]);
            } catch (error: any) {
                // eslint-disable-next-line no-console
                console.warn(`Cancel the closing TAB: ${error.message}`);
                throw error;
            }
        },
        [
            confirmIsClose,
            history,
            tabs,
            activeTab,
            setTabsHandler,
            setActiveTabHandler,
            closeCallback,
            flatMenuMapById,
            localRoutes,
            getTabUniqueKey,
        ],
    ); // 关闭所有标签

    const closeAllTab = useCallback(async () => {
        const {pushPath} = history;

        try {
            await confirmIsClose(getTabs()); // 回到首页

            pushPath({
                path: '/',
            }); // 生成首页Tab

            setActiveTabHandler(null); // 清空历史记录

            historyTrackRef.current = []; // 清空session记录

            setSession(SESSION_TABS_KEY, {
                tabs: [],
                activeTab: null,
            }); // 删除非活跃菜单

            setTabsHandler([]);
            confirmIsClose(getTabs());
        } catch (error) {
            console.log('close cancel');
        }
    }, [confirmIsClose, getTabs, history, setActiveTabHandler, setTabsHandler]); // 关闭其它标签

    const closeOtherTabs = useCallback(
        async (path) => {
            const {pushPath} = history;
            const historyTrack = historyTrackRef.current;

            try {
                const removedTabs = _.remove(
                    [...tabs],
                    (tab) => tab.path !== path,
                );

                await confirmIsClose(removedTabs);

                _.remove(tabs, (tab) => tab.path !== path);

                _.remove(historyTrack, (tabPath) => tabPath !== path);

                let tempActiveTab: undefined | Tab | null = activeTab; // 基于其它Tab,关闭了当前活跃Tab；将基准Tab设置为活跃

                if (activeTab && path !== activeTab.path) {
                    tempActiveTab = tabs.find((tab) => tab.path === path);
                    pushPath({
                        path: tempActiveTab!.path,
                    });
                    setActiveTabHandler(tempActiveTab!);
                }

                setSession(SESSION_TABS_KEY, {
                    tabs,
                    activeTab: tempActiveTab,
                }); // 删除非活跃菜单

                setTabsHandler([...tabs]);
                confirmIsClose(removedTabs);
            } catch (error) {
                console.log('close cancel');
            }
        },
        [
            activeTab,
            confirmIsClose,
            history,
            setActiveTabHandler,
            setTabsHandler,
            tabs,
        ],
    ); // 关闭左/右侧菜单

    const closeDirectionTabs = useCallback(
        async (path, direction = 'left') => {
            const {pushPath} = history;
            const historyTrack = historyTrackRef.current;
            const fountIndex = tabs.findIndex((tab) => tab.path === path);
            let newTabs: Tab[] = [];
            const ready2CloseTabs = [...tabs];

            if (direction === 'left') {
                newTabs = ready2CloseTabs.splice(
                    fountIndex,
                    tabs.length - fountIndex,
                );
            } else {
                newTabs = ready2CloseTabs.splice(0, fountIndex + 1);
            }

            try {
                await confirmIsClose(ready2CloseTabs);

                _.remove(historyTrack, (tabPath) =>
                    tabs.map((tab) => tab.path).includes(tabPath),
                );

                let tempActiveTab: undefined | Tab | null = activeTab; // 基于其它Tab,关闭了当前活跃Tab；将基准Tab设置为活跃

                if (
                    activeTab &&
                    tabs.map((tab) => tab.path).includes(activeTab.path)
                ) {
                    tempActiveTab = newTabs.find((tab) => tab.path === path);
                    pushPath({
                        path: tempActiveTab!.path,
                    });
                    setActiveTabHandler(tempActiveTab!);
                }

                setSession(SESSION_TABS_KEY, {
                    tabs: newTabs,
                    activeTab: tempActiveTab,
                }); // 删除非活跃菜单

                setTabsHandler([...newTabs]);
                confirmIsClose(ready2CloseTabs);
            } catch (error) {
                console.log('close cancel');
            }
        },
        [
            activeTab,
            confirmIsClose,
            history,
            setActiveTabHandler,
            setTabsHandler,
            tabs,
        ],
    ); // 地址变更创建tab

    const onLocationChange = useCallback(
        ({pathname, search}) => {
            const locationPath = `${pathname}${search}`;
            const {tab, tabs: currentTabs} = getTab({
                pathname,
                search,
            });

            // 越权访问
            const isUnauthorized = isUnauthorizedAccess(tab, flatMenuMapById);
            if (isUnauthorized) {
                message.warning(t('没有访问权限，请联系管理员'));
                // 回退到上一个页面
                const {back} = history;
                back();
                return;
            }

            // 记录路由路线信息
            recordTrack(locationPath);
            const prevTab = getActiveTab();
            setActiveTabHandler(tab);
            setSession(SESSION_TABS_KEY, {
                tabs: currentTabs,
                activeTab: tab,
            });
            setTabsHandler(currentTabs);
            onLocationChangeCallback && onLocationChangeCallback(tab, prevTab);
        },
        [
            getTab,
            recordTrack,
            getActiveTab,
            setActiveTabHandler,
            setTabsHandler,
            onLocationChangeCallback,
        ],
    ); // 刷新tab

    const refreshTab = useCallback(
        async (path: string) => {
            try {
                // 关闭确认
                await beforeRefreshTab(path); // 关闭

                afterRefreshTab(path);
            } catch (error: any) {
                // eslint-disable-next-line no-console
                console.warn(`Cancel the refreshing TAB: ${error.message}`);
            }
        },
        [afterRefreshTab, beforeRefreshTab],
    ); // 自动切换

    const startLoop = useCallback(
        (timeInterval = 3000) => {
            loopIntervalRef.current = setInterval(() => {
                const currentTabs = getTabs();
                const currentActiveTab = getActiveTab();

                if (currentTabs.length <= 1) {
                    return;
                }

                const findTabIndex = currentTabs.findIndex(
                    ({key}) => key === currentActiveTab?.key,
                );
                let nextTabIndex = findTabIndex + 1;

                if (nextTabIndex >= currentTabs.length) {
                    nextTabIndex = 0;
                }

                const {path, search} = currentTabs[nextTabIndex];
                history.pushPath({
                    search,
                    path,
                });
            }, timeInterval);
        },
        [getActiveTab, getTabs, history],
    );
    const stopLoop = useCallback(() => {
        window.clearInterval(Number(loopIntervalRef.current));
    }, []);
    useEffect(() => {
        if (mountedRef.current) {
            // const currentActiveTab = getActiveTab();
            // const {pathname, search} = location;
            // const locationPath = `${pathname}${search}`;
            // // 地址没有发生变化
            // if (currentActiveTab && locationPath === currentActiveTab.path.trim()) {
            //     return;
            // }
            onLocationChange(location);
        }
    }, [location, onLocationChange]); // 初始化

    useMount(() => {
        mountedRef.current = true; // 缓存信息

        const sessionTabs = getSession<SessionTabs>(SESSION_TABS_KEY);
        let tempTab = null;

        const {pathname, search} = location;

        // 存在历史记录
        if (toString.call(sessionTabs) === '[object Object]') {
            const {tabs: sTabs = [], activeTab: sActiveTab = null} =
                sessionTabs as SessionTabs; // 跳转到历史记录
            // 过滤有权限菜单
            const mfiltedTabs = sTabs.filter(
                (app) =>
                    app.meniId && flatMenuMapById[app.meniId] !== undefined,
            );
            setSession(SESSION_TABS_KEY, {
                tabs: mfiltedTabs || [],
                activeTab: sActiveTab,
            }); // 重新设置当前Tabs
            // 存在历史活跃界面
            if (sActiveTab) {
                // 不为初始界面，用户直接通过url输入地址访问
                if (pathname !== '/') {
                    const {tab} = getTab({
                        pathname,
                        search,
                    });

                    if (tab) {
                        history.pushPath({
                            path: tab.path,
                        });
                        historyTrackRef.current = [tab.path];
                        setActiveTabHandler(tab);
                        if (
                            mfiltedTabs.filter((app) => app.path === tab.path)
                        ) {
                            setTabsHandler(mfiltedTabs);
                        } else {
                            mfiltedTabs.concat([tab]);
                        }
                        tempTab = tab;
                    }
                } else {
                    // 不为初始界面，跳转到历史界面
                    if (sActiveTab.path !== '/') {
                        history.pushPath({
                            path: sActiveTab.path,
                        });
                    }

                    setActiveTabHandler(sActiveTab);
                    setTabsHandler(mfiltedTabs);
                    // 恢复历史队列
                    historyTrackRef.current = mfiltedTabs.map(
                        (sTab) => sTab.path,
                    );
                    tempTab = sActiveTab;
                }
            }
            // 不存在历史记录（该场景下历史队列一定为空）
            else {
                // 不为初始界面，用户直接通过url输入地址访问
                if (pathname !== '/') {
                    const {tab} = getTab({
                        pathname,
                        search,
                    });

                    if (tab) {
                        historyTrackRef.current = [tab.path];
                        setActiveTabHandler(tab);
                        setTabsHandler([tab]);
                        tempTab = tab;
                    }
                }
            }
        }
        // 没有记录
        else {
            const {tab} = getTab({
                pathname,
                search,
            });

            if (tab) {
                historyTrackRef.current = [tab.path];
                setActiveTabHandler(tab);
                setTabsHandler([tab]);
                tempTab = tab;
            }
        }

        // 越权访问
        const isUnauthorized = isUnauthorizedAccess(tempTab, flatMenuMapById);
        if (isUnauthorized) {
            message.warning(t('没有访问权限，请联系管理员'));
            // 回退到上一个页面
            const {back} = history;
            back();
            back();
            return;
        }

        onLocationChangeCallback && onLocationChangeCallback(tempTab);
    });
    useUnmount(() => {
        window.clearInterval(Number(loopIntervalRef.current));
    });
    // 暴露api
    useImperativeHandle(tabRef, () => ({
        // 获取当前Tab
        getActive: getActiveTab,
        // 关闭Tab
        closeTab: async (path?: string) => {
            let tempTab = null;

            if (typeof path === 'undefined') {
                tempTab = getActiveTab();
            } else {
                tempTab = _.find(tabs, (item) => item.path === path);
            }

            if (tempTab) {
                return closeTab(tempTab);
            }

            return Promise.resolve();
        },
        // 修改当前Tab名称
        modifyTabTitle: (path: string, title: string) => {
            const currentTabs = getTabs();
            const foundTab = currentTabs.find((tab) => path === tab.path);

            if (foundTab && title) {
                foundTab.title = title;
                setTabs([...currentTabs]);
            }
        },
        // 获取当前路由链路
        getHistory: () => historyTrackRef.current,
        // 获取上一个页面地址
        getLatestHistory: () => latestTrackRef.current,
        // 开始循环轮播
        startLoop,
        stopLoop,
    }));
    return {
        historyTrackRef,
        tabs,
        activeTab,
        refreshTab,
        closeTab,
        closeAllTab,
        closeOtherTabs,
        closeDirectionTabs,
        setActiveTab: setActiveTabHandler,
    };
}
export function useTabLocation({
    tabElement,
    tabs,
    activeTab,
    setActiveTab,
}: {
    tabElement: MutableRefObject<Element | null>;
    tabs: Tab[];
    activeTab: Tab | null;
    setActiveTab: (tab: Tab) => void;
}) {
    const {historyManager} = useAction(); // 移动

    const moveToTab = useCallback(
        (tab, onlyMove = false) => {
            // eslint-disable-next-line react/no-find-dom-node
            const tabContainer = ReactDOM.findDOMNode(tabElement.current);
            if (!tabContainer || !(tabContainer instanceof Element)) return;
            const activeTabElement = tabContainer.querySelector(
                `[data-tab="${tab.path}"]`,
            ) as HTMLElement;
            if (!activeTabElement) return;
            tabContainer.scrollTo(activeTabElement.offsetLeft - 10, 0);
            setActiveTab(tab);
            !onlyMove &&
                historyManager.pushPath({
                    path: tab.path,
                });
        },
        [tabElement, setActiveTab, historyManager],
    );
    const move = useCallback(
        (offsetLeft = 50) => {
            // eslint-disable-next-line react/no-find-dom-node
            const tabContainer = ReactDOM.findDOMNode(tabElement.current);
            if (!tabContainer || !(tabContainer instanceof Element)) return;
            tabContainer.scrollTo(tabContainer.scrollLeft - offsetLeft, 0);
        },
        [tabElement],
    ); // 处理tab聚焦

    useLayoutEffect(() => {
        if (!activeTab || !tabElement.current) return; // 仅仅处理聚焦, 如果通过地址栏直接输入&正常js逻辑跳转

        moveToTab(activeTab, true);
    }, [tabs, activeTab, tabElement, move, moveToTab]); // 向前

    const forward = useCallback(() => {
        if (!activeTab) return;
        const foundIndex = tabs.findIndex((tab) => tab.path === activeTab.path);

        if (foundIndex > 0) {
            moveToTab(tabs[foundIndex - 1]);
        }
    }, [activeTab, moveToTab, tabs]); // 向后

    const backward = useCallback(() => {
        if (!activeTab) return;
        const foundIndex = tabs.findIndex((tab) => tab.path === activeTab.path);

        if (foundIndex < tabs.length - 1) {
            moveToTab(tabs[foundIndex + 1]);
        }
    }, [activeTab, moveToTab, tabs]);
    return {
        move,
        forward,
        backward,
    };
} // 受控tooltip

export function useTooltip({tabs}: {tabs: Tab[]}) {
    const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);
    useLayoutEffect(() => {
        setTooltipVisible(null);
    }, [tabs.length]);
    const onTooltipVisibleChange = useCallback((key, visible) => {
        if (!visible) {
            setTooltipVisible(null);
            return;
        }

        setTooltipVisible(key);
    }, []);
    return {
        tooltipVisible,
        onTooltipVisibleChange,
    };
}
