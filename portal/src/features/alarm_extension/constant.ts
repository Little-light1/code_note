/*
 * @Author: zhangzhen
 * @Date: 2022-07-04 11:04:14
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-08-12 10:42:01
 *
 */
// url 相对路径
export const relateUrl = /^(\/)[A-Za-z0-9/-_&?%#=+]+$|^(\/)$/g;
export const relateUrlMsg = 'alarmExtension.relateUrlMsg'; // url 绝对路径

export const absUrl =
    /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
export const absUrlMsg = 'alarmExtension.absUrlMsg'; // 只能输入数字和字母+/

export const onlyEnNoAndLine = /^[A-Za-z0-9/]+$/gi;
export const onlyEnNoAndLineMsg = 'alarmExtension.onlyEnNoAndLineMsg'; // 验证绝对地址

export const checkAbsUrl = (url: string) => new RegExp(absUrl).test(url); // 验证相对路径

export const checkRelUrl = (url: string) => new RegExp(relateUrl).test(url);
