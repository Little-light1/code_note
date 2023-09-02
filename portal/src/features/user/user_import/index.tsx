/*
 * @Author: sds
 * @Date: 2021-12-01 15:39:20
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-08-22 15:02:12
 */
import React, {useState} from 'react';
import {shallowEqual} from 'react-redux';
import {UploadOutlined} from '@ant-design/icons';
import {Modal, useModal, useAction, PageProps} from '@gwaapp/ease';
import {getLocal} from '@utils/storage';
import {ApiBaseUrl, AuthCookieKey} from '@common/init/configs';
import {Button, message, notification, Spin, Upload} from 'antd';
import {UploadProps} from 'antd/es/upload';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {report} from '@utils/clientAction';
import {useTranslation} from 'react-i18next';
import styles from './styles.module.scss';
import {USER_IMPORT_MODAL_ID} from '../constant';

// 页面props
interface Props {
    pageProps: PageProps;
}

/**
 * 用户批量导入
 * @param {object} param
 */
const UserImport = ({pageProps}: Props) => {
    const {t} = useTranslation();
    const {id} = pageProps;
    const dispatch = useAppDispatch();
    const {getPageSimpleActions} = useAction();
    const update = useAppSelector((state) => state[id].update, shallowEqual);
    const simpleActions = getPageSimpleActions(id);
    const {closeModal} = useModal();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

    /**
     * modal取消、关闭
     */
    const handleCancel = () => {
        setFileList([]);
        closeModal(USER_IMPORT_MODAL_ID);
    };
    /**
     * upload props
     */
    const uploadProps: UploadProps<any> = {
        name: 'file',
        accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        action: `${ApiBaseUrl}/aapp-portal/user/import/upload`,
        headers: {
            Authorization: getLocal(AuthCookieKey) || '',
            'Accept-Language': getLocal('i18nextLng') || '',
        },
        maxCount: 1,
        showUploadList: {
            showRemoveIcon: false,
        },

        onChange(info: any) {
            const fileInfo = info.file;
            const fileListNew = info.fileList;

            // 不要删除下一行
            setFileList(fileListNew);
            // 不要删除上一行

            const action = {
                id: 'import',
                module: id,
                desc: t('导入用户列表'),
            };

            if (fileInfo.status === 'uploading') {
                setLoading(true);
            } else if (
                fileInfo.status === 'done' &&
                fileInfo.response.code === '200'
            ) {
                message.success(t('导入成功'));
                setFileList(fileListNew);
                dispatch(
                    simpleActions.set({
                        update: !update,
                    }),
                );
                handleCancel();

                setLoading(false);
                report.success(action);
            } else if (
                fileInfo.status === 'done' &&
                fileInfo.response.code !== '200'
            ) {
                const msg = fileInfo.response.msg || '';
                const msgAr = msg.split('\n');
                const msgHtml = (
                    <div>
                        {msgAr.map((ele: string) => (
                            <div key={ele}>{ele}</div>
                        ))}
                    </div>
                );
                notification.error({
                    icon: null,
                    message: t('请求报错'),
                    description: msgHtml,
                });
                setFileList([]);
                setLoading(false);
                report.fail(action);
            } else if (info.file.status === 'error') {
                message.error(`${t('上传失败')}：${fileInfo.response.msg}.`);
                setFileList([]);
                setLoading(false);
                report.fail(action);
            }
        },
    };

    return (
        <Modal
            id={USER_IMPORT_MODAL_ID}
            title={t('用户导入')}
            destroyOnClose
            width={600}
            onCancel={handleCancel}
            footer={[
                <Button
                    id="model__button_close"
                    key="close"
                    onClick={handleCancel}
                >
                    {t('关闭')}
                </Button>,
            ]}
        >
            <Spin spinning={loading}>
                <div className={styles.upLoad}>
                    <span>{t('请上传用户EXCEL')}：</span>
                    <span className={styles.uploadCompont}>
                        <Upload {...uploadProps} fileList={fileList}>
                            <Button type="primary">
                                <UploadOutlined />
                                {t('上传文件')}
                            </Button>
                        </Upload>
                    </span>
                </div>
            </Spin>
        </Modal>
    );
};

export default UserImport;
