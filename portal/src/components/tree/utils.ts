import _ from 'lodash';
import {Flat2TreeProps, Tree2FlatProps} from './types';

const getHasOwnProperty = (obj: Object, property: string) =>
    Object.prototype.hasOwnProperty.call(obj, property);
/**
 * 扁平 => 树
 * @param {*} params
 * @param {string} params.flatData - 扁平数据
 * @param {string} params.keyPropName - id属性名
 * @param {string} params.parentKeyPropName - 父属性名
 * @param {string} params.isRoot - 判断根节点方法
 * @returns
 */

export function flat2Tree({
    flatData = [],
    keyPropName = 'id',
    parentKeyPropName = 'pid',
    isRoot = (value) => value === '',
}: Flat2TreeProps) {
    const res: any[] = [];
    const map: Record<string, any> = {};

    for (const item of flatData) {
        const keyValue = item[keyPropName];
        const parentKeyValue = item[parentKeyPropName];
        map[keyValue] = {
            ...item, //   children: getHasOwnProperty(map, keyValue) ? map[keyValue].children : [],
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

            if (typeof map[parentKeyValue].children === 'undefined') {
                map[parentKeyValue].children = [];
            }

            map[parentKeyValue].children.push(newItem);
        }
    }

    return res;
}
/**
 * 将树形数据转换成扁平的结构
 * @param {*} param0
 * @returns
 */

export function tree2Flat<T = any>({
    treeData,
    childrenPropName = 'children',
    keyPropName = 'key',
    toType = 'object',
    treeKeys = [],
    clone = true,
}: Tree2FlatProps): T {
    let flatData = toType === 'object' ? {} : [];
    treeData.forEach((treeNode) => {
        const node = clone ? {...treeNode} : treeNode;
        const key: string = node[keyPropName];
        const tempTreeKeys = [...treeKeys, key]; // eslint-disable-next-line no-underscore-dangle

        // eslint-disable-next-line no-underscore-dangle
        node._treeKeys = tempTreeKeys;

        if (toType === 'object') {
            (flatData as any)[key] = node;
        } else {
            (flatData as any[]).push(node);
        }

        if (node[childrenPropName]) {
            const flatChildren = tree2Flat({
                treeData: node[childrenPropName],
                childrenPropName,
                keyPropName,
                toType,
                treeKeys: tempTreeKeys,
            });

            if (toType === 'object') {
                flatData = {...flatData, ...flatChildren};
            } else {
                flatData = [...(flatData as any[]), ...(flatChildren as any[])];
            }
        }
    });
    return flatData;
}
interface LoopExcludeTreePropsProps {
    treeData: {
        [key: string]: any;
    };
    excludeProps?: string[];
    childrenPropName?: string;
}
/**
 * 循环排除属性字段
 * @param param0
 * @returns
 */

export function loopExcludeTreeProps({
    treeData,
    excludeProps = [],
    childrenPropName = 'children',
}: LoopExcludeTreePropsProps) {
    return treeData.map((node: any) => {
        const newNode: {
            [key: string]: any;
        } = _.omit(node, excludeProps);

        if (node[childrenPropName]) {
            newNode[childrenPropName] = loopExcludeTreeProps({
                treeData: node[childrenPropName],
                excludeProps,
                childrenPropName,
            });
        }

        return newNode;
    });
}
interface LoopToAntdTreeDataProps {
    treeData: {
        [key: string]: any;
    };
    keyPropName?: string;
    titlePropName?: string;
    childrenPropName?: string;
    getKey?: (node: any, index: number) => string;
    indexKeys?: number[];
    parentNodes?: any[];
    parentKey?: string;
    attachNodeProps?: (
        result: any,
        currentIndexKeys: number[],
        parentNodes: any[],
    ) => Record<string, any>;
    needAttachParentNodes?: boolean;
    needAttachIndexKeys?: boolean;
    needAttachIndexParentKey?: boolean;
    clone?: boolean;
}
/**
 * 将规整的树状数据转换成antd tree组件treeData数据
 * @param {*} params
 * @param {string} params.treeData - 树状数据
 * @param {string} params.keyPropName - 树状数据中的唯一值属性名(会被转换成"key")
 * @param {function} params.getKey key值计算方法 (nodeData) => string
 * @param {string} params.titlePropName - 树状数据中名称值属性名,会被转换成"title"
 * @param {string} params.childrenPropName - 树状数据中下级数据属性名,会被转换成"children"
 * @param {array} params.indexKeys - 当前节点的位置
 * @param {function} params.attachNodeProps - 对节点进行数据附加
 * @param {function} params.needAttachParentNodes - 是否需要附加父节点数据
 * @param {function} params.needAttachIndexKeys - 是否需要附加父节点index数据
 * @param {boolean} params.clone - 是否直接对树节点元素进行操作(门户中的状态数据是天然冻结的)
 * @returns treeData
 */

export function loopToAntdTreeData({
    treeData,
    keyPropName = 'key',
    titlePropName = 'title',
    childrenPropName = 'children',
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
    return treeData.map((item: any, index: number) => {
        const currentIndexKeys = [...indexKeys, index];
        const keyValue =
            typeof getKey === 'function'
                ? getKey(item, index)
                : item[keyPropName];
        const titleValue = item[titlePropName];
        let childrenValue = item[childrenPropName]; // delete item[keyPropName];
        // delete item[titlePropName];
        // delete item[childrenPropName];

        let result;

        if (clone) {
            result = {...item, key: keyValue, title: titleValue};
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
        } // const currentParentNodes = [...parentNodes, result];

        if (needAttachParentNodes) {
            result.parentNodes = parentNodes;
        }

        if (childrenValue && childrenValue.length) {
            childrenValue = loopToAntdTreeData({
                treeData: childrenValue,
                keyPropName,
                titlePropName,
                childrenPropName,
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

        if (typeof childrenValue !== 'undefined') {
            result.children = childrenValue;
        }

        if (typeof attachNodeProps === 'function') {
            result = Object.assign(
                result,
                attachNodeProps(result, currentIndexKeys, parentNodes),
            );
        }

        return result;
    });
}
/**
 * CommonFunction 递归查找节点
 * @param list [{},{},{}]
 * @param matchVal "匹配内容"
 * @param searchKey "匹配字段"
 * @param loopKey 嵌套字段key list/children...
 * return {
 *  obj:{} 查找到的节点
 *  pos:[] 节点在list中的位置
 * }
 * return undefined 如果没有找到
 */

export function loopSearchTree({
    list,
    matchVal,
    searchKey = 'groupId',
    loopKey = 'list',
}) {
    // if (isArray(list)  === false) throw new Error("Parameter must be an Array in 'loopSearchTree'");
    if (Array.isArray(list) === false) {
        console.log("Parameter must be an Array in 'loopSearchTree'");
        return undefined;
    }

    for (const [index, obj] of list.entries()) {
        // 增加通过null判断
        if (typeof obj[searchKey] === 'undefined' || obj[searchKey] === null) {
            return undefined;
        }

        if (obj[searchKey] === matchVal) {
            const objPos = {};
            objPos.obj = obj;
            objPos.pos = [
                {
                    key: loopKey,
                    i: index,
                    id: obj[searchKey],
                },
            ];
            return objPos;
        }

        if (typeof obj[loopKey] !== 'undefined') {
            const searchResult = loopSearchTree({
                list: obj[loopKey],
                matchVal,
                searchKey,
                loopKey,
            });

            if (typeof searchResult !== 'undefined') {
                const tmpPos = {
                    key: loopKey,
                    i: index,
                    id: obj[searchKey],
                };
                searchResult.pos.unshift(tmpPos);
                return searchResult;
            }
        }
    }

    return undefined;
}
/**
 * 查找对应key节点的父节点key值
 * @param {*} params
 * @param {string} params.key - 需要配对的key值
 * @param {string} params.treeData - 树状数据
 * @param {string} params.keyPropName - 树状数据
 * @param {string} params.childrenPropName - 树状数据
 * @returns
 */

export function getParentKey({
    key,
    treeData,
    keyPropName = 'key',
    childrenPropName = 'children',
    isAllParents = false,
}) {
    let parentKey;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < treeData.length; i++) {
        const node = treeData[i];
        const children = node[childrenPropName];

        if (children) {
            if (children.some((item) => item[keyPropName] === key)) {
                parentKey = isAllParents
                    ? [node[keyPropName]]
                    : node[keyPropName];
                break;
            } else {
                const result = getParentKey({
                    key,
                    treeData: children,
                    keyPropName,
                    childrenPropName,
                    isAllParents,
                });

                if (typeof result !== 'undefined' && result.length) {
                    parentKey = isAllParents
                        ? [node[keyPropName], ...result]
                        : result;
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
 * @param {string} params.treeData - 树状数据
 * @param {string} params.keyPropName - 树状数据中的唯一值属性名
 * @param {string} params.childrenPropName - 树状数据中下级数据属性名
 * @returns
 */

export function getAllParentKeys({
    treeData = [],
    keyPropName = 'key',
    childrenPropName = 'children',
}) {
    let parentKeys = [];
    treeData.forEach((node) => {
        if (node[childrenPropName]) {
            parentKeys.push(node[keyPropName]);
            parentKeys = [
                ...parentKeys,
                ...getAllParentKeys({
                    treeData: node[childrenPropName],
                    keyPropName,
                    childrenPropName,
                }),
            ];
        }
    });
    return parentKeys;
}
/**
 * 查找第一个叶子节点: 第一个没有children的节点
 * @param {*} params
 * @param {string} params.treeData - 树状数据
 * @param {string} params.childrenPropName - 树状数据中下级数据属性名
 * @returns
 */

export function getFirstLeafItem({treeData, childrenPropName = 'children'}) {
    for (const data of treeData) {
        const children = data[childrenPropName];

        if (typeof children === 'undefined') {
            return data;
        }

        const searchChildren = getFirstLeafItem({
            treeData: children,
            childrenPropName,
        });

        if (typeof searchChildren !== 'undefined') {
            return searchChildren;
        }
    }

    return undefined;
}
/**
 * 循环判断是否叶子节点, 如果是叶子节点则清理节点下children
 * 再余下的逻辑中,可以通过判断是否存在children来确定是否是叶子节点
 * @param {*} params
 * @param {string} params.childrenPropName - 树状数据中下级数据属性名
 * @param {string} params.judgeIsLeaf - 判断函数,参数为节点数据 (nodeData) => boolean
 * @returns treeData
 */

export function loopCleanLeaf({
    treeData,
    childrenPropName = 'children',
    judgeIsLeaf = () => false,
    indexKeys = [],
}) {
    return treeData.map((item, index) => {
        const currentIndexKeys = [...indexKeys, index];
        const childrenValue = item[childrenPropName];

        if (childrenValue.length) {
            item[childrenPropName] = loopCleanLeaf({
                treeData: childrenValue,
                childrenPropName,
                judgeIsLeaf,
                indexKeys: currentIndexKeys,
            });
        } else {
            const isLeaf = judgeIsLeaf(item, currentIndexKeys);

            if (isLeaf) {
                delete item[childrenPropName];
            }
        }

        return item;
    });
}
interface LoopGetAllTreeKeysProps {
    treeData: any[];
    childrenPropName?: string;
    keyPropName?: string;
    filter?: (item: any) => boolean;
}
/**
 * 获取所有节点key值
 * @param param0
 * @returns
 */

export function getAllTreeKeys({
    treeData = [],
    childrenPropName = 'children',
    keyPropName = 'key',
    filter,
}: LoopGetAllTreeKeysProps) {
    let keys: string[] = [];
    treeData.forEach((item) => {
        if (filter) {
            if (filter(item)) {
                keys.push(item[keyPropName]);
            }
        } else {
            keys.push(item[keyPropName]);
        }

        const children: any[] = item[childrenPropName];

        if (children instanceof Array && children.length) {
            keys = [
                ...keys,
                ...getAllTreeKeys({
                    treeData: children,
                    childrenPropName,
                    keyPropName,
                    filter,
                }),
            ];
        }
    });
    return keys;
}
export function filterData(data, key) {
    const cloneData = JSON.parse(JSON.stringify(data));
    let newData = [];

    const loop = (aData) => {
        const vF = (e) => e.key !== key;

        const nData = aData.filter(vF);
        nData.forEach((ele) => {
            if (ele.children) {
                ele.children = loop(ele.children);
            }
        });
        return nData;
    };

    newData = loop(cloneData);
    return newData;
}
