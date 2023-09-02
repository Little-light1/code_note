/*
 * @Author: zhangyu
 * @Date: 2022-11-15 10:56:43
 * @LastEditors: zhangyu
 * @LastEditTime: 2022-11-15 11:03:34
 * @Description:获取local存储的当前语言类型
 *
 */
import {getLocal} from '@utils/storage';

export const currentLanguage = () => {
    return getLocal('i18nextLng');
};
