import React, {useState, useEffect, MutableRefObject} from 'react';
import {Tree} from 'antd';
import {useTranslation} from 'react-i18next';
import {
    useAppDispatch,
    useAppSelector,
    getPageSimpleActions,
} from '@/app/runtime';
import {useModal, PageProps} from '@gwaapp/ease';
import {shallowEqual} from 'react-redux';
import _ from 'lodash';
import styles from './styles.module.scss';

interface IProps {
    addModalId: string;
    modalType: 'add' | 'edit'; // 模态窗口类型

    pageProps: PageProps;
    selectedNode: null | any;
}

const CustomForm = ({pageProps, selectedNode, modalType}: IProps) => {
    const dispatch = useAppDispatch();
    const {id} = pageProps;
    const {orgTree, selectScope} = useAppSelector(
        (state) => state[id],
        shallowEqual,
    );
    const simpleAction = getPageSimpleActions(id);
    const {t} = useTranslation();

    const handleSelect = (keys: any, e: any) => {
        if (
            selectScope.filter((i: any) => {
                return i.uuid === e.node.uuid;
            }).length !== 0
        ) {
            return;
        }
        const arr = _.clone(selectScope);
        arr.push({...e.selectedNodes[0], children: null});
        dispatch(
            simpleAction.set({
                selectScope: arr,
            }),
        );
    };
    const removeScopeItem = (item) => {
        const arr = _.clone(selectScope);
        const index = arr.findIndex((i) => i.uuid === item.uuid);
        arr.splice(index, 1);
        dispatch(
            simpleAction.set({
                selectScope: arr,
            }),
        );
    };

    return (
        <div className={styles.scope_model}>
            <div className={styles.orgtree}>
                <p>{t('列表')}</p>
                <div>
                    <Tree
                        treeData={orgTree}
                        fieldNames={{
                            title: 'name',
                            key: 'uuid',
                            children: 'children',
                        }}
                        showLine
                        onSelect={(key, e) => {
                            handleSelect(key, e);
                        }}
                    />
                </div>
            </div>
            <div className={styles.select_node}>
                <p>{t('已选择')}</p>
                <div>
                    {selectScope.map((item) => {
                        return (
                            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                            <p
                                title={t('点击取消')}
                                className={
                                    item.resourceType === 'AAPP_ORG'
                                        ? styles.selectItemOrg
                                        : styles.selectedItem
                                }
                                key={item.id}
                                onClick={() => {
                                    removeScopeItem(item);
                                }}
                            >
                                {item.name}
                            </p>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CustomForm;
