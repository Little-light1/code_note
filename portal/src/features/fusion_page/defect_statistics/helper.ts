
import * as echarts from 'echarts';
import { nullToDoubleBar } from '../constant';
import { ChartModel, DimensionType } from './types';

/**
 * 获取曲线图配置项
 * @param chartData 图表数据源
 * @returns 
 */
const getLineChartOption = (chartData: ChartModel | null) => ({
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
        icon: 'rect',
        right: 24,
        itemHeight: 2,
        itemWidth: 12,
        itemGap: 20,
        textStyle: {
            color: '#FFFFFF',
            fontSize: 12
        }
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
        data: chartData?.names,
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
    series: [
        {
            name: '一类',
            data: chartData?.c1,
            type: 'line',
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {offset: 0, color: '#00FF60'},
                    {offset: 1, color: '#00FFBA'},
                ]),
            },
            smooth: true,
            showSymbol: false
        },
        {
            name: '二类',
            data: chartData?.c2,
            type: 'line',
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {offset: 0, color: '#00FFF0'},
                    {offset: 1, color: '#0498BE'},
                ]),
            },
            smooth: true,
            showSymbol: false
        },
        {
            name: '三类',
            data: chartData?.c3,
            type: 'line',
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {offset: 0, color: '#74CEFF'},
                    {offset: 1, color: '#005C9E'},
                ]),
            },
            smooth: true,
            showSymbol: false
        },
        {
            name: '四类',
            data: chartData?.c4,
            type: 'line',
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {offset: 0, color: '#FCE232'},
                    {offset: 1, color: '#FFAB54'},
                ]),
            },
            smooth: true,
            showSymbol: false
        },
        {
            name: '未处理',
            data: chartData?.c5,
            type: 'line',
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {offset: 0, color: '#FF74EA'},
                    {offset: 1, color: '#9E007F'},
                ]),
            },
            smooth: true,
            showSymbol: false
        }
    ]
});

/**
 * 获取状图图配置项
 * @param chartData 图表数据源
 * @returns 
 */
const getBarChartOption = (chartData: ChartModel | null) => ({
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
        icon: 'rect',
        right: 24,
        itemHeight: 12,
        itemWidth: 12,
        itemGap: 20,
        textStyle: {
            color: '#FFFFFF',
            fontSize: 12
        },
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
        data: chartData?.names,
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
    series: [
        {
            name: '一类',
            type: 'bar',
            stack: 'key',
            barWidth: 20,
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {offset: 0, color: '#00FF60'},
                    {offset: 1, color: '#00FFBA'},
                ]),
                borderRadius: [2, 2, 2, 2]
            },
            data: chartData?.c1
        },
        {
            name: '二类',
            type: 'bar',
            stack: 'key',
            barWidth: 20,
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {offset: 0, color: '#00FFF0'},
                    {offset: 1, color: '#0498BE'},
                ]),
                borderRadius: [2, 2, 2, 2]
            },
            data: chartData?.c2
        },
        {
            name: '三类',
            type: 'bar',
            stack: 'key',
            barWidth: 20,
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {offset: 0, color: '#74CEFF'},
                    {offset: 1, color: '#005C9E'},
                ]),
                borderRadius: [2, 2, 2, 2]
            },
            data: chartData?.c3
        },
        {
            name: '四类',
            type: 'bar',
            stack: 'key',
            barWidth: 20,
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {offset: 0, color: '#FCE232'},
                    {offset: 1, color: '#FFAB54'},
                ]),
                borderRadius: [2, 2, 2, 2]
            },
            data: chartData?.c4
        },
        {
            name: '未处理',
            type: 'bar',
            stack: 'key',
            barWidth: 20,
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {offset: 0, color: '#FF74EA'},
                    {offset: 1, color: '#9E007F'},
                ]),
                borderRadius: [2, 2, 2, 2]
            },
            data: chartData?.c5
        }
    ]
});

/**
 * 根据权限显示图表：场站时显示曲线图，否则显示柱状图
 * @param chartData 图表数据
 * @returns 
 */
export const getChartOption = (chartData: ChartModel | null) => chartData?.dimension === DimensionType.Depart ? getLineChartOption(chartData) : getBarChartOption(chartData)