/*
 * @Author: zhangzhen
 * @Date: 2022-11-22 17:21:15
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-11-24 17:21:29
 *
 */
import CryptoJS from 'crypto-js';

/**
 * @description:"AES加密"
 * @param {string} password
 * @return {string}
 */
export const encryptionPassword = (password: string): string => {
    // 密钥
    const key = CryptoJS.enc.Utf8.parse('GOLDWIND_AAPP!@#');

    const encrypted = CryptoJS.AES.encrypt(password, key, {
        iv: key,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    // base64加密
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
};

/**
 * @description: "AES解密"
 * @param {string} password
 * @return {string}
 */
// export const decryptionPassword = (password: string): string => {};
