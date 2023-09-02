import React from 'react';
import styles from './styles.module.scss';
import {LoopProps} from './types';

export const loop = ({
    treeData,
    searchValue,
    subTitleRender,
    nodeTitleClassName = '',
    hiddenKeys,
    keyPropName,
    titlePropName,
    childrenPropName,
}: LoopProps): any[] =>
    treeData
        .filter((item) => hiddenKeys.indexOf(item[keyPropName]) < 0)
        .map((item) => {
            const index = item[titlePropName].indexOf(searchValue);
            const beforeStr = item[titlePropName].substr(0, index);
            const afterStr = item[titlePropName].substr(
                index + searchValue.length,
            );
            const title = (
                <span className={styles.title}>
                    <span
                        className={`${styles.content} ${nodeTitleClassName}`}
                        title={item[titlePropName]}
                    >
                        {index > -1 ? (
                            <>
                                {beforeStr}
                                <span className={styles.searchedStr}>
                                    {searchValue}
                                </span>
                                {afterStr}
                            </>
                        ) : (
                            item[titlePropName]
                        )}
                    </span>

                    {subTitleRender ? subTitleRender(item) : null}
                </span>
            );

            if (typeof item[childrenPropName] !== 'undefined') {
                return {
                    ...item,
                    [titlePropName]: title,
                    children: loop({
                        treeData: item[childrenPropName],
                        searchValue,
                        subTitleRender,
                        nodeTitleClassName,
                        hiddenKeys,
                        titlePropName,
                        keyPropName,
                        childrenPropName,
                    }),
                };
            }

            return {...item, [titlePropName]: title};
        });
