import React, {FC} from 'react';
import {shallowEqual} from 'react-redux';
import {usePage, PageProps, getUniqueKey} from '@gwaapp/ease';
import {useAppSelector, useAppDispatch} from '@/app/runtime';

import {onInit} from './actions';
import styles from './styles.module.scss';

const IframePage: FC<any> = (props: PageProps) => {
    const {id, searchParse, search} = props;
    const dispatch = useAppDispatch();
    const {url} = useAppSelector(
        (state) => state[getUniqueKey(id, search)],
        shallowEqual,
    );
    usePage({
        ...props,
        // 页面初始化逻辑
        init: (pageProps) => dispatch(onInit(pageProps)), // // 页面刷新，由外框架触发
        // refresh: (pageProps) => dispatch(onInit(pageProps)),
    });
    return (
        <div className={styles.contentBox}>
            <iframe
                className={styles.iframePageContent}
                src={url}
                title={searchParse?.tabName || ''}
            />
        </div>
    );
};

export default IframePage;
