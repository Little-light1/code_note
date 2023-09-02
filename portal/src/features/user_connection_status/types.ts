/// 查询条件
export enum SearchBarItemName {
    // 所属组织机构
    Organization = 'organization',
    // 用户账号
    UserAccount = 'userAccount',
    // 用户名称
    Username = 'username',
    // 连接状态
    ConnectionStatus = 'connectionStatus',
} /// 连接状态

export enum ConnectionStatus {
    // 全部
    All = 'all',
    // 在线
    Online = '1',
    // 离线
    Offline = '0',
} // 日志埋点操作ID

export enum LogActionID {
    Query = 'query',
} // 表单搜索记录时使用的表单参数

export interface FormValuesType {
    // 组织机构ID
    orgId: string; // 用户账号

    userAccount: string; // 用户姓名

    username: string; // 连接状态

    connectionStatus: string;
}
