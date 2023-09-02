export enum SortType {
    Up,
    Down
}


export interface TopListItemModel {
    groupId: string;
    groupName: string;
    value: number;
}

export interface EquipmentInfoModel {
    // 本周
    thisWeekValue: number;
    // 本月
    thisMonthValue: number;
    // 近12月
    last12MonthValue: number;
    xjQuotaGroups: TopListItemModel[];
}