/*
 * @Author: sds
 * @Date: 2021-12-01 15:38:07
 * @Last Modified by: sds
 * @Last Modified time: 2022-01-10 09:23:47
 */
// 临时处理方法

/* eslint-disable */
export function uuid2() {
  const chars0 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const chars1 = '0123456789'.split('');
  const chars2 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const chars3 = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const uuid = [];
  uuid[0] = chars0[0 | Math.random() * chars0.length];
  uuid[1] = chars0[0 | Math.random() * chars0.length];
  uuid[2] = chars0[0 | Math.random() * chars0.length];
  uuid[3] = chars0[0 | Math.random() * chars0.length];
  uuid[4] = chars1[0 | Math.random() * chars1.length];
  uuid[5] = chars2[0 | Math.random() * chars2.length];
  uuid[6] = chars3[0 | Math.random() * chars3.length];
  uuid[7] = chars0[0 | Math.random() * chars0.length];
  uuid[8] = chars1[0 | Math.random() * chars1.length];
  uuid[9] = chars2[0 | Math.random() * chars2.length];
  uuid[10] = chars3[0 | Math.random() * chars3.length];
  uuid[11] = chars0[0 | Math.random() * chars0.length];
  uuid[12] = chars1[0 | Math.random() * chars1.length];
  uuid[13] = chars2[0 | Math.random() * chars2.length];
  uuid[14] = chars3[0 | Math.random() * chars3.length];
  uuid[15] = chars0[0 | Math.random() * chars0.length];
  uuid[16] = chars1[0 | Math.random() * chars1.length];
  uuid[17] = chars2[0 | Math.random() * chars2.length];
  uuid[18] = chars3[0 | Math.random() * chars3.length];
  uuid[19] = chars0[0 | Math.random() * chars0.length];
  return uuid.join('');
}