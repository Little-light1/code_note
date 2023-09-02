import React, { FC } from 'react';
import {Progress} from 'antd';
import styles from './styles.module.scss';
import { EquipmentInfoModel, SortType } from './types';
import { getSortIcon } from './helper';

interface Props {
    // 标题
    title: string;
    // 数据源
    info: EquipmentInfoModel | null;
    // 排序类型
    sortType: SortType;
    // 排序类型变更回调
    onSortChange: (sortType: SortType) => void;
}

const Component: FC<Props> = ({title, info, sortType, onSortChange}) => (
    <div className={styles.listItem}>
        <div className={styles.itemHeader}>
            <div className={styles.headerTitle}>{title}</div>
            <div className={styles.headerInfo}> 
                <div>
                    <span>本周：</span>
                    <span className={styles.infoValue}>{info?.thisWeekValue || 0}</span>
                    <span className={styles.infoUnit}>%</span>
                </div>
                <div>
                    <span>本月：</span>
                    <span className={styles.infoValue}>{info?.thisMonthValue || 0}</span>
                    <span className={styles.infoUnit}>%</span>
                </div>
                <div>
                    <span>近12月：</span>
                    <span className={styles.infoValue}>{info?.last12MonthValue || 0}</span>
                    <span className={styles.infoUnit}>%</span>
                </div>
            </div>
            <div onClick={() => {
                // 排序变更
                const toType = sortType === SortType.Down ? SortType.Up:SortType.Down;
                onSortChange(toType);
            }}>
                <img src={getSortIcon(sortType)} alt="" />
            </div>
        </div>
        <div className={styles.topListTitle}>{title}TOP榜单</div>
        <div className={styles.topList}>
            {info?.xjQuotaGroups?.map((item) => (
                <div className={styles.topListItem} key={item.groupId}>
                    <div className={styles.itemTitle} title={item.groupName}>{item.groupName}</div>
                    <Progress 
                        className={styles.itemProgress} 
                        strokeColor={{
                            '0%': '#6CC45F',
                            '100%': '#00DCFF',
                        }}
                        trailColor='rgba(255, 255, 255, 0.2000)'
                        percent={item.value}
                        showInfo={false} 
                    />
                    <div className={styles.itemValue}>{item.value}%</div>
                </div>
            ))}
        </div>
    </div>
)

export default Component;
