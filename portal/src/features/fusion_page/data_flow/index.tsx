/* eslint-disable global-require */
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/runtime';
import { PageProps } from '@gwaapp/ease';
import EChartsReact from 'echarts-for-react';
import { shallowEqual } from 'react-redux';
import _ from 'lodash';
import styles from './styles.module.scss';
import { chartColors, dataFlowTypes, getChartOption, getDataFlowItem, getDataFlowItemData, getDataFlowItemValue } from './helper';
import { DataFlowType } from './types';
import { getChartData, handleTabChange } from './actions';
import { nullToDoubleBar } from '../constant';

// 初始图例页码
// const InitialLegendPage = 0;
// const InitialLegendPageSize = 6;

const Component: FC<PageProps> = (props) => {
    const { id } = props;
    const { 
        dataFlowTab,
        dataFlowData,
    } = useAppSelector((state) => state[id], shallowEqual);
    const dispatch = useAppDispatch();
    const [hiddenLegends, setHiddenLegends] = useState<string[]>([]);
    // const [legendPage, setLegendPage] = useState(InitialLegendPage);
    const chartsRef = useRef<EChartsReact>(null);
    const legendsRef = useRef<any>(null);

    const option = useMemo(
        () => getChartOption(dataFlowTab, dataFlowData), 
        [dataFlowTab, dataFlowData]
    );
    
    const chartArea = useMemo(
        () => <EChartsReact ref={chartsRef} className={styles.echarts} option={option} />, 
        [option]
    );

    const itemValue = useMemo(
        () => getDataFlowItemValue(dataFlowData),
        [dataFlowData]
    )

    useEffect(() => {
        dispatch(getChartData(id, dataFlowTab));
    }, [dispatch, id, dataFlowTab]);

    // tab切换事件
    const onTabChange = (type: DataFlowType) => {
        dispatch(handleTabChange(props, type));
    };

    // 图例点击事件
    const onLegendClick = (name: string) => {
        const charts = chartsRef?.current?.getEchartsInstance();
        if (!charts) {
            return;
        }
        charts.dispatchAction({
            type: 'legendToggleSelect',
            // 图例名称
            name
        })
        const legends = _.clone(hiddenLegends);
        const index = legends.findIndex((item) => item === name);
        if (index < 0) {
            legends.push(name);
        } else {
            legends.splice(index, 1);
        }
        setHiddenLegends(legends);
    }

    // // 图例上一页
    // const onPreviewPage = () => {
    //     legendsRef?.current?.scrollTo({
    //         top: 30 * InitialLegendPageSize * (legendPage - 1),
    //         // 如果想要滚动时，带有动画效果，可以使用 smooth 即可
    //         behavior: 'smooth'
    //     }); 
    //     setLegendPage(legendPage - 1);
    // }

    // // 图例下一页
    // const onNextPage = () => {  
    //     legendsRef?.current?.scrollTo({
    //         top: 30 * InitialLegendPageSize * (legendPage + 1),
    //         // 如果想要滚动时，带有动画效果，可以使用 smooth 即可
    //         behavior: 'smooth'
    //     }); 
    //     setLegendPage(legendPage + 1);
    // }

    return (
        <div className={styles.dataFlow}>
            {/* 标题区域 */}
            <div className={styles.header}>
                <div className={styles.title}>
                    <div className={styles.titleIcon} />
                    <div>数据流量及接入点</div>
                </div>
            </div>
            <div className={styles.content}>
                {chartArea}
                <div className={styles.rightInfo}>
                    {/* 自定义图例 */}
                    <div className={styles.legendBox}>
                        {/* 上翻页按钮 */}
                        {/* <div className={styles.legendButton} onClick={() => legendPage === InitialLegendPage ? null:onPreviewPage()}>
                            <img src={ legendPage === InitialLegendPage ? require('../images/arrow_up_gray.png'):require('../images/arrow_up.png')} alt="" />
                        </div> */}
                        {/* 图例列表 */}
                        <div className={styles.legendList} ref={legendsRef}>
                            {[getDataFlowItemData(dataFlowTab).historyTitle].map((item, index) => {
                                const idx = index % chartColors.length;
                                const colors = chartColors[idx];
                                const findIndex = hiddenLegends.findIndex((i) => i === item);
                                return (
                                    <div key={item} className={styles.legendItem} onClick={() => {
                                        onLegendClick(item);
                                    }}>
                                        <div 
                                            // 若曲线不显示，则图例置灰
                                            className={findIndex < 0 ? `${styles.legendIcon}`:`${styles.legendIcon} ${styles.legendIconHidden}`} 
                                            // 根据曲线渐变色，显示图例渐变色
                                            style={findIndex < 0 ? {backgroundImage: `linear-gradient(to right, ${colors[0]} , ${colors[1]})`}:{}}
                                        />
                                        <div 
                                            className={findIndex < 0 ? `${styles.legendTitle}`:`${styles.legendTitle} ${styles.legendTitleHidden}`} 
                                            title={item}>
                                            {item}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* 下翻页按钮 */}
                        {/* <div className={styles.legendButton} onClick={() => (legendPage + 1) * InitialLegendPageSize > chartValues.length ? null:onNextPage()}>
                            <img src={(legendPage + 1) * InitialLegendPageSize > chartValues.length ? require('../images/arrow_down_gray.png'):require('../images/arrow_down.png')} alt="" />
                        </div> */}
                    </div>
                    <div className={styles.dataBox}>
                        <div>{nullToDoubleBar(itemValue)}</div>
                        <div className={styles.dataTitle}>{getDataFlowItemData(dataFlowTab).realtimeTitle}</div>
                        {dataFlowTab === DataFlowType.DataFlow ? <div className={styles.dataUnit}>({dataFlowData?.realTimeData?.unit})</div> : null }
                    </div>
                </div> 
            </div>
            {/* 底部切换tab 数据流量-设备数-接入点 */}
            <div className={styles.tabs}>
                {dataFlowTypes.map((type) => {
                    const item = getDataFlowItem(type);
                    return <div 
                        key={type} 
                        className={type === dataFlowTab ? `${styles.tabItem} ${styles.tabItemSelected}`:styles.tabItem}
                        onClick={() => {
                            onTabChange(type);
                        }}
                    >
                        <img src={item.icon} alt="" className={styles.tabIcon}/>
                        {item.title}
                    </div>
                })}
            </div>
        </div>
    );
};

export default Component;
