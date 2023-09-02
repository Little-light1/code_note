import axios from 'axios';
import request, {prefix} from '../common';

// 获取两票统计数据
export const getTicketChartData = (loginName: string) => 
    axios({
        url: `/am6/api/open/ticketCount/ticketChartData/${loginName}`,
        method: 'get',
    });

// 获取缺陷统计月数据
export const getDefectChartMonthData = (loginName: string) => 
    axios({
        url: `/am6/api/open/defectCount/defectChartMonthData/${loginName}`,
        method: 'get',
    });

// 获取缺陷统计月数据
export const getDefectChartYearData = (loginName: string) => 
    axios({
        url: `/am6/api/open/defectCount/defectChartYearData/${loginName}`,
        method: 'get',
    });


// 获取设备信息健康度数据
export const getWtHealthNumByCond = (data: any) => 
    request<any>({
        url: '/task/xjbs/getWtHealthNumByCond',
        method: 'post',
        showError: false,
        data,
    });

// 获取设备信息完结率数据
export const getOverRateByCond = (data: any) => 
    request<any>({
        url: '/task/xjbs/getOverRateByCond',
        method: 'post',
        showError: false,
        data,
    });

// 获取设备信息准确率数据
export const getRightRateByCond = (data: any) => 
    request<any>({
        url: '/task/xjbs/getRightRateByCond',
        method: 'post',
        showError: false,
        data,
    });

// 获取预警信息任务数数据
export const getTaskNumOverStateGroupByAlarmGrade = (data: any) => 
    request<any>({
        url: '/task/biz/taskCount/getTaskNumOverStateGroupByAlarmGrade',
        method: 'post',
        showError: false,
        data,
    });

// 获取预警信息任务数数据
export const getFuulTaskGroupNumByRule = (data: any) => 
    request<any>({
        url: '/task/biz/taskCount/getFuulTaskGroupNumByRule',
        method: 'post',
        showError: false,
        data,
    })

// 获取场站能效分析数据
export const getSiteEnergyChart = (data: any) => 
    request<any>({
        url: prefix('/fusion/siteEnergyChart', 'bi'),
        method: 'post',
        showError: false,
        data,
    });

// 获取设备能效分析数据
export const getDeviceEnergyChart = (data: any) => 
    request<any>({
        url: prefix('/fusion/deviceEnergyChart', 'bi'),
        method: 'post',
        showError: false,
        data,
    });

// 获取数据质量数据
export const getRealTimeData = (params: any) => 
    request<any>({
        url: prefix('/overview/datascale/getRealTimeData', 'bigdataplat'),
        method: 'get',
        params,
        showError: false,
    });

// 获取数据质量数据
export const getDataQualityInfo = () => 
    request<any>({
        url: prefix('/overview/dataquality/getInfo', 'bigdataplat'),
        method: 'get',
        showError: false,
    });

// 获取数据质量覆盖数据
export const getDataQualityCover = () => 
    request<any>({
        url: prefix('/overview/dataquality/cover', 'bigdataplat'),
        method: 'get',
        showError: false,
    });