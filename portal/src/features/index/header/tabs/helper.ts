import {parseSearchParams} from '@/common/utils/url';
import {pathToRegexp} from 'path-to-regexp';
import {logUnauthorizedAccess} from '@/common/utils/auth';
import {AntdMenuItem} from '@/common/types/menu';
import {GetTabUniqueKey, Tab} from './types';

type LocalRoutes = Record<string, {path: string; title: string}>;

interface CreateTabProps {
    flatMenuMapById: {
        [key: string]: AntdMenuItem;
    };
    localRoutes: LocalRoutes;
    pathname: string;
    search?: string;
    key?: string;
    getTabUniqueKey: GetTabUniqueKey;
} // 默认以pathname&search为uniqueKey定义Tab

export function getUniqueKey({
    pathname,
    search,
    getTabUniqueKey,
}: {
    pathname: string;
    search: string;
    getTabUniqueKey: GetTabUniqueKey;
}) {
    let key = pathname + search; // 如果有唯一值定义函数，则根据定义生成uniqueKey

    if (getTabUniqueKey) {
        for (const reg of Object.keys(getTabUniqueKey)) {
            const isMath = pathToRegexp(reg).test(pathname);

            if (isMath) {
                key = getTabUniqueKey[reg]({
                    pathname,
                    search,
                });
                break;
            }
        }
    }

    return key;
}
/**
 * 创建tab标签
 * @param param0
 * @returns
 */

export function createTab({
    flatMenuMapById,
    localRoutes,
    pathname,
    search = '',
    getTabUniqueKey,
}: CreateTabProps): Tab {
    let key = getUniqueKey({
        pathname,
        search,
        getTabUniqueKey,
    }); // 特殊参数：Tab名称

    const parseSearch = parseSearchParams(search);
    const {tabName} = parseSearch; // 完整路径

    const path = `${pathname}${search}`;
    key = key || path; // Tab名称
    // 查找权限菜单

    const menu = Object.values(flatMenuMapById).find(
        ({menuRoutingPath, menuId}) => {
            if (typeof menuRoutingPath === 'undefined') {
                return false;
            }
            // 处理菜单管理中配置有search的情况
            const [routePathName, routeSearch] = menuRoutingPath.split('?'); // 当没有search的时候，全量匹配

            if (typeof routeSearch === 'undefined') {
                return (
                    routePathName === pathname ||
                    (pathname === '/iframeOpen' &&
                        parseSearch.menuId &&
                        parseSearch?.menuId === String(menuId))
                );
            } // pathname需要相同，当前Url search需要包含路由中的search

            return (
                (routePathName === pathname &&
                    search.indexOf(routeSearch) >= 0) ||
                (pathname === '/iframeOpen' &&
                    parseSearch.menuId &&
                    parseSearch?.menuId === String(menuId))
            );
        },
    ); // 无权限菜单，使用本地菜单配置

    if (typeof menu === 'undefined') {
        let title = '';

        if (localRoutes[pathname]) {
            title = tabName ? String(tabName) : localRoutes[pathname].title;
        } else {
            title = tabName ? String(tabName) : '';
        }

        const tab = {
            key,
            title,
            path,
            pathname,
            search,
        };
        return tab;
    }

    const tab = {
        key,
        title: tabName ? String(tabName) : menu.title,
        path,
        pathname,
        search,
        // params:
        // options
        menuId: menu.menuId,
        code: menu.applicationCode,
    };
    return tab;
}

// 是否越权
export function isUnauthorizedAccess(tab: Tab | null, flatMenuMapById: any) {
    let is = false;

    if (tab?.pathname === '/apollo/formCreate/add') {
        return false;
    }
    if (
        (tab && typeof tab.menuId === 'undefined') ||
        (tab &&
            typeof tab.menuId !== 'undefined' &&
            tab.menuId &&
            flatMenuMapById[tab.menuId] === undefined)
    ) {
        logUnauthorizedAccess(tab.path).then(() => {
            console.log('越权记录成功');
        });

        is = true;
    }
    return is;
}
