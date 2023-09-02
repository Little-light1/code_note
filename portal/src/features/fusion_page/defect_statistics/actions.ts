import { AppThunk } from "@/app/runtime";
import { getDefectChartMonthData, getDefectChartYearData } from "@/services/fusion_page";
import { StatisticsChartTab } from "../types";


/**
 * 获取图表数据
 * @param id 页面属性
 * @param tab 统计维度
 * @returns
 */
export const getChartData =
 (id: string, tab: StatisticsChartTab): AppThunk =>
     async (dispatch, getState, {getPageSimpleActions}) => {
         const actions = getPageSimpleActions(id);
         dispatch(actions.set({
             defectChartData: null,
         }));
         // 获取登录名
         const {loginName} = JSON.parse(window.localStorage.getItem('userInfo') || '{}');
         const response = tab === StatisticsChartTab.ThisMonth ? (await getDefectChartMonthData(loginName)):(await getDefectChartYearData(loginName));
         const {data} = response.data;
         dispatch(actions.set({
             defectChartData: data || null,
         }));
     };

/**
 * 选择统计维度
 * @param id 页面id
 * @param value 统计维度
 * @returns
 */
export const handleRadioGroupChange =
 (id: string, value: StatisticsChartTab): AppThunk =>
     async (dispatch, _, {getPageSimpleActions}) => {
         const actions = getPageSimpleActions(id);

         dispatch(actions.set({
             defectChartTab: value
         }));
     };