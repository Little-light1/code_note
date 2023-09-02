import React, {useEffect, useState} from 'react';
import {Divider, Dropdown, Menu, Popover} from 'antd';
import {useAppSelector, useAppDispatch} from '@/app/runtime'; // import {useSkin} from '@/components/skin_provider';

import {useAction, useModal} from '@gwaapp/ease';
import PortalIcon from '@components/icon';
import {CatchTokenImage} from '@/components/catch_image';
import {Link} from 'react-router-dom';
import {checkAbsUrl} from '@/common/utils/reg';
import {i18nIns} from '@/app/i18n';
import {shallowEqual} from 'react-redux';
import {getAlarmProductNumsFun} from '../../actions'; // const SkinMenu = ({skins, setSkin}: {skins: Skin[]; setSkin?: SetSkin}) => (
import styles from './styles.module.scss';
import AboutSystemModal from '../about_system';
import AppDownloadModal from '../app_download';

// import {appVisible} from '../../../login/actions'

//     <Menu>
//         {skins.map((skin) => {
//             const {title, key} = skin;
//             return (
//                 <Menu.Item key={key} className={styles.userMenu} onClick={() => setSkin && setSkin(skin)}>
//                     {title}
//                 </Menu.Item>
//             );
//         })}
//     </Menu>
// );

const FunctionIcons = (props: {alarmCount: any; messageCount: any}) => {
    const commonConfigs = useAppSelector((state) => state.app.commonConfigs);
    const {alarmProductNums, systemVersionInfo} = useAppSelector(
        (state) => state.index,
    );
    const dispatch = useAppDispatch();
    const {handlers} = useAction();
    const {openPage} = handlers; // const {skins, setSkin} = useSkin();
    const {t} = i18nIns;
    const {alarmCount, messageCount} = props;

    const {appData, appVisible} = useAppSelector(
        (state) => state['index'],
        shallowEqual,
    );

    const alarmElement = (
        <div className={styles.alarmMessage}>
            <div className={styles.alarmMessageTitle}>
                <span>{t('业务应用')}</span>
                <span>{t('告警数量')}</span>
            </div>
            <div className={styles.hr} />
            <div className={styles.alarmMessageContent}>
                {alarmProductNums.map((item: any) => (
                    <div key={item.noticeConfigProName}>
                        <span>{item.noticeConfigProName}</span>
                        <span
                            onClick={() => {
                                openPage({
                                    path: item.noticeConfigUrl || '/',
                                });
                            }}
                        >
                            {item.noticeNums}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
    const [visibleModal, setVisibleModal] = useState(false);
    const items = [
        {
            key: '1',
            label: (
                <span
                    onClick={() =>
                        openPage({
                            path: '/help',
                        })
                    }
                >
                    {t('帮助中心')}
                </span>
            ),
        },
        {
            key: '3',
            label: (
                <span onClick={() => setVisibleModal(true)}>
                    {t('关于系统')}
                </span>
            ),
        },
    ];

    if (appVisible) {
        items.splice(1, 0, {
            key: '2',
            label: (
                <span onClick={() => appDownloadBlock()}>{t('APP下载')}</span>
            ),
        });
    }

    const {openModal} = useModal();

    // app下载点击事件
    const appDownloadBlock = () => {
        openModal('downloadApp', {
            data: appData,
        });
    };

    useEffect(() => {
        dispatch(getAlarmProductNumsFun());
    }, [alarmCount, dispatch]);
    return (
        <>
            <div className={styles.view}>
                {commonConfigs.map((config: any) => {
                    const {
                        children,
                        cconfigFiletoken,
                        cconfigName,
                        cconfigId,
                        cconfigIsenable,
                        cconfigUrlpath,
                    } = config;
                    const haveChildren = children && children.length;
                    // 子项全部被禁用
                    const isAllChildrenDisable =
                        haveChildren &&
                        children.filter((c: any) => c.cconfigIsenable === 0)
                            .length === children.length;
                    // 禁用过滤
                    if (cconfigIsenable === 0) {
                        return null;
                    }
                    if (haveChildren && !isAllChildrenDisable) {
                        return (
                            <div key={cconfigId} className={styles.icon}>
                                <Dropdown
                                    overlay={
                                        <Menu>
                                            {children.map((sub: any) => {
                                                // 禁用过滤
                                                if (sub.cconfigIsenable === 0) {
                                                    return null;
                                                }
                                                return (
                                                    <Menu.Item
                                                        key={sub.cconfigId}
                                                    >
                                                        <CatchTokenImage
                                                            height={22}
                                                            width={22}
                                                            style={{
                                                                marginRight: 10,
                                                            }}
                                                            token={
                                                                sub.cconfigFiletoken
                                                            }
                                                            alt={
                                                                sub.cconfigName
                                                            }
                                                        />
                                                        {checkAbsUrl(
                                                            sub.cconfigUrlpath,
                                                        ) ? (
                                                            <a
                                                                target="_Blank"
                                                                href={
                                                                    sub.cconfigUrlpath
                                                                }
                                                                rel="noreferrer"
                                                            >
                                                                {
                                                                    sub.cconfigName
                                                                }
                                                            </a>
                                                        ) : (
                                                            <Link
                                                                to={
                                                                    sub.cconfigUrlpath
                                                                }
                                                                title={
                                                                    sub.cconfigName
                                                                }
                                                            >
                                                                {
                                                                    sub.cconfigName
                                                                }
                                                            </Link>
                                                        )}
                                                    </Menu.Item>
                                                );
                                            })}
                                        </Menu>
                                    }
                                    placement="bottomLeft"
                                >
                                    <div className={styles.defaultFunctions}>
                                        <CatchTokenImage
                                            height={23}
                                            width={23}
                                            token={cconfigFiletoken}
                                            alt={cconfigName}
                                        />
                                    </div>
                                </Dropdown>
                                <Divider
                                    type="vertical"
                                    className={styles.line}
                                />
                            </div>
                        );
                    }
                    let commonIcon = (
                        <CatchTokenImage
                            height={23}
                            width={23}
                            token={cconfigFiletoken}
                            alt={cconfigName}
                        />
                    );
                    if (cconfigUrlpath) {
                        if (checkAbsUrl(cconfigUrlpath)) {
                            commonIcon = (
                                <a
                                    target="_Blank"
                                    href={cconfigUrlpath}
                                    rel="noreferrer"
                                    style={{lineHeight: 0}}
                                >
                                    <CatchTokenImage
                                        height={22}
                                        width={22}
                                        token={cconfigFiletoken}
                                        alt={cconfigName}
                                    />
                                </a>
                            );
                        } else {
                            commonIcon = (
                                <Link to={cconfigUrlpath} title={cconfigName}>
                                    <CatchTokenImage
                                        height={22}
                                        width={22}
                                        token={cconfigFiletoken}
                                        alt={cconfigName}
                                    />
                                </Link>
                            );
                        }
                    }
                    return (
                        <div key={cconfigId} className={styles.icon}>
                            <div className={styles.defaultFunctions}>
                                {commonIcon}
                            </div>
                            <Divider type="vertical" className={styles.line} />
                        </div>
                    );
                })}

                {/* 默认功能 */}
                {/* <Dropdown overlay={<SkinMenu skins={skins} setSkin={setSkin} />}>
      <div className={styles.defaultFunctions}>
      <SkinOutlined />
      </div>
      </Dropdown> */}

                {/* <Divider type="vertical" className={styles.line} /> */}

                {/* 消息中心 */}
                <div
                    className={`${styles.defaultFunctions} ${styles.messageArea}`}
                    onClick={() =>
                        openPage({
                            path: '/noticeCenter',
                        })
                    }
                >
                    <PortalIcon
                        className={styles.icon}
                        iconClass="icon-portal-message"
                        title={String(messageCount)}
                    />
                    {messageCount > 0 && (
                        <div
                            className={styles.messageNum}
                            style={
                                messageCount > 99
                                    ? {
                                          lineHeight: '10px',
                                      }
                                    : {}
                            }
                        >
                            {messageCount > 99 ? '...' : messageCount}
                        </div>
                    )}
                </div>

                <Divider type="vertical" className={styles.line} />

                {/* 帮助中心 */}
                <Dropdown menu={{items}} placement="bottom">
                    <div
                        className={`${styles.defaultFunctions} ${styles.messageArea}`}
                    >
                        <PortalIcon
                            className={styles.icon}
                            iconClass="icon-portal-help"
                        />
                    </div>
                </Dropdown>

                <Divider type="vertical" className={styles.line} />
                {/* 告警数量 */}
                <div
                    className={`${styles.defaultFunctions} ${styles.alarmIcon}`}
                >
                    <Popover
                        content={alarmElement}
                        zIndex={3}
                        placement="bottom"
                    >
                        <PortalIcon
                            className={styles.icon}
                            iconClass="icon-portal-warn"
                            title={String(alarmCount)}
                        />
                        {alarmCount > 0 && (
                            <div
                                className={styles.messageNum}
                                style={
                                    alarmCount > 99
                                        ? {
                                              lineHeight: '10px',
                                          }
                                        : {}
                                }
                            >
                                {alarmCount > 99 ? '...' : alarmCount}
                            </div>
                        )}
                    </Popover>
                </div>

                <Divider type="vertical" className={styles.line} />
            </div>
            <AboutSystemModal
                visibleModal={visibleModal}
                onCancel={(val: any) => {
                    setVisibleModal(val);
                }}
                data={systemVersionInfo}
            />

            <AppDownloadModal pageProps={props} modalId="downloadApp" />
        </>
    );
};

export default FunctionIcons;
