/* eslint-disable no-underscore-dangle */

/* eslint-disable @typescript-eslint/naming-convention */
import _ from 'lodash';
import React, {useCallback, useRef, memo, useMemo, Key} from 'react';
import {Tree, Input, Empty} from 'antd';
import {useSize} from 'ahooks';
import {loop} from './helper';
import useComponent, {ActionTypes} from './useComponent';
import {getAllTreeKeys} from '../utils';
import styles from './styles.module.scss';
import {SearchTreeProps} from './types';

const {Search} = Input;
const EMPTY_LIST: any[] = [];
const defaultShowLine = {
    showLeafIcon: false,
};

const SearchTree = ({
    isShowSearch = true,
    expandedKeys = EMPTY_LIST,
    defaultHiddenKeys,
    defaultExpandedKeys,
    treeData,
    checkedKeys,
    selectedKeys,
    checkable = true,
    showLine = defaultShowLine,
    childrenPropName = 'children',
    keyPropName = 'key',
    titlePropName = 'title',
    nodeTitleClassName = '',
    placeholder = '',
    autoHalfCheckedInStrictly,
    virtual = false,
    subTitleRender,
    onCheck,
    onSelect,
    onExpand,
    ...args
}: SearchTreeProps) => {
    const treeContainerRef = useRef(null);
    const size = useSize(treeContainerRef);
    const fieldNames = useMemo(
        () => ({
            key: keyPropName,
            title: titlePropName,
        }),
        [keyPropName, titlePropName],
    );
    const {state, dispatch} = useComponent({
        defaultHiddenKeys,
        defaultExpandedKeys,
        treeData,
        childrenPropName,
        keyPropName,
        expandedKeys,
    });
    const {
        treeDataMap,
        expandedKeys: expandedKeysState,
        hiddenKeys: hiddenKeysState,
        autoExpandParent,
        searchValue,
    } = state;
    const onSearchCb = useCallback(
        (value) => {
            value = value.trim(); // 清空场景不用计算

            if (value === '') {
                dispatch({
                    type: ActionTypes.SearchAction,
                    payload: {
                        searchValue: value,
                        expandedKeys,
                        hiddenKeys: [],
                        autoExpandParent: true,
                    },
                });
                return;
            } // 需要展开的节点: 匹配节点的所有父

            let tempExpandedKeys: string[] = []; // 展示节点:匹配节点及匹配节点的所有父

            let tempShowKeys: string[] = []; // 匹配节点的直系亲属

            let matchedParentKeys: string[] = []; // 匹配的所有节点

            const searchedKey: string[] = [];
            const treeDataList = Object.values(treeDataMap);
            treeDataList.forEach((item) => {
                if (item[titlePropName].indexOf(value) > -1) {
                    const {_treeKeys} = item;
                    const allParentKeys = [..._treeKeys].splice(
                        0,
                        _treeKeys.length - 1,
                    ); // const allParentKeys = getParentKey({
                    //   key: item[keyPropName],
                    //   treeData,
                    //   childrenPropName,
                    //   isAllParents: true,
                    // });
                    // 本身就是根节点

                    if (allParentKeys.length === 0) {
                        matchedParentKeys.push(item[keyPropName]);
                    } else {
                        // 当前节点的父
                        matchedParentKeys.push(
                            allParentKeys[allParentKeys.length - 1],
                        );
                    }

                    tempExpandedKeys = [...tempExpandedKeys, ...allParentKeys];
                    tempShowKeys = [...tempShowKeys, ..._treeKeys];
                    searchedKey.push(item[keyPropName]);
                }
            }); // 去重

            tempExpandedKeys = Array.from(new Set(tempExpandedKeys));
            tempShowKeys = Array.from(new Set(tempShowKeys));
            matchedParentKeys = Array.from(new Set(matchedParentKeys)); // 将其它非展开父节点隐藏(无展开项时不能隐藏其它)
            // const foldedKeys = tempExpandedKeys.length
            //   ? treeDataList
            //       .filter((item) => typeof item[childrenPropName] !== 'undefined' && !tempExpandedKeys.includes(item[keyPropName]))
            //       .map((item) => item[keyPropName])
            //   : [];
            // const foldedKeys = treeDataList
            //   .filter((item) => typeof item[childrenPropName] !== 'undefined' && !tempExpandedKeys.includes(item[keyPropName]))
            //   .map((item) => item[keyPropName]);
            // 反向找到需要隐藏的节点: 通过tempShowKeys

            let tempHiddenKeys = treeDataList
                .filter((item) => !tempShowKeys.includes(item[keyPropName]))
                .map((item) => item[keyPropName]); // 如下:需要重新展示出来的子元素

            let showChildrenKeys: string[] = [];
            matchedParentKeys.forEach((parentKey) => {
                const parentNode = treeDataMap[parentKey];
                showChildrenKeys = showChildrenKeys.concat(
                    getAllTreeKeys({
                        treeData: parentNode[childrenPropName],
                        childrenPropName,
                        keyPropName,
                    }),
                );
            }); // 找到查找到节点的所有排斥兄弟节点, 当同级下所有查找节点都排斥该节点才作为真正被排除

            const brotherKeysMapInSearchedKey = searchedKey.reduce(
                (prev, key) => {
                    let brotherKeys = [];
                    const node = treeDataMap[key];
                    const {_treeKeys} = node;
                    const allParentKeys = [..._treeKeys].splice(
                        0,
                        _treeKeys.length - 1,
                    );
                    let parentKey: string;

                    if (allParentKeys.length === 0) {
                        parentKey = '__root__';
                        brotherKeys = treeDataList
                            .filter(
                                (item) =>
                                    item[keyPropName] !== key &&
                                    item._treeKeys.length === 1,
                            )
                            .map((item) => item[keyPropName]);
                    } else {
                        parentKey = [...allParentKeys].splice(
                            allParentKeys.length - 1,
                            1,
                        )[0];
                        const parent = treeDataMap[parentKey];
                        brotherKeys = parent[childrenPropName]
                            .map((item: any) => item[keyPropName])
                            .filter((_key: string) => _key !== key);
                    }

                    prev[key] = {
                        parentKey,
                        brotherKeys,
                    };
                    return prev;
                },
                {} as any,
            );
            const keyWeightInParent: {
                [key: string]: {
                    [key: string]: number;
                };
            } = {};
            Object.keys(brotherKeysMapInSearchedKey).forEach((key) => {
                const {parentKey, brotherKeys} =
                    brotherKeysMapInSearchedKey[key];

                if (typeof keyWeightInParent[parentKey] === 'undefined') {
                    keyWeightInParent[parentKey] = {};
                }

                brotherKeys.forEach((brotherKey: string) => {
                    if (
                        typeof keyWeightInParent[parentKey][brotherKey] ===
                        'undefined'
                    ) {
                        keyWeightInParent[parentKey][brotherKey] = 1;
                    } else {
                        keyWeightInParent[parentKey][brotherKey] += 1;
                    }
                });
            });
            let excludeKeys: string[] = [];

            for (const weightKey of Object.keys(keyWeightInParent)) {
                const weightValues = keyWeightInParent[weightKey]; // 情况1 无值, 被查找到的值是唯一的

                if (Object.keys(weightValues).length === 0) {
                    // eslint-disable-next-line no-continue
                    continue;
                } // 情况2 权重一样

                const firstWeightValue = Object.values(weightValues)[0];
                const isAllWeightSame = Object.values(weightValues).every(
                    (weightValue) => weightValue === firstWeightValue,
                );

                if (isAllWeightSame) {
                    const {children} = treeDataMap[weightKey];

                    if (typeof children === 'undefined') {
                        // eslint-disable-next-line no-continue
                        continue;
                    } // 情况2-1 匹配到全部

                    if (firstWeightValue === children.length - 1) {
                        // do nothing
                    } // 情况2-2 只匹配到1个
                    else {
                        excludeKeys = excludeKeys.concat(
                            Object.keys(weightValues),
                        );
                    } // eslint-disable-next-line no-continue

                    continue;
                } // 情况3 权重不同, 排除掉最高权重的值

                const maxWeight = Math.max(...Object.values(weightValues)); // eslint-disable-next-line @typescript-eslint/no-loop-func

                Object.keys(weightValues).forEach((weightKeys) => {
                    const weightValue = weightValues[weightKeys];

                    if (maxWeight === weightValue) {
                        excludeKeys.push(weightKeys);
                    }
                });
            } // 从被隐藏的数据中清理掉

            _.remove(tempHiddenKeys, (key) =>
                [...showChildrenKeys].includes(key),
            ); // 如果父匹配到, 则excludeKeys中会包含其它父节点, 需要排除掉

            tempHiddenKeys = tempHiddenKeys.concat(
                _.difference(excludeKeys, matchedParentKeys),
            );
            dispatch({
                type: ActionTypes.SearchAction,
                payload: {
                    searchValue: value,
                    expandedKeys: Array.from(new Set(tempExpandedKeys)),
                    hiddenKeys: tempHiddenKeys,
                    autoExpandParent: true,
                },
            });
        },
        [
            treeDataMap,
            dispatch,
            expandedKeys,
            titlePropName,
            keyPropName,
            childrenPropName,
        ],
    );
    const onExpandCb = useCallback(
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
        [dispatch, onExpand],
    );
    const onSelectCb = useCallback(
        (keys, info) => {
            const selectedNodes = keys.map((key: string) => treeDataMap[key]);
            onSelect && onSelect(keys, selectedNodes, info);
        },
        [treeDataMap, onSelect],
    );
    const onCheckCb = useCallback(
        (
            keys:
                | Key[]
                | {
                      checked: Key[];
                      halfChecked: Key[];
                  },
            info,
        ) => {
            if (keys instanceof Array) {
                const checkedNodes = keys.map((key) => treeDataMap[key]);
                onCheck && onCheck(keys, checkedNodes, info);
                return;
            }

            const {checked} = keys;
            const checkedNode = checked.map((key) => treeDataMap[key]);
            const tempHalfChecked = new Set<Key>();

            if (autoHalfCheckedInStrictly) {
                // 自动帮助判断父半选状态
                checkedNode.forEach(({_treeKeys}) => {
                    [..._treeKeys]
                        .splice(0, _treeKeys.length - 1)
                        .forEach((key: Key) => tempHalfChecked.add(key));
                });
            }

            onCheck &&
                onCheck(
                    {
                        checked,
                        halfChecked: Array.from(tempHalfChecked),
                    },
                    {
                        checked: checkedNode,
                        halfChecked: Array.from(tempHalfChecked).map(
                            (key) => treeDataMap[key],
                        ),
                    },
                    info,
                );
        },
        [autoHalfCheckedInStrictly, onCheck, treeDataMap],
    );
    const treeDataTemp = loop({
        treeData,
        searchValue,
        subTitleRender,
        nodeTitleClassName,
        titlePropName,
        keyPropName,
        childrenPropName,
        hiddenKeys: hiddenKeysState,
    });
    return (
        <div
            className={styles.view}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            {isShowSearch ? (
                <Search
                    className={`${styles.search} ${styles.searchInput}`}
                    placeholder={placeholder}
                    onSearch={(e) => {
                        // e.persist();
                        onSearchCb(e);
                    }}
                />
            ) : null}
            <div className={styles.treeContainer} ref={treeContainerRef}>
                {treeDataTemp && treeDataTemp.length > 0 ? (
                    <Tree
                        virtual={virtual}
                        height={size?.height}
                        checkable={checkable}
                        onExpand={onExpandCb}
                        showLine={showLine}
                        expandedKeys={expandedKeysState}
                        autoExpandParent={autoExpandParent}
                        fieldNames={fieldNames} // 4.17.0
                        treeData={treeDataTemp}
                        checkedKeys={checkedKeys}
                        selectedKeys={selectedKeys}
                        onCheck={onCheckCb}
                        onSelect={onSelectCb}
                        {...args}
                    />
                ) : (
                    <Empty
                        className={styles.emptyDesc}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                )}
            </div>
        </div>
    );
};

export default memo(SearchTree);
