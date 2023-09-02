// import {Key} from 'react';
// type Index = 'string' | 'number' | 'symbol' | 'any';
interface Tree {
  [index: string]: any;
}
export interface Flat2TreeProps {
  flatData: any[];
  keyPropName?: string;
  parentKeyPropName?: string;
  isRoot?: (value: number | string) => boolean;
}
export interface Tree2FlatProps {
  treeData: Tree[];
  childrenPropName?: string;
  keyPropName?: string;
  toType?: 'object' | 'array';
  treeKeys?: string[];
  clone?: true;
}