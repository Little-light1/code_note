/*
 * @Author: gxn
 * @Date: 2022-03-26 11:37:37
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-12-01 14:56:48
 * @Description: view
 */
import React from 'react';
import {getLocal} from '@utils/storage';
import styles from './styles.module.scss';

const Component = () => {
    const authorization = getLocal('authorization');
    const language = getLocal('i18nextLng');
    return (
        <div className={styles.contentBox}>
            <iframe
                className={styles.iframePageContent}
                src={`${window.aappAmbariConfigs.THING_PLAT_URL.replace(
                    '{{host}}',
                    window.location.hostname,
                )}/#/dataPlat/thingConfigration?type=frontGateway&token=${authorization}&Accept-Language=${language}`}
                title="接入器注册"
            />
        </div>
    );
};

export default Component;
