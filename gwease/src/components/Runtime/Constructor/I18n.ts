import i18nNext, {i18n, InitOptions} from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import type {I18nResources} from './types';
import {log} from '../../../utils/log';

interface InitI18nProps {
    options?: InitOptions;
    defaultI18n?: string;
    resources?: I18nResources;
}

// 默认组装函数，页面为独立的命名空间
// export function constructDefaultI18nResources(i18n: I18nResources, pages: PageConfig[]) {
//     const resources = i18n;

//     pages.forEach(({key, i18n: pageI18n}) => {
//         if (pageI18n) {
//             Object.keys(pageI18n).forEach((i18nKey) => {
//                 typeof resources[i18nKey] === 'undefined' && (resources[i18nKey] = {});
//                 resources[i18nKey][key] = pageI18n[i18nKey];
//             });
//         }
//     });

//     return resources;
// }

export function initI18n({defaultI18n = 'zh', options = {}, resources = {}}: InitI18nProps): i18n {
    i18nNext
        // https://github.com/i18next/i18next-browser-languageDetector
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
            // https://www.i18next.com/principles/fallback#language-fallback
            fallbackLng: defaultI18n, // 默认当前语言环境
            interpolation: {
                escapeValue: false, // escapes passed in values to avoid XSS injection, not needed for react as it escapes by default
            },
            // ns: Object.keys(zhCNResources),
            resources,
            detection: {
                caches: ['localStorage', 'sessionStorage', 'cookie'],
            },
            saveMissing: true,
            // extra props: updateMissing, options
            missingKeyHandler: (lngs, ns, key, fallbackValue) => {
                log({module: 'I18n', sketch: `missing i18n: ${lngs.join(',')}-${ns}-${key}, fallbackValue:${fallbackValue}`, type: 'warn'});
            },
            ...options,
        });

    return i18nNext;
}
