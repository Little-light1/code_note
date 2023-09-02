/*
 * @Author: zhangzhen
 * @Date: 2022-06-22 08:49:21
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-07-20 15:35:05
 *
 */
import React, {useMemo, useRef} from 'react';
import {Table, Input} from 'antd';
import {useSize} from 'ahooks';
import {useTable} from './useTable';
import styles from './styles.module.scss';
import {CustomTableProps} from './types';

const {Search} = Input;
const DEFAULT_OFFSET = {
    x: 20,
    y: 39,
};
const DEFAULT_PAGINATION = 50;

const CustomTable = ({
    columns,
    dataSource,
    pagination = false,
    showIndex = false,
    showSearch = false,
    indexWidth = 140,
    className,
    onChange,
    onFilter,
    offset = DEFAULT_OFFSET,
    scroll,
    ...props
}: CustomTableProps) => {
    const containerRef = useRef(null);
    const size = useSize(containerRef);
    const {
        internalPagination,
        onInternalChange,
        filterDataSource,
        internalColumns,
        setFilterValue,
    } = useTable({
        onFilter,
        pagination,
        onChange,
        showIndex,
        indexWidth,
        dataSource,
        columns,
    });
    const internalScroll = useMemo(() => {
        // 不启用内置计算
        if (scroll === false) {
            return undefined;
        } // 不配置则启用内部计算，按照容器大小动态计算

        if (typeof scroll === 'undefined') {
            const {height, width} = size || {};

            if (!height || !width) {
                return {};
            }

            return {
                x: width - offset.x,
                y:
                    height -
                    offset.y -
                    (internalPagination ? DEFAULT_PAGINATION : 0),
            };
        }

        return scroll;
    }, [offset, size, scroll, internalPagination]);
    return (
        <div className={styles.container}>
            {showSearch ? (
                <Search
                    className={styles.search}
                    allowClear
                    maxLength={20}
                    onSearch={setFilterValue}
                    placeholder={
                        typeof showSearch === 'string' ? showSearch : ''
                    }
                />
            ) : null}

            <div className={styles.table} ref={containerRef}>
                <Table
                    columns={internalColumns}
                    className={`${styles.view} ${className || ''}`}
                    dataSource={filterDataSource}
                    bordered
                    pagination={internalPagination}
                    size="small"
                    scroll={internalScroll}
                    onChange={onInternalChange}
                    {...props}
                />
            </div>
        </div>
    );
};

export default CustomTable;
