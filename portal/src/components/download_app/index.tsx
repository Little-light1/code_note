/*
 * @Author: zhangzhen
 * @Date: 2022-06-29 16:01:22
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-09-19 10:32:00
 *
 */
import React, { FC } from 'react';
import styles from './styles.module.scss';

const DownloadApp: FC<any> = () => <div className={styles.qrCode}>
        <div>
            <div>android下载</div>
            <span>android下载</span>
        </div>
        <div>
            <div>iOS版下载</div>
            <span>iOS版下载</span>
        </div>
    </div>;

export default DownloadApp;