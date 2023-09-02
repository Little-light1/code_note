/*
 * @Author: zhangzhen
 * @Date: 2022-07-21 13:46:39
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-07-27 15:27:57
 *
 */
export interface DictModel {
  dictModelId: number;
  dictModelName: string;
  dictModelCode: string;
  dictModelMark: string;
  dictModelSort: number;
  isEnable: number;
  type: number;
  treeKey: string;
  parentTreeKey?: string;
}
export interface FetchDictModelVOPageByParentIdProps {
  dictType: number; // 0:分类 1:枚举

  parentId: number; // 父ID

  page?: number; // 页码 default 1

  pageSize?: number; // 每页数量 default 10

}
export interface DictModelList {
  records: any[];
  total: number;
  size: number;
  current: number;
  orders: any[];
  optimizeCountSql: boolean;
  hitCount: boolean;
  searchCount: boolean;
  pages: number;
}
export interface AddDictItemProps {
  dictdataCode: string;
  dictdataDesc: string;
  dictdataIsenabled: number;
  dictdataName: string;
  dicttypeId: number;
  dictdataParentid: number;
}
export interface AddDictClassProps {
  dicttypeCode: string;
  dicttypeParentid: number;
  dicttypeIsenabled: number;
  dicttypeName: string;
}
export interface UpdateDictItemProps extends AddDictItemProps {
  dictdataId: number;
}
export interface UpdateDictClassProps {
  dicttypeCode: string;
  dicttypeId: number;
  dicttypeIsenabled: number;
  dicttypeName: string;
}
export interface DictTree {
  children?: DictTree[];
  dictdataCode: string; // "dictdataCreateBy": "string",
  // "dictdataCreatetime": string

  dictdataDesc: string;
  dictdataId: number;
  dictdataIsenabled: number;
  dictdataMark: string;
  dictdataName: string;
  dictdataParentid: number;
  dictdataSort: number;
  dictdataUpdateBy: string;
  dictdataUpdatetime: string;
  dicttypeId: number;
  dictdataValue: string | number;
}
export interface DictList {
  list: DictTree[];
  total: number;
}