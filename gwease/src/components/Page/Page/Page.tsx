import React, {PureComponent} from 'react';
import type {ErrorInfo} from 'react';
import PageContextProvider from './PageContextProvider';
import {PageContainerContext} from '../context';
import type {PageWrapperProps} from '../types';
import ErrorIcon from './static/error.svg';
import {connectRouter} from '../connect/connectRouter';
import {connectAction} from '../../Runtime';
import {log} from '../../../utils/log';
import {connectLocal} from '../../Runtime/App/LocaleProvider';

interface Error {
    name: string;
    message: string;
    stack?: string;
}

interface State {
    hasError: null | any;
    loading: boolean;
}

class Page extends PureComponent<PageWrapperProps, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            hasError: null,
            loading: false,
        };

        const {injectAsyncReducer, location, id, reducers, async = true} = this.props;
        const {search} = location;
        async && injectAsyncReducer({key: id, reducers, search});
    }

    static getDerivedStateFromError(error: any) {
        return {hasError: error, loading: false};
    }

    // componentDidUpdate() {
    //   const { currentPageKey } = this.context;
    //   const { key } = this.state;

    //   if (currentPageKey !== key) {
    //     this.setState((state) => ({ ...state, key: currentPageKey }));
    //   }
    // }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        const {logError} = this.props;
        if (logError) {
            logError(error, errorInfo);
            return;
        }
        log({module: 'Page', sketch: error.message, type: 'error'});
    }

    render() {
        const {errorRender, children, id, title, location, navigate, params, async = true, loadingTime = 100, easeLocal} = this.props;
        const {search, state} = location;
        const {currentPageKey, forceRefresh} = this.context;
        const {hasError, loading} = this.state;

        if (loading) {
            return null;
        }

        if (hasError) {
            if (errorRender) {
                return errorRender(hasError);
            }

            const {message, stack = ''} = hasError;

            // // 查找调用链最近报错代码位置
            // const stackList = stack.split('\n');
            // let latestPos = '';

            // if (stackList.length > 1) {
            //     const matchPos = stackList[1].match(/\(.*?\)/g);

            //     if (matchPos.length) {
            //         latestPos = matchPos[0].replace(/[()]/g, '');
            //     }
            // }

            return (
                <div style={{fontSize: '25px', padding: '20px', display: 'flex', alignItems: 'baseline', flexDirection: 'column'}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <img src={ErrorIcon} alt="error" style={{height: '30px', width: '30px', marginRight: '10px'}} />
                        <span>{easeLocal?.Page?.renderError ?? '页面渲染出错'}</span>
                        <span
                            style={{
                                borderBottom: '1px solid rgb(0, 228, 255)',
                                marginLeft: '10px',
                                fontSize: '16px',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                this.setState({hasError: null, loading: true});
                                forceRefresh();
                                setTimeout(() => {
                                    this.setState({hasError: null, loading: false});
                                }, loadingTime);
                            }}>
                            {easeLocal?.Page?.retry ?? '重试'}
                        </span>
                        <span
                            style={{
                                borderBottom: '1px solid rgb(0, 228, 255)',
                                marginLeft: '10px',
                                fontSize: '16px',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                window.location.reload();
                            }}>
                            {easeLocal?.Page?.refresh ?? '刷新'}
                        </span>
                    </div>
                    <div style={{fontSize: '20px', paddingLeft: '42px'}}>
                        {easeLocal?.Page?.message ?? '错误信息'}: {message}
                    </div>
                    <div style={{fontSize: '20px', paddingLeft: '42px', display: 'none'}}>{stack}</div>
                </div>
            );
        }

        return (
            <PageContextProvider {...{id, title, location, navigate, params, search, state, async}}>
                {typeof children === 'function' ? children({key: currentPageKey, search, state, params}) : children}
            </PageContextProvider>
        );
    }
}

Page.contextType = PageContainerContext;

export default connectRouter(connectLocal(connectAction(Page)));
