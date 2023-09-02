import React, {FC, useEffect, useMemo} from 'react';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {Radio, RadioChangeEvent} from 'antd';
import {PageProps} from '@gwaapp/ease';
import EChartsReact from 'echarts-for-react';
import {shallowEqual} from 'react-redux';
import styles from './styles.module.scss';
import {ChartSortType, EnergyChartTab, StatisticsChartTab} from '../types';
import {getChartOption} from './helper';
import {
    getChartData,
    handleChartSortChange,
    handleEnergyRadioGroupChange,
    handleTimeRadioGroupChange,
} from './actions';
import OrderAsc from '../images/order_asc.svg';
import OrderDesc from '../images/order_desc.svg';
import Order from '../images/order.svg';

const orderStyles = {
    marginLeft: '15px',
    width: '14px',
    height: '14px',
    cursor: 'pointer',
};

const Component: FC<PageProps> = (props) => {
    const {id} = props;
    const {
        stationTimeTab,
        stationEnergyTab,
        stationChartSortData,
        stationChartSort,
    } = useAppSelector((state) => state[id], shallowEqual);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getChartData(id, stationTimeTab, stationEnergyTab));
    }, [dispatch, id, stationTimeTab, stationEnergyTab]);

    const option = useMemo(
        () => getChartOption(stationChartSortData, stationEnergyTab),
        [stationChartSortData, stationEnergyTab],
    );

    const chartArea = useMemo(
        () => <EChartsReact className={styles.echarts} option={option} />,
        [option],
    );

    const stationEnergyTitle = useMemo(
        () =>
            stationEnergyTab === EnergyChartTab.Wind
                ? '场站能效对比分析'
                : '场站系统效率PR对比分析',
        [stationEnergyTab],
    );

    // tab切换事件
    const onStatisticsRadioGroupChange = (event: RadioChangeEvent) => {
        dispatch(handleTimeRadioGroupChange(id, event.target.value));
    };

    const onEnergyRadioGroupChange = (event: RadioChangeEvent) => {
        dispatch(handleEnergyRadioGroupChange(id, event.target.value));
    };

    // 图表排序事件
    const onChartSortChange = (value: ChartSortType) => {
        dispatch(handleChartSortChange(id, value));
    };

    return (
        <div className={styles.stationEnergyEfficiency}>
            {/* 标题区域 */}
            <div className={styles.header}>
                <div className={styles.title}>
                    <div className={styles.titleIcon} />
                    <div>{stationEnergyTitle}</div>
                </div>
                {/* 右侧tab */}
                <div>
                    <Radio.Group
                        value={stationTimeTab}
                        onChange={onStatisticsRadioGroupChange}
                    >
                        <Radio.Button value={StatisticsChartTab.ThisMonth}>
                            本月
                        </Radio.Button>
                        <Radio.Button value={StatisticsChartTab.ThisYear}>
                            本年
                        </Radio.Button>
                    </Radio.Group>
                    <Radio.Group
                        className={styles.energyChartTab}
                        value={stationEnergyTab}
                        onChange={onEnergyRadioGroupChange}
                    >
                        <Radio.Button value={EnergyChartTab.Wind}>
                            风机
                        </Radio.Button>
                        <Radio.Button value={EnergyChartTab.Photovoltaic}>
                            光伏
                        </Radio.Button>
                    </Radio.Group>
                    {/* 默认排序 */}
                    {stationChartSort === ChartSortType.none && (
                        <Order
                            onClick={() => onChartSortChange(ChartSortType.asc)}
                            style={orderStyles}
                        />
                    )}
                    {/* 升序 */}
                    {stationChartSort === ChartSortType.asc && (
                        <OrderAsc
                            onClick={() =>
                                onChartSortChange(ChartSortType.desc)
                            }
                            style={orderStyles}
                        />
                    )}
                    {/* 降序 */}
                    {stationChartSort === ChartSortType.desc && (
                        <OrderDesc
                            onClick={() =>
                                onChartSortChange(ChartSortType.none)
                            }
                            style={orderStyles}
                        />
                    )}
                </div>
            </div>
            {/* echarts 图表区域 */}
            {chartArea}
        </div>
    );
};

export default Component;
