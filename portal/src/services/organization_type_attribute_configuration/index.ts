import request, {prefix} from '../common'; // 新增组织框架模板-组织模板管理--AAPP业务接口

export const addOrgTemplate = (data: any) =>
    request({
        url: prefix('/aappauthor/orgtemp/addAAPPOrgTemplate'),
        method: 'post',
        data,
    }); // 复制新建组织框架模板

export const copyOrgTemplate = (data: any) =>
    request({
        url: prefix('/author/orgtemp/copyOrgTemplate'),
        method: 'post',
        data,
    }); // 新增组织框架模板字段

export const addOrgTemplateField = (data: any) =>
    request({
        url: prefix('/author/orgtemp/addOrgTemplateField'),
        method: 'post',
        data,
    }); // 更新组织框架模板字段

export const updateOrgTemplateField = (data: any) =>
    request({
        url: prefix(`/author/orgtemp/updateOrgTemplateField`),
        method: 'post',
        data,
    }); // 删除组织框架模板字段

export const deleteField = (data: any) =>
    request({
        url: prefix(`/author/orgtemp/deleteField?fieldId=${data.fieldId}`),
        // 模板字段ID
        method: 'post',
        data,
    }); // 删除组织框架模板

export const deleteOrgTemplate = (data: any) =>
    request({
        url: prefix(
            `/author/orgtemp/deleteOrgTemplate?templateId=${data.templateId}`,
        ),
        // 组织模板ID
        method: 'post',
        data,
    }); // 批量删除组织框架模板字段

export const deleteTemplateFields = (data: any) =>
    request({
        url: prefix(`/author/orgtemp/deleteTemplateFields`),
        method: 'post',
        data,
    }); // 根据id获取组织框架模板 左上列表数据获取

export const getOrgTemplateById = (params: any) =>
    request({
        url: prefix(
            `/author/orgtemp/getOrgTemplateById?orgTemplateId=${params.orgTemplateId.toString()}`,
        ),
        method: 'get',
    }); // 根据选择的组织模板Id获取组织模板字段信息

export const getOrgTemplateFieldByTemplateId = (params: any) =>
    request({
        url: prefix(`/author/orgtemp/getOrgTemplateFieldByTemplateId`),
        method: 'get',
        params,
    }); // 根据请求对象获取组织框架模板列表-获取所有模板数据

export const getOrgTemplateList = (data: any) =>
    request({
        // url: prefix(`/author/orgtemp/getOrgTemplateList`),
        url: prefix(`/aappauthor/orgtemp/getAAPPOrgTemplateList`),
        method: 'post',
        data,
    }); // // 根据租户id获取组织框架模板列表
// export const getOrgTemplateListByTenantId = (params: any) =>
//   request({
//     url: prefix(`/author/orgtemp/getOrgTemplateListByTenantId?TenantId=${params.TenantId}`),
//     method: 'get',
//     params,
//   });
// 获取组织框架模板字段列表

export const getTemplateFieldList = (params: any) =>
    request({
        url: prefix(
            `/author/orgtemp/getTemplateFieldList?orgTemplateId=${params.orgTemplateId}`,
        ),
        method: 'get',
        params,
    }); // 根据请求对象获取组织框架模板列表     返回两个列表数据

export const getTemplateFieldPage = (data: any) =>
    request({
        url: prefix(`/author/orgtemp/getTemplateFieldPage`),
        method: 'post',
        data,
    }); // 保存组织框架模板排序

export const saveOrgTemplateSort = (data: any) =>
    request({
        url: prefix(`/author/orgtemp/saveOrgTemplateSort`),
        method: 'post',
        data,
    }); // 更新组织框架模板

export const updateOrgTemplate = (data: any) =>
    request({
        url: prefix(`/author/orgtemp/updateOrgTemplate`),
        method: 'post',
        data,
    }); // 字典接口-根据字段分类code获取其子孙字典树-添加框架弹框类型下拉菜单获取

export const getDictDataTreeVOByTypeCode = (data: any) =>
    request({
        url: prefix(`/dictInfo/getDictDataTreeVOByTypeCode?typeCode=org`),
        method: 'post',
        data,
    });

// 字典接口-根据字段分类code获取其子孙字典树-添加框架弹框类型下拉菜单获取

export const getDictDataListByTypeCode = (params: any) =>
    request({
        url: prefix(`/dictInfo/getDictDataListByTypeCode`),
        method: 'get',
        params,
    });
// 字典接口-控件类型获取  根据dicType获取字典下拉列表

export const getDicDataListByDicType = (data: any) =>
    request({
        url: prefix(`/author/dict/getDicDataListByDicType`),
        method: 'post',
        data,
    });
