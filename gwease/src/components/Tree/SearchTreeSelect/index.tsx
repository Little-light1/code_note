import React, {useState, useEffect, useMemo, useCallback, FC} from 'react';
import _ from 'lodash';
import {Dropdown, Input} from 'antd';
import SearchTree from '../SearchTree/view';
import {tree2Flat} from '../utils';
import './styles.scss';
import {SearchTreeSelectProps} from './types';
import {DEFAULT_FIELD_NAMES} from '../constant';
import {useLocale} from '../../Runtime/App/LocaleProvider';

const SearchTreeSelect: FC<SearchTreeSelectProps> = ({
    placeholder,
    searchPlaceholder,
    value = '',
    checkedKeys,
    selectedKeys,
    dropdownHeight = 400,
    dropdownWidth = 300,
    checkable = true,
    treeData,
    fieldNames,
    autoHalfCheckedInStrictly,
    defaultExpandedKeys,

    // action
    onCheck,
    onSelect,
}) => {
    const locale = useLocale('SearchTreeSelect');

    const mergeFieldNames = useMemo(() => ({...DEFAULT_FIELD_NAMES, ...fieldNames}), [fieldNames]);
    const [visible, setVisible] = useState(false);
    const [checkedKeysCache, setCheckedKeysCache] = useState([]);
    const {flatLeafs, flatLeafKeys} = useMemo(() => {
        const tempFlatLeafs = tree2Flat<any[]>({
            treeData: _.cloneDeep(treeData),
            toType: 'array',
            fieldNames: mergeFieldNames,
        }).filter((nodeData) => typeof nodeData[mergeFieldNames.children] === 'undefined');
        const tempFlatLeafKeys = tempFlatLeafs.map((v) => v[mergeFieldNames.key]);

        return {
            flatLeafs: tempFlatLeafs,
            flatLeafKeys: tempFlatLeafKeys,
        };
    }, [treeData, mergeFieldNames]);
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
        inputValue = value({checkedKeys: flatCheckedLeafKeys, leafs: flatLeafs, selectedKeys});
    } else {
        if (!checkable) {
            inputValue = value;
        } else {
            inputValue = `${flatCheckedLeafKeys.length}/${flatLeafs.length}`;
        }
    }
    return (
        <Dropdown
            visible={visible}
            overlay={
                <div
                    className="ease-search-tree-select"
                    style={{
                        height: dropdownHeight,
                        width: dropdownWidth,
                    }}>
                    <SearchTree
                        placeholder={searchPlaceholder || locale.searchPlaceholder || '请输入查询条件'}
                        treeData={treeData}
                        checkedKeys={checkedKeys}
                        selectedKeys={selectedKeys}
                        fieldNames={mergeFieldNames}
                        defaultExpandedKeys={defaultExpandedKeys}
                        checkable={checkable}
                        autoHalfCheckedInStrictly={autoHalfCheckedInStrictly}
                        onCheck={handleCheck}
                        onSelect={onSelect}
                    />
                </div>
            }
            trigger={['click']}
            arrow={false}>
            <Input
                placeholder={placeholder || locale.placeholder || '请选择'}
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
