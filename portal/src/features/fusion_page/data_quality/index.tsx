import React, { FC, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/runtime';
import { Row, Col, Divider} from 'antd';
import { PageProps } from '@gwaapp/ease';
import EChartsReact from 'echarts-for-react';
import { shallowEqual } from 'react-redux';
import styles from './styles.module.scss';
import { getInfoItems, getRadarChartOption, getRadarTypeName, getRateInfoBottomItems, getRateInfoTopItems, radarTypes } from './helper';
import { getQualityCoverData, getQualityInfoData, handleChartClick } from './actions';

const Component: FC<PageProps> = (props) => {
    const {id} = props;
    const {
        dataQualityChartIndex,
        dataQualityInfoData,
        dataQualityCoverData,
    } = useAppSelector((state) => state[id], shallowEqual);
    const dispatch = useAppDispatch();
    const infoItems = useMemo(
        () => getInfoItems(dataQualityInfoData), 
        [dataQualityInfoData]
    );
    const option = useMemo(
        () => getRadarChartOption(dataQualityChartIndex, dataQualityInfoData),
        [dataQualityChartIndex, dataQualityInfoData]
    );

    const chartArea = useMemo(
        () => <EChartsReact className={styles.echarts} option={option} onEvents={{
            'click': (params: any) => {
                if (params.componentType === 'series') {
                    // eslint-disable-next-line no-underscore-dangle
                    const selectedIndex = params.event.target.__dimIdx;
                    dispatch(handleChartClick(id, selectedIndex));
                } else if (params.componentType === 'radar') {
                    const selectedIndex = radarTypes.findIndex((item) => getRadarTypeName(item) === params.name);
                    dispatch(handleChartClick(id, selectedIndex));
                }
            }}} />, [dispatch, option, id])

    useEffect(() => {
        dispatch(getQualityCoverData(id));
        dispatch(getQualityInfoData(id));
    }, [dispatch, id]);

    const infoTopItems = useMemo(
        () => getRateInfoTopItems(radarTypes[radarTypes[dataQualityChartIndex]], dataQualityCoverData), 
        [dataQualityChartIndex, dataQualityCoverData]
    );
    const infoBottomItems = useMemo(
        () => getRateInfoBottomItems(radarTypes[radarTypes[dataQualityChartIndex]], dataQualityCoverData), 
        [dataQualityChartIndex, dataQualityCoverData]
    );

    return (
        <div className={styles.dataQuality}>
            {/* 标题区域 */}
            <div className={styles.header}>
                <div className={styles.title}>
                    <div className={styles.titleIcon} />
                    <div>数据质量</div>
                </div>
            </div>
            <div className={styles.infoItems}>
                {infoItems.map((item) => (
                    <div key={item.title} className={styles.infoItem}>
                        <div>{item.title}</div>
                        <div className={styles.infoValue}>{item.value}<span>{item.unit}</span></div>
                    </div>
                ))}
            </div>
            <div className={styles.infoSeparator} />
            <div className={styles.detail}>
                {/* echarts 图表区域 */}
                {chartArea}
                <div className={styles.dataInfo}>
                    <div className={styles.dataTitle}>{getRadarTypeName(radarTypes[dataQualityChartIndex])}</div>
                    <Row>
                        {infoTopItems.map((item) => (
                            <Col key={item.title} span={8}>
                                <div>
                                    <div>{item.title}</div>
                                    <div className={styles.dataValue}>
                                        {item.covered}
                                        <span className={styles.dataValueSeparator}>/</span>
                                        {item.all}
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                    {infoBottomItems.length > 0 ? 
                        (
                            <div>
                                <Divider className={styles.divider}/>
                                <Row>
                                    {infoBottomItems.map((item) => (
                                        <Col key={item.title} span={8}>
                                            <div>
                                                <div>{item.title}</div>
                                                <div className={styles.dataValue}>{item.all}</div>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        ):null}
                </div>
            </div>
            
        </div>
    ); 
};

export default Component;