import { AppThunk } from "@/app/runtime";
import { getRealTimeData } from "@/services/fusion_page";
import { PageProps } from "@gwaapp/ease";
import _ from "lodash";
import moment from "moment";
import { DataFlowChartModel, DataFlowModel, DataFlowType } from "./types";


const getDataFlowUnitInfo = (maxValue: number) => {
    let unit = 'B';
    let num = 1;

    if (maxValue > 1073741824) {
        unit = 'GB';
        num = 1073741824;
    } else if (maxValue > 1048576) {
        unit = 'MB';
        num = 1048576;
    } else if (maxValue > 1024) {
        unit = 'KB';
        num = 1024;
    }
    return {
        unit,
        num
    }
}

/**
 * 获取数据质量数据
 * @param id 页面id
 * @returns
 */
export const getChartData =
 (id: string, tab: DataFlowType): AppThunk =>
     async (dispatch, getState, {getPageSimpleActions}) => {
         const actions = getPageSimpleActions(id);
         dispatch(actions.set({ 
             dataFlowData: null,
         }));  
         const params = {
             type: tab
         };
         const {data} = await getRealTimeData(params);
         const responseData = data as DataFlowModel;
         if (tab === DataFlowType.DataFlow) {
             const maxHistoryValue = _.max(responseData.historyData?.实时数据量?.map((item) => parseInt(item.value, 10))) || 0;
             const historyUnitInfo = getDataFlowUnitInfo(maxHistoryValue/10);
             
             const maxRealTimeValue = _.max(responseData.realTimeData?.map((item) => parseInt(item.value, 10))) || 0;
             const realTimeUnitInfo = getDataFlowUnitInfo(maxRealTimeValue/10);

             const chartData: DataFlowChartModel = {
                 historyData: {
                     data: responseData.historyData?.实时数据量?.map((item) => ({
                         dateTime: moment(item.dateStr).format('MM/DD'),
                         value: parseInt(item.value, 10) > 0 ? parseFloat((parseInt(item.value, 10) / historyUnitInfo.num).toFixed(2)) : 0,
                     })) || null,
                     unit: historyUnitInfo.unit
                 },
                 realTimeData: {
                     data: responseData.realTimeData?.map((item) => ({
                         dateTime: moment(item.dateStr).format('HH:mm'),
                         value: parseInt(item.value, 10) > 0 ? parseFloat((parseInt(item.value, 10) / 10 / realTimeUnitInfo.num).toFixed(2)) : 0,
                     })) || null,
                     unit: `${realTimeUnitInfo.unit}/min` 
                 },
             }
             dispatch(actions.set({ 
                 dataFlowData: chartData,
             })); 
             
         } else {
             const chartData: DataFlowChartModel = {
                 historyData: {
                     data: responseData.historyData?.实时数据量?.map((item) => ({
                         dateTime: moment(item.dateStr).format('MM/DD'),
                         value: parseInt(item.value, 10), 
                     })) || null,
                     unit: '' 
                 },
                 realTimeData: {
                     data: responseData.realTimeData?.map((item) => ({
                         dateTime: moment(item.dateStr).format('HH:mm'),
                         value: parseInt(item.value, 10),  
                     })) || null,
                     unit: ''
                 }
             }
             dispatch(actions.set({ 
                 dataFlowData: chartData,
             }));  
         }
     };

/**
 * 选择数据流量tab类型
 * @param props 页面属性
 * @param value tab类型
 * @returns
 */
export const handleTabChange =
 (props: PageProps, value: DataFlowType): AppThunk =>
     async (dispatch, _, {getPageSimpleActions}) => {
         const {id} = props;
         const actions = getPageSimpleActions(id);

         dispatch(actions.set({
             dataFlowTab: value
         }));
     };