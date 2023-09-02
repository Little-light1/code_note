import React, {FC, useCallback} from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {useMount} from 'ahooks';
import {ConfigProvider} from 'antd';
import moment from 'moment';
import {App as EaseApp} from '@gwaapp/ease';
import {AuthProvider} from '@components/auth_provider';
import {SkinProvider} from '@components/skin_provider';
import {ModalWrapper} from '@components/modal';
import {setAuth} from '@utils/auth';
import {report, initReactTrack} from '@/common/utils/clientAction';
import logReporter from '@utils/logDatabase';
import {LoginResponseData} from '@/services/login/types';
import {useTranslation} from 'react-i18next';
import {AntdLocals, Languages, EaseLocals} from '@/common/constant/locale';
import {runtime, useAppDispatch} from './runtime';
import AppRouter from './router';
import {
    thunkInit,
    thunkInitWithAuth,
    thunkInitAuthUser,
    getSysConfigFromAmbari,
    initMicroController,
    needChangePasswordFun,
    savePasswordDaysFun,
} from './actions';
import '@style/global';
import {useInitHandler} from './hooks/useInitHandler';
import useInitCallback from './hooks/useInitCallback';
import {useLang} from './hooks/useLang';

document.oncontextmenu = () => false;

const {store, historyManager} = runtime;

// 初始化行为记录
initReactTrack({
    onClickAction: report.action.bind(report),
});

// 创建query实例
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

const AppView: FC<any> = ({handlers, tab, locale}) => {
    const dispatch = useAppDispatch();

    // 切换html lang
    useLang();

    // 登录成功系统初始化逻辑
    const onAuth = useCallback(
        (data?: LoginResponseData) => {
            if (data) {
                setAuth(data.token);

                const needChangePassword =
                    !data.user?.forceModifyPasswordTime &&
                    !data.user?.forceModifyPassword?.value;
                dispatch(needChangePasswordFun(needChangePassword));

                if (data && data.user && data.userProperties) {
                    if (data.user.forceModifyPasswordTime) {
                        const expired =
                            data.userProperties.passwordProperties.expired -
                            moment().diff(
                                data.user?.forceModifyPasswordTime.split(
                                    'T',
                                )[0],
                                'day',
                            );
                        dispatch(savePasswordDaysFun(expired));
                    }
                }
            } // 初始化授权信息

            dispatch(thunkInitAuthUser()).then(() => {
                // // 初始化微应用
                // initMicroController({store, handlers, tab});
                // 获取登录后信息
                dispatch(thunkInitWithAuth());
            });
        },
        [dispatch],
    ); // 系统初始化逻辑

    useMount(() => {
        window.portalHandlers = handlers; // 获取配置文件

        dispatch(getSysConfigFromAmbari())
            .then((res: any) => {
                const {data} = res.data;
                let apolloApps = []; // apollo 相关应用需要添加到微前端 excludeAssetFilter

                if (data.apollo_apps) {
                    apolloApps = data.apollo_apps.split(',');
                } // 初始化微应用

                initMicroController({
                    store,
                    handlers,
                    tab,
                    excludeAssets: apolloApps,
                });
            })
            .catch(() => {
                // 初始化微应用
                initMicroController({
                    store,
                    handlers,
                    tab,
                });
            }); // 初始化未授权信息

        dispatch(
            thunkInit({
                routes: historyManager.routeDictByPath,
            }),
        );
    }); // 设置 Modal、Message、Notification rootPrefixCls。

    ConfigProvider.config({
        prefixCls: 'portal-antd', // 4.13.0+
    });
    return (
        <QueryClientProvider client={queryClient}>
            {/* // TODO: antd多语言没有产生联动 */}
            <ConfigProvider locale={locale} prefixCls="portal-antd">
                <AuthProvider onAuth={onAuth} logout={handlers.logout}>
                    <ModalWrapper>
                        <SkinProvider>
                            <AppRouter />
                        </SkinProvider>
                    </ModalWrapper>
                </AuthProvider>
            </ConfigProvider>
        </QueryClientProvider>
    );
};

const App: FC = () => {
    // 初始化全局handlers
    const {tab, handlers} = useInitHandler();
    const callback = useInitCallback(runtime);
    const {i18n} = useTranslation();
    const {language} = i18n;
    const antdLocale = AntdLocals[language as Languages];
    const easeLocale = EaseLocals[language as Languages];

    // 开启全局日志上报
    logReporter.start();

    return (
        <EaseApp
            runtime={runtime}
            handlers={handlers}
            callback={callback}
            tab={tab}
            locale={easeLocale}
        >
            <AppView handlers={handlers} tab={tab} locale={antdLocale} />
        </EaseApp>
    );
};

export default App;
