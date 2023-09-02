const UpdateImmerMicroPageStatus = '@update/app/microPageStatus';
const reducers = {
    appVisible: {
      initialState: false
    },
    appData: {
      initialState: []
    },
    userInfo: {
        initialState: {},
    },
    dicts: {
        initialState: {},
    },
    needChangePassword: {
        initialState: false,
    },
    // 密码有效期
    passwordDays: {
        initialState: 9999,
    },
    logo: {
        initialState: {},
    },
    system: {
        initialState: {},
    },
    loginPics: {
        initialState: [],
    },
    loginPicsIsRequested: {
        initialState: false,
    },
    subSystems: {
        initialState: [],
    },
    localRoutes: {
        initialState: {},
    },
    menus: {
        initialState: [],
    },
    flatMenuMapById: {
        initialState: null,
    },
    flatMenuMapByPath: {
        initialState: null,
    },
    currentSubSystem: {
        initialState: null,
    },
    currentMenus: {
        initialState: [],
    },
    currentTab: {
        initialState: null,
    },
    commonConfigs: {
        initialState: [],
    },
    biResources: {
        initialState: [],
    },
    biResourceMap: {
        initialState: {},
    },
    menuResources: {
        initialState: [],
    },
    menuResourceMap: {
        initialState: {},
    },
    mergeMenuResources: {
        initialState: {},
    },
    isSystemReady: {
        initialState: false,
    },
    microPageStatus: {
        initialState: {},
        actions: [
            {
                actionType: UpdateImmerMicroPageStatus,
                action: (state: any, action: any) => {
                    Object.assign(state, action.payload);
                },
            },
        ],
    },
    // 全局模态窗口状态
    modalState: {
        initialState: {},
        actions: [
            {
                actionType: '@app/openModal',
                action: (state: any, action: any) => {
                    Object.assign(state, action.payload);
                },
            },
            {
                actionType: '@app/closeModal',
                action: (state: any, action: any) => {
                    delete state[action.payload];
                },
            },
        ],
    },
    // 全局遮罩状态
    isShowGlobalMask: {
        initialState: false,
        actions: [
            {
                actionType: '@app/openGlobalMask',
                action: (state: any, action: any) => action.payload || true,
            },
            {
                actionType: '@app/closeGlobalMask',
                action: () => false,
            },
        ],
    },
};
export default reducers;
export const ActionTypes = {
    UpdateImmerMicroPageStatus,
};
