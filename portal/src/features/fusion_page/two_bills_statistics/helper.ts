import * as echarts from 'echarts';
import { nullToDoubleBar } from '../constant';
import { StatisticsChartTab } from "../types";
import { ChartModel, DimensionType } from "./types";

/**
 * 图表柱状渐变色配色数据源
 */
const chartColors = [
    ['#00FF60', '#00FFBA'],
    ['#00FFF0', '#0498BE'],
    ['#74CEFF', '#005C9E'],
    ['#FCE232', '#FFAB54'],
    ['#FF74EA', '#9E007F'],
]

/**
 * 获取曲线图表配置项
 * @param chartData 图表数据
 * @param chartTab 当前选中的统计周期维度
 * @returns 
 */
const getLineChartOption = (chartData: ChartModel | null, chartTab: StatisticsChartTab) => ({
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
                itemStr += `<div style='margin-bottom:10px'>
                        <span style='display:inline-block;width:12px;height:2px;background-image:linear-gradient(to right, ${item.color.colorStops[0].color} , ${item.color.colorStops[1].color});vertical-align:middle' /></span>
                        <span style='margin-left:5px;font-size:14px;color:#FFFFFF;'>${item.seriesName}</span>
                        <span style='float:right;margin-left:20px;color:#00E4FF;font-size:16px;'>${nullToDoubleBar(item.data)}</span>
                    </div>`;
            });
            const containerStr = `<div style='display:flex;flex-direction:column;flex-wrap:wrap;'>${itemStr}</div>`;
            return `<div style='box-sizing: border-box;'>${dataStr}${containerStr}</div>`;
        },
    },
    legend: {
        type: 'scroll',
        icon: 'rect',
        right: 24,
        itemHeight: 2,
        itemWidth: 12,
        itemGap: 20,
        textStyle: {
            color: '#FFFFFF',
            fontSize: 12
        },
        pageTextStyle: {
            color: '#FFFFFF'
        },
        pageIconColor: '#00E4FF'
    },
    dataZoom: [
        {
            type: 'slider',
            show: true,
            startValue: 0,
            endValue: 11,
            height: 20,
            borderColor: 'transparent',
            backgroundColor: '#404C57',
            showDataShadow: false,
            showDetail: false,
            brushSelect: false,
            fillerColor: 'rgba(135, 134, 134, 0.4)',
        }
    ],
    xAxis: {
        type: 'category',
        data: chartTab === StatisticsChartTab.ThisMonth ? chartData?.x1Data : chartData?.x2Data,
        axisLabel: {
            color: '#FFFFFF',
            fontSize: 12
        },
    },
    yAxis: {
        type: 'value',
        min: 0,
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
        axisLine: {
            show: false,
        },
        axisTick: {
            show: false,
        },
        nameTextStyle: {
            color: '#FFFFFF'
        },
        splitNumber: 5,
    },
    grid: {
        top: 40,
        left: 60,
        right: 60,
        show: false
    },
    series: chartData?.series?.map((item, index) => {
        const idx = index % chartColors.length;
        const colors = chartColors[idx];
        const data = chartTab === StatisticsChartTab.ThisMonth ? item.v1Datas : item.v2Datas;
        return {
            name: item.name,
            data,
            type: 'line',
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {offset: 0, color: colors[0]},
                    {offset: 1, color: colors[1]},
                ]),
            },
            smooth: true,
            showSymbol: false
        };
    }),
});

/**
 * 获取柱状图表配置项
 * @param chartData 图表数据
 * @param chartTab 当前选中的统计周期维度
 * @returns 
 */
const getBarChartOption = (chartData: ChartModel | null, chartTab: StatisticsChartTab) => ({
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
                itemStr += `<div style='margin-bottom:10px'>
                        <span style='display:inline-block;width:12px;height:12px;background-image:linear-gradient(to right, ${item.color.colorStops[0].color} , ${item.color.colorStops[1].color});vertical-align:middle' /></span>
                        <span style='margin-left:5px;font-size:14px;color:#FFFFFF;'>${item.seriesName}</span>
                        <span style='float:right;margin-left:20px;color:#00E4FF;font-size:16px;'>${nullToDoubleBar(item.data)}</span>
                    </div>`;
            });
            const containerStr = `<div style='display:flex;flex-direction:column;flex-wrap:wrap;'>${itemStr}</div>`;
            return `<div style='box-sizing: border-box;'>${dataStr}${containerStr}</div>`;
        },
    },
    legend: {
        type: 'scroll',
        icon: 'rect',
        right: 24,
        itemHeight: 12,
        itemWidth: 12,
        itemGap: 20,
        textStyle: {
            color: '#FFFFFF',
            fontSize: 12
        },
        pageTextStyle: {
            color: '#FFFFFF'
        },
        pageIconColor: '#00E4FF'
    },
    dataZoom: [
        {
            type: 'slider',
            show: true,
            startValue: 0,
            endValue: 11,
            height: 20,
            borderColor: 'transparent',
            backgroundColor: '#404C57',
            showDataShadow: false,
            showDetail: false,
            brushSelect: false,
            fillerColor: 'rgba(135, 134, 134, 0.4)',
        }
    ],
    grid: {
        top: 40,
        left: 60,
        right: 60,
        show: false
    },
    xAxis: {
        type: 'category',
        data: chartTab === StatisticsChartTab.ThisMonth ? chartData?.x1Data : chartData?.x2Data,
        axisLabel: {
            color: '#FFFFFF',
            fontSize: 12
        }
    },
    yAxis: {
        type: 'value',
        min: 0,
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
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        nameTextStyle: {
            color: '#FFFFFF'
        },
        splitNumber: 5,
    },
    series: chartData?.series?.map((item, index) => {
        const idx = index % chartColors.length;
        const colors = chartColors[idx];
        const data = chartTab === StatisticsChartTab.ThisMonth ? item.v1Datas : item.v2Datas;
        return {
            name: item.name,
            type: 'bar',
            stack: 'key',
            barWidth: 20,
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {offset: 0, color: colors[0]},
                    {offset: 1, color: colors[1]},
                ]),
                borderRadius: [2, 2, 2, 2]
            },
            data,
        };
    }),
});

/**
 * 根据权限显示图表：场站时显示曲线图，否则显示柱状图
 * @param chartData 图表数据
 * @param chartTab 当前选中的统计周期维度
 * @returns 
 */
export const getChartOption = (chartData: ChartModel | null, chartTab: StatisticsChartTab) => chartData?.dimension === DimensionType.Depart ? getLineChartOption(chartData, chartTab) : getBarChartOption(chartData, chartTab)