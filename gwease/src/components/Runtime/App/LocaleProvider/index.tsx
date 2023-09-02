/*
 * @Author: sun.t
 * @Date: 2021-08-30 15:57:32
 * @Last Modified by: sun.t
 * @Last Modified time: 2022-12-09 14:12:16
 */
import React, {FC, useContext} from 'react';
import zhCN from '../../../locale-provider/zh_CN.json';
import type {Locale} from '../types';

export const Context = React.createContext<Locale>({} as Locale);

interface LocaleProviderProps {
    locale?: Locale;
}

export const LocaleProvider: FC<LocaleProviderProps> = ({children, locale = zhCN}) => (
    <Context.Provider value={locale as Locale}>{children}</Context.Provider>
);

export function useLocale(scope: string): Record<string, string>;
export function useLocale(): Locale;
export function useLocale(scope = '') {
    const context = React.useContext(Context);
    if (context === undefined) {
        throw new Error(`useLocale must be used within a LocaleProvider`);
    }

    if (Object.keys(context).length === 0) {
        // @ts-ignore
        return scope ? zhCN[scope] : zhCN;
    }

    return scope ? context[scope] : context;
}

LocaleProvider.propTypes = {
    // children: PropTypes.node,
    // eslint-disable-next-line react/forbid-prop-types
};

// ActionProvider.defaultProps = {
//   children: null,
// };

interface EaseLocal {
    easeLocal: Locale;
}

export function connectLocal<P = any>(Child: React.ComponentType<P | EaseLocal>) {
    const Component: FC<Omit<P, keyof EaseLocal>> = (props) => {
        const context = useContext(Context);

        return <Child easeLocal={context} {...props} />;
    };
    return Component;
}

// 模板替换方法
// 替换内容为 template("{name}很厉害，才{age}岁",{name:'小美',age:18})
// 当没有全匹配的时候会返回defaultValue
export function template(temp: string, context?: Record<string, string | number>, defaultValue?: string) {
    if (!context) return temp;

    let isAllMatch = true;
    const newTxt = temp.replace(/{.*?}/g, (match) => {
        const res = context[match.replace(/[{}]/g, '').trim()];

        if (typeof res !== 'undefined') {
            return String(res);
        }

        isAllMatch = false;
        return match;
    });

    // eslint-disable-next-line no-nested-ternary
    return isAllMatch ? newTxt : typeof defaultValue !== 'undefined' ? defaultValue : temp;
}

type TProps = {locale: Record<string, string>; key: string; context?: Record<string, string | number>; defaultValue?: string};
export function t({locale, key, context, defaultValue}: TProps) {
    const temp = locale[key];
    if (typeof temp === 'undefined') {
        return key;
    }

    return template(temp, context, defaultValue);
}
