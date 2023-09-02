/*
 * @Author: gxn
 * @Date: 2022-03-26 11:37:37
 * @LastEditors: gxn
 * @LastEditTime: 2022-03-26 15:31:38
 * @Description: view
 */
import React, {FC, useMemo} from 'react';
import {getLocal} from '@/common/utils/storage';
import {usePage} from '@gwaapp/ease';
import styles from './styles.module.scss';

const InfoModelEntry: FC<any> = (props) => {
    usePage({...props});

    const jumpPageToken = useMemo(() => {
        const authorization = getLocal('authorization');
        const language = getLocal('i18nextLng');

        return `${window.aappAmbariConfigs.THING_PLAT_URL.replace(
            '{{host}}',
            window.location.hostname,
        )}/#/tmc/modelEntry?token=${authorization}&Accept-Language=${language}`;
    }, []);

    return (
        <div className={styles.contentBox}>
            <iframe
                className={styles.iframePageContent}
                src={jumpPageToken}
                title="词条管理2.0"
            />
        </div>
    );
};

export default InfoModelEntry;
