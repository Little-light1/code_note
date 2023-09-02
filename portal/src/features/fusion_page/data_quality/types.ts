export enum RadarType {
    // 完整性
    Integrity,
    // 有效性
    Effectiveness,
    // 及时性
    Timeliness,
    // 唯一性
    Uniqueness,
    // 一致性
    Consistency,
}

/// 详情数据条目
export interface InfoItem {
    title: string;
    unit: string;
    value: string;
}

export interface DataValidity {
    DATA_VALIDITY: number;
}

export interface DataQualityInfoModel {
    // 综合评分
    comprehensiveRate: number;
    // 有效性
    effectivenessRate: number;
    // 完整性
    integrityRate: number;
    // 及时性
    timelinessRate: number;
    // 一致性
    uniformityRate: number;
    // 唯一性
    uniqueRate: number;
}

export interface DataQualityCoverModel {
    // 覆盖场站总个数
    allBusinessFarmCount: number;
    // 覆盖设备总个数
    allThingDevices: number;
    // 覆盖测点总个数
    allTingIecCount: number;
    // 除有效性外覆盖设备个数
    deviceCount: number;
    // 除有效性外覆盖场站个数
    farmCount: number;
    // 有效性覆盖设备个数
    qualityDeviceCount: DataValidity;
    // 有效性覆盖场站个数
    qualityFarmCount: DataValidity;
    // 有效性覆盖测点个数
    validityIecCount: number;
    // 质量模型个数
    validityModelCount: number;
    // 算子类型个数
    validityModelTypeCount: number;
}
