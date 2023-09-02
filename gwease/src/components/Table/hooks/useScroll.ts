import {useSize} from 'ahooks';
import {TablePaginationConfig} from 'antd';
import {useMemo, useRef} from 'react';
import {DataSource, Offset, Scroll} from '../types';

// 默认表格
export const DEFAULT_SCROLL_OFFSET = {
    x: 15,
    y: 39,
};

const DEFAULT_PAGINATION = 50;

interface UseScrollProps {
    columnsWidth: {[key: string]: string | number | undefined};
    offset?: Offset;
    scroll?: Scroll;
    pagination: false | TablePaginationConfig;
    dataSource: DataSource;
}

export default function useScroll({offset = DEFAULT_SCROLL_OFFSET, columnsWidth, scroll, pagination, dataSource}: UseScrollProps) {
    const containerRef = useRef(null);

    const containerSize = useSize(containerRef);

    const internalScroll = useMemo(() => {
        // 不启用内置计算
        if (scroll === false) {
            return undefined;
        }

        // 不配置则启用内部计算，按照容器大小动态计算
        if (typeof scroll === 'undefined') {
            const {height, width} = containerSize || {};

            if (!height || !width) {
                return {};
            }

            if (Object.keys(columnsWidth).length) {
                const totalWidth = Object.values(columnsWidth).reduce<number>((prev, curr) => {
                    const w = curr ? parseFloat(String(curr)) : 0;
                    return prev + w;
                }, 0);

                return {
                    x: Math.max(width - offset.x, totalWidth),
                    y: height - offset.y - (pagination ? DEFAULT_PAGINATION : 0),
                };
            }
            return {
                x: width - offset.x,
                y: height - offset.y - (pagination ? DEFAULT_PAGINATION : 0),
            };
        }

        return scroll;
    }, [scroll, dataSource.length, containerSize, columnsWidth, offset.x, offset.y, pagination]);

    return {
        containerSize,
        containerRef,
        internalScroll,
    };
}
