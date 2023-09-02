import React, {FC} from 'react';
import {useAppDispatch} from '@/app/runtime';
import {PageProps, usePage} from '@gwaapp/ease';
import {Tabs} from 'antd';
import {useTranslation} from 'react-i18next';
import TimeControl from './time_control';
import AddressControl from './address_control';
import {onInit} from './actions';
import styles from './styles.module.scss';

const Component: FC<PageProps> = (props) => {
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    usePage({...props, init: (pageProps) => dispatch(onInit(pageProps))});
    return (
        <div className={styles.searchView}>
            <Tabs defaultActiveKey="timeControl" type="card">
                <Tabs.TabPane tab={t('访问时间控制')} key="timeControl">
                    <TimeControl {...props} />
                </Tabs.TabPane>
                <Tabs.TabPane tab={t('访问地址控制')} key="addressControl">
                    <AddressControl {...props} />
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

export default Component;
