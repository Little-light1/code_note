import React, {FC} from 'react';
import {Collapse, Panel} from '@components/collapse';
import {usePage, PageProps} from '@gwaapp/ease';
import {useAppDispatch} from '@/app/runtime';
import {useTranslation} from 'react-i18next';
import LogoEditor from './logo_editor';
import BgEditor from './bg_editor';
import CommonEditor from './common_editor';
import {onInit} from './actions';
import styles from './styles.module.scss';

const FrameConfig: FC<any> = (props: PageProps) => {
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    usePage({...props, init: (pageProps) => dispatch(onInit(pageProps))});
    return (
        <div className={styles.view}>
            <Collapse
                defaultActiveKey={['1', '2', '3']}
                expandIconPosition="right"
            >
                {/* 基本信息配置 */}
                <Panel header={t('基本信息配置')} key="1">
                    <LogoEditor props={props} />
                </Panel>
                {/* 背景页面配置 */}
                <Panel header={t('背景页面配置')} key="2">
                    <BgEditor pageProps={props} />
                </Panel>
                {/* 通用功能配置 */}
                <Panel header={t('通用功能配置')} key="3">
                    <CommonEditor pageProps={props} />
                </Panel>
            </Collapse>
        </div>
    );
};

export default FrameConfig;
