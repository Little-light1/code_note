/*
 * @Author: zhangzhen
 * @Date: 2022-06-29 16:01:22
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-12-02 09:35:30
 *
 */
import React, {FC} from 'react';
import {Button} from 'antd';
import {ToolOutlined} from '@ant-design/icons';
import {getUniqueKey, PageProps} from '@gwaapp/ease';
import {shallowEqual} from 'react-redux';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useTranslation} from 'react-i18next';
import styles from './styles.module.scss';
import {alarmDealFun} from '../actions';

const AlarmDetailModal: FC<{
    props: PageProps;
}> = ({props}) => {
    const {id} = props;
    const dispatch = useAppDispatch();
    const {alarmDetailInfo, alarmDetailArr} = useAppSelector(
        (state) => state[getUniqueKey(id)],
        shallowEqual,
    );
    const {t} = useTranslation();

    const changeLevleColor = (name: string, value: string) => {
        if (name === '告警等级' && (value === '严重' || value === 'serious')) {
            return {
                color: 'red',
            };
        }

        if (name === '告警等级' && (value === '一般' || value === 'commonly')) {
            return {
                color: 'orange',
            };
        }

        return {};
    };

    return (
        <div className={styles.alarmBox}>
            {alarmDetailArr.map((item: {value: string; name: string}) => (
                <div key={item.name} className={styles.alarmItem}>
                    <div>{t(item.name)}:</div>
                    <span style={changeLevleColor(item.name, item.value)}>
                        {item.value || '--'}
                    </span>
                </div>
            ))}
            <div className={styles.alarmButton}>
                <Button
                    icon={<ToolOutlined rotate={270} />}
                    type="primary"
                    onClick={() => {
                        dispatch(alarmDealFun(props, alarmDetailInfo));
                    }}
                >
                    {t('处理')}
                </Button>
            </div>
        </div>
    );
};

export default AlarmDetailModal;
