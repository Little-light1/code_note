/*
 * @Author: gxn
 * @Date: 2021-12-29 10:45:11
 * @LastEditors: gxn
 * @LastEditTime: 2022-01-13 19:42:55
 * @Description: file content
 */
import React, {useState, useCallback, CSSProperties, useEffect} from 'react';
import {getPreviewImageUrl} from '@services/file';

interface Props {
    height?: number;
    width?: number;
    alt?: string;
    style?: CSSProperties;
    className?: string;
}
interface ImageProps extends Props {
    src: string;
}

const CatchImage = ({
    src,
    height = 32,
    width = 32,
    alt = '',
    ...args
}: ImageProps) => {
    const [isError, setIsError] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const onError = useCallback(() => {
        setIsError(true);
    }, []);
    const onLoad = useCallback(() => {
        // 处理图表加载失败闪烁问题
        setLoaded(true);
    }, []);
    useEffect(() => {
        setIsError(false);
    }, [src]);

    if (isError) {
        return null;
    }

    return (
        <img
            onError={onError}
            onLoad={onLoad}
            alt={alt}
            src={src}
            height={loaded ? height : 0}
            width={loaded ? width : 0}
            {...args}
        />
    );
};

interface TokenImageProps extends Props {
    token: string;
}
export const CatchTokenImage = ({token, ...args}: TokenImageProps) => {
    if (token === '') return null;
    const src = getPreviewImageUrl(token);
    return <CatchImage src={src} {...args} />;
};

export default CatchImage;
