import React, {useCallback} from 'react';
import {SearchTree, utils} from '@components/tree';
import {remove} from 'lodash';
import {i18nIns} from '@/app/i18n';
import styles from './styles.module.scss';

const {t} = i18nIns;

const SearchTreeWrapper = ({
    checkedKeys,
    onCheck,
    treeData,
    expandedKeys,
    selectedKeys,
    onSelect,
}: any) => {
    const onCheckHandler = useCallback(
        (keys, nodes, info) => {
            const {node} = info;
            let checked = [...keys.checked];
            const {key} = node;

            if (node.children) {
                // isRight = 1 有权限，可以被勾选
                const allChildrenKeys = utils.getAllTreeKeys({
                    treeData: node.children,
                    filter: (item) => !!item.isRight,
                }); // 包含则选中所有子节点，否则删除所有子节点

                if (checked.includes(key)) {
                    checked = [...checked, ...allChildrenKeys];
                } else {
                    remove(checked, (checkedKey) =>
                        allChildrenKeys.includes(checkedKey),
                    );
                }
            }

            onCheck({
                checked,
                halfChecked: [],
            });
        },
        [onCheck],
    );
    return (
        <div className={styles.searchTreeArea}>
            <SearchTree
                checkStrictly
                checkedKeys={checkedKeys}
                onCheck={onCheckHandler}
                placeholder={`${t('请输入')}`}
                treeData={treeData}
                expandedKeys={expandedKeys}
                selectedKeys={selectedKeys}
                onSelect={onSelect}
            />
        </div>
    );
};

export default SearchTreeWrapper;
