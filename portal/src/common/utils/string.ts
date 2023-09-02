export const formatSimpleAction = (str: string) =>
    `set${str[0].toUpperCase() + str.substr(1)}`;
/**
 * 生成随机字符串
 * @param length 长度
 * @param chars 可选的字符
 * @returns
 * @description
 */

export const randomStr = (
    length = 8,
    chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
) => {
    let result = ''; // eslint-disable-next-line no-plusplus

    // eslint-disable-next-line no-plusplus
    for (let i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];

    return result;
};
