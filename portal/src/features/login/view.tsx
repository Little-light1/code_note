import React, {FC, useCallback, useEffect, useState, useRef} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Input, Button, Form, message, Modal, Dropdown} from 'antd';
import {useMount, useSize} from 'ahooks';
import {shallowEqual} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useModal, PageProps, usePage} from '@gwaapp/ease';
import {useAuth} from '@/components/auth_provider';
import LogoutModal from '@/components/logout_modal';
import {currentLanguage} from '@utils/cuerrent_language';
import {SsoLoginKey} from '@common/init/configs';
import {setLocal} from '@/common/utils/storage';
import Language from './Language';
import Background from './background';
import {asyncLogin, refreshCode} from './slices';
import styles from './styles.module.scss';
import {encryptionPassword} from '../../common/utils/encryption';
import DownloadAppModal from './modal';
import {requestAppData} from './actions';

// import { getQrCodeConfigFun } from './slices'

const Login: FC<PageProps> = (props) => {
    const {id} = props;
    const [visible, setVisible] = useState<boolean>(false);
    const [sameBro, setSameBro] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const {openModal} = useModal();

    const containerRef = useRef(null);
    const {t, i18n} = useTranslation();
    const size = useSize(containerRef);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const [form] = Form.useForm();
    const {onAuth} = useAuth();
    const {code, codeSession} = useAppSelector(
        (state) => state[id],
        shallowEqual,
    );
    const {appData, appVisible} = useAppSelector(
        (state) => state.login,
        shallowEqual,
    );

    const {system, loginPics, loginPicsIsRequested} = useAppSelector(
        (state) => state.app,
        shallowEqual,
    );

    useMount(() => {
        dispatch(refreshCode(props));
        dispatch(requestAppData());
    });

    // 登录表单提交
    const onFinish = useCallback(() => {
        setLoading(true);
        form.validateFields()
            .then((values) => {
                if (visible) {
                    // 强制登录
                    values.forceQuit = 'YES';
                }

                const isLogin = document.cookie.indexOf('authorization') > -1;

                values.password = encryptionPassword(values.password);

                asyncLogin({...values, sessionId: codeSession, type: 'AES'})
                    .then((res: any) => {
                        const {data, code: statusCode} = res; // 登录成功

                        if (data && statusCode === '200') {
                            setLocal(SsoLoginKey, false);
                            if (!visible && !sameBro && isLogin) {
                                setSameBro(true);
                                setVisible(true);
                                setLoading(false);
                                return false;
                            }

                            setLoading(false);
                            onAuth(data!);
                            setVisible(false);
                            navigate(location.state?.from ?? '/');
                        } else if (statusCode !== '200') {
                            if (statusCode === '400108') {
                                setVisible(true);
                                return false;
                            }

                            dispatch(refreshCode(props));
                            form.setFieldsValue({
                                code: '',
                            });
                        }
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [
        codeSession,
        dispatch,
        form,
        location.state?.from,
        navigate,
        onAuth,
        props,
        sameBro,
        visible,
    ]);

    useEffect(() => {
        function handleKeyDown(e: any) {
            if (e.keyCode === 13) {
                onFinish();
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onFinish]);

    // app下载点击事件
    const appDownloadBlock = () => {
        openModal('downloadApp', {
            data: appData,
        });
    };

    return (
        <div className={styles.view} ref={containerRef}>
            {/* 地图轮播背景 */}
            <Background
                background={loginPics}
                loginPicsIsRequested={loginPicsIsRequested}
                size={size}
            />

            {/* Logo & 系统名 */}
            <div className={styles.logo}>
                {/* /public/image/logo.svg */}
                {window.systemPictures && window.systemPictures.logo && (
                    <img
                        src={window.systemPictures.logo}
                        alt=""
                        width="150px"
                        height="50px"
                    />
                )}
                <span className={styles.systemName}>
                    {system.lconfigName || ''}
                </span>
            </div>

            <div className={styles.formBg}>
                <div className={styles.form}>
                    {/* <div className={styles.selectLan}>
                    <Language i18n={i18n} />    
                  </div> */}

                    <div className={styles.loginText}>
                        {t('登录').toUpperCase()}
                    </div>

                    <Form
                        form={form}
                        className={styles.loginForm}
                        name="login"
                        onValuesChange={(changedValues) => {
                            // 语言发生变化需要重新初始化form
                            if (typeof changedValues.language !== 'undefined') {
                                const currentFieldsValue =
                                    form.getFieldsValue();

                                form.resetFields();

                                form.setFieldsValue(currentFieldsValue);
                            }
                        }}
                        initialValues={{
                            username: '',
                            password: '',
                            code: '',
                            language: currentLanguage(),
                            type: 'PLAIN_TEXT',
                        }} // onFinishFailed={({errorFields}) => {
                        //   console.log(errorFields);
                        // }}
                    >
                        <div className={styles.selectLan}>
                            <Form.Item
                                name="language"
                                rules={[
                                    {
                                        required: true,
                                        message: t('请选择语言'),
                                    },
                                ]}
                                className={styles.formItem}
                            >
                                <Language i18n={i18n} />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: t('请输入用户名'),
                                },
                            ]}
                            className={styles.formItem}
                        >
                            <Input
                                type="text"
                                maxLength={50}
                                size="large"
                                placeholder={t('请输入用户名')}
                                prefix={
                                    <span className="portal-iconfont icon-portal-user" />
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: t('请输入密码'),
                                },
                            ]}
                            className={styles.formItem}
                            style={{marginBottom: '20px'}}
                        >
                            <Input
                                size="large"
                                type="password"
                                placeholder={t('请输入密码')}
                                prefix={
                                    <span className="portal-iconfont icon-portal-password" />
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            name="code"
                            rules={[
                                {
                                    required: true,
                                    message: t('请输入验证码'),
                                },
                            ]}
                            className={styles.formItem}
                            style={{flex: 1}}
                        >
                            <Input
                                size="large"
                                // style={{width: '360px'}}
                                placeholder={t('请输入验证码')}
                                prefix={
                                    <span className="portal-iconfont icon-portal-verificationCode" />
                                }
                                addonAfter={
                                    <div className={styles.verificationCode}>
                                        <img
                                            src={code}
                                            alt="code"
                                            style={{
                                                cursor: 'pointer',
                                            }}
                                            onClick={() =>
                                                dispatch(refreshCode(props))
                                            }
                                            role="presentation"
                                        />
                                    </div>
                                }
                            />
                        </Form.Item>

                        {/* <Form.Item
                          name="language"
                          rules={[
                              {
                                  required: true,
                                  message: t('请选择语言'),
                              },
                          ]}
                          className={styles.formItem}
                      >
                          
                      </Form.Item> */}

                        <Form.Item>
                            <Button
                                block
                                loading={loading}
                                onClick={onFinish}
                                className={styles.loginBtn}
                            >
                                {t('登录')}
                            </Button>
                        </Form.Item>

                        <div
                            style={{marginBottom: '10px', textAlign: 'center'}}
                        >
                            <span
                                className={styles.forgetPassword}
                                onClick={() => {
                                    message.info(
                                        t('请联系企业管理员找回密码'),
                                        5,
                                    );
                                }}
                            >
                                {t('忘记密码?')}
                            </span>
                        </div>
                        <div className={styles.downloadBtnWrapper}>
                            <div
                                className={styles.downloadBtn}
                                onClick={appDownloadBlock}
                            >
                                {appVisible ? t('APP下载') : ''}
                            </div>
                        </div>
                    </Form>
                </div>
            </div>

            <Modal
                title={sameBro ? t('继续登录') : t('强制退出')}
                visible={visible}
                width={400}
                destroyOnClose
                maskClosable={false}
                footer={null}
                onCancel={() => {
                    setVisible(false);
                    setSameBro(false);
                }}
            >
                <LogoutModal
                    onCancel={() => {
                        if (sameBro) {
                            // 刷新页面
                            window.location.reload();
                            setSameBro(false);
                            setVisible(false);
                        } else {
                            setVisible(false);
                        }
                    }}
                    onOk={() => {
                        onFinish();
                    }}
                    sameBro={sameBro}
                />
            </Modal>

            <DownloadAppModal pageProps={props} modalId="downloadApp" />
        </div>
    );
};

export default Login;
