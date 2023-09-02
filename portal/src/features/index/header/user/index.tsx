/*
 * @Author: zhangzhen
 * @Date: 2022-06-22 08:49:23
 * @LastEditors: Tomato.Bei
 * @LastEditTime: 2023-01-12 10:34:51
 * @Description:
 *
 */
import React, {useState, useEffect} from 'react';
import {Dropdown, Menu, Modal} from 'antd';
import {CaretDownOutlined} from '@ant-design/icons';
import {useAuth} from '@/components/auth_provider';
import {useAppSelector, useAppDispatch} from '@/app/runtime';
import ChangePassWordModal from '@/components/change_password_modal';
import {useTranslation} from 'react-i18next';
import {SsoLoginKey} from '@common/init/configs';
import styles from './styles.module.scss';
import {changePasswordFun} from '../../actions';
import PersonInfoModal from '../person_Info_modal';

const UserMenu = ({logout, id, socket, openUpdatePasswordModal}: any) => {
    const {t} = useTranslation();
    const [visibleModal, setVisibleModal] = useState(false);
    const isSsoLogin = Boolean(localStorage.getItem(SsoLoginKey) === 'true');

    return (
        <>
            <Menu>
                {isSsoLogin ? null : (
                    <Menu.Item
                        key="changePassword"
                        onClick={() => {
                            openUpdatePasswordModal(true);
                        }}
                        className={styles.userMenu}
                    >
                        {t('密码修改')}
                    </Menu.Item>
                )}

                <Menu.Item
                    className={styles.userMenu}
                    key="personInfo"
                    onClick={() => {
                        setVisibleModal(true);
                    }}
                >
                    {t('个人信息')}
                </Menu.Item>
                {isSsoLogin ? null : (
                    <Menu.Item
                        key="quit"
                        className={styles.userMenu}
                        onClick={() => {
                            logout(id, socket);
                        }}
                    >
                        {t('退出系统')}
                    </Menu.Item>
                )}
            </Menu>
            <PersonInfoModal
                visibleModal={visibleModal}
                openUpdateInfoModal={(val: boolean) => {
                    setVisibleModal(val);
                }}
                onCancel={() => {
                    setVisibleModal(false);
                }}
            />
        </>
    );
};

const User = (props: {socket: any}) => {
    const [visible, setVisible] = useState(false);
    const {t} = useTranslation();
    const {logout} = useAuth();
    const {userInfo, needChangePassword, passwordDays} = useAppSelector(
        (state) => state.app,
    );
    const dispatch = useAppDispatch();
    const {socket} = props;
    const expired = passwordDays; // 有效期小于15天也要修改密码

    useEffect(() => {
        if (needChangePassword || expired <= 15) {
            setVisible(true);
        }
    }, [needChangePassword, expired]);

    if (!userInfo) {
        return null;
    }

    const {userName = '', id = ''} = userInfo; // 登陆后需要判断修改密码弹窗

    const dontChangePassWord = () => {
        Modal.confirm({
            content: needChangePassword
                ? t(
                      '初次登录必须修改密码，终止修改将跳转到登陆页面。是否继续修改？',
                  )
                : t('必须修改密码，终止修改将跳转到登陆页面。是否继续修改？'),
            okText: t('是'),
            cancelText: t('否'),
            onOk: () => {},
            onCancel: () => {
                logout(id, socket);
            },
        });
    };

    return (
        <div className={styles.view}>
            {/* <img src="/static/testUser.jpeg" alt="" width="41px" height="40px" /> */}
            <div className={styles.icon}>{userName.substr(0, 1)}</div>

            <Dropdown
                overlay={
                    <UserMenu
                        logout={logout}
                        id={id}
                        openUpdatePasswordModal={(val: any) => {
                            setVisible(val);
                        }}
                        socket={socket}
                    />
                }
            >
                <span className={styles.username}>
                    {userName}{' '}
                    <CaretDownOutlined
                        style={{
                            fontSize: '13px',
                            opacity: 0.5,
                        }}
                    />
                </span>
            </Dropdown>
            <Modal
                title={t('密码修改')}
                visible={visible}
                width={650}
                destroyOnClose
                maskClosable={false}
                footer={null}
                onCancel={() => {
                    if (needChangePassword || expired <= 0) {
                        dontChangePassWord();
                    } else {
                        setVisible(false);
                    }
                }}
            >
                <ChangePassWordModal
                    onCancel={() => {
                        // 是否修改密码和有效期判断
                        if (needChangePassword || expired <= 0) {
                            dontChangePassWord();
                        } else {
                            setVisible(false);
                        }
                    }}
                    onOk={(values) => {
                        // 初次修改密码
                        dispatch(
                            changePasswordFun(values, () => {
                                logout(id, socket);
                            }),
                        );
                    }}
                />
            </Modal>
        </div>
    );
};

export default User;
