
// 用户权限
export enum DimensionType {
    // 集团
    Group = 'group',
    // 区域
    Area = 'area',
    // 场站
    Depart = 'depart'
}

/**
 * 图表数据模型
 */
export interface ChartModel {
    // 用户权限
    dimension: DimensionType;
    // 各场站一类缺陷的数量
    c1: string[];
    // 各场站二类缺陷的数量
    c2: string[];
    // 各场站三类缺陷的数量
    c3: string[];
    // 各场站四类缺陷的数量 
    c4: string[];
    // 各场站未分级缺陷的数量 
    c5: string[];
    // x轴名称
    names: string[];
}