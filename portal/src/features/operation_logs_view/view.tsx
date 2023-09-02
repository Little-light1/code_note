/*
 * @Author: Tomato.Bei
 * @Date: 2022-08-05 15:33:21
 * @Last Modified by: sun.t
 * @Last Modified time: 2022-08-09 15:17:46
 */
import React, {FC} from 'react';
import {usePage, PageProps} from '@gwaapp/ease';
import {useAppDispatch} from '@/app/runtime';
import HeadOperation from './head_operation';
import TableContent from './table_content';
import styles from './styles.module.scss';
import {onInit} from './actions';

const Component: FC<any> = (props: PageProps) => {
    const dispatch = useAppDispatch();
    usePage({...props, init: (pageProps) => dispatch(onInit(pageProps))});
    return (
        <div className={styles.view}>
            <div className={styles.head}>
                <HeadOperation pageProps={props} />
            </div>
            <div className={styles.content}>
                <TableContent pageProps={props} />
            </div>
        </div>
    );
};

export default Component;
