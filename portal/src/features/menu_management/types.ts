export interface MenuTypeModel {
    // 编码
    dictdataCode: string; // ID

    dictdataId: number; // 名称

    dictdataName: string; // 值

    dictdataValue: number;
} /// 日志上报操作ID

export enum LogActionID {
    Add = 'add',
    Modify = 'modify',
    Delete = 'delete',
    // 添加资源 日志 ID
    AddResource = 'addResource',
    // 编辑资源 日志 ID
    ModifyResource = 'modifyResource',
    // 删除资源 日志 ID
    DeleteResource = 'deleteResource',
}

export interface ProductSubModel {
    desc: string;
    enum: string;
    value: number;
}

export interface ProductItemModel {
    id: string;
    name: string;
    code: string;
    company: string;
    createBy: string;
    createTime: string;
    // 内外部标识 value 0 内部应用 1 第三方应用
    gwFlag: ProductSubModel;
    piId: string;
    // 相对路由地址
    piRouter: string;
    // ip地址，若仅有路由地址，无ip地址，则都视为内部应用
    piUrl: string;
    remark: string;
    secret: string;
    // 状态 value 0 启用  1 禁用
    state: ProductSubModel;
}
