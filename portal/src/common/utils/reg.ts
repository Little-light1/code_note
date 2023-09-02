/* eslint-disable no-misleading-character-class */
/* eslint-disable no-useless-escape */
/*
 * @Author: gxn
 * @Date: 2022-01-06 16:42:10
 * @LastEditors: gxn
 * @LastEditTime: 2022-01-18 16:47:38
 * @Description: reg.ts
 */

import {i18nIns} from '@/app/i18n';

const {t} = i18nIns;

// 特殊符号
export const specificSymbol =
    /^[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im; // emoji表情

export const emoji =
    /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi; // 验证表情

export const checkEmoji = (value: string) => new RegExp(emoji).test(value);
export const checkEmojiMsg = t('不支持输入表情'); // 只能输入中文英文数字

// 菜单管理
export const regNoCnEnPu = /^[\u4E00-\u9FA5A-Za-z0-9\s()（）.。]+$/gi;
export const regNoCnEnPuMsg = t('请输入数字、汉字、字母、括号或者句号');
export const onlyCnEnNo = /^[\u4E00-\u9FA5A-Za-z0-9\s]+$/gi;
// export const onlyCnEnNoW = /^[\u4E00-\u9FA5A-Za-z0-9]+$/gi;
export const onlyCnEnNoW = /^[\S]+$/gi;
// export const onlyCnEnNoMax15 = /^[\u4E00-\u9FA5A-Za-z0-9\s]{1,15}$/gi;

export const onlyCnEnNoMsg = t('请输入数字、汉字或字母');
export const onlyNoEnUnder = /^[A-Za-z0-9_]+$/gi;
export const onlyNoEnUnderMsg = t('请输入数字、字母或下划线'); // 只能输入数字和字母

export const onlyEnNo = /^[A-Za-z0-9]+$/gi;
export const onlyEnNoMsg = t('请输入数字或字母'); // url

export const checkUrl = /[a-zA-z]+:\/\/[^\s]*/;
export const checkUrlMsg = t('请输入正确的地址'); // url 相对路径

export const relateUrl = /^(\/)[A-Za-z0-9/\-_&?%#=+.]+$|^(\/)$/g;
export const relateUrlMsg = t('请输入正确的相对路径'); // url 绝对路径
// export const absUrl = /^((http|https):\/\/)(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/?:]?.*$/;

export const absUrl =
    /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@%!$&'()*+,;=.]+$/;
export const absUrlMsg = t('请输入正确的绝对路径'); // 只能输入数字和字母+/

export const onlyEnNoAndLine = /^[A-Za-z0-9/]+$/gi;
export const onlyEnNoAndLineMsg = t('请输入数字、字母或斜杠'); // 验证绝对地址

export const checkAbsUrl = (url: string) => new RegExp(absUrl).test(url); // 验证相对路径

export const checkRelUrl = (url: string) => new RegExp(relateUrl).test(url); // false不合法
// console.log(reg2.test(str))
// 替换字符
// console.log(str.replace(reg, ''));
//
// function bind(el, binding, vnode) {
//   // 正则规则可根据需求自定义
//   var regRule =
//     /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;
//   let $inp = findEle(el, 'input');
//   el.$inp = $inp;
//   $inp.handle = function () {
//     let val = $inp.value;
//     $inp.value = val.replace(regRule, '');
//     trigger($inp, 'input');
//   };
//   $inp.addEventListener('keyup', $inp.handle);
// }
// function unbind(el) {
//   el.$inp.removeEventListener('keyup', el.$inp.handle);
// }
// 手机号脱敏

export const phoneEncryption = (value: string): string => {
    if (!value) {
        return value;
    }

    const reg = /^(\d{3})\d{4}(\d{4})$/;
    return value.replace(reg, '$1****$2');
}; // 手机号脱敏

export const emailEncryption = (value: string): string => {
    if (!value) {
        return value;
    }

    const reg = /(.{0,3}).*@(.*)/;
    return value.replace(reg, '$1***@$2');
}; // 手机号脱敏

export const IDCardEncryption = (value: string): string => {
    if (!value) {
        return value;
    }

    const reg = /^(.{6})(?:\d+)(.{2})$/;
    return value.replace(reg, '$1**********$2');
};
