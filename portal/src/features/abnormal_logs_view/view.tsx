/*
 * @Author: Tomato.Bei
 * @Date: 2022-08-05 15:34:33
 * @Last Modified by: Tomato.Bei
 * @Last Modified time: 2022-08-12 09:48:38
 */
import React, {FC} from 'react';
import {usePage, PageProps} from '@gwaapp/ease';
import {useAppDispatch} from '@/app/runtime';
import HeadOperation from './head_operation';
import TableContent from './table_content';
import styles from './styles.module.scss';
import {onInit} from './actions';

const Component: FC<PageProps> = (props) => {
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
