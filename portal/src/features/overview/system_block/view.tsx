/*
 * @Author: Tomato.Bei
 * @Date: 2022-10-08 15:14:41
 * @Last Modified by: Tomato.Bei
 * @Last Modified time: 2022-10-08 15:24:24
 * @Des: systemBlock
 */
import React from 'react';
import {getPreviewImageUrl} from '@services/file';

import styles from './styles.module.scss';

const SystemBlock = (props: any) => {
    const {name, token} = props;
    
    const src = getPreviewImageUrl(token);
    return (
        <div className={styles.view}>
            <img className={styles.bgImg} src={token?src:'/public/image/systemDefault.jpg'}/>
            <div className={styles.bottomTag}>
                <div className={styles.systemName}>{name}</div>
            </div>
        </div>
    );
};

export default SystemBlock;
