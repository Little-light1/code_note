/*
 * @Author: sun.t
 * @Date: 2022-09-28 11:34:49
 * @Last Modified by: gongzunbao
 * @Last Modified time: 2023-06-25 14:31:27
 */
import React from 'react';
import {Menu, Tooltip} from 'antd';
import {Link} from 'react-router-dom';
import {CatchTokenImage} from '@/components/catch_image';
import {checkAbsUrl} from '@utils/reg';
import {saveQuickMenu, cancelShortcutMenuDTO} from '@features/index/actions';
import {openNewTag} from '@/common/utils/openNewTag';
import {openInnerTag} from '@/common/utils/openInnerTag';
import {AntdMenuItem} from '@/common/types/menu';
import styles from './styles.module.scss';

const {SubMenu} = Menu;
export function renderMenuItem(
    dispatch: any,
    openPage: any,
    menu: any,
    menuResourceType: string,
    t: any,
) {
    const {
        menuRoutingPath,
        title,
        menuIconEnable,
        key,
        menuIconToken,
        targetType,
    } = menu;
    const isAbs = checkAbsUrl(menuRoutingPath) && targetType;
    let processMenuPath = menuRoutingPath; // 对菜单地址进行预处理

    if (window.linkProcessByName && window.linkProcessByName[title]) {
        processMenuPath = window.linkProcessByName[title](menuRoutingPath);
    }
    const userInfo = JSON.parse(
        window.localStorage.getItem('userInfo') || '{}',
    );
    const param = {
        userId: userInfo.id || '',
    };

    return (
        <Menu.Item
            key={key}
            eventKey={key}
            title={title}
            style={{display: 'flex'}}
        >
            <Tooltip
                title={
                    menuResourceType === 'normal' ? (
                        <span
                            className={styles.contextMenu}
                            onClick={() => dispatch(saveQuickMenu(menu))}
                        >
                            {t('加入快捷菜单')}
                        </span>
                    ) : (
                        <span
                            className={styles.contextMenu}
                            onClick={() =>
                                dispatch(cancelShortcutMenuDTO(menu))
                            }
                        >
                            {t('删除')}
                        </span>
                    )
                }
                trigger="contextMenu"
                placement="right"
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {menuIconEnable && menuIconToken ? (
                        <div className={styles.menuIcon}>
                            <CatchTokenImage
                                height={15}
                                width={15}
                                token={menuIconToken}
                                alt={title}
                            />
                        </div>
                    ) : null}
                    {isAbs ? (
                        <span
                            style={{
                                width: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                            // onClick={() =>
                            //     dispatch(
                            //         openInnerTag(
                            //             navigate,
                            //             processMenuPath,
                            //             menu,
                            //         ),
                            //     )
                            // }
                            onClick={() =>
                                dispatch(
                                    openNewTag(
                                        processMenuPath,
                                        param,
                                        null,
                                        false,
                                    ),
                                )
                            }
                        >
                            {title}
                        </span>
                    ) : (
                        <span
                            // to={processMenuPath}
                            onClick={() =>
                                dispatch(
                                    openInnerTag(
                                        openPage,
                                        processMenuPath,
                                        menu,
                                    ),
                                )
                            }
                            style={{
                                width: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {title}
                        </span>
                    )}
                </div>
            </Tooltip>
        </Menu.Item>
    );
}

// 普通菜单&快捷菜单都会调用
export const constructMenu = ({
    dispatch,
    openPage,
    menu,
    menuResourceType,
    t,
}: any) => {
    const {
        key,
        title,
        menuRoutingPath,
        children,
        menuIconToken,
        menuEnable,
        menuIconEnable,
        menuVisible,
    } = menu;
    // 过滤禁用/隐藏菜单
    if (menuEnable === 0 || menuVisible === 0) {
        return null;
    }

    // 判断是否是子节点，没有children/children内容为空
    if (!children || children.length === 0) {
        // 过滤没有地址的菜单
        if (!menuRoutingPath) {
            return null;
        }

        return renderMenuItem(dispatch, openPage, menu, menuResourceType, t);
    }

    // 如果有子节点，需要判断子节点是否都是显示的，否则当普通节点处理
    if (children.length && menuResourceType === 'normal') {
        // 存在子菜单需要展示
        // && curr.menuRoutingPath
        const count = children.reduce(
            (prev: number, curr: any) =>
                curr.menuVisible === 1 ? 1 + prev : prev,
            0,
        );

        if (count === 0) {
            if (!menuRoutingPath) {
                return null;
            }

            return renderMenuItem(
                dispatch,
                openPage,
                menu,
                menuResourceType,
                t,
            );
        }
    }

    return (
        <SubMenu
            key={key}
            title={<span title={title}>{title}</span>}
            icon={
                menuIconEnable && menuIconToken ? (
                    <div className={styles.menuIcon}>
                        <CatchTokenImage
                            height={15}
                            width={15}
                            token={menuIconToken}
                            alt={title}
                        />
                    </div>
                ) : null
            }
        >
            {children.map((childMenu: AntdMenuItem) =>
                constructMenu({
                    dispatch,
                    openPage,
                    menu: childMenu,
                    menuResourceType,
                    t,
                }),
            )}
        </SubMenu>
    );
};
