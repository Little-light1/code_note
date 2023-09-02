import React from 'react';
import {SearchTree} from '@components/tree';
import {usePage, PageProps} from '@gwaapp/ease';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {onInit} from './actions';

const TableDemo = (props: PageProps) => {
    const dispatch = useAppDispatch();
    usePage({...props, init: (pageProps) => dispatch(onInit(pageProps))});
    const treeData = useAppSelector((state) => state.treeDemo.treeData);
    return (
        <div
            style={{
                height: '100%',
            }}
        >
            <SearchTree treeData={treeData} />
        </div>
    );
};

export default TableDemo;
