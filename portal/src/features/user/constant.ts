/*
 * @Author: sds
 * @Date: 2021-12-01 15:37:18
 * @Last Modified by: sun.t.t
 * @Last Modified time: 2022-11-21 21:21:18
 */

import {i18nIns} from '@/app/i18n';

const {t} = i18nIns;

export const USER_MODAL_ID = 'userModalID';
export const USER_PASSWORD_MODAL_ID = 'passwordModalID';
export const USER_IMPORT_MODAL_ID = 'userImportModalID';
export const USER_ROLE_MODAL_ID = 'userRoleModalID';
export const USER_STATE = {
    ENABLE: {
        value: 0,
        name: t('激活'),
        enum: 'ENABLE',
    },
    DISABLE: {
        value: 1,
        name: t('禁用'),
        enum: 'DISABLE',
    },
    SLEEP: {
        value: 2,
        name: t('休眠'),
        enum: 'SLEEP',
    },
    LOGOUT: {
        value: 3,
        name: t('注销'),
        enum: 'LOGOUT',
    },
};
export const USER_LIFE_CYCLE = [
    // {text: '全部', value: null, key: 'ALL'},
    {
        text: t('永久'),
        value: 0,
        key: 'LONG',
    },
    {
        text: t('有限'),
        value: 1,
        key: 'TEMP',
    },
];
export const USER_STATE_LIST = [
    // {text: '全部', value: null, key: 'ALL'},
    {
        text: t('激活'),
        value: 0,
        key: 'ENABLE',
    },
    {
        text: t('休眠'),
        value: 2,
        key: 'SLEEP',
    },
    {
        text: t('注销'),
        value: 3,
        key: 'LOGOUT',
    },
];
export const SYS_USER = ['AuditAdmin', 'BizAdmin', 'BizUser', 'BDMSAdmin'];
// 本子级code
export const LOCAL_AND_SON_LEVEL = 'LocalAndSonLevel';
