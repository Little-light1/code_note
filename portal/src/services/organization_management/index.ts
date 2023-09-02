import request, {prefix} from '../common';
import uploadFileMock from './mock/uploadFile.mock.json';
import successMock from './mock/success.mock.json';
import {
    // 获取组织机构信息
    OrgInfo,
    OrgSonInfo,
    GetDevicePageByOrgIdProps,
    GetDeviceListByOrgIdProps,
    GetThingDeviceListProps,
    DeviceMapingProps,
} from './types'; // 根据登录用户所在企业ID获取组织及子组织架构信息

export const getTreeByEnterpriseId = (params: {}) =>
    request<any[]>({
        url: prefix('/aappauthor/org/getUserRightFullOrgTreeVO'),
        method: 'post',
        params,
        mock: [200, []],
    });
export const getThingTreeByEnterpriseId = (params: {}) =>
    request<any[]>({
        url: prefix('/aapp/org/manager/getTreeFarm'),
        method: 'get',
        params,
        mock: [200, []],
    }); // 根据登录用户所在企业ID获取详情

export const getOrganizationInfoById = (params: {}) =>
    request<OrgInfo>({
        url: prefix('/aapp/organization/getOrganizationInfoById'),
        method: 'get',
        params,
        mock: [200, []],
    }); // 根据组织Id查询某组织的所有下级组织

export const getSonOrgByOrgID = (params: {}) =>
    request<OrgSonInfo[]>({
        url: prefix('/aapp/organization/getUserRightSonOrgByOrgId'),
        method: 'get',
        params,
        mock: [200, []],
    }); // 删除组织框架以及子组织
// export const deleteOrgByID = (orgId: string) =>
//   request<string>({
//     url: prefix('/aapp/organization/deleteByID'),
//     method: 'post',
//     params: {orgId},
//     mock: [200, successMock],
//   });

export const deleteOrgByID = (orgId: string) =>
    request<string>({
        url: prefix('/aapporg/organization/delById'),
        method: 'delete',
        params: {
            orgId,
        },
        mock: [200, successMock],
    });
export const checkRecursiveDelOrg = (checkOrgId: string) =>
    request<string>({
        url: prefix('/aappauthor/org/checkRecursiveDelOrg'),
        method: 'post',
        params: {
            checkOrgId,
        },
    });
export const recursiveDelOrg = (orgId: string) =>
    request<string>({
        url: prefix('/aappauthor/org/recursiveDelOrg'),
        method: 'post',
        params: {
            orgId,
        },
    });
export const getSameLevelFlag = (dconfigCode: string) =>
    request<string>({
        url: prefix('/comConfig/getDictDataConfig'),
        method: 'post',
        params: {
            dconfigCode,
            tenantId: 1000,
        },
    });
// 根据企业Id获取组织模板Id
// export const getOrganizationTemplateByOrgId = (pOrgId: any) =>
//   //
//   request<any[]>({
//     url: prefix('/aapp/organization/getOrganizationTemplateByOrgId'),
//     method: 'get',
//     params: {pOrgId},
//   });

export const getOrganizationTemplateByOrgId = (params: {}) =>
    request<any[]>({
        url: prefix('/aapporg/organization/getOrganizationTemplateByOrgId'),
        method: 'get',
        params,
    });
// 根据企业获取组织关联的设备

export const getDevicePageByOrgId = (props: GetDevicePageByOrgIdProps) =>
    request<any[]>({
        url: prefix('/aapp/organization/getDevicePageByOrgId'),
        method: 'get',
        params: props, // mock: [200, []],
    }); // 根据企业获取组织关联的设备

export const getDeviceListByOrgId = (props: GetDeviceListByOrgIdProps) =>
    request<any[]>({
        url: prefix('/aapp/org/manager/deviceList'),
        method: 'get',
        params: props, // mock: [200, []],
    }); // 根据导入的组织excel插入组织数据

export const addOrgByExcel = (formData: FormData) =>
    request<string>({
        url: prefix('/aapp/organization/addOrgByExcel', 'fileUpload'),
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: formData,
        mock: [200, uploadFileMock],
    }); // 根据组织Id查询某组织的所有下级组织

export const getOrgTemplateFieldByTemplateId = (orgTemplateId: string) =>
    request<OrgSonInfo[]>({
        url: prefix('/aapp/orgTemplate/getOrgTemplateFieldByTemplateId'),
        method: 'get',
        params: {
            orgTemplateId,
        },
        mock: [200, []],
    }); // 新增下级组织

export const addOrgAndOrgField = (data: any) =>
    request<string>({
        url: prefix('/aapp/organization/addOrgAndOrgField'),
        method: 'post',
        data,
        mock: [200, successMock],
    }); // 新增下级组织

export const updateOrgAndOrgField = (data: any) =>
    request<string>({
        url: prefix('/aapp/organization/updateOrg'),
        method: 'post',
        data,
        mock: [200, successMock],
    });
export const exportExcel = (props: {orgId: any; proCode: any}) =>
    request<any>({
        url: prefix(`/aapp/org/excel/orgExport`),
        method: 'get',
        responseType: 'blob',
        params: props,
    }); // 根据企业获取组织关联的物理设备

export const getThingDeviceList = (props: GetThingDeviceListProps) =>
    request<any[]>({
        url: prefix('/aapp/org/manager/getUserRightOrgDeviceMapping'),
        method: 'get',
        params: props, // mock: [200, []],
    }); // 添加组织机构设备关联关系

export const deviceMaping = (props: DeviceMapingProps, params: any) => {
    return request<string>({
        url: prefix('/aapp/org/manager/add/deviceMaping'),
        method: 'post',
        data: props,
        params,
        mock: [200, successMock],
    });
}; // 根据传入名称模糊匹配(账号、用户名称、所属组织机构)列表信息

export const getUserListByOrganizationWithName = (params: {}) =>
    request<any[]>({
        url: prefix('/user/getUserListByOrganizationWithName'),
        method: 'get',
        params,
        mock: [200, []],
    });

export const getUserListByOrganization = (params: any, data: any) =>
    request<any[]>({
        url: prefix('/user/list'),
        method: 'post',
        params,
        data,
        mock: [200, []],
    });
// 根据传入名称模糊匹配(账号、用户名称、所属组织机构)列表信息

export const getUserListByAccount = (params: {}) =>
    request<any[]>({
        url: prefix('/user/userList/account'),
        method: 'post',
        ...params,
        mock: [200, []],
    }); // 新增下级组织

export const batchUpdateUserOrganization = (data: any) =>
    request<string>({
        url: prefix('/user/batchUpdateUserOrganization'),
        method: 'post',
        data,
        mock: [200, successMock],
    });
export const exportOrgTemplate = () =>
    request<any>({
        url: prefix(`/aapp/org/excel/orgTemplate`),
        method: 'get',
        responseType: 'blob',
    }); // 删除组织机构关联设备信息

export const delDevice = (params: {}) =>
    request<any[]>({
        url: prefix('/aapp/org/manager/delDevice'),
        method: 'delete',
        params,
        mock: [200, []],
    }); // 获取场站信息

export const getFarmList = (params: any, data: any) =>
    request<any[]>({
        url: prefix('/aapp/thing/getFarm'),
        method: 'post',
        params,
        data,
    }); // 获取场站信息

// 字典接口-根据字段分类code获取其子孙字典树-添加框架弹框类型下拉菜单获取

export const getDictDataListByTypeCode = (params: any) =>
    request({
        url: prefix(`/dictInfo/getDictDataListByTypeCode`),
        method: 'get',
        params,
    });
export const getOrgBindingFarmList = (params: any, data: any) =>
    request<any[]>({
        url: prefix('/aapp/thing/getOrgBindingFarmList'),
        method: 'post',
        params,
        data,
    }); // 获取场站信息
