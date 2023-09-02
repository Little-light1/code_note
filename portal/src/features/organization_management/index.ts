/*
 * @Author: gxn
 * @Date: 2021-11-29 13:53:10
 * @LastEditors: gxn
 * @LastEditTime: 2023-03-15 09:11:17
 * @Description: 组织机构管理tsx
 */
import {LazyLoader} from '@gwaapp/ease';

const component = LazyLoader(() => import('./view'));
export const key = 'organizationManagement';
export const title = '组织机构管理';
export const route = {
    key,
    title,
    path: '/organizationManagement',
    component,
    exact: true,
};
export const reducers = {
    dictTypeTree: {
        initialState: [],
    },
    dictTypeMap: {
        initialState: {},
    },
    dictTypeMapById: {
        initialState: {},
    },
    dictDataMapById: {
        initialState: {},
    },
    loading: {
        initialState: false,
    },
    expandedTreeKeys: {
        initialState: [],
    },
    selectedTreeNode: {
        initialState: null,
    },
    pageSize: {
        initialState: 20,
    },
    page: {
        initialState: 1,
    },
    tableDataSource: {
        initialState: [],
    },
    total: {
        initialState: 1,
    },
    isTableLoading: {
        initialState: false,
    },
    selectedRowKeys: {
        initialState: [],
    },
    deviceTableShow: {
        initialState: false,
    },
    // 组织机构管理
    orgInfo: {
        initialState: {
            fieldList: [],
            platformOrganization: {},
            platformOrganizationTemplate: {},
        },
    },
    // 下级组织机构类表
    orgSonList: {
        initialState: [],
    },
    // 模板列表
    orgTemplateList: {
        initialState: [],
    },
    // 组织机构下设备列表信息
    deviceTableData: {
        initialState: [],
    },
    // 组织机构下设备table分页信息
    deviceTableInfo: {
        initialState: {
            pageNum: 1,
            pageSize: 20,
        },
    },
    // 动态输入框
    dynamicRow: {
        initialState: [],
    },
    // 获取详情
    orgDetail: {
        initialState: {},
    },
    // 选中的关联节点treeNode
    selectedTreeNodeInModal: {
        initialState: null,
    },
    expandedTreeKeysInModal: {
        initialState: [],
    },
    // 设备绑定弹框
    thingFarmNode: {
        initialState: [],
    },
    deviceTableDataSource: {
        initialState: [],
    },
    usersInOrgs: {
        initialState: [],
    },
    selectedDeviceList: {
        initialState: [],
    },
    totalSelectedDeviceList: {
        initialState: [],
    },
    unSelectedDeviceList: {
        initialState: [],
    },
    totalUnSelectedDeviceList: {
        initialState: [],
    },
    // 左侧未归类的keys
    leftSelectedKeys: {
        initialState: [],
    },
    leftSearchName: {
        initialState: '',
    },
    // 右侧未归类的keys
    rightSelectedKeys: {
        initialState: [],
    },
    rightSearchName: {
        initialState: '',
    },
    actionCount: {
        initialState: 0,
    },
    // 用户弹框
    // 未关联用户
    unlinkedUsers: {
        initialState: [],
    },
    // 已关联用户
    linkedUsers: {
        initialState: [],
    },
    // 关联用户列表
    userTableShow: {
        initialState: false,
    },
    userTableSource: {
        initialState: [],
    },
    // 获取物理电场
    farmList: {
        initialState: [],
    },
    // 电场类型列表
    farmTypeList: {
        initialState: [],
    },
    // 物理设备loading
    deviceLoading: {
        initialState: false,
    },
    farmTreeLoading: {
        initialState: false,
    },
    sameLevelFlag: {
        initialState: false,
    },
};
export const i18n = {
    zh: {
        deviceId: '设备ID',
        deviceName: '设备名称',
        model: '型号',
        upOrgName: '上级组织架构',
        desc: '描述',
        sort: '顺序号',
        orgType: '组织类型',
        pyDevice: '物理设备',
        farmName: '电场名称',
        relateDevice: '关联设备',
        inputName: '设备ID/设备名称/型号',
        exportOrgData: '导出组织机构数据',
        templateDownload: '模板下载',
        businessField: '业务电场',
        commonOrg: '普通组织',
        subordinateOrg: '下级组织机构',
        orgName: '机构名称',
        orgDesc: '机构描述',
        templateType: '组织类型',
        hasRecordNotice: '有操作记录，确定要切换节点吗',
        pleaseSelectDevice: '请选择需要移动的设备',
        deleteDeviceNotice: '确定要删除吗',
        bindUser: '绑定用户',
        deviceType: '设备类型',
        deleteDevice: '删除设备',
        cancel: '取消',
        selectNode: '请选择节点',
        getOrgTree: '获取组织机构树',
        addOrg: '新增组织机构',
        modifyOrg: '编辑组织机构',
        exportTemplate: '模板下载',
        deleteOrg: '删除组织机构',
        exportOrgDetail: '导出组织机构数据',
    },
    en: {
        deviceId: 'deviceId',
        deviceName: 'deviceName',
        model: 'model',
        upOrgName: 'organizational structure',
        desc: 'description',
        sort: 'sort',
        orgType: 'org type',
        pyDevice: 'physical device',
        farmName: 'farmName',
        relateDevice: 'relate device',
        inputName: 'deviceID/deviceName/deviceModal',
        exportOrgData: 'exportOrgData',
        templateDownload: 'templateDownload',
        businessField: 'businessField',
        commonOrg: 'commonOrg',
        subordinateOrg: 'subordinateOrg',
        orgName: 'orgName',
        orgDesc: 'orgDesc',
        templateType: 'orgType',
        hasRecordNotice: 'changed,sure?',
        pleaseSelectDevice: 'please select device',
        deleteDeviceNotice: 'sure delete?',
        bindUser: 'bind user',
        deviceType: 'device type',
        deleteDevice: 'deleteDevice',
        cancel: 'cancel',
        selectNode: 'please select node',
        getOrgTree: 'get org tree',
        addOrg: 'addOrg',
        modifyOrg: 'modifyOrg',
        exportTemplate: 'downloadTemplate',
        deleteOrg: 'deleteOrg',
        exportOrgDetail: 'exportOrgDetail',
    },
};
export default component;
