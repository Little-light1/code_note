/*
 * @Author: shimmer
 * @Date: 2022-05-11 16:56:44
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-07-29 10:50:50
 */
import React, {FC, useMemo} from 'react';
import {PageProps, usePage, getUniqueKey} from '@gwaapp/ease';
import {shallowEqual} from 'react-redux';
import {Button, Upload, Input, DatePicker, Switch, Spin} from 'antd';
import {CloudUploadOutlined, DeleteOutlined} from '@ant-design/icons';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import styles from './styles.module.scss';
import {
    uploadQrCodeFun,
    deleteQrCodeFun,
    saveInfoFun,
    handleVersionChange,
    handleSwitchChange,
    requestAppData,
} from './actions';
import {useTranslation} from 'react-i18next';

import moment from 'moment';

const QrCodePage: FC<PageProps> = (props) => {
    const {id} = props;
    const dispatch = useAppDispatch();
    const {
        appData,
        clearBtnLoading,
        uploadBtnLoading,
        saveBtnLoading,
        spining,
    }: {
        appData: any[];
        clearBtnLoading: boolean;
        uploadBtnLoading: boolean;
        saveBtnLoading: boolean;
        spining: boolean;
    } = useAppSelector((state) => state[getUniqueKey(id)], shallowEqual);
    usePage({
        ...props,
        // 页面初始化逻辑
        // init: () => {
        //   dispatch(onInit(props));
        // },
        mount: () => {
            // dispatch(onInit(props));
            dispatch(requestAppData(props));
        },
    });

    const {t} = useTranslation();

    const beforeUpload = (flie: any, qrId: number) => {
        dispatch(uploadQrCodeFun(props, flie, qrId));
        return false;
    };

    const changeVersion = (event: any, index: any) => {
        dispatch(handleVersionChange(props, event, index));
    };

    const switchChange = (e: any, index: number) => {
        dispatch(handleSwitchChange(props, e, index));
    };

    const divBox = useMemo(
        () => (
            <div className={styles.qrCodeBox}>
                {appData.map((item: any, index: number) => (
                    <div className={styles.qrcode_item} key={item.id}>
                        <div className={styles.title}>
                            <div className={styles.title_content}>
                                <span className={styles.dot} />
                                <span>{item.name}</span>
                            </div>
                            <div className={styles.btn_box}>
                                <Upload
                                    showUploadList={false}
                                    maxCount={1}
                                    accept=".png,.jpg"
                                    beforeUpload={(file) => {
                                        beforeUpload(file, item.id);
                                    }}
                                >
                                    <Button
                                        loading={uploadBtnLoading}
                                        size="small"
                                        icon={<CloudUploadOutlined />}
                                        className={styles.btn}
                                    >
                                        {t('上传')}
                                    </Button>
                                </Upload>
                                <Button
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    className={styles.btn}
                                    loading={clearBtnLoading}
                                    onClick={() => {
                                        dispatch(
                                            deleteQrCodeFun(
                                                props,
                                                item.dconfigId,
                                                item.id,
                                            ),
                                        );
                                    }}
                                >
                                    {t('清空')}
                                </Button>
                            </div>
                        </div>
                        <div className={styles.pic} style={{height: '320px'}}>
                            <div className={styles.pic_content}>
                                {item.url ? (
                                    <img
                                        className={styles.qrcode_pic}
                                        src={item.url}
                                        alt=""
                                    />
                                ) : (
                                    <div className={styles.qrcode_pic}>
                                        <img
                                            className={styles.qrbg}
                                            src="/public/image/qrbg.png"
                                            alt=""
                                        />
                                        <span>{t('二维码未上传')}</span>
                                    </div>
                                )}
                            </div>
                            {
                                <div>
                                    <div className={styles.versionWrapper}>
                                        <div className={styles.version}>
                                            {index === 0
                                                ? t('Android版本号')
                                                : t('iPhone版本号')}
                                        </div>
                                        <Input
                                            placeholder={t('请输入')}
                                            maxLength={20}
                                            className={styles.input}
                                            value={item.version}
                                            onChange={(e) =>
                                                changeVersion(e, index)
                                            }
                                        />
                                    </div>
                                    <div className={styles.switchWrapper}>
                                        {index === 0
                                            ? t('启用/停用(安卓)')
                                            : t('启用/停用(苹果)')}{' '}
                                        <Switch
                                            className={styles.switch}
                                            checked={item.isOn}
                                            onClick={(e) =>
                                                switchChange(e, index)
                                            }
                                        />
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                ))}
            </div>
        ),
        [appData],
    );

    return (
        <div className={styles.contentWrapper}>
            <Spin spinning={spining} delay={500}>
                <Button
                    size="small"
                    className={styles.btn}
                    onClick={(e) => dispatch(saveInfoFun(props))}
                    loading={saveBtnLoading}
                >
                    {t('保存')}
                </Button>
                {divBox}
            </Spin>
        </div>
    );
};

export default QrCodePage;
