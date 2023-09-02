import request, {prefix} from '../common';
import {
    AddLogoConfigProps,
    AddLogoConfigResponse,
    UpdateIndexPicProps,
    FetchCommonConfigResponse,
    UpdateCommonConfigProps,
} from './types';
import addLogoConfigMock from './mock/addLogoConfig.mock.json';
import fetchIndexPicListMock from './mock/fetchIndexPicList.mock.json';
import fetchCommonConfigMock from './mock/fetchCommonConfig.mock.json';
// import fetchGetEnv from './mock/fetchGetEnv.mock.json';
// 新增Logo

export const addLogoConfig = (props: AddLogoConfigProps) =>
    request<AddLogoConfigResponse>({
        url: prefix('/comConfig/addLogoConfig'),
        method: 'post',
        data: {...props, lconfigId: 1},
        mock: [200, addLogoConfigMock],
    }); // 更新Logo

export const updateLogoConfig = (props: AddLogoConfigProps) =>
    request<AddLogoConfigResponse>({
        url: prefix('/comConfig/updateLogoConfig'),
        method: 'post',
        data: props,
        mock: [200, addLogoConfigMock],
    }); // 获取所有轮播图

export const fetchIndexPicList = () =>
    request({
        url: prefix('/comConfig/getIndecPicList'),
        method: 'post',
        mock: [200, fetchIndexPicListMock],
    }); // 更新轮播图

export const updateIndexPic = (props: UpdateIndexPicProps) =>
    request<AddLogoConfigResponse>({
        url: prefix('/comConfig/updateIndecPic'),
        method: 'post',
        data: props,
        mock: [200, addLogoConfigMock],
    }); // 新建轮播图

export const addIndexPic = (props: UpdateIndexPicProps) =>
    request<AddLogoConfigResponse>({
        url: prefix('/comConfig/addIndecPic'),
        method: 'post',
        data: props,
        mock: [200, addLogoConfigMock],
    }); // 删除轮播图

export const deleteIndexPic = (indexPicId: string) =>
    request<AddLogoConfigResponse>({
        url: prefix('/comConfig/delIndecPicById'),
        method: 'post',
        params: {
            indexPicId,
        },
        mock: [200, addLogoConfigMock],
    }); // 获取通用配置

export const fetchCommonConfig = () =>
    request<FetchCommonConfigResponse[]>({
        url: prefix('/comConfig/getComConfigTreeList'),
        method: 'post',
        mock: [200, fetchCommonConfigMock],
    });
// 更新通用配置(废弃，用saveFrameConfig合并接口)

export const updateCommonConfig = (props: UpdateCommonConfigProps) =>
    request<AddLogoConfigResponse>({
        url: prefix('/comConfig/updateCommonConfig'),
        method: 'post',
        data: props,
        mock: [200, addLogoConfigMock],
    }); // 删除通用配置

export const deleteCommonConfig = (cConfigId: string) =>
    request<AddLogoConfigResponse>({
        url: prefix('/comConfig/delCommonConfigById'),
        method: 'post',
        params: {
            cConfigId,
        },
        mock: [200, addLogoConfigMock],
    }); // 新增通用配置

export const addCommonConfig = (props: UpdateCommonConfigProps) =>
    request<AddLogoConfigResponse>({
        url: prefix('/comConfig/addCommonConfig'),
        method: 'post',
        data: props,
        mock: [200, addLogoConfigMock],
    }); // 获取框架配置信息

export const fetchFrameConfig = () =>
    request<any>({
        url: prefix('/aapp/comconfig/getFrameworksConfigVO'),
        method: 'post',
        params: {
            dconfigCode: 'Main_Win_Config',
        },
        mock: [
            200,
            {
                code: '200',
                data: {},
            },
        ],
    }); // 保存合并框架配置信息

export const saveFrameConfig = (data: any) =>
    request<any>({
        url: prefix('/aapp/comconfig/saveFrameworksConfigVO'),
        method: 'post',
        data,
        mock: [
            200,
            {
                code: '200',
                data: {},
            },
        ],
    });
