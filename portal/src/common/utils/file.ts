import {i18nIns} from '@/app/i18n';

const {t} = i18nIns;

/**
 * 将base64编码字符串转为File对象
 * @param {} dataurl ：base64编码字符串
 * @param {*} filename ： 文件名
 */
export const base642File = (base64Str: string, filename: string) => {
    const arr = base64Str.split(',');
    const matchFirst = arr[0].match(/:(.*?);/);

    if (matchFirst && matchFirst.length > 2) {
        const type = matchFirst[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n); // eslint-disable-next-line no-plusplus

        // eslint-disable-next-line no-plusplus
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, {
            type,
        });
    }

    return new File([], filename);
};
const UNIT_CONVERSION = {
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
};
type Size = 'KB' | 'MB' | 'GB';
interface CheckValidateProps {
    file: File;
    types: string[];
    size?: [number, Size];
    picture?: {
        height: number;
        width: number;
    };
}

/**
 * 验证文件有效性
 * @param param0
 * @returns
 */

export const validateFile = ({
    file,
    types = [],
    size,
    picture,
}: CheckValidateProps) =>
    new Promise<boolean>((resolve, reject) => {
        const reader = new FileReader();

        // 优先检测类型
        if (types && types.length) {
            const isRightType = types.includes(file.type);

            if (!isRightType) {
                reject(new Error(t('上传文件格式错误')));
                return;
            }
        }

        if (size && size.length) {
            const [limitValue, unit = 'KB'] = size;
            let isLimited = false;
            const sizeUnit = unit.toLocaleUpperCase() as Size;

            if (UNIT_CONVERSION[sizeUnit]) {
                isLimited = file.size / UNIT_CONVERSION[sizeUnit] > limitValue;
            }

            if (isLimited) {
                reject(new Error(t('文件大小超出限制')));
                return;
            }
        }

        reader.readAsDataURL(file);

        reader.onload = () => {
            const img = new Image();
            // 图片加载完成再验证
            img.onload = () => {
                if (picture && picture.height && picture.width) {
                    if (
                        img.naturalWidth > picture.width ||
                        img.naturalHeight > picture.height
                    ) {
                        reject(new Error(t('图片尺寸超出限制')));
                    }
                }
                resolve(true);
            };
            img.src = reader.result as string;
            if (img.complete) {
                if (picture && picture.height && picture.width) {
                    if (
                        img.naturalWidth > picture.width ||
                        img.naturalHeight > picture.height
                    ) {
                        reject(new Error(t('图片尺寸超出限制')));
                    }
                }
                resolve(true);
            }
        };
    });

interface ValidateFileProps {
    file: File;
    types: string[];
    minSize?: [number, Size];
    maxSize?: [number, Size];
    picture?: {
        height: number;
        width: number;
    };
}
/**
 * 验证文件有效性
 * @param param0
 * @returns
 */

export const validateFileInRangeSize = ({
    file,
    types = [],
    minSize,
    maxSize,
    picture,
}: ValidateFileProps) =>
    new Promise<boolean>((resolve, reject) => {
        if (types && types.length) {
            const isRightType = types.includes(file.type);

            if (!isRightType) {
                reject(new Error(t('上传文件格式错误')));
                return;
            }
        }

        if (maxSize && maxSize.length) {
            const [limitValue, unit = 'KB'] = maxSize;
            let isLimited = false;
            const sizeUnit = unit.toLocaleUpperCase() as Size;

            if (UNIT_CONVERSION[sizeUnit]) {
                isLimited = file.size / UNIT_CONVERSION[sizeUnit] > limitValue;
            }

            if (isLimited) {
                reject(new Error(t('文件大小超出限制')));
                return;
            }
        }

        if (minSize && minSize.length) {
            const [limitValue, unit = 'KB'] = minSize;
            let isLimited = false;
            const sizeUnit = unit.toLocaleUpperCase() as Size;

            if (UNIT_CONVERSION[sizeUnit]) {
                isLimited = file.size / UNIT_CONVERSION[sizeUnit] < limitValue;
            }

            if (isLimited) {
                reject(new Error(t('文件大小超出限制')));
                return;
            }
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                if (picture && picture.height && picture.width) {
                    if (
                        img.naturalWidth > picture.width ||
                        img.naturalHeight > picture.height
                    ) {
                        reject(new Error(t('图片尺寸超出限制')));
                    }
                }
                resolve(true);
            };
            img.src = reader.result as string;
            if (img.complete) {
                if (picture && picture.height && picture.width) {
                    if (
                        img.naturalWidth > picture.width ||
                        img.naturalHeight > picture.height
                    ) {
                        reject(new Error(t('图片尺寸超出限制')));
                    }
                }
                resolve(true);
            }
        };
    });
