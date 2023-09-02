import { Key } from "react";
import { DataNode, EventDataNode } from "antd/lib/tree";
import { Item } from "../SearchTree/types";

export interface SearchTreeSelectProps {
  placeholder?: string;
  searchPlaceholder?: string;
  value?: string | (({ checkedKeys, leafs }: { checkedKeys: string[]; leafs: any[]; selectedKeys?: string[] }) => string);
  checkedKeys?: string[];
  selectedKeys?: string[];
  dropdownHeight?: number;
  dropdownWidth?: number;
  checkable?: boolean;
  treeData: Item[];
  fieldNames?: { key?: string; title?: string; children?: string };
  defaultExpandedKeys?: string[];
  autoHalfCheckedInStrictly?: boolean;
  onCheck?: (
    checked:
      | {
          checked: Key[];
          halfChecked: Key[];
        }
      | Key[],
    checkedNodes: any[],
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
}
