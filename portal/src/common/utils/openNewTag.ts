/*
 * @Author: zhangzhen
 * @Date: 2022-09-28 17:11:15
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-12-15 10:09:23
 *
 */

import {getLocal} from './storage';
/**
 * @description:
 * @param {string} url
 * @param {Record} param
 * @param {Record} language
 * @param {boolean} urlEncode
 * @return {*}
 */
export const openNewTag = (
    url: string,
    param: Record<string, any>,
    language: Record<string, any>,
    urlEncode?: boolean,
) => {
    // 有参数
    if (param) {
        const paramArr = Object.keys(param);
        const valueArr: string[] = Object.values(param);
        // 转换url参数格式
        let paramString = '';
        if (urlEncode) {
            paramString = paramArr
                .map(
                    (item, index) =>
                        `${item}=${encodeURIComponent(valueArr[index])}`,
                )
                .join('&');
        } else {
            paramString = paramArr
                .map((item, index) => `${item}=${valueArr[index]}`)
                .join('&');
        }

        if (language) {
            paramString = `${paramString}&${language.paramKey}=${
                language.langMap[getLocal('i18nextLng') || 'zh']
            }`;
        }

        // 判断跳转的地址
        if (url.indexOf('?') > -1) {
            window.open(`${url}&${paramString}`);
        } else {
            window.open(`${url}?${paramString}`);
        }
        return;
    }
    // 无参数
    window.open(url);
};
