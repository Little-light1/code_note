/*
 * @Author: sun.t
 * @Date: 2021-11-02 10:53:03
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2023-04-25 11:01:10
 */
import React, {FC, useCallback} from 'react';
import {Layout, Spin} from 'antd';
import {Route, Routes, useLocation} from 'react-router-dom';
import {PageContainer, Page} from '@gwaapp/ease';
import ScalingContainer from '@/components/scaling_container';
import {getStaticConfigs, MicroContainerDomID} from '@/common/init/configs';
import {useAppSelector, useAppDispatch} from '@/app/runtime';
import {shallowEqual} from 'react-redux';
import {useMount} from 'ahooks';
import logReporter from '@/common/utils/logDatabase';
import {IComponentProps} from './types';
import AppHeader from './header/view';
import AppSider from './sider/view';
import styles from './styles.module.scss';
import {onInit} from './actions';

const {Content} = Layout;

const Index: FC<IComponentProps> = ({features}) => {
    const dispatch = useAppDispatch();
    const {flatMenuMapByPath, mergeMenuResources} = useAppSelector(
        (state) => state.app,
        shallowEqual,
    );
    const {pathname} = useLocation();
    const isScaling = (getStaticConfigs('scalingUrls') || []).includes(
        pathname,
    ); // apollo 容器尺寸变化主动推送

    const onSizeChange = useCallback(() => {
        const event = new CustomEvent('interact', {
            detail: {
                object: {
                    layoutType: 'resize',
                },
            },
        });
        document.body.dispatchEvent(event);
    }, []); // 框架信息初始化

    useMount(() => {
        dispatch(onInit());
    });
    return (
        <Layout
            style={{
                height: '100%',
            }}
            className={styles.layout}
        >
            {/* 顶部 */}
            <AppHeader />
            {/* 内容区域 */}
            <Layout className={styles.layoutBackground}>
                <img
                    src="/public/image/background.jpg"
                    alt=""
                    className={styles.layoutBackgroundImage}
                />

                {/* 侧边栏 */}
                <AppSider />

                {/* 内容区域 */}
                <Layout className={styles.layoutContent}>
                    <Content className={styles.microContent}>
                        <ScalingContainer
                            isScaling={isScaling}
                            onSizeChange={onSizeChange}
                        >
                            {({style}) => (
                                <>
                                    {/* 门户页面区域 */}
                                    <PageContainer
                                        onChange={(e, path) => {
                                            // TODO：页面加载时间
                                            // console.log(e, path);
                                        }}
                                    >
                                        <Routes>
                                            {features.map(
                                                ({
                                                    key: pageKey,
                                                    title,
                                                    route,
                                                    reducers,
                                                    async,
                                                }) => (
                                                    <Route
                                                        key={pageKey}
                                                        path={route.path}
                                                        element={
                                                            // <AuthRoute>
                                                            <div
                                                                className={
                                                                    styles.pageContainer
                                                                }
                                                            >
                                                                <Page
                                                                    id={pageKey}
                                                                    title={
                                                                        title
                                                                    }
                                                                    reducers={
                                                                        reducers
                                                                    }
                                                                    async={
                                                                        async
                                                                    }
                                                                    logError={(
                                                                        error: Error,
                                                                    ) => {
                                                                        // 组件异常日志存储
                                                                        logReporter.error(
                                                                            {
                                                                                content:
                                                                                    error.stack ||
                                                                                    '',
                                                                            },
                                                                        );
                                                                    }}
                                                                >
                                                                    {({
                                                                        key,
                                                                        search,
                                                                        state,
                                                                    }: any) => {
                                                                        const menu =
                                                                            flatMenuMapByPath
                                                                                ? flatMenuMapByPath[
                                                                                      pathname
                                                                                  ]
                                                                                : null;
                                                                        let resources =
                                                                            {};
                                                                        let biResources =
                                                                            {};

                                                                        if (
                                                                            menu &&
                                                                            mergeMenuResources[
                                                                                menu
                                                                                    .menuId
                                                                            ]
                                                                        ) {
                                                                            resources =
                                                                                mergeMenuResources[
                                                                                    menu
                                                                                        .menuId
                                                                                ]
                                                                                    .resources;
                                                                            biResources =
                                                                                mergeMenuResources[
                                                                                    menu
                                                                                        .menuId
                                                                                ]
                                                                                    .biResources;
                                                                        }

                                                                        return (
                                                                            <route.component
                                                                                id={
                                                                                    pageKey
                                                                                }
                                                                                title={
                                                                                    title
                                                                                }
                                                                                key={
                                                                                    key
                                                                                }
                                                                                search={
                                                                                    search
                                                                                }
                                                                                state={
                                                                                    state
                                                                                }
                                                                                menu={
                                                                                    menu
                                                                                }
                                                                                resources={
                                                                                    resources
                                                                                }
                                                                                biResources={
                                                                                    biResources
                                                                                }
                                                                            />
                                                                        );
                                                                    }}
                                                                </Page>
                                                            </div> // </AuthRoute>
                                                        }
                                                    />
                                                ),
                                            )}
                                        </Routes>
                                    </PageContainer>

                                    {/* 子系统页面容器 */}
                                    <div
                                        id={MicroContainerDomID}
                                        className={styles.microContainer}
                                        style={style}
                                    />
                                </>
                            )}
                        </ScalingContainer>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

const SystemReadyIndex: FC<IComponentProps> = ({features}) => {
    const isSystemReady = useAppSelector((state) => state.app.isSystemReady);

    if (!isSystemReady) {
        return (
            <div className={styles.systemLoading}>
                <img
                    src="/public/image/background.jpg"
                    alt=""
                    className={styles.layoutBackgroundImage}
                />
                <Spin size="large" />
            </div>
        );
    }

    return <Index features={features} />;
};
export default SystemReadyIndex;
