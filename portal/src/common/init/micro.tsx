import {
    registerMicroApps,
    start as startQiankun,
    addGlobalUncaughtErrorHandler,
    initGlobalState as initQiankunGlobalState,
    MicroAppStateActions,
    runAfterFirstMounted,
    FrameworkConfiguration,
} from 'qiankun'; // import {closeGlobalMask, openGlobalMask} from '@components/modal';

import {Store} from 'redux';
import {report} from '@/common/utils/clientAction';
// import {logError} from '@utils/logDatabase';
import {MicroContainerDomID} from '@common/init/configs';
import {Tab} from '@/features/index/header/tabs/types';
import axios from 'axios';
import {t} from 'i18next';

const loader = (loading: boolean) => {
    // eslint-disable-next-line no-console
    // console.log(loading);
};

// eslint-disable-next-line no-underscore-dangle
window.__STARTED_BY_QIANKUN__ = false; // 注册全局错误处理

addGlobalUncaughtErrorHandler((event) => {
    // TODO: event类型不确定，event.reason？
    // eslint-disable-next-line no-console
    console.error(event);
}); // 增加延时处理

const raceFetch = (url: URL | RequestInfo, timeout: number) => {
    const controller = new AbortController();
    const signal = controller.signal;

    const timeoutPromise = (t: number) =>
        new Promise((resolve) => {
            setTimeout(() => {
                resolve(
                    new Response('timeout', {
                        status: 504,
                        statusText: 'timeout ',
                    }),
                );
                controller.abort();
            }, t);
        });

    const requestPromise = (u: URL | RequestInfo) =>
        fetch(u, {
            signal,
        });

    return new Promise<Response>((resolveRace, rejectRace) => {
        Promise.race([timeoutPromise(timeout), requestPromise(url)])
            .then((resp) => {
                // const {status} = resp;
                // if (status === 504) {
                //     rejectRace(resp);
                // }
                resolveRace(resp as Response | PromiseLike<Response>);
            })
            .catch((error) => {
                rejectRace(error);
            });
    });
};

interface App {
    name: string;
    entry: string;
    activeRule: string;
}
interface MicroControllerProps {
    apps: App[];
    store: Store;
    handlers: {
        [key: string]: (props: any) => void;
    };
    tab: Tab;
    onUpdate: (names: string[]) => void;
}

class MicroController {
    apps: App[];

    store: Store;

    tab: Tab;

    handlers: {
        [key: string]: (props: any) => void;
    };

    actions: MicroAppStateActions | null;

    isFirstMounted: boolean;

    timeout: number;

    monitorVersionTimeout: number;

    options: FrameworkConfiguration;

    versions: {
        [key: string]: string;
    };

    onUpdate: (names: string[]) => void;

    constructor({apps, store, handlers, tab, onUpdate}: MicroControllerProps) {
        this.apps = apps;
        this.store = store;
        this.actions = null;
        this.handlers = handlers;
        this.tab = tab;
        this.isFirstMounted = false;
        this.timeout = 20 * 1000; // 默认20s

        this.monitorVersionTimeout = 60 * 1000; // 监听版本间隔

        this.versions = {};
        this.onUpdate = onUpdate;
        this.options = {
            fetch: (url) => raceFetch(url, this.timeout),
        };
        this.register();
        runAfterFirstMounted(this.runAfterFirstMounted.bind(this));
    }

    runAfterFirstMounted() {
        this.isFirstMounted = true;
    }

    register() {
        const {getState} = this.store;
        const {userInfo} = getState().app;
        const props = {
            userInfo,
            handlers: this.handlers,
            tab: this.tab,
        };
        const apps = this.apps.map((app) => ({
            ...app,
            container: `#${MicroContainerDomID}`,
            loader,
            props,
        }));
        registerMicroApps(apps, {
            beforeLoad: (app) => {
                // 加载微应用前，加载进度条
                // NProgress.start();
                report.action({
                    action: 'beforeLoadApp',
                    id: 'beforeLoadApp',
                    desc: t('开始装载{{name}}应用资源', {
                        name: app.name,
                    }),
                });
                return Promise.resolve();
            },
            beforeMount: (app) => {
                // const {container, frame} = app;
                // // 处理框架样式
                // if (container) {
                //   const frameContainer = document.querySelector(app.container);
                //   const clientHeight = frameContainer.clientHeight;
                //   const clientWidth = frameContainer.clientWidth;
                //   if (frameContainer) {
                //     if (frame && frame.height && frame.width) {
                //       const scaleX = Math.floor((clientWidth / frame.width) * 100) / 100;
                //       const scaleY = Math.floor((clientHeight / frame.height) * 100) / 100;
                //       frameContainer.style.height = `${frame.height}px`;
                //       frameContainer.style.width = `${frame.width}px`;
                //       const children = frameContainer.querySelector('div');
                //       // const scale =
                //       //   clientWidth / clientHeight < frame.height / frame.width ? clientWidth / frame.width : clientHeight / frame.height;
                //       const scale = Math.min(scaleX, scaleY);
                //       // children.style.transform = `scale(${scaleX, scaleY})`;
                //       children.style.transform = `scale(${scale})`;
                //       children.style.transformOrigin = '0 0';
                //     }
                //   }
                // }
                report.action({
                    action: 'beforeMountApp',
                    id: 'beforeMountApp',
                    desc: t('开始挂载{{name}}应用', {
                        name: app.name,
                    }),
                });
                return Promise.resolve();
            },
            afterMount: (app) => {
                report.action({
                    action: 'afterMountApp',
                    id: 'afterMountApp',
                    desc: t('完成挂载{{name}}应用', {
                        name: app.name,
                    }),
                }); // 加载微应用前，进度条加载完成

                return Promise.resolve();
            },
            beforeUnmount: (app) => {
                report.action({
                    action: 'beforeUnMountApp',
                    id: 'beforeUnMountApp',
                    desc: t('开始卸载{{name}}应用', {
                        name: app.name,
                    }),
                });
                return Promise.resolve();
            },
            afterUnmount: (app) => {
                report.action({
                    action: 'afterUnMountApp',
                    id: 'afterUnMountApp',
                    desc: t('完成卸载{{name}}应用', {
                        name: app.name,
                    }),
                });
                return Promise.resolve();
            },
        });
    } // eslint-disable-next-line class-methods-use-this

    initGlobalState(state: any) {
        // 初始化 state
        const actions: MicroAppStateActions = initQiankunGlobalState(state);
        this.actions = actions;
        return actions;
    } // 监听子系统版本

    monitorAppsVersion() {
        const apps = this.apps;
        setTimeout(() => {
            Promise.allSettled(
                apps.map(({entry}) =>
                    axios.get(`${entry}/version.json?${new Date().getTime()}`, {
                        timeout: this.timeout,
                    }),
                ),
            ).then((results) => {
                const updateApps: Record<
                    string,
                    {
                        from: string;
                        to: string;
                    }
                > = {};
                results.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        const name = apps[index].name as string;

                        if (typeof this.versions[name] === 'undefined') {
                            this.versions[name] = result.value.data.version;
                        } else {
                            if (
                                this.versions[name] !==
                                result.value.data.version
                            ) {
                                updateApps[name] = {
                                    from: this.versions[name],
                                    to: result.value.data.version,
                                };
                            }
                        }
                    }
                }); // 存在变化版本

                if (Object.keys(updateApps).length && this.onUpdate) {
                    console.warn(
                        `子系统发生变化:${JSON.stringify(updateApps)}`,
                    );
                    this.onUpdate(Object.keys(updateApps));
                } // 再次监听

                this.monitorAppsVersion();
            });
        }, this.monitorVersionTimeout);
    } // eslint-disable-next-line class-methods-use-this

    start(options: FrameworkConfiguration, isStartRightNow: boolean) {
        // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
        const _options = {...this.options, ...options};

        if (isStartRightNow) {
            startQiankun(_options);
            this.monitorAppsVersion();
        } else {
            const startIf = () => {
                const container = document.getElementById(MicroContainerDomID);

                if (container) {
                    startQiankun(_options);
                    return;
                }

                setTimeout(startIf, 100);
            };

            startIf();
        } // // eslint-disable-next-line no-underscore-dangle
        // if (!window.__STARTED_BY_QIANKUN__) {
        //     const startIf = () => {
        //         const container = document.getElementById(MicroContainerDomID);
        //         if (container) {
        //             startQiankun(options);
        //             return;
        //         }
        //         setTimeout(startIf, 500);
        //     };
        //     startIf();
        // } else {
        //     console.log('[LifeCycle] micro apps have already started.');
        // }
    }
}

export default MicroController;
