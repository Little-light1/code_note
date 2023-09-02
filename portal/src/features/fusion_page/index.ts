import {LazyLoader} from '@gwaapp/ease';
import {PageTitle, PageKey} from './constant';
import {DataFlowType} from './data_flow/types';
import { SortType } from './equipment_info/types';
import {EnergyChartTab, StatisticsChartTab, ChartSortType} from './types';
import {WarningTimeChartTab} from './warning_info/types';

const component = LazyLoader(() => import('./view'));

export const key = PageKey;
export const title = PageTitle;

export const route = {
    key,
    path: `/${PageKey}`,
    component,
    title,
    exact: false,
};

export const reducers = {
    // 两票统计 tab选择
    twoBillsChartTab: {
        initialState: StatisticsChartTab.ThisMonth,
    },

    // 两票统计 图表数据
    twoBillsChartData: {
        initialState: null,
    },

    // 缺陷统计 tab选择
    defectChartTab: {
        initialState: StatisticsChartTab.ThisMonth,
    },

    // 缺陷统计 图表数据
    defectChartData: {
        initialState: null,
    },

    // 设备信息 能源tab选择
    deviceEnergyTab: {
        initialState: EnergyChartTab.Wind,
    },

    // 设备信息 健康度数据
    deviceHealthyData: {
        initialState: null,
    },

    // 设备信息 健康度数据排序
    deviceHealthySort: {
        initialState: SortType.Down,
    },

    // 设备信息 完结率数据
    deviceCompletionRateData: {
        initialState: null,
    },

    // 设备信息 完结率数据
    deviceCompletionRateSort: {
        initialState: SortType.Down,
    },

    // 设备信息 准确率数据排序
    deviceAccuracyData: {
        initialState: null,
    }, 

    // 设备信息 准确率数据排序
    deviceAccuracySort: {
        initialState: SortType.Down,
    },

    // 预警信息 时间tab选择
    warningTimeTab: {
        initialState: WarningTimeChartTab.ThisMonth,
    },

    // 预警信息 能源tab选择
    warningEnergyTab: {
        initialState: EnergyChartTab.Wind,
    },

    // 预警信息 任务信息
    warningTaskInfo: {
        initialState: null,
    },

    // 预警数量Top数据
    warningTopList: {
        initialState: null,
    },

    // 场站能效 时间tab选择
    stationTimeTab: {
        initialState: WarningTimeChartTab.ThisMonth,
    },

    // 场站能效 能源tab选择
    stationEnergyTab: {
        initialState: EnergyChartTab.Wind,
    },

    // 场站能效 图表数据
    stationChartData: {
        initialState: null,
    },

    // 场站能效 图表排序后数据
    stationChartSortData: {
        initialState: null,
    },

    // 场站能效图表数据排序
    stationChartSort: {
        initialState: ChartSortType.none,
    },

    // 设备能效 时间tab选择
    equipmentTimeTab: {
        initialState: WarningTimeChartTab.ThisMonth,
    },

    // 设备能效 能源tab选择
    equipmentEnergyTab: {
        initialState: EnergyChartTab.Wind,
    },

    // 设备能效 图表数据
    equipmentChartData: {
        initialState: null,
    },

    // 设备能效 图表排序后数据
    equipmentChartSortData: {
        initialState: null,
    },

    // 设备能效图表数据排序
    equipmentChartSort: {
        initialState: ChartSortType.none,
    },

    // 数据流量 tab 选择
    dataFlowTab: {
        initialState: DataFlowType.DataFlow,
    },

    // 数据流量 数据源
    dataFlowData: {
        initialState: null,
    },

    // 数据质量选中的图表索引
    dataQualityChartIndex: {
        initialState: 0,
    },

    // 数据质量评分数据源
    dataQualityInfoData: {
        initialState: null,
    },

    // 数据质量覆盖数据源
    dataQualityCoverData: {
        initialState: null,
    },
};

// export const i18n = i18nJson;

export default component;
