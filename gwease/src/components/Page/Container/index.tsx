import React, {FC, useCallback, useMemo, useState} from 'react';
import {log} from '../../../utils/log';
import {PageContainerContext, DefaultPageContainer} from '../context';
import {PageContainerProps, State} from '../types';

type CurrentPageKey = string;

const PageContainer: FC<PageContainerProps> = ({children, defaultState, onChange}) => {
    // eslint-disable-next-line no-nested-ternary
    const [state, setState] = useState<State>(defaultState ? (typeof defaultState === 'function' ? defaultState() : defaultState) : {});

    const [currentPageKey, setCurrentPageKey] = useState<CurrentPageKey>(DefaultPageContainer.currentPageKey);

    // 清理页面状态
    const clear = useCallback(
        (pathname) => {
            setState((currentState) => {
                const nextState = {...currentState};
                delete nextState[pathname];

                onChange && onChange(nextState);

                return nextState;
            });
        },
        [onChange],
    );

    // 强制刷新
    const forceRefresh = useCallback(
        (pathname) => {
            pathname && clear(pathname);
            setCurrentPageKey(`${new Date().getTime()}`);
        },
        [clear],
    );

    // 初始化成功回调
    const onInitSuccess = useCallback(
        ({pathname, search, params, state: locationState}) => {
            const initializeTime = new Date().getTime();

            setState((currentState) => {
                const nextState = {
                    ...currentState,
                    [pathname]: {initializeTime, search, params, state: locationState},
                };

                onChange && onChange(nextState, pathname);

                return nextState;
            });
        },
        [onChange],
    );

    // 更新成功回调
    const onUpdateSuccess = useCallback(
        ({pathname, search, params, state: locationState}) => {
            const updateTime = new Date().getTime();

            setState((currentState) => {
                const nextState = {
                    ...currentState,
                    [pathname]: {...currentState[pathname], updateTime, search, params, state: locationState},
                };

                onChange && onChange(nextState);

                return nextState;
            });
        },
        [onChange],
    );

    // 刷新成功回调
    const onRefreshSuccess = useCallback(({pathname}) => {
        setState((currentState) => {
            let nextState = currentState;

            const initializeTime = new Date().getTime();

            if (typeof currentState[pathname] !== 'undefined') {
                nextState = {...currentState, [pathname]: {...currentState[pathname], initializeTime}};

                return nextState;
            }
            log({module: 'PageContainer', sketch: 'The page is not ready yet', type: 'warn'});
            return nextState;
        });
    }, []);

    const memoValue = useMemo(
        () => ({state, currentPageKey, forceRefresh, onRefreshSuccess, onInitSuccess, onUpdateSuccess, clear}),
        [state, currentPageKey, forceRefresh, onRefreshSuccess, onInitSuccess, onUpdateSuccess, clear],
    );

    return <PageContainerContext.Provider value={memoValue}>{children}</PageContainerContext.Provider>;
};

export default PageContainer;
