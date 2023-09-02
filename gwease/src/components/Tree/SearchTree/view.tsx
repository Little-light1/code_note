import React, { FC, useCallback, useRef, memo, useMemo, Key } from "react";
import { Tree, Input, Empty } from "antd";
import { useSize } from "ahooks";
import { loop } from "./helper";
import useSearchTree, { ActionTypes } from "./useSearchTree";

import { SearchTreeProps } from "./types";
import "./styles.scss";
import { DEFAULT_FIELD_NAMES } from "../constant";

const { Search } = Input;

const EMPTY_LIST: any[] = [];

const defaultShowLine = { showLeafIcon: false };
const SearchTree: FC<SearchTreeProps> = ({
  isShowSearch = true,
  expandedKeys = EMPTY_LIST,
  defaultHiddenKeys,
  defaultExpandedKeys,
  treeData,
  checkedKeys,
  selectedKeys,
  checkable = true,
  defaultExpandAll = false,
  showLine = defaultShowLine,
  virtual = false,
  fieldNames,
  nodeTitleClassName = "",
  placeholder = "",
  searchValue = "",
  autoHalfCheckedInStrictly,
  subTitleRender,
  onCheck,
  onSelect,
  onExpand,
  onSearch,
  ...args
}) => {
  const treeContainerRef = useRef(null);
  const size = useSize(treeContainerRef);
  const mergeFieldNames = useMemo(() => ({ ...DEFAULT_FIELD_NAMES, ...fieldNames }), [fieldNames]);
  const keyPropName = mergeFieldNames.key;
  const childrenPropName = mergeFieldNames.children;
  const titlePropName = mergeFieldNames.title;
  const { state, dispatch, onInternalSearch } = useSearchTree({
    searchValue,
    defaultHiddenKeys,
    defaultExpandedKeys,
    treeData,
    fieldNames: mergeFieldNames,
    expandedKeys,
    defaultExpandAll,
  });
  const {
    treeDataMap,
    expandedKeys: expandedKeysState,
    hiddenKeys: hiddenKeysState,
    autoExpandParent,
    searchValue: internalSearchValue,
  } = state;

  const onInternalExpand = useCallback(
    (keys, info) => {
      dispatch({
        type: ActionTypes.ExpandAction,
        payload: {
          expandedKeys: keys,
          autoExpandParent: false,
        },
      });

      onExpand && onExpand(keys, info);
    },
    [dispatch, onExpand]
  );

  const onInternalSelect = useCallback(
    (keys, info) => {
      const selectedNodes = keys.map((key: string) => treeDataMap[key]);

      onSelect && onSelect(keys, selectedNodes, info);
    },
    [treeDataMap, onSelect]
  );

  const onInternalCheck = useCallback(
    (
      keys:
        | Key[]
        | {
            checked: Key[];
            halfChecked: Key[];
          },
      info
    ) => {
      if (keys instanceof Array) {
        const checkedNodes = keys.map((key) => treeDataMap[key]);

        onCheck && onCheck(keys, checkedNodes, info);
        return;
      }

      const { checked } = keys;

      const checkedNode = checked.map((key) => treeDataMap[key]);
      const tempHalfChecked = new Set<Key>();
      if (autoHalfCheckedInStrictly) {
        // 自动帮助判断父半选状态
        checkedNode.forEach(({ _treeKeys }) => {
          [..._treeKeys].splice(0, _treeKeys.length - 1).forEach((key: Key) => tempHalfChecked.add(key));
        });
      }

      onCheck &&
        onCheck(
          { checked, halfChecked: Array.from(tempHalfChecked) },
          { checked: checkedNode, halfChecked: Array.from(tempHalfChecked).map((key) => treeDataMap[key]) },
          info
        );
    },
    [autoHalfCheckedInStrictly, onCheck, treeDataMap]
  );

  const treeDataTemp = loop({
    treeData,
    searchValue: internalSearchValue,
    subTitleRender,
    nodeTitleClassName,
    titlePropName,
    keyPropName,
    childrenPropName,
    hiddenKeys: hiddenKeysState,
  });

  return (
    <div
      className="ease-search-tree"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {isShowSearch ? <Search style={{ marginBottom: 8 }} placeholder={placeholder} onSearch={onInternalSearch} /> : null}
      <div className="ease-search-tree-container" ref={treeContainerRef}>
        {treeDataTemp && treeDataTemp.length > 0 ? (
          <Tree
            virtual={virtual}
            height={size?.height}
            checkable={checkable}
            onExpand={onInternalExpand}
            showLine={showLine}
            expandedKeys={expandedKeysState}
            autoExpandParent={autoExpandParent}
            fieldNames={mergeFieldNames} // 4.17.0
            treeData={treeDataTemp}
            checkedKeys={checkedKeys}
            selectedKeys={selectedKeys}
            onCheck={onInternalCheck}
            onSelect={onInternalSelect}
            {...args}
          />
        ) : (
          <Empty className="ease-tree-empty" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </div>
  );
};

export default memo(SearchTree);
