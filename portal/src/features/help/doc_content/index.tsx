import React, {useRef, useEffect} from 'react';
import {Spin, Anchor} from 'antd';
import {shallowEqual} from 'react-redux';
import $ from 'jquery';
import {PageProps} from '@gwaapp/ease';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import PortalIcon from '@/components/icon';
import {useTranslation} from 'react-i18next';
import styles from '../styles.module.scss';
import {editDocument, handledowloadAttachment} from '../actions';

interface Props {
    pageProps: PageProps;
}

const DocContent = ({pageProps}: Props) => {
    const {id} = pageProps;
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const {edit, currentDoc, docLoading, editTitle} = useAppSelector(
        (state) => state[id],
        shallowEqual,
    );
    const {Link} = Anchor; // console.log(anchor, 'anchor');
    // 滚动区域

    const docPanel = useRef();
    const anchor = useRef();
    let title: string;

    if (edit) {
        title = editTitle;
    } else {
        title = currentDoc ? currentDoc.title : '';
    }

    const content = currentDoc ? currentDoc.content : '';
    const heads: any[] = [];
    $(content)
        .filter('h1,h2,h3,h4,h5,h6')
        .each((index, value) => {
            if (value.innerHTML) {
                heads.push(value);
            }
        }); // 设置模式开关

    const setEdit = (newEdit: any) => {
        dispatch(editDocument(pageProps, newEdit));
    }; // 下载文档附件
    // const downloadUrl = (docID, filename) => `/aapp-api/aapp-portal/fileipload/attachment/${docID}/${filename}`;
    // 聚焦锚点

    const handleAnchorClick = (e: any, link: any) => {
        const target = $(link.href)[0]; // 因为有padding-top存在，所以要减去padding

        if (docPanel.current)
            docPanel.current.scrollTop = target.offsetTop - 20;
        e.preventDefault();
    }; // 监听滚动

    const onDocPanelScroll = (e) => {
        if (window.highlightHeadTimer) {
            clearTimeout(window.highlightHeadTimer);
        }

        const {scrollTop} = e.target;
        window.highlightHeadTimer = setTimeout(() => {
            $(docPanel.current)
                .find('h1,h2,h3,h4,h5,h6')
                .each((index, value) => {
                    if (value.id && value.offsetTop < scrollTop) {
                        anchor.current.setCurrentActiveLink(`#${value.id}`);
                        return false;
                    }

                    return true;
                });
            window.highlightHeadTimer = undefined;
        }, 200);
    };

    useEffect(() => {
        if (docPanel.current) {
            docPanel.current.addEventListener('scroll', onDocPanelScroll);
            docPanel.current.scrollTop = 0;
        }

        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            docPanel.current &&
                docPanel.current.removeEventListener(
                    'scroll',
                    onDocPanelScroll,
                );
        };
    }, [content, edit]);
    return (
        <Spin spinning={docLoading}>
            <div className={styles.docContent}>
                <div className={styles.docPanel} id="doc-panel" ref={docPanel}>
                    <h1 className={styles.docTitle}>
                        {title}
                        {pageProps.resources.help_edit_button !== undefined ? (
                            <PortalIcon
                                onClick={() => {
                                    setEdit(true);
                                }}
                                style={{
                                    fontSize: 20,
                                }}
                                iconClass="icon-portal-edit"
                            />
                        ) : (
                            ''
                        )}
                    </h1>
                    <div className={styles.docTip}>
                        <PortalIcon iconClass="icon-portal-Log" />
                        <span>
                            {/* 文档创建者： */}
                            {t('文档创建者：')}
                            <b>{currentDoc.createUsername}</b>
                        </span>
                        <span>
                            {/* 编辑次数： */}
                            {t('编辑次数：')}
                            <b>{currentDoc.editCount}</b>
                        </span>
                        <span>
                            {/* 最近更新： */}
                            {t('最近更新：')}
                            <b>{currentDoc.updateUsername}</b> {t('于')}{' '}
                            <b>{currentDoc.updateTimeStr}</b>
                        </span>
                    </div>
                    {/* eslint-disable-next-line react/no-danger */}
                    <div
                        className="article-detail"
                        dangerouslySetInnerHTML={{
                            __html: content,
                        }}
                    />
                    {currentDoc.attachments.length ? (
                        <div className={styles.docAttachments}>
                            {/* 附件： */}
                            <p>{t('附件：')}</p>
                            <div>
                                {currentDoc.attachments.map(
                                    (
                                        f, // eslint-disable-next-line jsx-a11y/anchor-is-valid
                                    ) => (
                                        <a
                                            className={styles.docAttachmentItem}
                                            key={f.attachmentID}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={handledowloadAttachment(
                                                f.name,
                                            )}
                                        >
                                            <PortalIcon iconClass="icon-portal-JobLog" />
                                            <span>{f.originFileName}</span>
                                        </a>
                                    ),
                                )}
                            </div>
                        </div>
                    ) : (
                        ''
                    )}
                </div>
                <div className={styles.docAnchor}>
                    <Anchor
                        onClick={handleAnchorClick}
                        affix={false}
                        ref={anchor}
                    >
                        {heads.map((ele) => (
                            <Link
                                href={`#${ele.id}`}
                                title={ele.innerText}
                                key={ele.id}
                            />
                        ))}
                    </Anchor>
                </div>
            </div>
        </Spin>
    );
};

export default DocContent;
