/*
 * @Author: sds
 * @Date: 2021-12-01 19:01:20
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-06-22 09:01:22
 */
import React from 'react';
import {shallowEqual} from 'react-redux';
import {Tree, Spin} from 'antd';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useAction, PageProps} from '@gwaapp/ease';
import styles from './styles.module.scss'; // interface OrgTree {
//   [index: string]: any;z
// }

interface OrganizationTreeProps {
    pageProps: PageProps; // treeData: OrgTree[];

    className?: string;
}

const OrganizationTree = ({pageProps, className}: OrganizationTreeProps) => {
    const {id} = pageProps;
    const treeData = useAppSelector(
        (state) => state[id].treeData,
        shallowEqual,
    );
    const isTreeLoading = useAppSelector(
        (state) => state[id].isTreeLoading,
        shallowEqual,
    );
    const selectedKeys = useAppSelector(
        (state) => state[id].selectedKeys,
        shallowEqual,
    );
    const expandedKeys = useAppSelector(
        (state) => state[id].expandedKeys,
        shallowEqual,
    );
    const current = useAppSelector((state) => state[id].current, shallowEqual);
    const dispatch = useAppDispatch();
    const {getPageSimpleActions} = useAction();
    const simpleActions = getPageSimpleActions(id); // action-select

    const onSelect = async (keys: React.Key[], nodes: any) => {
        if (!keys.length) {
            return;
        }

        if (!nodes.node.isRight) {
            return;
        }

        if (current > 1) {
            dispatch(
                simpleActions.set({
                    current: 1,
                }),
            );
        }

        if (!nodes.node.isRight) {
            return;
        }

        dispatch(
            simpleActions.set({
                selectedKeys: keys,
            }),
        );
    }; // action-expand

    const onExpand = (keys: React.Key[]) => {
        dispatch(
            simpleActions.set({
                expandedKeys: keys,
            }),
        );
    };

    return (
        <Spin
            spinning={isTreeLoading}
            wrapperClassName={`${styles.view} ${className}`}
        >
            <Tree
                selectedKeys={selectedKeys}
                expandedKeys={expandedKeys}
                treeData={treeData}
                onExpand={onExpand}
                onSelect={onSelect}
                showLine={{
                    showLeafIcon: false,
                }}
                showIcon={false}
            />
        </Spin>
    );
};

export default OrganizationTree;
