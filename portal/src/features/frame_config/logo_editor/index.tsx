import React, {FC, useCallback, useEffect, useRef} from 'react';
import {Col, Form, Button, Input, FormInstance, Switch} from 'antd';
import {UploadOutlined, DeleteOutlined} from '@ant-design/icons';
import {validateFile} from '@utils/file';
import {onlyCnEnNo, onlyCnEnNoMsg} from '@utils/reg';
import {UploadImage} from '@/components/upload';
import {useAction, PageProps} from '@gwaapp/ease';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import PortalIcon from '@/components/icon';
import {Events} from '@common/events';
import {shallowEqual} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {submitLogo} from './actions';
import styles from './styles.module.scss';
import {LogActionID} from '../types';

const LogoEditor: FC<{props: PageProps}> = ({props}) => {
    const {id} = props;
    const formRef = useRef<FormInstance | null>(null);
    const dispatch = useAppDispatch();
    const {handlers} = useAction();
    const {trigger} = handlers;
    const {logo, frame, frameResponse} = useAppSelector(
        (state) => state[props.id],
        shallowEqual,
    );
    const {systemLogoConfigDTO} = frameResponse;
    const {t} = useTranslation();

    const checkValidate = useCallback(
        (file) =>
            validateFile({
                file,
                types: ['image/jpeg', 'image/png'],
                size: [100, 'KB'],
                picture: {height: 32, width: 32},
            }),
        [],
    );

    const checkValidateSystem = useCallback(
        (file) =>
            validateFile({
                file,
                types: ['image/jpeg', 'image/png'],
                size: [2, 'MB'],
                picture: {height: 500, width: 1000},
            }),
        [],
    );

    const onSubmit = useCallback(
        (values) => {
            dispatch(submitLogo(props, values)).then(() =>
                trigger(Events.update_frame_configs),
            );
        },
        [dispatch, props, trigger],
    );

    useEffect(() => {
        formRef &&
            formRef.current?.setFieldsValue({
                lconfigFiletoken: logo.lconfigFiletoken,
                lconfigName: logo.lconfigName,
                systemConfigFiletoken: systemLogoConfigDTO?.lconfigFiletoken,
                systemConfigName: systemLogoConfigDTO?.lconfigName,
                top: frame.top,
                left: frame.left,
            });
    }, [frame.left, frame.top, logo, systemLogoConfigDTO]);

    return (
        <Form
            ref={formRef}
            layout="inline"
            labelCol={{span: 24}}
            onFinish={onSubmit}
            className={styles.view}
        >
            <Col span={6}>
                <div className={styles.title}>{t('LOGO配置')}</div>
                <div className={styles.content}>
                    <div className={styles.desc}>
                        <div className={styles.descTitle}>
                            <span className={styles.required}>*</span>
                            {t('上传浏览器Logo')}
                        </div>
                        <div className={styles.descContent}>
                            {t(
                                '文件格式为.png, .jpg，图片分辨率为32 * 32px，大小不超过 100k',
                            )}
                        </div>
                    </div>
                    <Form.Item
                        name="lconfigFiletoken"
                        rules={[{required: true, message: t('请上传logo')}]}
                    >
                        <UploadImage
                            checkValidate={checkValidate}
                            className={styles.upload}
                            listType="picture"
                            showUploadList={{
                                showRemoveIcon: true,
                                removeIcon: (
                                    <DeleteOutlined
                                        style={{
                                            color: 'white',
                                        }}
                                    />
                                ),
                            }}
                        >
                            <Button icon={<UploadOutlined />}>
                                {t('上传LOGO')}
                            </Button>
                        </UploadImage>
                    </Form.Item>
                </div>
            </Col>

            <Col span={6} offset={1}>
                <div className={styles.browserTitle}>
                    <div className={styles.title}>
                        <span className={styles.required}>*</span>
                        {t('浏览器标题名称')}
                    </div>
                    <Form.Item
                        name="lconfigName"
                        rules={[
                            {
                                required: true,
                                message: t('请输入浏览器标题名称'),
                            },
                            {
                                pattern: onlyCnEnNo,
                                message: onlyCnEnNoMsg,
                            },
                        ]}
                    >
                        <Input placeholder={t('请输入')} maxLength={50} />
                    </Form.Item>
                </div>
            </Col>

            <Col span={6}>
                <div className={styles.title}>{t('框架显示配置')}</div>
                <div className={styles.content}>
                    <Form.Item
                        label={t('顶部默认显示')}
                        name="top"
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren={t('显示')}
                            unCheckedChildren={t('隐藏')}
                            className={styles.switch}
                        />
                    </Form.Item>

                    <Form.Item
                        label={t('左侧导航默认显示')}
                        name="left"
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren={t('显示')}
                            unCheckedChildren={t('隐藏')}
                            className={styles.switch}
                        />
                    </Form.Item>
                </div>
            </Col>
            {/* 系统配置 */}
            <Col span={6}>
                <div className={styles.title}>{t('系统配置')}</div>
                <div className={styles.content}>
                    <div className={styles.desc}>
                        <div className={styles.descTitle}>
                            <span className={styles.required}>*</span>
                            {t('上传系统Logo')}
                        </div>
                        <div className={styles.descContent}>
                            {t(
                                '文件格式为：.png、.jpg，图片分辨率不超过1000*500px，大小不超过2M',
                            )}
                        </div>
                    </div>
                    <Form.Item
                        name="systemConfigFiletoken"
                        rules={[{required: true, message: t('请上传logo')}]}
                    >
                        <UploadImage
                            checkValidate={checkValidateSystem}
                            className={styles.upload}
                            listType="picture"
                            showUploadList={{
                                showRemoveIcon: true,
                                removeIcon: (
                                    <DeleteOutlined
                                        style={{
                                            color: 'white',
                                        }}
                                    />
                                ),
                            }}
                        >
                            <Button icon={<UploadOutlined />}>
                                {t('上传LOGO')}
                            </Button>
                        </UploadImage>
                    </Form.Item>
                </div>
            </Col>

            <Col span={6} offset={1}>
                <div className={styles.browserTitle}>
                    <div className={styles.title}>
                        <span className={styles.required}>*</span>
                        {t('系统名称')}
                    </div>
                    <Form.Item
                        name="systemConfigName"
                        rules={[
                            {required: true, message: t('请输入系统名称')},
                            {
                                pattern: onlyCnEnNo,
                                message: onlyCnEnNoMsg,
                            },
                        ]}
                    >
                        <Input placeholder={t('请输入')} maxLength={15} />
                    </Form.Item>
                </div>
            </Col>

            <Col span={5}>
                <div className={styles.operation}>
                    <Button
                        action={{
                            id: LogActionID.SaveBaseInfo,
                            module: id,
                            position: [
                                props.menu?.menuName ?? '',
                                t('基本信息配置'),
                                t('保存'),
                            ],
                            desc: t('保存基本信息配置'),
                            action: 'modify',
                            wait: true,
                        }}
                        type="primary"
                        icon={
                            <PortalIcon
                                iconClass="icon-portal-save"
                                style={{marginRight: 5}}
                            />
                        }
                        onClick={() => formRef.current?.submit()}
                    >
                        {t('保存')}
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            formRef.current?.setFieldsValue({
                                lconfigFiletoken: logo.lconfigFiletoken,
                                lconfigName: logo.lconfigName,
                                top: frame.top,
                                left: frame.left,
                            });
                        }}
                    >
                        {t('取消')}
                    </Button>
                </div>
            </Col>
        </Form>
    );
};

export default LogoEditor;
