/*
 * @Author: zhangzhen
 * @Date: 2022-07-21 13:46:40
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-07-27 14:13:47
 *
 */
// 表格数据
export type TableDataType = {
  index: number;
  createTime: string;
  dealStatus: {
    value: string;
    enum: string;
    desc: string;
  };
  dealTime: string;
  noticeBusinessId: string;
  noticeCause: string;
  noticeContent: string;
  noticeId: number;
  noticeLevel: '1' | '2' | '3' | string;
  noticeObjectName: string;
  noticeType: '1' | '2' | '3' | string;
  proCode: string;
  dealUserId: 'string';
  dealUser: {
    userName: string;
  };
}; // 后台获取接口数据

export type ResponseType<T> = {
  code: string | number;
  data: T;
  msg?: string;
}; // 能源类型

export type ListType = {
  list: TableDataType[];
  pageNum: number;
  pageSize: number;
  total: number;
};