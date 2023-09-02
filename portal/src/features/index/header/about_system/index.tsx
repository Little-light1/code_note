import React from 'react';
import {Modal} from 'antd';
import {i18nIns} from '@/app/i18n';
import styles from './styles.module.scss';

const AboutSystemModal = ({visibleModal, onCancel, data}: any) => {
    const {t} = i18nIns;

    return (
        <Modal
            open={visibleModal}
            title={t('关于系统')}
            width={774}
            footer={null}
            onCancel={() => {
                onCancel(false);
            }}
            maskClosable={false}
        >
            <div className={styles.systemInfoModel}>
                <div
                    style={{
                        minHeight: '320px',
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                    }}
                >
                    <img
                        src="../../../../../public/image/aboutSystem.png"
                        alt=""
                        style={{
                            width: '639px',
                            height: '311px',
                            position: 'absolute',
                            margin: '20px 0px 0px 95px',
                        }}
                    />
                    <div>
                        <div className={styles.systemIntroduce}>
                            <div className={styles.systemIntroduceContent}>
                                <div className={styles.systemName}>
                                    {data.map((item: any) => {
                                        return (
                                            <div key={item.id}>
                                                <p>{item.appName}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className={styles.middleLine}>
                                    {data.map((item: any) => {
                                        return <div key={item.id} />;
                                    })}
                                </div>
                                <div className={styles.systemVersion}>
                                    {data.map((item: any) => {
                                        return (
                                            <p key={item.id}>
                                                {t('当前版本号')}：
                                                {item.version}
                                            </p>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className={styles.systemExplain}>
                            {t('说明：')}
                            {data.map((item: any) => {
                                if (item?.appCode === 'OC') {
                                    return (
                                        <span key={item.id}>
                                            {item.upgradeNotes};
                                        </span>
                                    );
                                }

                                return null;
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div
                style={{
                    width: '100%',
                    height: '52px',
                    fontSize: '14px',
                    textAlign: 'center',
                }}
            >
                <span style={{marginTop: '16px', display: 'inline-block'}}>
                    {t('版权所有©2022金风慧能技术有限公司。')}
                </span>
            </div>
        </Modal>
    );
};

export default AboutSystemModal;
