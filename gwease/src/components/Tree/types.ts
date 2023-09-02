// type TreeData<Key = "key", Children = "children"> = {
//   [key: Key]: string;
//   [children: Children]: TreeData<Key, Children>;
// }[];

interface TreeNode {
  [index: string]: any;
}

export interface FieldNames {
  key?: string;
  parentKey?: string;
  title?: string;
  children?: string;
}

export interface Flat2TreeProps {
  flatData: TreeNode[];
  fieldNames?: Pick<FieldNames, "key" | "parentKey">;
  isRoot?: (value: number | string) => boolean;
}

export interface Tree2FlatProps {
  treeData: TreeNode[];
  fieldNames?: Pick<FieldNames, "key" | "children">;
  toType?: "object" | "array";
  treeKeys?: string[];
  clone?: true;
}

export interface LoopExcludeTreePropsProps {
  treeData: { [key: string]: any };
  excludeFieldNames?: string[];
  fieldNames?: Pick<FieldNames, "children">;
}

export interface LoopToAntdTreeDataProps {
  treeData: { [key: string]: any };
  fieldNames?: Pick<FieldNames, "key" | "title" | "children">;
  getKey?: (node: any, index: number) => string;
  indexKeys?: number[];
  parentNodes?: any[];
  parentKey?: string;
  attachNodeProps?: (result: any, currentIndexKeys: number[], parentNodes: any[]) => Record<string, any>;
  needAttachParentNodes?: boolean;
  needAttachIndexKeys?: boolean;
  needAttachIndexParentKey?: boolean;
  clone?: boolean;
}

export interface LoopSearchTreeProps {
  treeData: TreeNode[];
  matchValue: string;
  matchFieldName?: string;
  fieldNames?: Pick<FieldNames, "children">;
}

export interface GetParentKeyProps {
  matchKey: string;
  treeData: TreeNode[];
  fieldNames?: Pick<FieldNames, "key" | "children">;
  isAllParents?: boolean;
}

export interface GetAllParentKeysProps {
  treeData: TreeNode[];
  fieldNames?: Pick<FieldNames, "key" | "children">;
}

export interface GetFirstLeafNode {
  treeData: TreeNode[];
  fieldNames?: Pick<FieldNames, "children">;
}

export interface LoopCleanLeaf {
  treeData: any[];
  fieldNames?: Pick<FieldNames, "children">;
  judgeIsLeaf: (node: any, currentIndexKeys: number[]) => boolean;
  indexKeys?: number[];
}

export interface LoopGetAllTreeKeysProps {
  treeData: any[];
  fieldNames?: Pick<FieldNames, "key" | "children">;
  filter?: (item: any) => boolean;
}
