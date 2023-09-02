/*
 * @Author: gxn
 * @Date: 2022-03-29 16:44:12
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-12-01 14:57:16
 * @Description: deviceRegister
 */
import React from 'react';
import {getLocal} from '@utils/storage';
import styles from './styles.module.scss';

const deviceRegister = () => {
    const authorization = getLocal('authorization');
    const language = getLocal('i18nextLng');

    return (
        <div className={styles.contentBox}>
            <iframe
                className={styles.iframePageContent}
                src={`${window.aappAmbariConfigs.THING_PLAT_URL.replace(
                    '{{host}}',
                    window.location.hostname,
                )}/#/dataPlat/thingConfigration?type=farm&token=${authorization}&Accept-Language=${language}`}
                title="电场设备注册"
            />
        </div>
    );
};

export default deviceRegister;
