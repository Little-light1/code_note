/* eslint-disable global-require */
import * as echarts from 'echarts';
import { nullToDoubleBar } from '../constant';
import { DataFlowChartModel, DataFlowModel, DataFlowType } from "./types";

export const dataFlowTypes = [DataFlowType.DataFlow, DataFlowType.DeviceNumber, DataFlowType.AccessPoint];

export const chartColors = [
    ['#00FF60', '#00FFBA'],
    ['#00FFF0', '#0498BE'],
    ['#74CEFF', '#005C9E'],
    ['#FCE232', '#FFAB54'],
    ['#FF74EA', '#9E007F'],
]

export const getDataFlowItem = (type: DataFlowType) => {
    switch (type) {
    case DataFlowType.DataFlow:
        return {
            icon: require('../images/data_flow.png'),
            title: '数据流量'
        };  
    case DataFlowType.DeviceNumber:
        return {
            icon: require('../images/device_number.png'),
            title: '设备数'
        };
    case DataFlowType.AccessPoint:
        return {
            icon: require('../images/access_point.png'),
            title: '接入点'
        };
    default:
        return {};
    }
}

export const getDataFlowItemData = (type: DataFlowType) => {
    switch (type) {
    case DataFlowType.DataFlow:
        return {
            historyTitle: '实时数据量',
            realtimeTitle: '实时流量'
        };  
    case DataFlowType.DeviceNumber:
        return {
            historyTitle: '设备数',
            realtimeTitle: '实时设备数'
        };
    case DataFlowType.AccessPoint:
        return {
            historyTitle: '接入点数',
            realtimeTitle: '实时接入点'
        };
    default:
        return {
            historyTitle: '',
            realtimeTitle: ''
        };
    }
}

export const getDataFlowItemValue = (data: DataFlowChartModel | null) =>  {
    let value = null;
    const realTimeData = data?.realTimeData?.data;
    if (realTimeData && realTimeData.length > 0) {
        value = realTimeData[realTimeData.length - 1].value;
    }
    return value;
}

export const getChartOption = (type: DataFlowType, data: DataFlowChartModel | null) => ({
    tooltip: {
        trigger: 'axis',
        confine: true,
        borderWidth: 0,
        backgroundColor: 'rgba(1, 10, 14, 0.9000)',
        axisPointer: {
            type: 'shadow'
        },
        formatter: (params: any) => {
            // 获取xAxis data中的数据
            const dataStr = `<div style='color:#FFFFFF;font-size:16px;margin-bottom:10px'>${params[0].axisValue}</div>`;
            let itemStr = '';
            params.forEach((item: any) => {
                if (item.axisIndex === 0) {
                    itemStr += `<div style='margin-bottom:10px'>
                        <span style='display:inline-block;width:12px;height:12px;background-image:linear-gradient(to right, ${item.color.colorStops[0].color} , ${item.color.colorStops[1].color});vertical-align:middle' /></span>
                        <span style='margin-left:5px;font-size:14px;color:#FFFFFF;'>${item.seriesName}</span>
                        <div style='float:right'>
                        <span style='margin-left:20px;color:#00E4FF;font-size:16px;'>${nullToDoubleBar(item.data)}</span>
                        <span style='margin-left:5px'>${data?.historyData?.unit}</span>
                        </div>
                        </div>`;
                } else {
                    itemStr += `<div style='margin-bottom:10px'>
                                    <span style='display:inline-block;width:12px;height:12px;background-color:#00E4FF;vertical-align:middle' /></span>
                                    <span style='margin-left:5px;font-size:14px;color:#FFFFFF;'>${item.seriesName}</span>
                                    <div style='float:right'>
                                    <span style='margin-left:20px;color:#00E4FF;font-size:16px;'>${nullToDoubleBar(item.data)}</span>
                                    <span style='margin-left:5px'>${data?.realTimeData?.unit}</span>
                                    </div>
                                    </div>`;
                }
                    
            });
            const containerStr = `<div style='display:flex;flex-direction:column;flex-wrap:wrap;'>${itemStr}</div>`;
            return `<div style='box-sizing: border-box;'>${dataStr}${containerStr}</div>`;
        },
    },
    legend: {
        show: false,
    },
    grid: [
        { left: '60', right: '40', top: '8%', height: '50%' },
        { left: '60', right: '40', bottom: '8%', height: '20%' }
    ],
    xAxis: [
        {
            type: 'category',
            data: data?.historyData?.data?.map((item) => item.dateTime),
            gridIndex: 0,
            axisLabel: {
                color: '#FFFFFF',
                fontSize: 12
            }
        },
        {
            type: 'category',
            data: data?.realTimeData?.data?.map((item) => item.dateTime),
            gridIndex: 1,
            axisLabel: {
                color: '#FFFFFF',
                fontSize: 12
            }
        }
    ],
    yAxis: [
        {
            gridIndex: 0,
            axisLabel: {
                color: '#FFFFFF',
                fontSize: 12
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    color: '#7E7E80'
                },
            },
            splitNumber: 4,
        },
        {
            gridIndex: 1,
            axisLabel: {
                color: '#FFFFFF',
                fontSize: 12
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    color: '#7E7E80'
                },
            },
            splitNumber: 2,
        }
    ],
    series: [
        {
            name: getDataFlowItemData(type).historyTitle,
            type: 'line',
            showSymbol: false,
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {offset: 0, color: '#00FF60'},
                    {offset: 1, color: '#00FFBA'},
                ]),
            },
            smooth: true,
            data: data?.historyData?.data?.map((item) => item.value)
        },
        {
            name: getDataFlowItemData(type).realtimeTitle,
            type: 'line',
            showSymbol: false,
            smooth: true,
            data: data?.realTimeData?.data?.map((item) => item.value),
            xAxisIndex: 1,
            yAxisIndex: 1,
            lineStyle: {
                color: '#00E4FF',
            },
            itemStyle: {
                color: '#FFFFFF',
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: '#00E4FF',
                    },
                    {
                        offset: 1,
                        color: 'rgba(0, 228, 255, 0)',
                    },
                ]),
            },
        }
    ]
});