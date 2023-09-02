import { nullToDoubleBar } from "../constant";
import { InfoItem , DataQualityCoverModel, DataQualityInfoModel, RadarType } from "./types";

// 数据质量雷达图数据类型集合
export const radarTypes = [RadarType.Integrity, RadarType.Effectiveness, RadarType.Timeliness, RadarType.Uniqueness, RadarType.Consistency];

/**
 * 获取雷达图数据类型名称
 * @param type 雷达图数据类型
 * @returns 
 */
export const getRadarTypeName = (type: RadarType) => {
    switch (type) {
    case RadarType.Integrity:
        return '完整性';
    case RadarType.Effectiveness:
        return '有效性';
    case RadarType.Timeliness:
        return '及时性';
    case RadarType.Uniqueness:
        return '唯一性';
    case RadarType.Consistency:
        return '一致性';
    default:
        return '';
    }
};

const formatScorePercent = (value: number) => (value * 100).toFixed(2);

/**
 * 获取数据质量评分数据
 * @param data 
 * @returns 
 */
const getInfoValues = (data: DataQualityInfoModel | null) => ({
    comprehensiveRate: formatScorePercent(data?.comprehensiveRate || 0),
    integrityRate: formatScorePercent(data?.integrityRate || 0),
    uniformityRate: formatScorePercent(data?.uniformityRate || 0),
    uniqueRate: formatScorePercent(data?.uniqueRate || 0),
    timelinessRate: formatScorePercent(data?.timelinessRate || 0),
    effectivenessRate: formatScorePercent(data?.effectivenessRate || 0),
});

/**
 * 获取数据质量数据
 * @returns 
 */
export const getInfoItems = (data: DataQualityInfoModel | null): InfoItem[] => {
    const values = getInfoValues(data);

    // 综合评分
    const scoreItem: InfoItem = {
        title: '综合评分',
        unit: "分",
        value: values.comprehensiveRate,
    };

    // 完整性
    const integrityItem: InfoItem = {
        title: getRadarTypeName(RadarType.Integrity),
        unit: "%",
        value: values.integrityRate,
    };

    // 一致性
    const consistencyItem: InfoItem = {
        title: getRadarTypeName(RadarType.Consistency),
        unit: "%",
        value: values.uniformityRate,
    };

    // 唯一性
    const uniquenessItem: InfoItem = {
        title: getRadarTypeName(RadarType.Uniqueness),
        unit: "%",
        value: values.uniqueRate,
    };

    // 及时性
    const timelinessItem: InfoItem = {
        title: getRadarTypeName(RadarType.Timeliness),
        unit: "%",
        value: values.timelinessRate,
    };

    // 有效性
    const effectivenessItem: InfoItem = {
        title: getRadarTypeName(RadarType.Effectiveness),
        unit: "%",
        value: values.effectivenessRate,
    };

    return [scoreItem, integrityItem, consistencyItem, uniquenessItem, timelinessItem, effectivenessItem];
};


export const getRateInfoTopItems = (type: RadarType, data: DataQualityCoverModel | null) => {
    if (type === RadarType.Effectiveness) {
        return [
            {
                title: '覆盖场站（个）',
                covered: nullToDoubleBar(data?.qualityFarmCount?.DATA_VALIDITY),
                all: nullToDoubleBar(data?.allBusinessFarmCount),
            },
            {
                title: '覆盖设备（个）',
                covered: nullToDoubleBar(data?.qualityDeviceCount?.DATA_VALIDITY),
                all: nullToDoubleBar(data?.allThingDevices),
            },
            {
                title: '覆盖测点（个）',
                covered: nullToDoubleBar(data?.validityIecCount),
                all: nullToDoubleBar(data?.allTingIecCount),
            }
        ];
    }
    return [
        {
            title: '覆盖场站（个）',
            covered: nullToDoubleBar(data?.farmCount),
            all: nullToDoubleBar(data?.allBusinessFarmCount),
        },
        {
            title: '覆盖设备（个）',
            covered: nullToDoubleBar(data?.deviceCount),
            all: nullToDoubleBar(data?.allThingDevices),
        },
    ];
}

export const getRateInfoBottomItems = (type: RadarType, data: DataQualityCoverModel | null) => {
    if (type === RadarType.Effectiveness) {
        return [
            {
                title: '质量模型（个）',
                all: nullToDoubleBar(data?.validityModelCount),
            },
            {
                title: '算子类型（个）',
                all: nullToDoubleBar(data?.validityModelTypeCount),
            }
        ];
    }
    return [];
}

/**
 * 获取雷达图配置
 * @param name 雷达图数据类型名称
 * @param axisLabelShow 雷达图是否显示坐标轴
 * @param color 雷达图数据类型名称文本颜色
 * @returns 
 */
const getRadarChartIndicator = (name: string, axisLabelShow: boolean, color: string) => ({ 
    name, 
    max: 100,
    color,
    axisLabel: {    
        show: axisLabelShow,
        color: '#FFFFFF'
    },
});

/**
 * 获取雷达图配置项
 * @param index 
 * @returns 
 */
export const getRadarChartOption = (index: number, data: DataQualityInfoModel | null) => {
    const values = getInfoValues(data);

    const indicators = radarTypes.map((item, idx) => {
        const name = getRadarTypeName(item);
        // 仅完整性显示坐标轴
        const axisLabelShow = item === RadarType.Integrity;
        const axisLabelColor = index === idx ? '#00E4FF':'#FFFFFF';
        return getRadarChartIndicator(name, axisLabelShow, axisLabelColor);
    });

    const seriesValues = radarTypes.map((item) => {
        switch (item) {
        case RadarType.Integrity:
            return values.integrityRate;
        case RadarType.Effectiveness:
            return values.effectivenessRate;
        case RadarType.Timeliness:
            return values.timelinessRate;
        case RadarType.Uniqueness:
            return values.uniqueRate;
        case RadarType.Consistency:
            return values.uniformityRate;
        default:
            return 0;
        }
    });

    return {
        radar: {
            shape: 'circle',
            splitNumber: 4,
            axisName: {
                fontSize: 14
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            },  
            splitArea: {
                show: false
            },
            indicator: indicators,
            triggerEvent: true,
        },
        series: [
            {
                type: 'radar',
                data: [
                    {
                        value: seriesValues,
                    }
                ],
                lineStyle: { 
                    color: '#D200FF' 
                },
                itemStyle: {
                    color: "#FFFFFF",
                    borderColor: '#D200FF',
                    borderWidth: 1
                },
                areaStyle: {
                    color: "rgba(210, 0, 255, 0.2)"
                }
            }
        ]
    }
};


