/*
 * @Author: tomato.t
 * @Date: 2022-08-04 17:34:14
 * @Last Modified by: Tomato.Bei
 * @Last Modified time: 2022-08-12 09:49:21
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
