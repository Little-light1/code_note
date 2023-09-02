import _ from "lodash";
import { DEFAULT_FIELD_NAMES } from "./constant";
import {
  Flat2TreeProps,
  Tree2FlatProps,
  LoopSearchTreeProps,
  LoopExcludeTreePropsProps,
  LoopToAntdTreeDataProps,
  GetParentKeyProps,
  LoopCleanLeaf,
  LoopGetAllTreeKeysProps,
  GetAllParentKeysProps,
  GetFirstLeafNode,
} from "./types";

const getHasOwnProperty = (obj: Object, property: string) => Object.prototype.hasOwnProperty.call(obj, property);

/**
 * 扁平 => 树
 * @param {*} params
 * @param {string} params.flatData - 扁平结构数据
 * @param {object} params.fieldNames - 自定义属性名节点
 * @param {string} params.isRoot - 判断根节点方法
 * @returns
 */
export function flat2Tree({ flatData = [], fieldNames = {}, isRoot = (value) => value === "" }: Flat2TreeProps) {
  const mergeFieldNames = { ...DEFAULT_FIELD_NAMES, ...fieldNames };

  const res: any[] = [];
  const map: Record<string, any> = {};

  for (const item of flatData) {
    const keyValue = item[mergeFieldNames.key];
    const parentKeyValue = item[mergeFieldNames.parentKey];

    map[keyValue] = {
      ...item,
      //   children: getHasOwnProperty(map, keyValue) ? map[keyValue].children : [],
    };

    const newItem = map[keyValue];
    if (isRoot(parentKeyValue)) {
      res.push(newItem);
    } else {
      if (!getHasOwnProperty(map, parentKeyValue)) {
        map[parentKeyValue] = {
          children: [],
        };
      }

      if (typeof map[parentKeyValue].children === "undefined") {
        map[parentKeyValue].children = [];
      }
      map[parentKeyValue].children.push(newItem);
    }
  }
  return res;
}

/**
 * 递归将树形数据转换成扁平的结构
 * @param {*} params
 * @param {string} params.treeData - 树状嵌套结构数据
 * @param {object} params.fieldNames - 自定义属性名节点
 * @param {string} params.toType - 转换成对象/数组
 * @param {string} params.treeKeys - 树状结构中的数据所在位置
 * @param {string} params.clone - 是否clone节点
 * @returns
 */
export function tree2Flat<T = any>({ treeData, fieldNames, toType = "object", treeKeys = [], clone = true }: Tree2FlatProps): T {
  const mergeFieldNames = { ...DEFAULT_FIELD_NAMES, ...fieldNames };

  let flatData = toType === "object" ? {} : [];

  treeData.forEach((treeNode) => {
    const node = clone ? { ...treeNode } : treeNode;

    const key: string = node[mergeFieldNames.key];
    const tempTreeKeys = [...treeKeys, key];

    // eslint-disable-next-line no-underscore-dangle
    node._treeKeys = tempTreeKeys;

    if (toType === "object") {
      (flatData as Record<string, any>)[key] = node;
    } else {
      (flatData as any[]).push(node);
    }

    if (node[mergeFieldNames.children]) {
      const flatChildren = tree2Flat({
        treeData: node[mergeFieldNames.children],
        fieldNames,
        toType,
        treeKeys: tempTreeKeys,
      });

      if (toType === "object") {
        flatData = {
          ...flatData,
          ...flatChildren,
        };
      } else {
        flatData = [...(flatData as any[]), ...(flatChildren as any[])];
      }
    }
  });

  return flatData as T;
}

/**
 * 递归排除节点中的属性
 * @param {*} params
 * @param {string} params.treeData - 树状嵌套结构数据
 * @param {object} params.excludeProps - 需要排除的属性
 * @param {object} params.fieldNames - 自定义属性名节点
 * @returns
 */
export function loopExcludeTreeProps({ treeData, excludeFieldNames = [], fieldNames = {} }: LoopExcludeTreePropsProps) {
  const mergeFieldNames = { ...DEFAULT_FIELD_NAMES, ...fieldNames };
  return treeData.map((node: any) => {
    const newNode: { [key: string]: any } = _.omit(node, excludeFieldNames);

    if (node[mergeFieldNames.children]) {
      newNode[mergeFieldNames.children] = loopExcludeTreeProps({ treeData: node[mergeFieldNames.children], excludeFieldNames, fieldNames });
    }
    return newNode;
  });
}

/**
 * 将规整的树状数据转换成Antd-Tree组件treeData数据
 * @param {*} params
 * @param {string} params.treeData - 树状嵌套结构数据
 * @param {object} params.fieldNames - 自定义属性名节点
 * @param {function} params.getKey key值计算方法 (nodeData) => string，不提供则默认使用原始key
 * @param {array} params.indexKeys - 当前节点的下标位置
 * @param {function} params.attachNodeProps - 对节点进行数据附加
 * @param {function} params.needAttachParentNodes - 是否需要附加父节点数据
 * @param {function} params.needAttachIndexKeys - 是否需要附加父节点index数据
 * @param {boolean} params.clone - 是否直接对树节点元素进行操作(门户中的状态数据是天然冻结的)
 * @returns treeData
 */
export function loopToAntdTreeData({
  treeData,
  fieldNames = {},
  getKey,
  indexKeys = [],
  parentNodes = [],
  parentKey,
  attachNodeProps,
  needAttachParentNodes = false,
  needAttachIndexKeys = false,
  needAttachIndexParentKey = false,
  clone = true,
}: LoopToAntdTreeDataProps) {
  const mergeFieldNames = { ...DEFAULT_FIELD_NAMES, ...fieldNames };

  return treeData.map((item: any, index: number) => {
    const currentIndexKeys = [...indexKeys, index];
    const keyValue = typeof getKey === "function" ? getKey(item, index) : item[mergeFieldNames.key];
    const titleValue = item[mergeFieldNames.title];
    let childrenValue = item[mergeFieldNames.children];

    // delete item[keyPropName];
    // delete item[titlePropName];
    // delete item[childrenPropName];

    let result;

    if (clone) {
      result = { ...item, key: keyValue, title: titleValue };
    } else {
      result = Object.assign(item, {
        key: keyValue,
        title: titleValue,
      });
    }

    if (needAttachIndexKeys) {
      result.indexKeys = currentIndexKeys;
    }

    if (needAttachIndexParentKey && parentKey) {
      result.parentKey = parentKey;
    }

    // const currentParentNodes = [...parentNodes, result];

    if (needAttachParentNodes) {
      result.parentNodes = parentNodes;
    }

    if (childrenValue && childrenValue.length) {
      childrenValue = loopToAntdTreeData({
        treeData: childrenValue,
        fieldNames,
        getKey,
        indexKeys: currentIndexKeys,
        parentNodes: [...parentNodes, result],
        parentKey: keyValue,
        attachNodeProps,
        needAttachParentNodes,
        needAttachIndexKeys,
        needAttachIndexParentKey,
      });
    }

    if (typeof childrenValue !== "undefined") {
      result.children = childrenValue;
    }

    if (typeof attachNodeProps === "function") {
      result = Object.assign(result, attachNodeProps(result, currentIndexKeys, parentNodes));
    }

    return result;
  });
}

/**
 * 递归查找节点
 * @param {string} params.treeData 树状嵌套结构数据
 * @param {string} matchValue 匹配值
 * @param {string} matchFieldName 匹配属性
 * @param {object} fieldNames 自定义属性名节点
 * return {
 *  obj:{} 查找到的节点
 *  pos:[] 节点在list中的位置
 * }
 * return undefined 如果没有找到
 */
export function loopSearchTree({
  treeData,
  matchValue,
  matchFieldName = "key",
  fieldNames = {},
}: LoopSearchTreeProps): { obj: any; pos: { key: string; i: number; id: string }[] } | undefined {
  const mergeFieldNames = { ...DEFAULT_FIELD_NAMES, ...fieldNames };

  if (Array.isArray(treeData) === false) {
    // eslint-disable-next-line no-console
    console.warn("Parameter must be an Array in 'loopSearchTree'");

    return undefined;
  }
  for (const [index, obj] of treeData.entries()) {
    // 增加通过null判断
    if (typeof obj[matchFieldName] === "undefined" || obj[matchFieldName] === null) {
      return undefined;
    }
    if (obj[matchFieldName] === matchValue) {
      const objPos = {} as { obj: any; pos: { key: string; i: number; id: string }[] };

      objPos.obj = obj;
      objPos.pos = [
        {
          key: mergeFieldNames.children,
          i: index,
          id: obj[matchFieldName],
        },
      ];
      return objPos;
    }
    if (typeof obj[mergeFieldNames.children] !== "undefined") {
      const searchResult = loopSearchTree({
        treeData: obj[mergeFieldNames.children],
        matchValue,
        matchFieldName,
        fieldNames,
      });

      if (typeof searchResult !== "undefined") {
        const tmpPos = {
          key: mergeFieldNames.children,
          i: index,
          id: obj[matchFieldName],
        };

        searchResult.pos.unshift(tmpPos);
        return searchResult;
      }
    }
  }
  return undefined;
}

/**
 * 查找与matchKey匹配节点的父节点
 * @param {*} params
 * @param {string} params.matchKey - 需要配对的key值
 * @param {string} params.treeData - 树状嵌套结构数据
 * @param {object} params.fieldNames 自定义属性名节点
 * @returns
 */
export function getParentKey({ matchKey, treeData, fieldNames = {}, isAllParents = false }: GetParentKeyProps): string[] {
  const mergeFieldNames = { ...DEFAULT_FIELD_NAMES, ...fieldNames };
  let parentKey;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < treeData.length; i++) {
    const node = treeData[i];
    const children = node[mergeFieldNames.children];

    if (children) {
      if (children.some((item: any) => item[mergeFieldNames.key] === matchKey)) {
        parentKey = isAllParents ? [node[mergeFieldNames.key]] : node[mergeFieldNames.key];
        break;
      } else {
        const result = getParentKey({
          matchKey,
          treeData: children,
          fieldNames,
          isAllParents,
        });

        if (typeof result !== "undefined" && result.length) {
          parentKey = isAllParents ? [node[mergeFieldNames.key], ...result] : result;
          break;
        }
      }
    }
  }
  return parentKey || [];
}

/**
 * 获取所有父节点key
 * @param {*} params
 * @param {string} params.treeData - 树状嵌套结构数据
 * @param {object} params.fieldNames 自定义属性名节点
 * @returns
 */
export function getAllParentKeys({ treeData = [], fieldNames = {} }: GetAllParentKeysProps) {
  const mergeFieldNames = { ...DEFAULT_FIELD_NAMES, ...fieldNames };
  let parentKeys: string[] = [];

  treeData.forEach((node) => {
    if (node[mergeFieldNames.children]) {
      parentKeys.push(node[mergeFieldNames.key]);

      parentKeys = [
        ...parentKeys,
        ...getAllParentKeys({
          treeData: node[mergeFieldNames.children],
          fieldNames,
        }),
      ];
    }
  });

  return parentKeys;
}

/**
 * 查找第一个叶子节点: 第一个没有children的节点
 * @param {*} params
 * @param {string} params.treeData - 树状嵌套结构数据
 * @param {object} params.fieldNames 自定义属性名节点
 * @returns
 */
export function getFirstLeafItem({ treeData = [], fieldNames = {} }: GetFirstLeafNode) {
  const mergeFieldNames = { ...DEFAULT_FIELD_NAMES, ...fieldNames };

  for (const data of treeData) {
    const children = data[mergeFieldNames.children];

    if (typeof children === "undefined") {
      return data;
    }
    const searchChildren: any = getFirstLeafItem({
      treeData: children,
      fieldNames,
    });

    if (typeof searchChildren !== "undefined") {
      return searchChildren;
    }
  }
  return undefined;
}

/**
 * 循环判断是否叶子节点, 如果是叶子节点则清理节点下children
 * 再余下的逻辑中,可以通过判断是否存在children来确定是否是叶子节点
 * @param {*} params
 * @param {object} params.fieldNames 自定义属性名节点
 * @param {string} params.judgeIsLeaf - 判断函数,参数为节点数据 (nodeData) => boolean
 * @returns treeData
 */
export function loopCleanLeaf({ treeData = [], fieldNames = {}, judgeIsLeaf = () => false, indexKeys = [] }: LoopCleanLeaf) {
  const mergeFieldNames = { ...DEFAULT_FIELD_NAMES, ...fieldNames };
  return treeData.map((item, index) => {
    const currentIndexKeys = [...indexKeys, index];
    const childrenValue = item[mergeFieldNames.children];

    if (childrenValue.length) {
      item[mergeFieldNames.children] = loopCleanLeaf({
        treeData: childrenValue,
        fieldNames,
        judgeIsLeaf,
        indexKeys: currentIndexKeys,
      });
    } else {
      const isLeaf = judgeIsLeaf(item, currentIndexKeys);

      if (isLeaf) {
        delete item[mergeFieldNames.children];
      }
    }

    return item;
  });
}

/**
 * 获取所有节点key值
 * @param {*} params
 * @param {string} params.treeData - 树状嵌套结构数据
 * @param {object} params.fieldNames 自定义属性名节点
 * @param {string} params.judgeIsLeaf - 判断函数,参数为节点数据 (nodeData) => boolean
 * @returns
 */
export function getAllTreeKeys({ treeData = [], fieldNames = {}, filter }: LoopGetAllTreeKeysProps) {
  const mergeFieldNames = { ...DEFAULT_FIELD_NAMES, ...fieldNames };
  let keys: string[] = [];
  treeData.forEach((item) => {
    if (filter) {
      if (filter(item)) {
        keys.push(item[mergeFieldNames.key]);
      }
    } else {
      keys.push(item[mergeFieldNames.key]);
    }

    const children: any[] = item[mergeFieldNames.children];

    if (children instanceof Array && children.length) {
      keys = [...keys, ...getAllTreeKeys({ treeData: children, fieldNames, filter })];
    }
  });
  return keys;
}
