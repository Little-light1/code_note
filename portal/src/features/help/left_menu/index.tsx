import React, {useRef, useEffect, useState} from 'react';
import _ from 'lodash';
import {Button, Input, Tree, Dropdown, Menu, Modal} from 'antd';
import {shallowEqual} from 'react-redux';
import $ from 'jquery';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useAction, PageProps} from '@gwaapp/ease';
import PortalIcon from '@/components/icon';
import {useTranslation} from 'react-i18next';
import styles from '../styles.module.scss';
import {selectDocument} from '../actions';
import {searchContent} from './actions';

interface Props {
    pageProps: PageProps;
}

const LeftMenu = ({pageProps}: Props) => {
    const {id} = pageProps;
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const {getPageSimpleActions} = useAction();
    const actions = getPageSimpleActions(id);
    const {Search} = Input;
    const {docMenu, edit, currentDoc, searchResult, openKeys} = useAppSelector(
        (state) => state[id],
        shallowEqual,
    );
    const selectKeys = currentDoc ? [`${currentDoc.docID}`] : [];
    const {TreeNode} = Tree; // 搜索文档

    const handleSearch = (e) => {
        dispatch(searchContent(pageProps, e));
    }; // 添加文档

    const showAddModal = () => {
        dispatch(
            actions.set({
                addModalShow: true,
                addFormFields: {
                    parentDocID: '',
                    title: '',
                },
            }),
        );
    }; // 左侧菜单点击

    const handleSelect = (item) => {
        if (edit) {
            Modal.confirm({
                title: t('提示'),
                content: t('是否退出编辑？'),
                okText: t('确认'),
                cancelText: t('取消'),

                onOk() {
                    dispatch(selectDocument(pageProps, item.docID));
                },
            });
        } else {
            dispatch(selectDocument(pageProps, item.docID));
        }
    };

    const searchResultList = (
        <Menu>
            {searchResult.length ? (
                _.map(searchResult, (item, index) => (
                    <Menu.Item key={index}>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a
                            onClick={() => {
                                handleSelect(item);
                            }}
                        >
                            <div className={styles.docSearchItem}>
                                {/* eslint-disable-next-line react/no-danger */}
                                <h3
                                    dangerouslySetInnerHTML={{
                                        __html: item.title,
                                    }}
                                />
                                {/* eslint-disable-next-line react/no-danger */}
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: item.content,
                                    }}
                                />
                            </div>
                        </a>
                    </Menu.Item>
                ))
            ) : (
                <Menu.Item>{t('无数据')}</Menu.Item>
            )}
        </Menu>
    );

    const handleMenuExpand = (selectedKeys) => {
        dispatch(
            actions.set({
                openKeys: selectedKeys,
            }),
        );
    };

    const getTree = (list) =>
        _.map(list, (item) => {
            if (item.children) {
                return (
                    <TreeNode
                        key={item.docID}
                        title={
                            <div
                                id={`doc_tree_node_${item.docID}`}
                                onClick={() => handleSelect(item)}
                                title={item.title}
                            >
                                {item.title}
                            </div>
                        }
                    >
                        {getTree(item.children)}
                    </TreeNode>
                );
            }

            return (
                <TreeNode
                    key={item.docID}
                    title={
                        <div
                            id={`doc_tree_node_${item.docID}`}
                            onClick={() => handleSelect(item)}
                            title={item.title}
                        >
                            {item.title}
                        </div>
                    }
                />
            );
        });

    const leftPanel = useRef();
    const [menuFocused, setMenuFocused] = useState(false);
    useEffect(() => {
        if (currentDoc && !menuFocused) {
            const ele = $(`#doc_tree_node_${currentDoc.docID}`)[0];

            if (ele) {
                const top = ele.offsetTop;
                leftPanel.current.scrollTop = top - 40;
                setMenuFocused(true);
            }
        }
    }, [currentDoc, menuFocused]);
    return (
        <>
            <div className={styles.slideMenuToolbar}>
                <Search
                    placeholder={t('请输入')}
                    allowClear
                    onSearch={handleSearch}
                    style={{
                        width: 220,
                    }}
                />
                {pageProps.resources.help_edit_button !== undefined ? (
                    <Button
                        id="help_view_add"
                        className={styles.addDoc}
                        onClick={showAddModal}
                        icon={<PortalIcon iconClass="icon-portal-add" />}
                        style={{
                            flexShrink: 0,
                        }}
                    />
                ) : (
                    ''
                )}
            </div>
            <Dropdown
                overlay={searchResultList}
                trigger={['click']}
                overlayClassName="helpSearchDropdown"
            >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a id="helpSearchDropdownLink">searchDropDown</a>
            </Dropdown>
            <div className={styles.slideMenuContent} ref={leftPanel}>
                <Tree
                    showLine={{
                        showLeafIcon: false,
                    }}
                    expandedKeys={openKeys}
                    onExpand={handleMenuExpand}
                    selectedKeys={selectKeys}
                >
                    {getTree(docMenu)}
                </Tree>
            </div>
        </>
    );
};

export default LeftMenu;
