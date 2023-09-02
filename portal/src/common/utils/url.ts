import qs from 'query-string';
import {match} from 'path-to-regexp'; // 解析url中的search params提取成对象

export const parseSearchParams = (url: string) => {
    const splitUrl = url.split('?');

    if (splitUrl.length >= 2) {
        return qs.parse(splitUrl[1]);
    }

    return {};
}; // 解析url中url params提成对象

export const parseUrlParams = (url: string, defineUrl: string) => {
    const matchUrl = match(defineUrl, {
        decode: decodeURIComponent,
    });
    const result = matchUrl(url);

    if (result) {
        const {params} = result;
        return params;
    }

    return {};
}; // 根据path定义将url中的url params解析成对象

export const parse = (url: string, defineUrl: string) => ({
    urlParams: parseUrlParams(url, defineUrl),
    searchParams: parseSearchParams(url),
});
