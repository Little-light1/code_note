/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

/*
 * @Author: sun.t
 * @Date: 2021-11-07 23:39:56
 * @Last Modified by: sun.t
 * @Last Modified time: 2022-11-21 21:46:56
 */
import React, {useCallback} from 'react';
import {Row, Col, Divider, Layout} from 'antd';
import {DownOutlined, UpOutlined} from '@ant-design/icons';
import {shallowEqual} from 'react-redux';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useAction} from '@gwaapp/ease';
import {useMount} from 'ahooks';
import {getSession} from '@/common/utils/storage';
import {useLocation} from 'react-router';
import useWebSocket from '@/common/hooks/useWebSocket';
import Tabs from './tabs';
import SystemMenus from './system_menus';
import FunctionIcons from './function_icons';
import User from './user';
import styles from './styles.module.scss';
import {SessionTabs} from './tabs/types';
import {SESSION_TABS_KEY} from './tabs/constant';

const {Header} = Layout;

const Top = ({
    toggle,
    goSystemIndex,
    system,
}: {
    toggle: () => void;
    goSystemIndex: () => void;
    system: any;
}) => {
    const {alarmCount, messageCount, socket} = useWebSocket();
    return (
        <Row className={styles.view}>
            <Col flex={7} className={styles.wrapper}>
                <div className={styles.toggle}>
                    <div className={styles.toggle_child} onClick={toggle}>
                        <UpOutlined
                            style={{
                                fontSize: '13px',
                                fontWeight: 'bold',
                            }}
                        />
                    </div>
                </div>
                {/* '/public/image/logo.svg' */}
                {window.systemPictures && window.systemPictures.logo && (
                    <img
                        src={window.systemPictures.logo}
                        alt=""
                        width="150px"
                        height="50px"
                        onClick={goSystemIndex}
                        style={{
                            cursor: 'pointer',
                            marginRight: 10,
                        }}
                    />
                )}
                <Divider type="vertical" className={styles.line} />
                <div className={styles.systemName}>
                    <SystemMenus />
                </div>
            </Col>
            <Col flex={10}>
                <div className={styles.title}>
                    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                    <span className={styles.systemName}>
                        {window.systemPictures && window.systemPictures?.name
                            ? window.systemPictures.name
                            : ''}
                    </span>
                </div>
            </Col>
            <Col flex={7}>
                <div className={styles.quickBar}>
                    {/* TODO 临时隐藏 墨西哥演示 */}
                    <FunctionIcons
                        alarmCount={alarmCount}
                        messageCount={messageCount}
                    />
                    <User socket={socket} />
                </div>
            </Col>
        </Row>
    );
};

const Toggle = ({visible, toggle}: {visible: boolean; toggle: () => void}) => (
    <div
        className={`${styles.toggleHidden}`}
        onClick={toggle}
        style={{
            display: visible ? 'flex' : 'none',
        }}
    >
        <div className={styles.toggleHidden_child}>
            <DownOutlined
                style={{
                    fontSize: '13px',
                    fontWeight: 'bold',
                }}
            />
        </div>
    </div>
);

const AppHeader = () => {
    const dispatch = useAppDispatch();
    const {headerVisible} = useAppSelector(
        (state) => state.index,
        shallowEqual,
    );
    const {currentSubSystem, flatMenuMapByPath, system} = useAppSelector(
        (state) => state.app,
        shallowEqual,
    );
    const {getPageSimpleActions, handlers} = useAction();
    const {openPage} = handlers;
    const actions = getPageSimpleActions('index');
    const location = useLocation();
    const toggle = useCallback(() => {
        dispatch(
            actions.set({
                headerVisible: !headerVisible,
            }),
        );
    }, [actions, dispatch, headerVisible]); // 访问当前系统首页

    const goSystemIndex = useCallback(() => {
        const {path} = currentSubSystem || {};
        path &&
            flatMenuMapByPath[path] &&
            openPage({
                path,
            });
    }, [currentSubSystem, flatMenuMapByPath, openPage]);
    useMount(() => {
        // 初始化&没有缓存情况下跳转至首页
        // 缓存信息
        const sessionTabs = getSession<SessionTabs>(SESSION_TABS_KEY);
        const {gwFlag, path} = currentSubSystem || {};

        const jump2Index = () => {
            // 内部应用
            if (gwFlag && gwFlag.value === 0) {
                if (path && flatMenuMapByPath[path]) {
                    openPage({
                        path,
                    });
                }
            }
        };

        if (toString.call(sessionTabs) === '[object Object]') {
            const {activeTab: sActiveTab = null} = sessionTabs as SessionTabs;

            if (!sActiveTab || sActiveTab.path === '/') {
                jump2Index();
            }
        } else {
            // 只有在默认首页的时候才触发自动打开流程，正常URL直接访问
            if (location.pathname === '/') {
                jump2Index();
            }
        }
    }); // if (!headerVisible) {
    //   return (
    //     <div className={`${styles.toggleHidden}`} onClick={() => setVisible(!headerVisible)}>
    //       <div className={styles.toggleHidden_child}>
    //         <DownOutlined style={{fontSize: '13px', fontWeight: 'bold'}} />
    //       </div>
    //     </div>
    //   );
    // }

    return (
        <>
            {/* 展开 */}
            <Toggle visible={!headerVisible} toggle={toggle} />
            <Header
                className={styles.header}
                style={{
                    display: headerVisible ? 'block' : 'none',
                }}
            >
                {/* 折叠 */}
                <Top
                    toggle={toggle}
                    goSystemIndex={goSystemIndex}
                    system={system}
                />
                {/* 折叠 */}
                <Tabs />
            </Header>
        </>
    );
};

export default AppHeader;
