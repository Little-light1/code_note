/*
 * @Author: sds
 * @Date: 2021-12-01 15:38:07
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2023-06-26 10:02:38
 */
// 临时处理方法
/* eslint-disable */
export function uuid2() {
    const chars0 =
        '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@'.split(
            '',
        );
    const chars1 = '123456789'.split('');
    const chars2 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const chars3 = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const chars4 = '@'.split('');
    const uuid = [];

    uuid[0] = chars0[0 | (Math.random() * chars0.length)];
    uuid[1] = chars0[0 | (Math.random() * chars0.length)];
    uuid[2] = chars0[0 | (Math.random() * chars0.length)];
    uuid[3] = chars0[0 | (Math.random() * chars0.length)];

    uuid[4] = chars1[0 | (Math.random() * chars1.length)];
    uuid[5] = chars2[0 | (Math.random() * chars2.length)];
    uuid[6] = chars3[0 | (Math.random() * chars3.length)];
    uuid[7] = chars4[0 | (Math.random() * chars4.length)];

    return uuid.join('');
}
