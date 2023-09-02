import React, {
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {message, Upload, UploadProps} from 'antd';
import {PlusOutlined, LoadingOutlined} from '@ant-design/icons';
import {uploadImage, getPreviewImageUrl} from '@services/file';
import {UploadFileStatus} from 'antd/lib/upload/interface';
import {i18nIns} from '@/app/i18n';
import styles from './styles.module.scss';

const {t} = i18nIns;

interface Props extends Omit<UploadProps, 'onChange'> {
    value?: string;
    showHint?: string;
    children?: ((url: string) => ReactNode) | ReactNode;
    onChange?: (token: string) => void;
    checkValidate?: (file: File) => Promise<boolean>;
}

/**
 * 图片上传组件
 * @param param
 * @param param.showHint 提示信息
 * @returns
 */
const UploadImage = ({
    className,
    showHint,
    value,
    onChange,
    checkValidate,
    listType = 'picture-card',
    children,
    showUploadList = false,
    ...args
}: Props) => {
    const [uploading, setUploading] = useState(false);
    const [internalSrc, setInternalSrc] = useState('');

    useEffect(() => {
        if (value) {
            setInternalSrc(getPreviewImageUrl(value));
        }
    }, [value]);

    const fileList = useMemo(() => {
        if (internalSrc) {
            return [
                {
                    uid: '-1',
                    name: '',
                    status: 'done' as UploadFileStatus,
                    url: internalSrc,
                    thumbUrl: internalSrc,
                },
            ];
        }
        return [];
    }, [internalSrc]);

    const refreshUpload = useCallback(async (token: string) => {
        setInternalSrc(getPreviewImageUrl(token));
    }, []);

    const internalCheckValidate = useCallback(
        (file) =>
            new Promise<string | Blob | File>((resolve, reject) => {
                if (checkValidate) {
                    checkValidate(file)
                        .then((isValidate) => {
                            if (isValidate) {
                                resolve(file);
                            } else {
                                reject(new Error(t('上传图片验证不通过')));
                            }
                        })
                        .catch((error) => {
                            message.error(error.message);
                            reject(error);
                        });
                } else {
                    resolve(file);
                }
            }),
        [checkValidate],
    );

    const upload = useCallback(
        async (file) => {
            await internalCheckValidate(file).then(async (blob) => {
                const formData = new FormData();
                formData.append('file', blob);

                setUploading(true);
                const {code, data} = await uploadImage(formData);

                if (code === '200') {
                    message.info(t('上传成功'));

                    if (data) {
                        refreshUpload(data);

                        onChange && onChange(data);
                    }
                }

                setUploading(false);
            });
        },
        [internalCheckValidate, onChange, refreshUpload],
    );

    const beforeUpload = useCallback(
        (file) => {
            upload(file);
            return false;
        },
        [upload],
    );

    let childrenElement: ReactNode = internalSrc ? (
        <img src={internalSrc} alt="upload" style={{width: '100%'}} />
    ) : (
        <div>{uploading ? <LoadingOutlined /> : <PlusOutlined />}</div>
    );

    if (children) {
        if (typeof children === 'function') {
            childrenElement = children(internalSrc);
        } else {
            childrenElement = children;
        }
    }

    return (
        <div className={styles.container}>
            <Upload
                //   name="avatar"
                //   headers={{
                //     Authorization: getLocal(AuthCookieKey)!,
                //   }}
                {...args}
                listType={listType}
                fileList={fileList}
                className={`${styles.view} ${className || ''}`}
                maxCount={1}
                showUploadList={showUploadList}
                beforeUpload={beforeUpload}
                onRemove={() => {
                    setInternalSrc('');
                    onChange && onChange('');
                    return true;
                }}
            >
                {childrenElement}
            </Upload>
            {showHint ? <div>{showHint}</div> : null}
        </div>
    );
};

export default UploadImage;
