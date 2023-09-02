/*
 * @Author: shimmer
 * @Date: 2022-05-11 16:55:08
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-08-08 09:50:17
 *
 */
import {LazyLoader} from '@gwaapp/ease';
import {i18nIns} from '@/app/i18n';
import i18nJson from './i18n.json';

const {t} = i18nIns;

// console.log(i18nIns.options.resources);

const component = LazyLoader(() => import('./view'));
export const key = 'alarmCenter';
export const title = '告警中心';
export const route = {
    key,
    title,
    path: '/alarmCenter',
    component,
    exact: false,
};
export const reducers = {
    isFirstLoad: {
        initialState: true,
    },
    tableData: {
        initialState: [],
    },
    tableColumns: {
        initialState: [],
    },
    searchFormValue: {
        initialState: {},
    },
    formValue: {
        initialState: {},
    },
    total: {
        initialState: 0,
    },
    pageSize: {
        initialState: 20,
    },
    pageNum: {
        initialState: 1,
    },
    isTableLoading: {
        initialState: false,
    },
    detailModalVisible: {
        initialState: false,
    },
    alarmDetailInfo: {
        initialState: {},
    },
    alarmDetailArr: {
        initialState: [],
    },
    alarmType: {
        initialState: [
            {
                value: '',
                text: t('全部'),
            },
        ],
    },
    alarmTypeArr: {
        initialState: [],
    },
    alarmLevel: {
        initialState: [
            {
                value: '',
                text: t('全部'),
            },
        ],
    },
    alarmLevelArr: {
        initialState: [],
    },
};
export const i18n = i18nJson;
export default component;
