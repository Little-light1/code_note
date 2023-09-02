import React, {FC, useEffect, useMemo} from 'react';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {Radio, RadioChangeEvent} from 'antd';
import {PageProps} from '@gwaapp/ease';
import EChartsReact from 'echarts-for-react';
import { shallowEqual } from 'react-redux';
import styles from './styles.module.scss';
import {ChartSortType, EnergyChartTab, StatisticsChartTab} from '../types';
import { getChartOption } from './helper';
import { getChartData, handleChartSortChange, handleEnergyRadioGroupChange, handleTimeRadioGroupChange } from './actions';
import OrderAsc from '../images/order_asc.svg';
import OrderDesc from '../images/order_desc.svg';
import Order from '../images/order.svg';

const orderStyles = {marginLeft: '15px', width: '14px', height: '14px', cursor: 'pointer'};

const Component: FC<PageProps> = (props) => {
    const {id} = props;
    const {
        equipmentTimeTab,
        equipmentEnergyTab,
        equipmentChartSortData,
        equipmentChartSort,
    } = useAppSelector((state) => state[id], shallowEqual);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getChartData(id, equipmentTimeTab, equipmentEnergyTab));
    }, [dispatch, id, equipmentTimeTab, equipmentEnergyTab]);

    const option = useMemo(
        () => getChartOption(equipmentChartSortData), 
        [equipmentChartSortData]
    );

    const chartArea = useMemo(
        () => <EChartsReact className={styles.echarts} option={option} />, 
        [option]
    );

    // tab切换事件
    const onStatisticsRadioGroupChange = (event: RadioChangeEvent) => {
        dispatch(handleTimeRadioGroupChange(id, event.target.value))
    };

    const onEnergyRadioGroupChange = (event: RadioChangeEvent) => {
        dispatch(handleEnergyRadioGroupChange(id, event.target.value))
    };

    // 图表排序事件
    const onChartSortChange = (value: ChartSortType) => {
        dispatch(handleChartSortChange(id, value));
    }

    return (
        <div className={styles.equipmentEnergyEfficiency}>
            {/* 标题区域 */}
            <div className={styles.header}>
                <div className={styles.title}>
                    <div className={styles.titleIcon} />
                    <div>设备能效对比分析</div>
                </div>
                {/* 右侧tab */}
                <div>
                    <Radio.Group value={equipmentTimeTab} onChange={onStatisticsRadioGroupChange}>
                        <Radio.Button value={StatisticsChartTab.ThisMonth}>本月</Radio.Button>
                        <Radio.Button value={StatisticsChartTab.ThisYear}>本年</Radio.Button>
                    </Radio.Group>
                    <Radio.Group className={styles.energyChartTab} value={equipmentEnergyTab} onChange={onEnergyRadioGroupChange}>
                        <Radio.Button value={EnergyChartTab.Wind}>风机</Radio.Button>
                        <Radio.Button value={EnergyChartTab.Photovoltaic}>光伏</Radio.Button>
                    </Radio.Group>
                    {/* 默认排序 */}
                    {equipmentChartSort === ChartSortType.none && (
                        <Order
                            onClick={() => onChartSortChange(ChartSortType.asc)}
                            style={orderStyles}
                        />
                    )}
                    {/* 升序 */}
                    {equipmentChartSort === ChartSortType.asc && (
                        <OrderAsc
                            onClick={() => onChartSortChange(ChartSortType.desc)}
                            style={orderStyles}
                        />
                    )}
                    {/* 降序 */}
                    {equipmentChartSort === ChartSortType.desc && (
                        <OrderDesc
                            onClick={() => onChartSortChange(ChartSortType.none)}
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
