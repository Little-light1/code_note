
export enum WarningTimeChartTab {
    // 今日
    Today = 'today',
    // 本周
    ThisWeek = 'thisWeek',
    // 本月
    ThisMonth = 'thisMonth',
    // 近12月
    Last12Month = 'last12Month',
}

/// 任务信息数据模型
export interface TaskInfoModel {
    // 分组名称
    groupName: string;
    // 分组id
    groupId: string;
    // 任务数
    taskNum: number;
    // 处理中
    inProcessNum: number;
    // 已处理
    handledNum: number;
}

export interface WarningTopListItemModel {
    // 名称
    groupName: string;
    // id
    groupId: string;
    // 数量
    taskNum: number;
}