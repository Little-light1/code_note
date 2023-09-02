import React, { FC, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/runtime';
import { Radio, RadioChangeEvent } from 'antd';
import { PageProps } from '@gwaapp/ease';
import EChartsReact from 'echarts-for-react';
import { shallowEqual } from 'react-redux';
import styles from './styles.module.scss';
import { StatisticsChartTab } from '../types';
import { getChartOption } from './helper';
import { getChartData, handleRadioGroupChange } from './actions';

const Component: FC<PageProps> = (props) => {
    const {id} = props;
    const {
        twoBillsChartTab,
        twoBillsChartData,
    } = useAppSelector((state) => state[id], shallowEqual);
    const dispatch = useAppDispatch();
    // 图表配置项
    const option = useMemo(
        () => getChartOption(twoBillsChartData, twoBillsChartTab),
        [twoBillsChartData, twoBillsChartTab]
    );
    // 图表组件
    const chartArea = useMemo(
        () => <EChartsReact className={styles.echarts} option={option} />, 
        [option]
    );

    useEffect(() => {
        // 获取图表数据
        dispatch(getChartData(id));
    }, [dispatch, id]);
    
    // tab切换事件
    const onRadioGroupChange = (event: RadioChangeEvent) => {
        dispatch(handleRadioGroupChange(id, event.target.value))
    };

    return (
        <div className={styles.twoBillsStatistics}>
            {/* 标题区域 */}
            <div className={styles.header}>
                <div className={styles.title}>
                    <div className={styles.titleIcon} />
                    <div>两票统计</div>
                </div>
                {/* 右侧tab */}
                <Radio.Group value={twoBillsChartTab} onChange={onRadioGroupChange}>
                    <Radio.Button value={StatisticsChartTab.ThisMonth}>本月</Radio.Button>
                    <Radio.Button value={StatisticsChartTab.ThisYear}>本年</Radio.Button>
                </Radio.Group>
            </div>
            {/* 图表区域 */}
            {chartArea}
        </div>
    ); 
};

export default Component;