import React, {FC, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {Col, Radio, RadioChangeEvent, Row} from 'antd';
import {PageProps} from '@gwaapp/ease';
import { shallowEqual } from 'react-redux';
import styles from './styles.module.scss';
import {EnergyChartTab} from '../types';
import TopList from './topList';
import {getAccuracyData, getCompletionRateData, getHealthData, handleAccuracySortChange, handleCompletionRateSortChange, handleEnergyRadioGroupChange, handleHealthySortChange } from './actions';

const Component: FC<PageProps> = (props) => {
    const {id} = props;
    const {
        deviceEnergyTab,
        deviceHealthyData,
        deviceCompletionRateData,
        deviceAccuracyData,
        deviceHealthySort,
        deviceCompletionRateSort,
        deviceAccuracySort,
    } = useAppSelector((state) => state[id], shallowEqual);
    const dispatch = useAppDispatch();

    useEffect(() => {
        // 获取健康度数据
        dispatch(getHealthData(id, deviceEnergyTab, deviceHealthySort));
    }, [dispatch, id, deviceEnergyTab, deviceHealthySort]);

    useEffect(() => {
        // 获取完结率数据
        dispatch(getCompletionRateData(id, deviceEnergyTab, deviceCompletionRateSort));
    }, [dispatch, id, deviceEnergyTab, deviceCompletionRateSort]);

    useEffect(() => {
        // 获取准确率数据
        dispatch(getAccuracyData(id, deviceEnergyTab, deviceAccuracySort));
    }, [dispatch, id, deviceEnergyTab, deviceAccuracySort]);

    // tab切换事件
    const onRadioGroupChange = (event: RadioChangeEvent) => {
        dispatch(handleEnergyRadioGroupChange(id, event.target.value))
    };

    return (
        <div className={styles.equipmentInfo}>
            {/* 标题区域 */}
            <div className={styles.header}>
                <div className={styles.title}>
                    <div className={styles.titleIcon} />
                    <div>设备信息</div>
                </div>
                {/* 右侧tab */}
                <Radio.Group value={deviceEnergyTab} onChange={onRadioGroupChange}>
                    <Radio.Button value={EnergyChartTab.Wind}>风机</Radio.Button>
                    <Radio.Button value={EnergyChartTab.Photovoltaic}>光伏</Radio.Button>
                </Radio.Group>
            </div>
            {/* 详情数据 */}
            <div className={styles.detail}>
                <Row className={styles.row} gutter={[15, 15]}>
                    {/* 健康度 */}
                    <Col span={8}>
                        <TopList 
                            title='健康度' 
                            info={deviceHealthyData} 
                            sortType={deviceHealthySort} 
                            onSortChange={(sortType) => {
                                dispatch(handleHealthySortChange(id, sortType));
                            }}/>
                    </Col>
                    {/* 完结率 */}
                    <Col span={8}>
                        <TopList 
                            title='完结率' 
                            info={deviceCompletionRateData} 
                            sortType={deviceCompletionRateSort} 
                            onSortChange={(sortType) => {
                                dispatch(handleCompletionRateSortChange(id, sortType));
                            }}/>
                    </Col>
                    {/* 准确率 */}
                    <Col span={8}>
                        <TopList 
                            title='准确率' 
                            info={deviceAccuracyData} 
                            sortType={deviceAccuracySort} 
                            onSortChange={(sortType) => {
                                dispatch(handleAccuracySortChange(id, sortType));
                            }}/>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Component;
