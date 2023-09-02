/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
/*
 * @Author: sun.t
 * @Date: 2021-06-30 09:21:32
 * @Last Modified by: sun.t
 * @Last Modified time: 2022-07-01 23:37:03
 */

import _ from "lodash";
import { useReducer, useEffect, useCallback } from "react";
import { tree2Flat, getAllTreeKeys } from "../utils";
import { Item } from "./types";

const UpdateSearchAction = "update search value";
const SearchAction = "search";
const InitAction = "init";
const ExpandAction = "expand";
const UpdateExpandedKeysAction = "updateExpandedKeys";
const UpdateDefaultAction = "updateDefault";

type CustomObject = { [key: string]: any };

export const ActionTypes: {
  SearchAction: typeof SearchAction;
  InitAction: typeof InitAction;
  ExpandAction: typeof ExpandAction;
  UpdateExpandedKeysAction: typeof UpdateExpandedKeysAction;
  UpdateDefaultAction: typeof UpdateDefaultAction;
} = {
  SearchAction,
  InitAction,
  ExpandAction,
  UpdateExpandedKeysAction,
  UpdateDefaultAction,
};

interface InitialState {
  searchValue: string;
  expandedKeys: string[];
  defaultExpandedKeys: string[];
  defaultHiddenKeys: string[];
  treeDataMap: { [key: string]: Item };
  autoExpandParent: boolean;
  hiddenKeys: string[];
}

type Action = {
  type:
    | typeof UpdateSearchAction
    | typeof SearchAction
    | typeof InitAction
    | typeof ExpandAction
    | typeof UpdateExpandedKeysAction
    | typeof UpdateDefaultAction;
  payload: CustomObject;
};

type SearchTreeReducer = React.Reducer<InitialState, Action>;

const initialState: InitialState = {
  searchValue: "",
  expandedKeys: [],
  treeDataMap: {},
  autoExpandParent: false,
  defaultExpandedKeys: [],
  defaultHiddenKeys: [],
  hiddenKeys: [],
};

const reducer: SearchTreeReducer = (state, action) => {
  switch (action.type) {
    case UpdateSearchAction: {
      const { searchValue } = action.payload;
      return { ...state, searchValue };
    }
    case SearchAction: {
      const { autoExpandParent } = action.payload;
      let { expandedKeys } = action.payload;
      let { hiddenKeys } = action.payload;
      const { defaultExpandedKeys, defaultHiddenKeys } = state;

      // 如果无展开项，则使用默认展开项
      if (!expandedKeys.length) {
        expandedKeys = defaultExpandedKeys;
      }

      if (!hiddenKeys.length) {
        hiddenKeys = defaultHiddenKeys;
      }

      return {
        ...state,
        expandedKeys,
        hiddenKeys,
        autoExpandParent,
      };
    }
    case InitAction: {
      const { treeData, childrenPropName, keyPropName } = action.payload;
      const treeDataMap = tree2Flat({
        treeData,
        fieldNames: { children: childrenPropName, key: keyPropName },
      });

      return {
        ...state,
        treeDataMap,
        autoExpandParent: false,
      };
    }
    case ExpandAction: {
      return {
        ...state,
        expandedKeys: action.payload.expandedKeys,
        autoExpandParent: action.payload.autoExpandParent,
      };
    }
    case UpdateExpandedKeysAction: {
      return {
        ...state,
        expandedKeys: action.payload.expandedKeys,
      };
    }
    case UpdateDefaultAction: {
      return {
        ...state,
        defaultExpandedKeys: action.payload.defaultExpandedKeys,
      };
    }
    default: {
      throw new Error();
    }
  }
};

interface Props {
  defaultExpandedKeys?: string[];
  defaultHiddenKeys?: string[];
  treeData: Item[];
  fieldNames: { key: string; title: string; children: string };
  expandedKeys?: string[];
  searchValue?: string;
  defaultExpandAll: boolean;
  onSearch?: (value: string) => void;
}

export default function ({
  defaultExpandedKeys,
  defaultHiddenKeys,
  treeData,
  fieldNames,
  expandedKeys,
  searchValue,
  defaultExpandAll,
  onSearch,
}: Props) {
  const [state, dispatch] = useReducer<SearchTreeReducer>(reducer, {
    ...initialState,
    expandedKeys: defaultExpandedKeys || [],
    defaultExpandedKeys: defaultExpandedKeys || [],
    defaultHiddenKeys: defaultHiddenKeys || [],
    hiddenKeys: defaultHiddenKeys || [],
  });

  const { treeDataMap, searchValue: internalSearchValue } = state;

  // 查找设置
  const onInternalSearch = useCallback(
    (value) => {
      value = value.trim();

      if (typeof onSearch === "function") {
        onSearch(value);
        return;
      }

      dispatch({
        type: UpdateSearchAction,
        payload: {
          searchValue: value,
        },
      });
    },
    [onSearch]
  );

  // treeData变化重新初始化内部数据
  useEffect(() => {
    dispatch({
      type: InitAction,
      payload: {
        treeData,
        childrenPropName: fieldNames.children,
        keyPropName: fieldNames.key,
      },
    });
  }, [treeData, fieldNames]);

  // expandedKeys受控场景需要回归到内部状态
  useEffect(() => {
    if (typeof expandedKeys !== "undefined") {
      dispatch({
        type: UpdateExpandedKeysAction,
        payload: { expandedKeys },
      });
    }
  }, [expandedKeys]);

  // defaultExpandedKeys需要被更新到内部状态
  useEffect(() => {
    const payload = {} as CustomObject;

    // 优先按照defaultExpandAll设置全部key作为默认值
    if (defaultExpandAll) {
      payload.defaultExpandedKeys = Object.keys(treeDataMap);
    }

    // 其次按照defaultExpandedKeys设置默认值
    if (typeof defaultExpandedKeys !== "undefined") {
      payload.defaultExpandedKeys = defaultExpandedKeys;
    }

    // 按照defaultHiddenKeys设置默认值
    if (typeof defaultHiddenKeys !== "undefined") {
      payload.defaultHiddenKeys = defaultHiddenKeys;
    }
    dispatch({
      type: UpdateDefaultAction,
      payload,
    });
  }, [defaultExpandedKeys, defaultHiddenKeys, defaultExpandAll, treeDataMap]);

  // searchValue受控场景需要回归到内部状态
  useEffect(() => {
    if (typeof searchValue !== "undefined") {
      dispatch({
        type: UpdateSearchAction,
        payload: {
          searchValue,
        },
      });
    }
  }, [searchValue]);

  // 过滤
  useEffect(() => {
    // 清空场景不用计算
    if (internalSearchValue === "") {
      dispatch({
        type: ActionTypes.SearchAction,
        payload: {
          expandedKeys,
          hiddenKeys: [],
          autoExpandParent: true,
        },
      });
      return;
    }

    // 需要展开的节点: 匹配节点的所有父
    let tempExpandedKeys: string[] = [];
    // 展示节点:匹配节点及匹配节点的所有父
    let tempShowKeys: string[] = [];
    // 匹配节点的直系亲属
    let matchedParentKeys: string[] = [];
    // 匹配的所有节点
    const searchedKey: string[] = [];
    const treeDataList = Object.values(treeDataMap);

    treeDataList.forEach((item) => {
      if (item[fieldNames.title].indexOf(internalSearchValue) > -1) {
        const _treeKeys = item._treeKeys;

        const allParentKeys = [..._treeKeys].splice(0, _treeKeys.length - 1);

        // const allParentKeys = getParentKey({
        //   key: item[keyPropName],
        //   treeData,
        //   childrenPropName,
        //   isAllParents: true,
        // });

        // 本身就是根节点
        if (allParentKeys.length === 0) {
          matchedParentKeys.push(item[fieldNames.key]);
        } else {
          // 当前节点的父
          matchedParentKeys.push(allParentKeys[allParentKeys.length - 1]);
        }

        tempExpandedKeys = [...tempExpandedKeys, ...allParentKeys];

        tempShowKeys = [...tempShowKeys, ..._treeKeys];

        searchedKey.push(item[fieldNames.key]);
      }
    });

    // 去重
    tempExpandedKeys = Array.from(new Set(tempExpandedKeys));
    tempShowKeys = Array.from(new Set(tempShowKeys));
    matchedParentKeys = Array.from(new Set(matchedParentKeys));

    // 将其它非展开父节点隐藏(无展开项时不能隐藏其它)
    // const foldedKeys = tempExpandedKeys.length
    //   ? treeDataList
    //       .filter((item) => typeof item[childrenPropName] !== 'undefined' && !tempExpandedKeys.includes(item[keyPropName]))
    //       .map((item) => item[keyPropName])
    //   : [];

    // const foldedKeys = treeDataList
    //   .filter((item) => typeof item[childrenPropName] !== 'undefined' && !tempExpandedKeys.includes(item[keyPropName]))
    //   .map((item) => item[keyPropName]);

    // 反向找到需要隐藏的节点: 通过tempShowKeys
    let tempHiddenKeys = treeDataList.filter((item) => !tempShowKeys.includes(item[fieldNames.key])).map((item) => item[fieldNames.key]);

    // 如下:需要重新展示出来的子元素
    let showChildrenKeys: string[] = [];

    matchedParentKeys.forEach((parentKey) => {
      const parentNode = treeDataMap[parentKey];

      showChildrenKeys = showChildrenKeys.concat(getAllTreeKeys({ treeData: parentNode[fieldNames.children], fieldNames }));
    });

    // 找到查找到节点的所有排斥兄弟节点, 当同级下所有查找节点都排斥该节点才作为真正被排除
    const brotherKeysMapInSearchedKey = searchedKey.reduce((prev, key) => {
      let brotherKeys = [];
      const node = treeDataMap[key];
      const _treeKeys = node._treeKeys;

      const allParentKeys = [..._treeKeys].splice(0, _treeKeys.length - 1);

      let parentKey: string;

      if (allParentKeys.length === 0) {
        parentKey = "__root__";
        brotherKeys = treeDataList
          .filter((item) => item[fieldNames.key] !== key && item._treeKeys.length === 1)
          .map((item) => item[fieldNames.key]);
      } else {
        parentKey = [...allParentKeys].splice(allParentKeys.length - 1, 1)[0];
        const parent = treeDataMap[parentKey];
        brotherKeys = parent[fieldNames.children].map((item: any) => item[fieldNames.key]).filter((_key: string) => _key !== key);
      }

      prev[key] = {
        parentKey,
        brotherKeys,
      };
      return prev;
    }, {} as any);

    const keyWeightInParent: { [key: string]: { [key: string]: number } } = {};

    Object.keys(brotherKeysMapInSearchedKey).forEach((key) => {
      const { parentKey, brotherKeys } = brotherKeysMapInSearchedKey[key];

      if (typeof keyWeightInParent[parentKey] === "undefined") {
        keyWeightInParent[parentKey] = {};
      }

      brotherKeys.forEach((brotherKey: string) => {
        if (typeof keyWeightInParent[parentKey][brotherKey] === "undefined") {
          keyWeightInParent[parentKey][brotherKey] = 1;
        } else {
          keyWeightInParent[parentKey][brotherKey] += 1;
        }
      });
    });

    let excludeKeys: string[] = [];

    for (const weightKey of Object.keys(keyWeightInParent)) {
      const weightValues = keyWeightInParent[weightKey];

      // 情况1 无值, 被查找到的值是唯一的
      if (Object.keys(weightValues).length === 0) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // 情况2 权重一样
      const firstWeightValue = Object.values(weightValues)[0];
      const isAllWeightSame = Object.values(weightValues).every((weightValue) => weightValue === firstWeightValue);

      if (isAllWeightSame) {
        const children = treeDataMap[weightKey].children;

        if (typeof children === "undefined") {
          // eslint-disable-next-line no-continue
          continue;
        }

        // 情况2-1 匹配到全部
        if (firstWeightValue === children.length - 1) {
          // do nothing
        }
        // 情况2-2 只匹配到1个
        else {
          excludeKeys = excludeKeys.concat(Object.keys(weightValues));
        }

        // eslint-disable-next-line no-continue
        continue;
      }

      // 情况3 权重不同, 排除掉最高权重的值
      const maxWeight = Math.max(...Object.values(weightValues));

      // eslint-disable-next-line @typescript-eslint/no-loop-func
      Object.keys(weightValues).forEach((wKey) => {
        const weightValue = weightValues[wKey];

        if (maxWeight === weightValue) {
          excludeKeys.push(wKey);
        }
      });
    }

    // 从被隐藏的数据中清理掉
    _.remove(tempHiddenKeys, (key) => [...showChildrenKeys].includes(key));

    // 如果父匹配到, 则excludeKeys中会包含其它父节点, 需要排除掉
    tempHiddenKeys = tempHiddenKeys.concat(_.difference(excludeKeys, matchedParentKeys));

    dispatch({
      type: ActionTypes.SearchAction,
      payload: {
        expandedKeys: Array.from(new Set(tempExpandedKeys)),
        hiddenKeys: tempHiddenKeys,
        autoExpandParent: true,
      },
    });
  }, [expandedKeys, internalSearchValue, treeDataMap, fieldNames]);

  return {
    onInternalSearch,
    state,
    dispatch,
  };
}
