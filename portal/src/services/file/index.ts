import {ApiBaseUrl} from '@common/init/configs';
import {startsWith} from 'lodash';
import request, {prefix} from '../common';
import {FetchImageUrlMapResponse, FetchFileMapResponse} from './types';
import fetchImageUrlMapMock from './mock/fetchImageUrlMap.mock.json';
import uploadImageMock from './mock/uploadImage.mock.json';
import fetchFileMapMock from './mock/fetchFileMap.mock.json'; // 获取图片地址

export const fetchImageUrlMap = (tokens: string[]) =>
    request<FetchImageUrlMapResponse>({
        url: prefix('/file/getImageUrlMap', 'fileUpload'),
        method: 'post',
        params: {
            tokens: tokens.join(','),
        },
        mock: [200, fetchImageUrlMapMock],
        showError: false,
    }); // 上传图片地址

export const uploadImageUrl = `${ApiBaseUrl}/${prefix(
    '/file/uploadImg',
    'fileUpload',
)}`; // 上传图片

export const uploadImage = (formData: FormData) =>
    request<string>({
        url: prefix('/file/uploadImg', 'fileUpload'),
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: formData,
        mock: [200, uploadImageMock],
    }); // 获取文件信息

export const fetchFileMap = (tokens: string[]) =>
    request<FetchFileMapResponse>({
        url: prefix('/file/getFileMap', 'fileUpload'),
        method: 'post',
        params: {
            tokens: tokens.join(','),
        },
        mock: [200, fetchFileMapMock],
    }); // 获取图片预览地址

export const getPreviewImageUrl = (token: string = '') =>
`${ApiBaseUrl}/${prefix('/file/preview', 'fileUpload')}?token=${token}`; // 获取图片地址

export const getQrCodeUrl = (token: string = '') => `/${prefix('/file/preview', 'fileUpload')}?token=${token}`; // 获取图片地址


export const getImageUrl = (staticSrc: string = '') => {
    const separator = startsWith(staticSrc, '/') ? '' : '/';
    return `${ApiBaseUrl}${separator}${staticSrc}`;
}; // 获取模板文件下载地址

export const getResourceDownloadUrl = (fileName: string = '') =>
    `${ApiBaseUrl}/${prefix('/file/download', 'fileUpload')}?token=${fileName}`;
