/*
 * @Author: sun.t
 * @Date: 2021-11-07 23:39:56
 * @Last Modified by: gongzunbao
 * @Last Modified time: 2023-03-16 16:42:56
 */
import React, {useEffect, useState} from 'react';
import {Menu, Layout, Tabs} from 'antd';
import {
    CaretLeftOutlined,
    PushpinFilled,
    UnorderedListOutlined,
    StarOutlined,
} from '@ant-design/icons';
import {shallowEqual} from 'react-redux';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useAction, TreeUtils} from '@gwaapp/ease';
import {useTranslation} from 'react-i18next';
import {AntdMenuItem} from '@/common/types/menu';
import styles from './styles.module.scss';
import {constructMenu} from './helper';

const {Sider} = Layout;
const {TabPane} = Tabs;
let hoverTimeout: any = null;

const AppSider = ({width = 260}) => {
    const dispatch = useAppDispatch();
    const {getPageSimpleActions, handlers} = useAction();
    const actions = getPageSimpleActions('index');
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const {t} = useTranslation();
    const {currentMenus, currentTab} = useAppSelector(
        (state) => state.app,
        shallowEqual,
    );
    const {
        siderCollapsed,
        siderFixed,
        menuResourceType,
        quicklyMenus,
        headerVisible,
    } = useAppSelector((state) => state.index, shallowEqual);
    const {openPage} = handlers;
    const menus = menuResourceType === 'normal' ? currentMenus : quicklyMenus; // 活跃tab变化主动展开当前菜单

    useEffect(() => {
        if (!currentTab) return;
        const parentKeys = TreeUtils.getParentKey({
            treeData: menus,
            matchKey: currentTab.menuId,
            isAllParents: true,
        });
        setOpenKeys(parentKeys.map((v) => String(v)));
    }, [menus, currentTab]);

    return (
        <Sider
            className={`${styles.view} ${siderFixed ? styles.fixed : ''}`}
            width={!siderCollapsed ? width : 0}
            style={
                !siderCollapsed
                    ? {
                          padding: 5,
                      }
                    : {}
            }
            onMouseEnter={() => window.clearTimeout(hoverTimeout)}
            onMouseLeave={() => {
                if (!siderCollapsed && siderFixed) {
                    hoverTimeout = setTimeout(() => {
                        dispatch(actions.setSiderCollapsed(true));
                    }, 2000);
                }
            }}
        >
            <div className={styles.content}>
                {/* 展开 */}
                <div
                    className={styles.collapseAnchor}
                    onClick={() =>
                        dispatch(actions.setSiderCollapsed(!siderCollapsed))
                    }
                    onMouseEnter={() => {
                        if (siderCollapsed && siderFixed) {
                            dispatch(actions.setSiderCollapsed(false));
                        }
                    }}
                >
                    <CaretLeftOutlined rotate={siderCollapsed ? 180 : 0} />
                </div>
                {/* 固定 */}
                <div
                    className={styles.anchorArea}
                    style={
                        !headerVisible
                            ? {
                                  top: '30px',
                              }
                            : {}
                    }
                >
                    <div
                        className={styles.anchor}
                        onClick={() =>
                            dispatch(actions.setSiderFixed(!siderFixed))
                        }
                    >
                        <PushpinFilled rotate={!siderFixed ? -45 : 0} />
                    </div>
                </div>
                <div className={styles.menuContainer}>
                    <Tabs
                        moreIcon={null}
                        size="small"
                        className={
                            !headerVisible ? styles.tabsPadding : styles.tabs
                        }
                        activeKey={menuResourceType}
                        type="card"
                        onChange={(activeKey) =>
                            dispatch(actions.setMenuResourceType(activeKey))
                        }
                    >
                        <TabPane
                            tab={
                                <UnorderedListOutlined
                                    style={{
                                        color: '#fff',
                                    }}
                                />
                            }
                            key="normal"
                        />
                        <TabPane
                            tab={
                                <StarOutlined
                                    style={{
                                        color: '#fff',
                                    }}
                                />
                            }
                            key="quick"
                        />
                    </Tabs>

                    <div className={styles.menus}>
                        <Menu
                            mode="inline"
                            selectedKeys={currentTab ? [currentTab.menuId] : []}
                            style={{
                                height: '100%',
                                borderRight: 0,
                            }}
                            openKeys={openKeys}
                            onOpenChange={setOpenKeys}
                        >
                            {menus.map((menu: AntdMenuItem) =>
                                constructMenu({
                                    dispatch,
                                    openPage,
                                    menu,
                                    menuResourceType,
                                    t,
                                }),
                            )}
                        </Menu>
                    </div>
                </div>
            </div>
        </Sider>
    );
};

export default AppSider;
