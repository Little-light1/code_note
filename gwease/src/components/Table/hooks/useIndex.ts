import {useMemo} from 'react';
import {useLocale} from '../../Runtime/App/LocaleProvider';
import {DataSource, Columns, Index, AlignType} from '../types';
import {EMPTY_OBJECT} from './constant';

interface UseIndexProps {
    showIndex?: boolean | {current: number; pageSize: number};
    dataSource?: DataSource;
    columns?: Columns;
    index?: Index;
}

const EMPTY_DATA_SOURCE: any[] = [];
const EMPTY_COLUMNS: any[] = [];

// 嵌套设置index
function loopSetIndex({dataSource, start = 1, indexKey}: {dataSource: DataSource; start?: number; indexKey: string}) {
    return dataSource.map((item, index) => {
        const {children, ...itemProps} = item;

        // const indexValue = parentKey ? `${parentKey}-${index + 1}` : String(index + 1);
        const indexValue = String(index + start);

        const temp = Object.assign(itemProps, {[indexKey]: indexValue});

        if (children) {
            temp.children = loopSetIndex({dataSource: children, indexKey});
        }

        return temp;
    });
}

export default function useIndex({
    showIndex,
    dataSource = EMPTY_DATA_SOURCE,
    columns = EMPTY_COLUMNS,
    index = EMPTY_OBJECT,
}: UseIndexProps) {
    const locale = useLocale('Table');

    const DEFAULT_INDEX = useMemo(
        () => ({
            key: '_index',
            dataIndex: '_index',
            title: locale.index || '序号',
            width: 50,
            canHide: false,
            canDrag: false,
            canDrop: false,
            canResize: false,
        }),
        [],
    );

    const mergeIndex = useMemo(() => ({...DEFAULT_INDEX, ...index}), [DEFAULT_INDEX, index]);

    const indexDataSource = useMemo(() => {
        // if (!showIndex) return dataSource;

        let tempDataSource = [];

        let start = 1;
        if (showIndex instanceof Object) {
            const {current, pageSize} = showIndex;
            start = (current - 1) * pageSize + 1;
        }
        tempDataSource = loopSetIndex({dataSource, start, indexKey: mergeIndex.key});

        return tempDataSource;
    }, [dataSource, mergeIndex.key, showIndex]);

    const indexColumns = useMemo(() => {
        if (!showIndex) return columns;

        return [
            {
                key: mergeIndex.key,
                dataIndex: mergeIndex.dataIndex,
                title: mergeIndex.title,
                width: mergeIndex.width,
                align: 'center' as AlignType,
                canHide: mergeIndex.canHide,
                canDrag: mergeIndex.canDrag,
                canDrop: mergeIndex.canDrop,
                canResize: mergeIndex.canResize,
            },
            ...columns,
        ];
    }, [showIndex, columns, mergeIndex]);

    return {
        indexDataSource,
        indexColumns,
    };
}
