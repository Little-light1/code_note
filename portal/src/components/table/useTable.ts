import {i18nIns} from '@/app/i18n';
import {TablePaginationConfig} from 'antd';
import {ColumnType} from 'antd/lib/table';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {AntdTablePagination, Pagination, OnTableChange} from './types';

const {t} = i18nIns;

interface UseTableProps<RecordType = any> {
    pagination: Pagination;
    onChange?: OnTableChange<RecordType>;
    showIndex?:
        | boolean
        | {
              current: number;
              pageSize: number;
          };
    indexWidth?: number;
    dataSource?: readonly RecordType[];
    columns?: ColumnType<RecordType>[];
    onFilter?: (item: RecordType, searchValue: string) => boolean;
}
export const DEFAULT_PAGE_SIZE_OPTIONS = [20, 50, 100, 500, 1000];
const DEFAULT_PAGINATION: Pagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
    // showTotal: (total: number) => `${t('共')} ${total} ${t('条')}`,
    showTotal: (total: number) => t(`共{{total}}条`, {total}),
    position: ['bottomLeft'],
};
// 嵌套设置index
function loopSetIndex(dataSource: any[], start = 1) {
    return dataSource.map((item, index) => {
        const {children, ...itemProps} = item; // const indexValue = parentKey ? `${parentKey}-${index + 1}` : String(index + 1);

        const indexValue = String(index + start);
        const temp = Object.assign(itemProps, {
            index: indexValue,
        });

        if (children) {
            temp.children = loopSetIndex(children);
        }

        return temp;
    });
}

export const useTable = ({
    pagination,
    onChange,
    indexWidth,
    showIndex = true,
    dataSource = [],
    columns = [],
    onFilter,
}: UseTableProps) => {
    let internalPagination: Pagination = false;
    const [internalDataSource, setInternalDataSource] = useState<any[]>([]);
    const [internalColumns, setInternalColumns] = useState<any[]>([]);
    const [filterValue, setFilterValue] = useState('');
    const {t} = useTranslation();
    useEffect(() => {
        let internalDataSourceTemp = [];

        if (showIndex) {
            let start = 1;

            if (showIndex instanceof Object) {
                const {current, pageSize} = showIndex;
                start = (current - 1) * pageSize + 1;
            }

            internalDataSourceTemp = loopSetIndex([...dataSource], start);
        } else {
            internalDataSourceTemp = [...dataSource];
        }

        setInternalDataSource(internalDataSourceTemp);
    }, [dataSource, showIndex, columns]);
    useEffect(() => {
        let internalColumnsTemp = [];

        if (showIndex) {
            internalColumnsTemp = [
                {
                    key: 'index',
                    dataIndex: 'index',
                    title: t('序号'),
                    width: indexWidth,
                    align: 'center',
                    ellipsis: true,
                },
                ...columns,
            ];
        } else {
            internalColumnsTemp = [...columns];
        }

        setInternalColumns(internalColumnsTemp);
    }, [showIndex, columns, indexWidth]);
    const onInternalChange = useCallback<OnTableChange>(
        (_pagination, _filters, _sorter, _extra) => {
            // TODO
            onChange && onChange(_pagination, _filters, _sorter, _extra);
        },
        [onChange],
    ); // 过滤

    const filterDataSource = useMemo(() => {
        if (filterValue.trim() === '' || typeof onFilter !== 'function') {
            return internalDataSource;
        }

        return internalDataSource.filter((item) => onFilter(item, filterValue));
    }, [filterValue, internalDataSource, onFilter]);

    if (pagination) {
        if (pagination instanceof Boolean) {
            internalPagination = DEFAULT_PAGINATION;
        } else {
            internalPagination = {
                ...DEFAULT_PAGINATION,
                ...(pagination as TablePaginationConfig),
            } as AntdTablePagination;
        }
    }

    return {
        setFilterValue,
        internalPagination,
        filterDataSource,
        internalColumns,
        onInternalChange,
    };
};
