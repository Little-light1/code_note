import React, {FC, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {Radio, Row, Col, Progress, RadioChangeEvent} from 'antd';
import {PageProps} from '@gwaapp/ease';
import { shallowEqual } from 'react-redux';
import styles from './styles.module.scss';
import {WarningTimeChartTab, WarningTopListItemModel} from './types';
import TaskInfo from './taskInfo';
import { getTaskNumData, getWarningTopListData, handleEnergyRadioGroupChange, handleTimeRadioGroupChange } from './actions';
import { EnergyChartTab } from '../types';

const Component: FC<PageProps> = (props) => {
    const {id} = props;
    const {
        warningTimeTab,
        warningEnergyTab,
        warningTaskInfo,
        warningTopList,
    } = useAppSelector((state) => state[id], shallowEqual);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getTaskNumData(id, warningTimeTab, warningEnergyTab));
    }, [dispatch, id, warningEnergyTab, warningTimeTab]);

    useEffect(() => {
        dispatch(getWarningTopListData(id, warningEnergyTab));
    }, [dispatch, id, warningEnergyTab]);

    // tab切换事件
    const onTimeRadioGroupChange = (event: RadioChangeEvent) => {
        dispatch(handleTimeRadioGroupChange(id, event.target.value));
    };

    // tab切换事件
    const onEnergyRadioGroupChange = (event: RadioChangeEvent) => {
        dispatch(handleEnergyRadioGroupChange(id, event.target.value));
    };

    return (
        <div className={styles.warningInfo}>
            {/* 标题区域 */}
            <div className={styles.header}>
                <div className={styles.title}>
                    <div className={styles.titleIcon} />
                    <div>预警信息</div>
                </div>
                {/* 右侧tab */}
                <div>
                    <Radio.Group value={warningTimeTab} onChange={onTimeRadioGroupChange}>
                        <Radio.Button value={WarningTimeChartTab.Today}>今日</Radio.Button>
                        <Radio.Button value={WarningTimeChartTab.ThisWeek}>本周</Radio.Button>
                        <Radio.Button value={WarningTimeChartTab.ThisMonth}>本月</Radio.Button>
                        <Radio.Button value={WarningTimeChartTab.Last12Month}>近12月</Radio.Button>
                    </Radio.Group>
                    <Radio.Group className={styles.energyChartTab} value={warningEnergyTab} onChange={onEnergyRadioGroupChange}>
                        <Radio.Button value={EnergyChartTab.Wind}>风机</Radio.Button>
                        <Radio.Button value={EnergyChartTab.Photovoltaic}>光伏</Radio.Button>
                    </Radio.Group>
                </div>
            </div>
            <div className={styles.detail}>
                <Row gutter={[15, 15]}>
                    <Col span={12}>
                        <TaskInfo taskInfo={warningTaskInfo}/>
                    </Col>
                    <Col span={12}>
                        <div className={styles.listItem}>
                            <div className={styles.topListTitle}>预警数量TOP榜单</div>
                            <div className={styles.topList}>
                                {warningTopList?.map((item: WarningTopListItemModel) => {
                                    const taskNum = item.taskNum || 0;
                                    return (
                                        <div className={styles.topListItem} key={item.groupId}>
                                            <div className={styles.itemTitle} title={item.groupName}>{item.groupName}</div>
                                            <Progress 
                                                className={styles.itemProgress} 
                                                strokeColor={{
                                                    '0%': '#6CC45F',
                                                    '100%': '#00DCFF',
                                                }}
                                                trailColor='rgba(255, 255, 255, 0.2000)'
                                                percent={taskNum}
                                                showInfo={false} 
                                            />
                                            <div className={styles.itemValue}>{taskNum}个</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Col>
                </Row>
                
            </div>
        </div>
    );
};

export default Component;
