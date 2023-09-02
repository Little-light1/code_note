import {TablePaginationConfig} from 'antd';
import {useCallback, useMemo} from 'react';
import {useLocale, t} from '../../Runtime/App/LocaleProvider';
import {Pagination, OnTableChange} from '../types';

// 默认表格
const DEFAULT_PAGE_SIZE_OPTIONS = [20, 50, 100, 500, 1000];

// const DEFAULT_PAGINATION: TablePaginationConfig = {
//     showSizeChanger: true,
//     showQuickJumper: true,
//     pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
//     showTotal: (total: number) => `共 ${total} 条`,
//     position: ['bottomLeft'],
// };

interface UsePaginationProps {
    pagination?: Pagination;
    onChange?: OnTableChange;
}

interface UsePaginationReturn {
    internalPagination: false | TablePaginationConfig;
    onInternalChange: OnTableChange;
}

export default function usePagination({pagination, onChange}: UsePaginationProps): UsePaginationReturn {
    const locale = useLocale('Table');

    const DEFAULT_PAGINATION: TablePaginationConfig = useMemo(
        () => ({
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
            showTotal: (total: number) => t({locale, key: 'total', context: {total}, defaultValue: `共 ${total} 条`}),
            position: ['bottomLeft'],
        }),
        [locale],
    );

    const internalPagination = useMemo(() => {
        let tempPagination: Pagination = false;

        if (toString.call(pagination) === '[object Boolean]') {
            if (pagination) {
                tempPagination = DEFAULT_PAGINATION;
            }
        } else {
            tempPagination = {...DEFAULT_PAGINATION, ...(pagination as TablePaginationConfig)};
        }

        return tempPagination;
    }, [DEFAULT_PAGINATION, pagination]);

    const onInternalChange = useCallback<OnTableChange>(
        (_pagination, _filters, _sorter, _extra) => {
            onChange && onChange(_pagination, _filters, _sorter, _extra);
        },
        [onChange],
    );

    return {internalPagination, onInternalChange};
}
