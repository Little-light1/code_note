import React, {FC} from 'react';
import {Provider} from 'react-redux';
import {useMount} from 'ahooks';
import EaseRouter from './EaseRouter';
import {ActionProvider} from './ActionProvider';
import {LocaleProvider} from './LocaleProvider';
import {AppProps, LogErrorProps} from './types';
import './style/style.scss';

const DefaultHandlers = {
    register: () => {},
    deregister: () => {},
    trigger: () => {},
    logError: ({msg = '', error}: LogErrorProps) => {
        if (error) {
            console.error(error.message);
        }

        if (msg) {
            console.error(msg);
        }
    },
};

const App: FC<AppProps> = ({runtime, handlers = DefaultHandlers, tab, callback, children, state, locale}) => {
    const {
        store,
        historyManager: {history, basename},
    } = runtime;

    useMount(() => {
        // 将参数注入runtime
        runtime.handlers = handlers;
    });

    return (
        <div className="ease-app">
            <Provider store={store}>
                <LocaleProvider locale={locale}>
                    <ActionProvider runtime={runtime} handlers={handlers} callback={callback} state={state} tab={tab}>
                        <EaseRouter basename={basename} history={history}>
                            {children}
                        </EaseRouter>
                    </ActionProvider>
                </LocaleProvider>
            </Provider>
        </div>
    );
};

export default App;
