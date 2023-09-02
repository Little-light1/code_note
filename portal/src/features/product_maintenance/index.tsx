import {LazyLoader} from '@gwaapp/ease';

const component = LazyLoader(() => import('./view'));

export const key = 'productMaintenance';
export const title = '应用维护';

export const route = {
    key,
    title,
    path: '/productMaintenance',
    component,
    exact: false,
};

export const reducers = {
    pageSize: {
        initialState: 20,
    },
    page: {
        initialState: 1,
    },
    tableDataSource: {
        initialState: [],
    },
    searchTableDataSource: {
        initialState: [],
    },
    total: {
        initialState: 0,
    },
    isTableLoading: {
        initialState: false,
    },
    // 单点登录方式
    loginType: {
        initialState: [],
    },
};

export const i18n = {
    'zh-CN': {
        code: '应用编码',
        applyCode: '存在重复编码，请重新输入',
        codeInput: '请输入应用编码',
        name: '应用名称',
        applyName: '存在重复名称，请重新输入',
        noEmojiName: '应用名称不能输入表情',
        noEmojiCode: '应用编码不能输入表情',
        nameInput: '请输入应用名称',
        onNameInput: '请输入应用名称/应用编码',
        remark: '应用描述',
        remarkText: '请输入255字以内的应用描述',
        status: '状态',
        querySuccessful: '查询成功',
        queryError: '数据查询失败',
        request: '请求报错',
        piUrl: '应用IP',
        onAsIp: '请输入应用IP',
        noAsIp: '请输入正确的IP地址',
        sort: '顺序',
        onSort: '请输入顺序',
        piRouter: '路由地址',
        onRouteAddr: '请输入路由地址',
        onRouteAddrValue: '请输入正确的路由地址',
        gwFlag: '内外标识',
        onSourceFlag: '内外标识不可以为空',
        selectSourceFlag: '请选择内外标识',
        inside: '金风内部产品',
        external: '第三方的产品',
        terminalType: '应用终端类型',
        pcEnd: 'PC端',
        MobileTerminal: '移动端',
        appPicture: '应用图片',
        appPictureHint: '文件格式为:.png、.jpg,大小不超过2M',
        ssoType: '单点登录方式',
        ssoInfo: '单点登录参数',
        changeSsoType: '请选择单点登录方式',
        ssoInfoMsg: '输入的参数格式有误，请检查输入的参数数据格式',
        enterSsoInfo: '请输入单点登录参数,参数格式为JSON类型,长度不超过500',
    },
    'en-US': {
        code: 'Application Coding',
        applyCode: 'Duplicate code exists, please re-enter',
        codeInput: 'Please enter application code',
        name: 'Apply Name',
        applyName: 'Duplicate name exists,please re-enter',
        noEmojiName: 'App name cannot be entered',
        noEmojiCode: 'Application code cannot enter expression',
        nameInput: 'Please enter app name',
        onNameInput: 'Please enter app name / app code',
        remark: 'Describe',
        remarkText: 'Please enter an application description within 255 words',
        status: 'Status',
        querySuccessful: 'query was successful',
        queryError: 'Data query failed',
        request: 'Request error',
        piUrl: 'Application IP',
        onAsIp: 'Please enter the application IP',
        noAsIp: 'Please enter the correct IP address',
        sort: 'order',
        onSort: 'Please enter the order',
        piRouter: 'Routing address',
        onRouteAddr: 'Please enter the routing address',
        onRouteAddrValue: 'Please enter the correct routing address',
        gwFlag: 'identification',
        onSourceFlag: 'ID cannot be empty',
        selectSourceFlag: 'Please select internal and external identification',
        inside: 'Jinfeng internal products',
        external: 'Third party products',
        terminalType: 'Terminal type',
        pcEnd: 'PC end',
        MobileTerminal: 'Mobile terminal',
        appPicture: 'App picture',
        appPictureHint: 'appPictureHint',
        ssoType: 'ssoType',
        ssoInfo: 'ssoInfo',
        changeSsoType: 'changeSsoType',
        ssoTypeMsg: 'ssoTypeMsg',
        enterSsoInfo: 'enterSsoInfo',
    },
};

export default component;
