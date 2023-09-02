import React, {useState, useEffect, useMemo, useCallback, Key} from 'react';
import _ from 'lodash';
import {Dropdown, Input} from 'antd';
import {DataNode, EventDataNode} from 'antd/lib/tree';
import {i18nIns} from '@/app/i18n';
import SearchTree from '../search_tree/view';
import {tree2Flat} from '../utils';
import styles from './styles.module.scss';
import {Item} from '../search_tree/types';

const {t} = i18nIns;

interface SearchTreeSelectProps {
    placeholder?: string;
    searchPlaceholder?: string;
    value?:
        | string
        | (({
              checkedKeys,
              leafs,
          }: {
              checkedKeys: string[];
              leafs: any[];
              selectedKeys?: string[];
          }) => string);
    checkedKeys?: string[];
    selectedKeys?: string[];
    dropdownHeight?: number;
    dropdownWidth?: number;
    checkable?: boolean;
    treeData: Item[];
    childrenPropName?: string;
    keyPropName?: string;
    titlePropName?: string;
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
        info: any,
    ) => void;
    onSelect?: (
        selectedKeys: Key[],
        selectedNodes: any[],
        info: {
            event: 'select';
            selected: boolean;
            node: EventDataNode;
            selectedNodes: DataNode[];
            nativeEvent: MouseEvent;
        },
    ) => void;
}

const SearchTreeSelect = ({
    placeholder = t('请选择'),
    searchPlaceholder = t('请输入查询条件'),
    value = '',
    checkedKeys,
    selectedKeys,
    dropdownHeight = 400,
    dropdownWidth = 300,
    checkable = true,
    treeData,
    childrenPropName = 'children',
    keyPropName = 'key',
    titlePropName = 'title',
    autoHalfCheckedInStrictly,
    defaultExpandedKeys,
    // action
    onCheck,
    onSelect,
}: SearchTreeSelectProps) => {
    const [visible, setVisible] = useState(false);
    const [checkedKeysCache, setCheckedKeysCache] = useState([]);
    const {flatLeafs, flatLeafKeys} = useMemo(() => {
        const tempFlatLeafs = tree2Flat<any[]>({
            treeData: _.cloneDeep(treeData),
            toType: 'array',
        }).filter(
            (nodeData) => typeof nodeData[childrenPropName] === 'undefined',
        );
        const tempFlatLeafKeys = tempFlatLeafs.map((v) => v[keyPropName]);
        return {
            flatLeafs: tempFlatLeafs,
            flatLeafKeys: tempFlatLeafKeys,
        };
    }, [treeData, childrenPropName, keyPropName]);
    const flatCheckedLeafKeys = useMemo(
        () => checkedKeysCache.filter((key) => flatLeafKeys.includes(key)),
        [checkedKeysCache, flatLeafKeys],
    );
    useEffect(() => {
        const toggle = () => setVisible(false);

        document.body.addEventListener('click', toggle);
        return () => {
            document.body.removeEventListener('click', toggle);
        };
    }, [visible]);
    const handleCheck = useCallback(
        (keys, checkedNodes, info) => {
            setCheckedKeysCache(keys);
            onCheck && onCheck(keys, checkedNodes, info);
        },
        [onCheck],
    );
    let inputValue;

    if (typeof value === 'function') {
        inputValue = value({
            checkedKeys: flatCheckedLeafKeys,
            leafs: flatLeafs,
            selectedKeys,
        });
    } else if (!checkable) {
        inputValue = value;
    } else {
        inputValue = `${flatCheckedLeafKeys.length}/${flatLeafs.length}`;
    }

    return (
        <Dropdown
            visible={visible}
            overlay={
                <div
                    className={styles.view}
                    style={{
                        height: dropdownHeight,
                        width: dropdownWidth,
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <SearchTree
                        placeholder={searchPlaceholder}
                        treeData={treeData}
                        checkedKeys={checkedKeys}
                        selectedKeys={selectedKeys}
                        childrenPropName={childrenPropName}
                        keyPropName={keyPropName}
                        titlePropName={titlePropName}
                        defaultExpandedKeys={defaultExpandedKeys}
                        checkable={checkable}
                        autoHalfCheckedInStrictly={autoHalfCheckedInStrictly}
                        onCheck={handleCheck}
                        onSelect={onSelect}
                    />
                </div>
            }
            trigger={['click']}
            arrow={false}
        >
            <Input
                placeholder={placeholder}
                value={inputValue}
                onClick={(e) => {
                    setVisible(!visible);
                    e.preventDefault();
                    e.stopPropagation();
                }}
            />
        </Dropdown>
    );
};

export default SearchTreeSelect;
