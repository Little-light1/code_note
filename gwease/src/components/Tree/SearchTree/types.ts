import { TreeProps } from "antd";
import { DataNode, EventDataNode } from "antd/lib/tree";
import { Key } from "react";

export interface Item {
  key: string;
  title: string;
  children?: Item[];
  [key: string]: any;
}

// type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

// interface RichItem extends Omit<Item, 'title' | 'children'> {
//   title: React.ReactElement;
//   children?: RichItem[];
// }

export interface LoopProps {
  treeData: Item[];
  searchValue: string;
  subTitleRender?: (item: any) => React.ReactElement;
  nodeTitleClassName?: string;
  hiddenKeys: string[];
  titlePropName: string;
  keyPropName: string;
  childrenPropName: string;
}

export interface SearchTreeProps extends Omit<TreeProps, "onCheck" | "onSelect"> {
  isShowSearch?: boolean;
  expandedKeys?: string[];
  defaultHiddenKeys?: string[];
  defaultExpandedKeys?: string[];
  treeData: Item[];
  nodeTitleClassName?: string;
  placeholder?: string;
  searchValue?: string;
  subTitleRender?: (item: any) => React.ReactElement;
  autoHalfCheckedInStrictly?: boolean;
  onCheck?: (
    checked:
      | {
          checked: Key[];
          halfChecked: Key[];
        }
      | Key[],
    checkedNodes:
      | any[]
      | {
          checked: any[];
          halfChecked: any[];
        },
    info: any
  ) => void;
  onSelect?: (
    selectedKeys: Key[],
    selectedNodes: any[],
    info: {
      event: "select";
      selected: boolean;
      node: EventDataNode<Item>;
      selectedNodes: DataNode[];
      nativeEvent: MouseEvent;
    }
  ) => void;
  onSearch?: (value: string) => void;
  //   onExpand: (expendKeys: string[]) => void;
}
