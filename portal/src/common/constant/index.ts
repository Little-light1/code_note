/*
 * @Author: sun.t
 * @Date: 2022-12-12 10:29:45
 * @Last Modified by: sun.t
 * @Last Modified time: 2022-12-12 10:30:53
 * @Description: ※注意※ 这个文件不能被app下任何目录引用，否则会造成多语言的问题
 */
import {i18nIns} from '@/app/i18n';

const {t} = i18nIns;

function createConstant<T>(target: T): T {
    return Object.freeze(target);
} // 字典类型

export const DICT_TYPES = createConstant({
    class: {
        key: 0,
        title: t('分类'),
    },
    dict: {
        key: 1,
        title: t('字典'),
    },
    item: {
        key: 2,
        title: t('字典值'),
    },
});

// 字典项key
export const PAGE_RESOURCE_DICT_KEY = 'SOURCETYPE'; // 组织机构类型

export const ORGANIZATION_TYPES = {
    // 电场
    farm: '170',
};

// 应用
export const APPLICATION = {
    bi: {code: 'BI'},
    dataplat: {code: 'DataPlat'},
};
