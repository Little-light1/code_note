/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from 'axios';
import React from 'react';
import {FrameworkConfiguration, MicroAppStateActions} from 'qiankun';
import {
    fetchMenuTree,
    fetchUserAllBiMenuSource,
    fetchUserMenuSource,
} from '@services/resource';
import {fetchIndexPicListNoAuth} from '@services/system_configs';
import {fetchSelf} from '@services/login';
import {fetchCommonConfig, fetchFrameConfig} from '@services/frame_config';
import {fetchImageUrlMap, getPreviewImageUrl} from '@services/file';
// import {newMsgNum} from '@services/notice_center';
import {fetchDictModelVOPageByTypeCode} from '@services/data_dict_config';
import {utils} from '@components/tree';
import {editBrowserIcon} from '@utils/icon';
import {sortByKey} from '@utils/sort';
import {message, notification} from 'antd';
import {clearSession, setLocal} from '@/common/utils/storage';
import {removeAuth} from '@/common/utils/auth';
import {thunkGetShortcutMenuDTOByUserId} from '@/features/index/actions';
import {RichRoute} from '@gwaapp/ease';
import {AppThunk} from '@/app/runtime';
import MicroController from '@/common/init/micro';
import {getStaticConfigs} from '@/common/init/configs';
import type {OnLocationChangeProps, BootstrapMicroProps} from '@/app/types';
import {mountWindowRuntime} from '@/common/utils/window';
import {report} from '@/common/utils/clientAction';
import {i18nIns} from '@/app/i18n';
import {APPLICATION} from '@common/constant';

const {t} = i18nIns;

let microActions: MicroAppStateActions | null = null;

const {tree2Flat, loopToAntdTreeData} = utils;

// ----------------------------非授权信息----------------------------

/**
 * 初始化登录图片
 * @returns
 */
export const thunkInitLoginPics =
    (): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const action = getPageSimpleActions('app');

        const {data, code} = await fetchIndexPicListNoAuth();

        if (code === '200' && data) {
            const tokens = data.map((v) => v.ipicFiletoken);

            const picsPathResponse = await fetchImageUrlMap(tokens);

            if (picsPathResponse.code === '200' && picsPathResponse.data) {
                const pics = data.map((pic) => {
                    const {ipicFiletoken} = pic;

                    return {
                        ...pic,
                        src: picsPathResponse.data![ipicFiletoken] || '',
                    };
                });

                dispatch(action.set({loginPics: pics}));
            }
            dispatch(action.set({loginPicsIsRequested: true}));
        }
    };

// // 初始化系统logo
// export const thunkInitLogo =
//   (): AppThunk =>
//   async (dispatch, getState, {getPageSimpleActions}) => {
//     const action = getPageSimpleActions('app');

//     const {code, data} = await fetchLogNoAuth();

//     if (code === '200' && data) {
//       const {lconfigName, lconfigFiletoken} = data;

//       document.title = lconfigName || '';
//       let logo = {};

//       if (lconfigFiletoken) {
//         editBrowserIcon(getPreviewImageUrl(lconfigFiletoken));

//         const logoPathResponse = await fetchImageUrlMap([lconfigFiletoken]);
//         if (logoPathResponse.code === '200' && logoPathResponse.data) {
//           logo = {...data, src: logoPathResponse.data[lconfigFiletoken]};
//         }
//       } else {
//         logo = data;
//       }
//       dispatch(action.setLogo(logo));
//     }
//   };

// 获取框架配置
export const thunkInitFrameConfigs =
    (): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const action = getPageSimpleActions('app');
        const indexAction = getPageSimpleActions('index');

        const {code, data} = await fetchFrameConfig();

        if (code === '200' && data) {
            const {
                browserLogoConfigDTO,
                systemLogoConfigDTO,
                mainWinConfigDTO: {left = 1, top = 1},
            } = data;
            const {lconfigName, lconfigFiletoken} = browserLogoConfigDTO;
            const {
                lconfigFiletoken: systemNameFileToken,
                lconfigName: systemName,
            } = systemLogoConfigDTO;

            document.title = lconfigName || '';
            let logo = {};
            let system = {} as any;

            if (systemNameFileToken) {
                const systemPicUrl =
                    window.location.origin +
                    getPreviewImageUrl(systemNameFileToken);
                const logoPathResponse = await fetchImageUrlMap([
                    systemNameFileToken,
                ]);
                if (logoPathResponse.code === '200' && logoPathResponse.data) {
                    system = {...systemLogoConfigDTO, src: systemPicUrl};
                }
            } else {
                system = systemLogoConfigDTO;
            }

            if (lconfigFiletoken) {
                editBrowserIcon(getPreviewImageUrl(lconfigFiletoken));
                const logoPathResponse = await fetchImageUrlMap([
                    lconfigFiletoken,
                ]);
                if (logoPathResponse.code === '200' && logoPathResponse.data) {
                    logo = {
                        ...browserLogoConfigDTO,
                        src: logoPathResponse.data[lconfigFiletoken],
                    };
                }
            } else {
                logo = browserLogoConfigDTO;
            }

            window.systemPictures.logo = system.src;
            window.systemPictures.name = systemName;
            // 设置图标信息
            dispatch(action.setLogo(logo));
            dispatch(action.setSystem(system));
            // 设置框架配置状态
            dispatch(
                indexAction.set({siderCollapsed: !left, headerVisible: !!top}),
            );
            // 获取大数据环境
            // dispatch(thunkGetEnvAjax());
        }
    };

// 未授权系统信息初始化
export const thunkInit =
    ({routes = {}}: {routes: {[key: string]: RichRoute}}): AppThunk =>
    (dispatch, getState, {getPageSimpleActions}) => {
        const action = getPageSimpleActions('app');

        // dispatch(thunkInitLogo());
        dispatch(thunkInitLoginPics());
        dispatch(thunkInitFrameConfigs());
        // 记录本地路由信息
        const localRoutes: Record<string, {path: string; title?: string}> = {};
        Object.keys(routes).forEach((key) => {
            const {path, title} = routes[key];

            localRoutes[key] = {
                path,
                title,
            };
        });

        dispatch(
            action.set({
                localRoutes,
            }),
        );
    };

// ----------------------------授权信息----------------------------

// 获取通用配置
export const thunkInitCommonConfigs =
    (): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const action = getPageSimpleActions('app');

        const {code, data} = await fetchCommonConfig();

        if (code === '200' && data) {
            dispatch(action.set({commonConfigs: data}));
        }
    };
// 合并 菜单 & 资源
export const mergeMenuAndResource =
    (): AppThunk =>
    (dispatch, getState, {getPageSimpleActions, getPageState}) => {
        const {flatMenuMapById, menuResources, biResources} = getPageState(
            getState(),
            'app',
        );
        const action = getPageSimpleActions('app');

        if (!flatMenuMapById || !Object.keys(flatMenuMapById).length) {
            return;
        }

        const mergeMenuResources: any = {};

        Object.keys(flatMenuMapById).forEach((id) => {
            const menu = flatMenuMapById[id];
            const filterResources = menuResources
                .filter(
                    ({menuId, msourceEnable}: any) =>
                        String(menuId) === String(id) && msourceEnable === 1,
                )
                .reduce(
                    (prev: any, curr: any) => ({
                        ...prev,
                        [curr.msourceCode]: curr,
                    }),
                    {},
                );
            const filterBiResources = biResources
                .filter(
                    ({bimenuId, bimsourceEnable}: any) =>
                        String(bimenuId) === String(id) &&
                        bimsourceEnable === 1,
                )
                .reduce(
                    (prev: any, curr: any) => ({
                        ...prev,
                        [curr.bimsourceCode]: curr,
                    }),
                    {},
                );

            mergeMenuResources[id] = {
                menu,
                resources: filterResources,
                biResources: filterBiResources,
            };
        });

        dispatch(action.set({mergeMenuResources}));
    };

// 获取权限菜单
export const thunkInitMenus =
    (): AppThunk<Promise<any>> =>
    (dispatch, getState, {getPageSimpleActions, getPageState}) =>
        new Promise((resolve, reject) => {
            // 获取快捷菜单
            dispatch(thunkGetShortcutMenuDTOByUserId());

            // 获取全量菜单
            fetchMenuTree()
                .then(({code, data, msg}) => {
                    const state: any = {};
                    if (code === '200' && data) {
                        const {currentSubSystem} = getPageState(
                            getState(),
                            'app',
                        );

                        // 子系统
                        state.subSystems = data.map(
                            ({menuTreelVOS, ...args}) => {
                                const {
                                    gwFlag,
                                    piRouter = '',
                                    piUrl = '',
                                } = args;

                                // 完整可访问地址
                                let path = '';

                                // （内部系统 & 有菜单） ｜ （外部系统 &（有完整可访问路径 ｜ 有菜单））
                                let visible = false;
                                if (gwFlag) {
                                    // 内部系统 & 有菜单
                                    if (gwFlag.value === 0) {
                                        if (
                                            menuTreelVOS &&
                                            menuTreelVOS.length
                                        ) {
                                            visible = true;
                                        }
                                        // 内部系统仅使用相对路径
                                        path = piRouter;
                                    }
                                    // 外部系统 &（有完整可访问路径 ｜ 有菜单）
                                    else {
                                        let isValidUrl = false;
                                        // try {
                                        //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                        //     const tryCreateUrl = new URL(
                                        //         `${piUrl}${piRouter}`,
                                        //     );
                                        //     path = `${piUrl}${piRouter}`;
                                        //     isValidUrl = true;
                                        // } catch (error) {
                                        //     // do nothing
                                        // }
                                        if (piUrl) {
                                            isValidUrl = true;
                                        }

                                        const isHaveMenus =
                                            !!menuTreelVOS.length;

                                        visible = isValidUrl || isHaveMenus;
                                    }
                                }

                                return Object.assign(args, {visible, path});
                            },
                        );

                        // 当前子系统
                        if (state.subSystems.length) {
                            // 存在之前记录，使用之前的系统
                            state.currentSubSystem =
                                currentSubSystem ||
                                state.subSystems.find(
                                    (system: any) => system.visible,
                                );
                        }

                        // 子系统 & 菜单树
                        state.menus = data.map(
                            ({menuTreelVOS, id, name, ...args}) => ({
                                id,
                                key: id,
                                title: name,
                                children: loopToAntdTreeData({
                                    treeData: menuTreelVOS,
                                    keyPropName: 'menuId',
                                    titlePropName: 'menuName',
                                    attachNodeProps: (result) => ({
                                        path: String(
                                            result.menuRoutingPath,
                                        ).trim(),
                                    }),
                                }),
                                ...args,
                            }),
                        );

                        // 排序
                        state.menus = state.menus.map((system: any) => ({
                            ...system,
                            children: sortByKey(
                                system.children || [],
                                'menuSort',
                                'asc',
                            ),
                        }));

                        // 所有菜单对象
                        state.flatMenuMapById = tree2Flat({
                            treeData: state.menus.reduce(
                                (prev: any[], curr: any) => [
                                    ...prev,
                                    ...curr.children,
                                ],
                                [],
                            ),
                        });

                        state.flatMenuMapByPath = tree2Flat({
                            treeData: state.menus.reduce(
                                (prev: any[], curr: any) => [
                                    ...prev,
                                    ...curr.children,
                                ],
                                [],
                            ),
                            keyPropName: 'path',
                        });

                        // 查找当前系统菜单
                        if (state.currentSubSystem) {
                            const foundSystem = state.menus.find(
                                (system: any) =>
                                    system.code === state.currentSubSystem.code,
                            );

                            if (foundSystem) {
                                state.currentMenus = foundSystem.children || [];
                            }
                        }

                        const action = getPageSimpleActions('app');

                        dispatch(action.set(state));
                        dispatch(mergeMenuAndResource());

                        resolve(state.subSystems);
                    } else {
                        reject(new Error(msg));
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });

// 获取bi资源
export const thunkInitBiResources =
    (): AppThunk<Promise<void>> =>
    (dispatch, getState, {getPageSimpleActions, getPageState}) =>
        new Promise((resolve, reject) => {
            const {userInfo} = getPageState(getState(), 'app');
            const action = getPageSimpleActions('app');

            fetchUserAllBiMenuSource({userId: userInfo.id})
                .then(({code, msg, data}) => {
                    if (code === '200' && data) {
                        dispatch(
                            action.set({
                                biResources: data,
                                biResourceMap: data.reduce(
                                    (prev, curr) => ({
                                        ...prev,
                                        [curr.bimsourceId]: curr,
                                    }),
                                    {},
                                ),
                            }),
                        );

                        dispatch(mergeMenuAndResource());

                        resolve();
                    } else {
                        reject(new Error(msg));
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });

// 获取页面资源
export const thunkInitMenuResources =
    (): AppThunk<Promise<void>> =>
    (dispatch, getState, {getPageSimpleActions, getPageState}) =>
        new Promise((resolve, reject) => {
            const {userInfo} = getPageState(getState(), 'app');
            const action = getPageSimpleActions('app');

            fetchUserMenuSource({userId: userInfo.id})
                .then(({code, msg, data}) => {
                    if (code === '200' && data) {
                        dispatch(
                            action.set({
                                menuResources: data,
                                menuResourceMap: data.reduce(
                                    (prev, curr) => ({
                                        ...prev,
                                        [curr.msourceId]: curr,
                                    }),
                                    {},
                                ),
                            }),
                        );

                        dispatch(mergeMenuAndResource());

                        resolve();
                    } else {
                        reject(new Error(msg));
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });

// 获取新消息
// export const thunkMonitorMessage =
//     (): AppThunk =>
//         async (dispatch, getState, {getPageSimpleActions}) => {
//             // const actions = getPageSimpleActions('index');

//             // const {code, data} = await newMsgNum();

//             // if (code === '200') {
//             //     dispatch(actions.set({noticeNum: data}));
//             // }
//             setTimeout(() => {
//                 hasAuth() && dispatch(thunkMonitorMessage());
//             }, 60 * 1000);
//         };

// 获取字典表资源
export const thunkInitDicts =
    (): AppThunk =>
    (dispatch, getState, {getPageSimpleActions}) => {
        // 业务类型 、行为类型
        const dictCodes = ['busi_app', 'opn_behavior'];

        Promise.all(
            dictCodes.map((code) => fetchDictModelVOPageByTypeCode(code)),
        ).then((responses) => {
            const action = getPageSimpleActions('app');

            dispatch(
                action.set({
                    dicts: responses.reduce<Record<string, any>>(
                        (prev, curr, currIndex) => {
                            const dictList = curr.data?.list ?? [];

                            prev[dictCodes[currIndex]] = dictList.reduce(
                                (p, c) => ({...p, [c.dictdataCode]: c}),
                                {},
                            );
                            return prev;
                        },
                        {},
                    ),
                }),
            );
        });
    };

// 获取框架配置信息

// 授权信息初始化
export const thunkInitWithAuth =
    (): AppThunk =>
    (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        // 业务依赖数据，需要保证可以获取flatMenuMapById
        Promise.all([
            dispatch(thunkInitMenus()),
            dispatch(thunkInitMenuResources()),
        ])
            .then(() => {
                const {menus} = getPageState(getState(), 'app');
                const biApplication = menus.find(
                    (ele: any) => ele.code === APPLICATION.bi.code,
                );
                // 包含bi企业，请求bi资源
                if (biApplication) {
                    dispatch(thunkInitBiResources());
                }

                const action = getPageSimpleActions('app');
                dispatch(action.set({isSystemReady: true}));
            })
            .catch(() => {
                message.error('基础数据获取失败,请联系管理员');

                setTimeout(() => {
                    removeAuth();
                    // 清理
                    clearSession();
                    // 清理状态
                    const allActions = getPageSimpleActions();
                    Object.values(allActions).forEach(({reset}) =>
                        dispatch(reset()),
                    );

                    window.location.reload();
                }, 5000);
            });

        dispatch(thunkInitCommonConfigs());
        // dispatch(thunkMonitorMessage());

        dispatch(thunkInitDicts());
    };

// 获取授权用户信息
export const thunkInitAuthUser =
    (): AppThunk<Promise<any>> =>
    (dispatch, getState, {getPageSimpleActions}) =>
        new Promise((resolve, reject) => {
            fetchSelf()
                .then((response) => {
                    const {data: userInfo} = response;
                    const action = getPageSimpleActions('app');

                    setLocal('userInfo', userInfo);
                    dispatch(action.set({userInfo}));

                    resolve(userInfo);
                })
                .catch((error) => {
                    reject(error);
                });
        });

// 微应用上送数据
export const bootstrapMicro =
    ({routes, runtime, app}: BootstrapMicroProps): AppThunk =>
    (dispatch, getState, {getPageSimpleActions, getPageState}) => {
        const actions = getPageSimpleActions('app');
        const {localRoutes} = getPageState(getState(), 'app');

        // 保留子系统的运行时
        mountWindowRuntime(app, runtime);

        if (routes) {
            dispatch(actions.set({localRoutes: {...localRoutes, ...routes}}));
        }
    };

// 从前端服务获取配置（ambari、cm）
export const getSysConfigFromAmbari = (): AppThunk => async () =>
    axios
        .get('/aapp-config/getAmbariConfigs')
        .then((res: {data: {code: string; data: any; msg: string}}) => {
            const {code, data} = res.data;
            if (code === '200' && Object.keys(data).length) {
                for (const ele in data) {
                    if (data.hasOwnProperty(ele)) {
                        window.aappAmbariConfigs[ele] = data[ele];
                    }
                }
            }
            return res;
        });

// 初始化微应用控制器
export function initMicroController({
    store,
    handlers,
    tab,
    excludeAssets = [],
}: Record<string, any>) {
    // 初始化微服务控制器
    const micro = new MicroController({
        apps: getStaticConfigs('microApps') || [],
        store,
        handlers,
        tab,
        onUpdate: () => {
            notification.warn({
                key: 'NOTIFICATION_SYSTEM_CHANGE_KEY',
                duration: null,
                message: t('系统版本变化'),
                description: (
                    <span>
                        {t('检测到系统环境发生变化')},
                        <a
                            onClick={() => {
                                window.location.reload();
                            }}
                        >
                            {t('请重新载入系统')}
                        </a>
                    </span>
                ),
            });
        },
    });

    // 初始化状态通信
    microActions = micro.initGlobalState({});

    // 创建监听
    microActions.onGlobalStateChange((state, prev) => {
        // state: 变更后的状态; prev 变更前的状态
        // eslint-disable-next-line no-console
        // console.log(state, prev);
    });
    // actions.setGlobalState(state);
    // actions.offGlobalStateChange();

    const options: FrameworkConfiguration = {
        // prefetch: 'all',
        prefetch(apps: any[]) {
            const currentActiveSystem = apps.find(
                (app) => window.location.pathname.indexOf(app.activeRule) >= 0,
            );
            let criticalAppNames = [];
            let minorAppsName = [];
            if (currentActiveSystem) {
                criticalAppNames = currentActiveSystem.name;
                minorAppsName = apps
                    .filter((app) => app.name !== currentActiveSystem.name)
                    .map((app) => app.name);
            } else {
                if (apps.length) {
                    criticalAppNames = apps.map((app) => app.name);
                    minorAppsName = [];
                }
            }

            return {
                criticalAppNames,
                minorAppsName,
            };
        },
        // sandbox: {strictStyleIsolation: true},
    };

    const excludeAssetsConstant = getStaticConfigs('excludeAssets');

    // https://github.com/umijs/qiankun/issues/1586
    // 排除apollo应用/fineBi相关
    options.excludeAssetFilter = (assetUrl) => {
        // B66093#【偶发故障】AAPP_应用门户_系统中偶发页面渲染出错现象
        const excludeKeywords = excludeAssetsConstant.concat(excludeAssets);

        if (
            excludeKeywords.filter((key: string) => assetUrl.indexOf(key) >= 0)
                .length
        ) {
            return true;
        }

        // const urlType = new URL(assetUrl);

        // if (urlType.host !== window.location.host) {
        //   return true;
        // }

        return false;
    };

    const isStartRightNow = (getStaticConfigs('microApps') || []).find(
        (app: any) => window.location.pathname.indexOf(app.activeRule) >= 0,
    );

    micro.start(options, !isStartRightNow);
}

// 路由变化回调
export const onLocationChange =
    ({tab, prevTab}: OnLocationChangeProps): AppThunk =>
    (dispatch, getState, {getPageSimpleActions, getPageState}) => {
        const actions = getPageSimpleActions('app');
        const {menus, subSystems, flatMenuMapById, menuResources, biResources} =
            getPageState(getState(), 'app');

        if (!tab) {
            return;
        }

        prevTab &&
            report.action({
                action: 'pageEnter',
                id: 'location',
                desc: t('离开页面'),
                position: `${prevTab?.title}(${prevTab.key})`,
                // extra: {prevTab},
            });

        report.action({
            action: 'pageEnter',
            id: 'location',
            desc: t('进入页面'),
            position: `${tab?.title}(${tab.key})`,
            // extra: {tab},
        });

        const {code} = tab;
        let state: any = {currentTab: tab};

        // 保存 && 系统菜单联动
        const foundSystemMenuObject = menus.find(
            (menu: any) => menu.code === code,
        );
        const foundSystem = subSystems.find(
            (system: any) => system.code === code,
        );
        if (foundSystem && foundSystemMenuObject) {
            const currentMenus = foundSystemMenuObject.children || [];
            state = {...state, currentSubSystem: foundSystem, currentMenus};
        }

        dispatch(actions.set(state));

        if (tab && microActions) {
            const {menuId: tabMenuId} = tab;
            const menu = tabMenuId ? flatMenuMapById[tabMenuId] : {};
            const filterResources = menuResources
                .filter(
                    ({menuId, msourceEnable}: any) =>
                        menuId === tabMenuId && msourceEnable === 1,
                )
                .reduce(
                    (prev: any, curr: any) => ({
                        ...prev,
                        [curr.msourceCode]: curr,
                    }),
                    {},
                );
            const filterBiResources = biResources
                .filter(
                    ({bimenuId, bimsourceEnable}: any) =>
                        bimenuId === tabMenuId && bimsourceEnable === 1,
                )
                .reduce(
                    (prev: any, curr: any) => ({
                        ...prev,
                        [curr.bimsourceCode]: curr,
                    }),
                    {},
                );

            // 下发通知 菜单/页面资源/BI资源
            microActions.setGlobalState({
                menu: {...menu, enterPageTime: new Date()},
                resources: filterResources,
                biResources: filterBiResources,
                subSystems,
            });
        }
    };

// 是否初次登陆需要修改密码
export const needChangePasswordFun =
    (needChangePassword: boolean): AppThunk =>
    (dispatch, getState, {getPageSimpleActions}) => {
        const actions = getPageSimpleActions('app');

        dispatch(actions.set({needChangePassword}));
    };
// 保存密码有效期时间
export const savePasswordDaysFun =
    (expired: number): AppThunk =>
    (dispatch, getState, {getPageSimpleActions}) => {
        const actions = getPageSimpleActions('app');

        dispatch(actions.set({passwordDays: expired}));
    };
