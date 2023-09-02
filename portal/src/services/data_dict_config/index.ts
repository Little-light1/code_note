import request, {prefix} from '../common';
import dictModelTreeMock from './mock/dictModelTree.mock.json';
import dictModelVOPageByParentIdMock from './mock/dictModelVOPageByParentId.mock.json';
import successMock from './mock/success.mock.json';
import {
    DictModel,
    DictTree,
    DictList,
    FetchDictModelVOPageByParentIdProps,
    DictModelList,
    AddDictItemProps,
    AddDictClassProps,
    UpdateDictItemProps,
    UpdateDictClassProps,
} from './types'; // 获取数据字典模型列表(树) 废弃

export const fetchDictModelTree = () =>
    request<DictModel[]>({
        url: prefix('/dictInfo/getDictModelTree'),
        method: 'post',
        mock: [200, dictModelTreeMock],
    }); // 获取数据字典模型列表(树)

export const fetchDictTypeTree = (typeCode = 'ROOT') =>
    request<any[]>({
        url: prefix('/dictInfo/getDictTypeTree'),
        method: 'post',
        params: {
            typeCode,
        },
        mock: [200, []],
    }); // 获取数据字典模型列表(树)

export const fetchDictModelVOPageByParentId = (
    props: FetchDictModelVOPageByParentIdProps,
) =>
    request<DictModelList>({
        url: prefix('/dictInfo/getDictModelVOPageByParentId'),
        method: 'post',
        params: props,
        mock: [200, dictModelVOPageByParentIdMock],
    }); // 获取数据字典模型列表(树)

// 有权限（使用界面使用，会排除删除的、禁用的）
export const fetchDictModelVOPageByTypeCode = (
    typeCode: string,
    data?: Object,
) =>
    request<DictTree[]>({
        url: prefix('/dictInfo/getDictDataListByTypeCode'),
        method: 'get',
        params: {
            typeCode,
        },
    }); // 获取数据字典模型列表(分页)

// 无权限（只在创建界面使用）
export const getDictDataTreePageByTypeCode = (typeCode: string, data: Object) =>
    request<DictList>({
        url: prefix('/dictInfo/getDictDataTreePageByTypeCode'),
        method: 'post',
        params: {
            typeCode,
        },
        data,
        mock: [200, []],
    }); // 创建字典项

export const addDictItem = (props: AddDictItemProps) =>
    request<string>({
        url: prefix('/dictInfo/addDictData'),
        method: 'post',
        data: props,
        mock: [200, successMock],
    }); // 创建分类

export const addDictClass = (props: AddDictClassProps) =>
    request<string>({
        url: prefix('/dictInfo/addDictType'),
        method: 'post',
        data: props,
        mock: [200, successMock],
    }); // 更新字典项

export const updateDictItem = (props: UpdateDictItemProps) =>
    request<string>({
        url: prefix('/dictInfo/updateDictData'),
        method: 'post',
        data: props,
        mock: [200, successMock],
    }); // 更新字典分类

export const updateDictClass = (props: UpdateDictClassProps) =>
    request<string>({
        url: prefix('/dictInfo/updateDictType'),
        method: 'post',
        data: props,
        mock: [200, successMock],
    }); // 删除字典分类

export const deleteDictClass = (ids: string) =>
    request<string>({
        url: prefix('/dictInfo/batchDelDictType'),
        method: 'post',
        params: {
            ids,
        },
        mock: [200, successMock],
    }); // 删除字典项

export const deleteDictItems = (ids: string) =>
    request<string>({
        url: prefix('/dictInfo/batchDelDictData'),
        method: 'post',
        params: {
            ids,
        },
        mock: [200, successMock],
    });
