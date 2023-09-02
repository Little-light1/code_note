import React, {
    CSSProperties,
    FC,
    ReactNode,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {Slider} from 'antd';
import {useDebounceFn, useSize} from 'ahooks';
import styles from './style.module.scss';

interface Props {
    isScaling?: boolean;
    reSize?: boolean;
    designWidth?: number;
    designHeight?: number;
    defaultStyle?: CSSProperties;
    children: (props: {style: CSSProperties}) => ReactNode;
    onSizeChange: ({width, height}: {width: number; height: number}) => void;
}

const FadeSlider: FC<{
    rate: number;
    setRate: React.Dispatch<React.SetStateAction<number>>;
}> = ({rate, setRate}) => {
    const [isIn, setIsIn] = useState(false);
    return (
        <div
            className={isIn ? styles.fadeIn : styles.fadeOut}
            style={{
                position: 'absolute',
                right: 20,
                height: 200,
                top: '30%',
            }}
            onMouseLeave={() => setIsIn(false)}
            onMouseEnter={() => setIsIn(true)}
        >
            <Slider
                vertical
                tooltipVisible={false}
                value={rate}
                max={1}
                min={0}
                step={0.1}
                onChange={setRate}
            />
        </div>
    );
};

const DefaultStyle = {};

const ScalingContainer: FC<Props> = ({
    children,
    defaultStyle = DefaultStyle,
    isScaling = false,
    designWidth = 1920,
    designHeight = 1080,
    reSize = true,
    onSizeChange,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<CSSProperties>({});
    const [rate, setRate] = useState(1);
    const [max, setMax] = useState(1);
    const size = useSize(ref);
    const {run} = useDebounceFn(onSizeChange, {
        wait: 500,
    });
    useEffect(() => {
        setStyle(defaultStyle);
    }, [defaultStyle, isScaling]);
    useEffect(() => {
        size && run(size);
    }, [onSizeChange, run, size]);
    useEffect(() => {
        if (!isScaling) return;
        let tempStyle: CSSProperties = {
            height: designHeight,
            width: designWidth,
        };

        if (size) {
            const scale =
                size.width / size.height < designWidth / designHeight
                    ? size.width / designWidth
                    : size.height / designHeight;
            tempStyle = {
                ...tempStyle,
                transform: `scale(${scale}) translate(-50%)`,
                transformOrigin: '0 0',
                position: 'relative',
                left: '50%',
            };
            setRate(scale);
            setMax(scale);
            setStyle(tempStyle);
        }
    }, [designHeight, designWidth, isScaling, size]);
    useEffect(() => {
        if (!isScaling) return;
        setStyle((prev) => ({
            ...prev,
            transform: `scale(${
                rate > max ? Math.min(max, rate) : rate
            }) translate(-50%)`,
        }));
    }, [isScaling, max, rate]);
    const Children = useMemo(
        () =>
            children({
                style,
            }),
        [children, style],
    );
    // overflow: isScaling ? 'hidden' : 'auto'
    const containerStyle: CSSProperties = {height: '100%', width: '100%', position: 'relative'};

    if (!isScaling) {
        containerStyle.overflow = 'auto';
    }

    return (
        <div style={containerStyle} ref={ref}>
            {Children}
            {reSize && isScaling ? (
                <FadeSlider rate={rate} setRate={setRate} />
            ) : null}
        </div>
    );
};

export default ScalingContainer;
