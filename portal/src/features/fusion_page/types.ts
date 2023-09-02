/**
 * 统计周期类型
 */
export enum StatisticsChartTab {
    // 本月
    ThisMonth = 'thisMonth',
    // 本年
    ThisYear = 'thisYear',
}

/**
 * 能源类型
 */
export enum EnergyChartTab {
    // 风机
    Wind = 'wind',
    // 光伏
    Photovoltaic = 'photovoltaic',
}

/**
 * 涉及菜单类型
 */
export enum MenuCode {
    // 大数据
    DataPlat = 'DataPlat',
    // 健康管理
    SPHM = 'SPHM',
    // 业务智能
    BI = 'BI',
    // 资产管理
    AM = 'AM6.0'
}

// 图表排序
export enum ChartSortType {
    // 不排序
    none,
    // 递增
    asc,
    // 递减
    desc
}
