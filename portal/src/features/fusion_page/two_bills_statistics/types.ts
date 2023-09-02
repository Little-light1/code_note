/**
 * 用户权限
 */
export enum DimensionType {
    // 集团
    Group = 'group',
    // 区域
    Area = 'area',
    // 场站
    Depart = 'depart'
}

export interface SeriesModel {
    name: string;
    // 月数据
    v1Datas: number[];
    // 年数据
    v2Datas: number[];
}

/**
 * 图表接口数据模型
 */
export interface ChartModel {
    // 用户权限
    dimension: DimensionType;
    // 图标数据
    series: SeriesModel[];
    // 票名称集合
    ticketTypes: string[];
    title: string;
    // 月横坐标数据
    x1Data: string[];
    x1Title: string;
    // 年横坐标数据
    x2Data: string[];
    x2Title: string;
}