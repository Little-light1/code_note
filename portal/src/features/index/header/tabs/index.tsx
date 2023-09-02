/*
 * @Author: sun.t
 * @Date: 2021-11-07 23:39:56
 * @Last Modified by: gongzunbao
 * @Last Modified time: 2023-06-28 13:31:27
 */
import React, {useRef, FC} from 'react';
import {Divider, Dropdown, Menu, Tooltip} from 'antd';
import {useDebounceFn} from 'ahooks';
import {CloseOutlined, RedoOutlined} from '@ant-design/icons';
import {shallowEqual} from 'react-redux';
import {useAction} from '@gwaapp/ease';
import {useAppSelector} from '@/app/runtime';
import {useTranslation} from 'react-i18next';
import {useTabs, useTabLocation, useTooltip} from './hooks';
import {AntdMenuItem} from '@/common/types/menu';
import styles from './styles.module.scss';
import {Tab} from './types';

interface TabsProps {
    flatMenuMapById: {
        [key: string]: AntdMenuItem;
    };
    localRoutes: {
        [key: string]: any;
    };
}

const Tabs: FC<TabsProps> = ({flatMenuMapById, localRoutes}) => {
    const tabElement = useRef(null);
    const {tab, historyManager: history, callback = {}} = useAction();
    const {onLocationChange} = callback;
    const {t} = useTranslation();
    const {
        tabs,
        activeTab,
        closeTab,
        closeAllTab,
        closeOtherTabs,
        closeDirectionTabs,
        setActiveTab,
        refreshTab,
    } = useTabs({
        tab,
        flatMenuMapById,
        localRoutes,
        onLocationChangeCallback: onLocationChange,
        getTabUniqueKey: window.getTabUniqueKey,
        t,
    });
    const {tooltipVisible, onTooltipVisibleChange} = useTooltip({
        tabs,
    });
    const {run: debounceRefresh} = useDebounceFn(
        (path) => {
            refreshTab(path);
        },
        {
            wait: 1000,
        },
    );
    const {forward, backward} = useTabLocation({
        tabElement,
        tabs,
        activeTab,
        setActiveTab,
    });
    const closeDisable = tabs.length === 1 && tabs[0].path === '/';
    return (
        <div className={styles.tabs}>
            <div className={styles.container}>
                <div ref={tabElement}>
                    {tabs.map((tabpane: Tab) => {
                        const {key, title, params, search, path, pathname} =
                            tabpane;
                        const tabVisible =
                            !!tooltipVisible && tooltipVisible === key;
                        return (
                            <Tooltip
                                visible={tabVisible}
                                onVisibleChange={(v) =>
                                    onTooltipVisibleChange(key, v)
                                }
                                key={key}
                                placement="rightBottom"
                                title={
                                    <div className={styles.contextMenu}>
                                        <span
                                            onClick={() => {
                                                closeTab(tabpane);
                                            }}
                                        >
                                            {t('关闭当前页签')}
                                        </span>
                                        <span
                                            onClick={() => {
                                                closeOtherTabs(path);
                                            }}
                                        >
                                            {t('关闭其它页签')}
                                        </span>
                                        <span
                                            onClick={() => {
                                                closeDirectionTabs(
                                                    path,
                                                    'left',
                                                );
                                            }}
                                        >
                                            {t('关闭左侧页签')}
                                        </span>
                                        <span
                                            onClick={() => {
                                                closeDirectionTabs(
                                                    path,
                                                    'right',
                                                );
                                            }}
                                        >
                                            {t('关闭右侧页签')}
                                        </span>
                                        <span onClick={closeAllTab}>
                                            {t('关闭全部页签')}
                                        </span>
                                    </div>
                                }
                                trigger="contextMenu"
                            >
                                <div
                                    key={path}
                                    data-tab={path}
                                    className={`${styles.tab} ${
                                        activeTab && path === activeTab.path
                                            ? styles.active
                                            : ''
                                    }`}
                                    onClick={() => {
                                        history.pushPath({
                                            params,
                                            search,
                                            path: pathname,
                                        });
                                    }}
                                >
                                    {/* 刷新 */}
                                    <RedoOutlined
                                        className={styles.refresh}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            debounceRefresh(path);
                                        }}
                                    />
                                    <div className={styles.title}>{title}</div>
                                    {closeDisable ? null : (
                                        <CloseOutlined
                                            className={styles.close}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                closeTab(tabpane);
                                            }}
                                        />
                                    )}
                                </div>
                            </Tooltip>
                        );
                    })}
                </div>
            </div>

            <div className={styles.controls}>
                <span
                    className={`${
                        styles.item
                    } ${'portal-iconfont icon-portal-right'}`}
                    onClick={backward}
                />
                <Divider type="vertical" className={styles.line} />
                <Dropdown
                    overlay={
                        <Menu>
                            {tabs.map((tabpane: Tab) => {
                                const {path, title, search, params} = tabpane;
                                return (
                                    <Menu.Item
                                        key={path}
                                        onClick={() => {
                                            history.pushPath({
                                                search,
                                                params,
                                                path,
                                            });
                                        }}
                                    >
                                        <div className={styles.menus}>
                                            <span className={styles.title}>
                                                {title}
                                            </span>
                                            {closeDisable ? null : (
                                                <CloseOutlined
                                                    className={styles.close}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        closeTab(tabpane);
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </Menu.Item>
                                );
                            })}
                        </Menu>
                    }
                    placement="bottomLeft"
                >
                    <span
                        className={`${
                            styles.item
                        } ${'portal-iconfont icon-portal-grid'}`}
                    />
                </Dropdown>
                <Divider type="vertical" className={styles.line} />
                <span
                    className={`${
                        styles.item
                    } ${'portal-iconfont icon-portal-left'}`}
                    onClick={forward}
                />
            </div>
        </div>
    );
};

const TabsContainer = () => {
    const {flatMenuMapById, localRoutes} = useAppSelector(
        (state) => state.app,
        shallowEqual,
    );
    if (!flatMenuMapById) return null;
    return <Tabs flatMenuMapById={flatMenuMapById} localRoutes={localRoutes} />;
};

export default TabsContainer;
