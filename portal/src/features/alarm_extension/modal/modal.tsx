/*
 * @Author: shimmer
 * @Date: 2022-05-11 16:56:44
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-07-22 13:39:08
 */
import React, {FC} from 'react';
import {Button, Modal} from 'antd';
import {useTranslation} from 'react-i18next';

const AlarmTipModal: FC<any> = ({visible, onCancel}) => {
    const {t} = useTranslation();
    return (
        <Modal
            title={t('提示')}
            visible={visible}
            width={450}
            destroyOnClose
            footer={
                <Button
                    type="primary"
                    onClick={() => {
                        onCancel();
                    }}
                >
                    {t('确定')}
                </Button>
            }
            onCancel={() => {
                onCancel();
            }}
        >
            <p>{t('请填写告警跳转地址')}</p>
        </Modal>
    );
};

export default AlarmTipModal;
