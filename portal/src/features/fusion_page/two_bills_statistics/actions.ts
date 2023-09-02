import { AppThunk } from "@/app/runtime";
import { getTicketChartData } from "@/services/fusion_page";
import { StatisticsChartTab } from "../types";


/**
 * 获取图表数据
 * @param id 页面id
 * @returns
 */
export const getChartData =
 (id: string): AppThunk =>
     async (dispatch, getState, {getPageSimpleActions}) => {
         const actions = getPageSimpleActions(id);
         // 获取当前用户登录名
         const {loginName} = JSON.parse(window.localStorage.getItem('userInfo') || '{}');
         const response = await getTicketChartData(loginName);
         const {data} = response.data;
         dispatch(actions.set({
             twoBillsChartData: data || null,
         }))
     };

/**
 * 选择统计维度
 * @param props 页面属性
 * @param value 统计维度
 * @returns
 */
export const handleRadioGroupChange =
 (id: string, value: StatisticsChartTab): AppThunk =>
     async (dispatch, _, {getPageSimpleActions}) => {
         const actions = getPageSimpleActions(id);

         dispatch(actions.set({
             twoBillsChartTab: value
         }));
     };