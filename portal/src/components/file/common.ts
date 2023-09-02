import {baseURL, prefix} from '@services/common';
import {getLocal} from '@common/utils/storage';
import {AuthCookieKey} from '@common/init/configs';
/**
 * 文件上传通用配置
 */

/**
 * header
 */

export const headers = {
    [AuthCookieKey]: getLocal(AuthCookieKey),
};
/**
 * 上传文件地址
 */

export const uploadAction = `${baseURL}/${prefix(
    '/file/upload',
    'fileUpload',
)}`;
/**
 * 下载文件地址
 */

export const downloadAction = `${baseURL}/${prefix(
    '/file/download',
    'fileUpload',
)}`;
/**
 * 显示前缀
 */

export const showPrefix = `${baseURL}/${prefix('', 'fileUpload')}`;
