/*
 * @Author: zhangyu
 * @Date: 2022-10-30 10:35:33
 * @LastEditors: zhangyu
 * @LastEditTime: 2022-11-04 14:31:23
 * @Description:
 *
 */
import axios from 'axios';
import {po} from 'gettext-parser';
import {I18nResources, initI18n} from '@gwaapp/ease';
import {i18n as I18nClass} from 'i18next';
import {Locals} from '@common/constant/locale';

// eslint-disable-next-line import/no-mutable-exports
export let i18nIns: I18nClass;

const SCOPE = 'oc';

const getFun = (lanType: string) =>
    axios({
        method: 'get',
        url: `/public/getText/${lanType}.po`,
        responseType: 'arraybuffer',
        baseURL: '',
    });

export async function asyncI18n() {
    const langs = Object.keys(Locals);

    return Promise.all(langs.map((l) => getFun(l)))
        .then((responses) => {
            // {
            //     zh: {
            //         oc: {},
            //     },
            //     en: {
            //         oc: {},
            //     },
            //     es: {
            //         oc: {},
            //     },
            // }
            const resources: I18nResources = langs.reduce(
                (prev, curr) => ({[curr]: {[SCOPE]: {}}, ...prev}),
                {},
            );

            responses.forEach((res, i) => {
                const lanType = langs[i];
                const data = po.parse(Buffer.from(res.data)).translations[''];
                for (const key in data) {
                    if (key !== '') {
                        resources[lanType][SCOPE][key] = data[key].msgstr[0];
                    }
                }
            });

            const prevLng = localStorage.getItem('i18nextLng');

            i18nIns = initI18n({
                resources,
                options: {
                    ns: [SCOPE, 'common'],
                    defaultNS: SCOPE,
                    lng: prevLng || 'zh',
                },
            });
        })
        .catch(() => {
            console.error('多语言获取失败');
        });

    // getFun('zh');
    // getFun('en');
    // getFun('es');
    // console.log(resourceObj, '<===============');

    // return resourceObj;
}
