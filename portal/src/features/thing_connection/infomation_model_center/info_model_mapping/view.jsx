/*
 * @Author: gxn
 * @Date: 2022-03-26 11:37:37
 * @LastEditors: gxn
 * @LastEditTime: 2022-03-26 15:23:04
 * @Description: view
 */
import React from 'react'; // import {Route} from 'react-router-dom';

import styles from './styles.module.scss';

function Component({
  jumpPageToken
}) {
  return <div className={styles.contentBox}>
        <iframe className={styles.iframePageContent} src={jumpPageToken} title="信息模型字典" />
    </div>;
}

export default Component;