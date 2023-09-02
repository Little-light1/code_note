/*
 * @Author: zhangzhen
 * @Date: 2022-06-28 09:42:53
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-12-06 17:12:55
 *
 */
import React, {FC} from 'react';
import {Button} from 'antd';
import {InfoCircleOutlined} from '@ant-design/icons';
import {i18nIns} from '../../app/i18n';

type PageProps = {
    onOk: () => void;
    onCancel: () => void;
    sameBro: boolean;
};

const LogoutModal: FC<PageProps> = (props) => {
    const {onOk, onCancel, sameBro} = props;
    const {t} = i18nIns;
    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '120px',
                    fontSize: '14px',
                }}
            >
                <InfoCircleOutlined
                    style={{
                        color: '#ff3300',
                        marginRight: '16px',
                    }}
                />
                {sameBro ? (
                    <span>{t('已有用户在该浏览器上登录，是否继续登录？')}</span>
                ) : (
                    <span>{t('您已在其他浏览器上登录，是否强制退出？')}</span>
                )}
            </div>
            <div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row-reverse',
                    }}
                >
                    <Button
                        style={{
                            marginLeft: '15px',
                        }}
                        type="dashed"
                        onClick={() => {
                            onCancel();
                        }}
                    >
                        {t('否')}
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            onOk();
                        }}
                    >
                        {t('是')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
