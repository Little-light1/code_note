import * as echarts from 'echarts';
import {nullToDoubleBar} from '../constant';
import {ChartItemModel} from './types';
import {EnergyChartTab} from '../types';

enum SeriesId {
    // 理论发电量
    TheoreticalPowerGeneration = 'theoreticalPowerGeneration',
    // 上网电量
    OnGridEnergy = 'onGridEnergy',
    // 场站系统效率PR
    EnergyAvailability = 'energyAvailability',
}

export const getChartOption = (
    chartData: ChartItemModel[] | null,
    energyTab: EnergyChartTab,
) => ({
    tooltip: {
        trigger: 'axis',
        confine: true,
        borderWidth: 0,
        backgroundColor: 'rgba(1, 10, 14, 0.9000)',
        axisPointer: {
            type: 'shadow',
        },
        formatter: (params: any) => {
            // 获取xAxis data中的数据
            const dataStr = `<div style='color:#FFFFFF;font-size:16px;margin-bottom:10px'>${params[0].axisValue}</div>`;
            let itemStr = '';
            params.forEach((item: any) => {
                let unit = '';
                itemStr += `<div style='margin-bottom:10px'>`;
                if (item.seriesId === SeriesId.TheoreticalPowerGeneration) {
                    unit = '万kWh';
                    itemStr += `<span style='display:inline-block;width:12px;height:12px;background-image:linear-gradient(to right, #00FF60 , #00FFBA);vertical-align:middle' /></span>`;
                } else if (item.seriesId === SeriesId.OnGridEnergy) {
                    unit = '万kWh';
                    itemStr += `<span style='display:inline-block;width:12px;height:12px;background-color:transparent;border: 1px solid #00FFFF;vertical-align:middle' /></span>`;
                } else {
                    unit = '%';
                    itemStr += `<span style='display:inline-block;width:12px;height:2px;background-color:#FC00FC;vertical-align:middle' /></span>`;
                }
                itemStr += `<span style='margin-left:5px;font-size:14px;color:#FFFFFF;'>${
                    item.seriesName
                }</span>
                            <div style='float:right'>
                                <span style='margin-left:20px;color:#00E4FF;font-size:16px;'>${nullToDoubleBar(
                                    item.data,
                                )}</span>
                                <span style='margin-left:5px'>${unit}</span>
                            </div>
                            </div>`;
            });
            const containerStr = `<div style='display:flex;flex-direction:column;flex-wrap:wrap;'>${itemStr}</div>`;
            return `<div style='box-sizing: border-box;'>${dataStr}${containerStr}</div>`;
        },
    },
    dataZoom: [
        {
            type: 'slider',
            show: true,
            startValue: 0,
            endValue: 9,
            height: 20,
            borderColor: 'transparent',
            backgroundColor: '#404C57',
            showDataShadow: false,
            showDetail: false,
            brushSelect: false,
            fillerColor: 'rgba(135, 134, 134, 0.4)',
        },
    ],
    xAxis: [
        {
            type: 'category',
            data: chartData?.map((item) => item.orgName),
            axisPointer: {
                type: 'shadow',
            },
            axisLabel: {
                color: '#FFFFFF',
                fontSize: 12,
            },
        },
    ],
    yAxis: [
        {
            type: 'value',
            name: '万kWh',
            min: 0,
            // minInterval: 100,
            axisLabel: {
                color: '#FFFFFF',
                fontSize: 12,
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    color: '#7E7E80',
                },
            },
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            nameTextStyle: {
                color: '#FFFFFF',
            },
            splitNumber: 5,
        },
        {
            type: 'value',
            name: '%',
            min: 0,
            // minInterval: 100,
            axisLabel: {
                color: '#FFFFFF',
                fontSize: 12,
            },
            splitLine: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            nameTextStyle: {
                color: '#FFFFFF',
            },
        },
    ],
    legend: {
        right: 24,
        itemHeight: 12,
        itemWidth: 12,
        itemGap: 20,
        textStyle: {
            color: '#FFFFFF',
            fontSize: 12,
        },
    },
    grid: {
        top: 60,
        left: 60,
        right: 100,
        show: false,
    },
    series: [
        {
            id: SeriesId.TheoreticalPowerGeneration,
            name: '理论发电量',
            type: 'bar',
            barWidth: 50,
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {offset: 0, color: '#00FF60'},
                    {offset: 1, color: '#00FFBA'},
                ]),
            },
            data: chartData?.map((item) => item.wtTheoryActivePower),
        },
        {
            id: SeriesId.OnGridEnergy,
            name: '上网电量',
            type: 'bar',
            barWidth: 58,
            barGap: '-108%',
            itemStyle: {
                color: 'transparent',
                borderColor: '#00FFFF',
                borderWidth: 1,
            },
            data: chartData?.map((item) => item.onElec),
            z: -1,
        },
        {
            id: SeriesId.EnergyAvailability,
            name:
                energyTab === EnergyChartTab.Wind
                    ? '综合能量可利用率'
                    : '场站系统效率PR',
            type: 'line',
            yAxisIndex: 1,
            lineStyle: {
                color: '#FC00FC',
            },
            itemStyle: {
                color: '#FFFFFF',
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: 'rgba(255, 0, 255, 0.4)',
                    },
                    {
                        offset: 1,
                        color: 'rgba(34, 69, 125, 0.1)',
                    },
                ]),
            },
            data: chartData?.map((item) => item.energyAvailability),
            z: -2,
        },
    ],
});
