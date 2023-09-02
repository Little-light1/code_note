
export enum DataFlowType {
    // 数据流量
    DataFlow = 'DATA_FLOW',
    // 设备数
    DeviceNumber = 'DEVICE_NUM',
    // 接入点
    AccessPoint = 'IEC_NUM'
}

// 单个数据模型
export interface DataFlowItemModel {
    // 日期时间 格式 yyyy-MM-DD HH:mm:ss
    dateStr: string;
    // 值
    value: string;
}

// 历史数据模型
export interface DataFlowHistoryModel {
    实时数据量: DataFlowItemModel[] | null;
}

// 页面数据模型
export interface DataFlowModel {
    historyData: DataFlowHistoryModel | null;
    realTimeData: DataFlowItemModel[] | null;
}


export interface DataFlowChartDataModel {
    dateTime: string;
    value: number;
}

export interface DataFlowChartItemModel {
    unit: string;
    data: DataFlowChartDataModel[] | null;
}

export interface DataFlowChartModel {
    // 历史数据
    historyData: DataFlowChartItemModel | null;
    // 实时数据
    realTimeData: DataFlowChartItemModel | null;
}