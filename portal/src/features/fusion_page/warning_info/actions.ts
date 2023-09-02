import { AppThunk } from "@/app/runtime";
import { getFuulTaskGroupNumByRule, getTaskNumOverStateGroupByAlarmGrade } from "@/services/fusion_page";
import { EnergyChartTab } from "../types";
import { WarningTimeChartTab } from "./types";

/**
 * 获取任务数数据
 * @param id 页面id
 * @returns
 */
export const getTaskNumData =
 (id: string, timeTab: WarningTimeChartTab, energyTab: EnergyChartTab): AppThunk =>
     async (dispatch, getState, {getPageSimpleActions}) => {
         const actions = getPageSimpleActions(id);
         const params = {
             // 死值
             dataType: 0,
             // 枚举值，all-所有（默认，可不传）, last12Month-近12月, thisMonth-本月, thisWeek-本周, today-今日
             timeType: timeTab,
             // 风机光伏切换，wtType或者proType都可以，0表示风机，4表示光伏
             wtType: energyTab === EnergyChartTab.Wind ? 0:4,
         };
         const {data} = await getTaskNumOverStateGroupByAlarmGrade(params);
         dispatch(actions.set({ 
             warningTaskInfo: data || null,
         }));
     };

/**
 * 获取预警数量Top榜单
 * @param id 页面id
 * @returns
 */
export const getWarningTopListData =
 (id: string, energyTab: EnergyChartTab): AppThunk =>
     async (dispatch, getState, {getPageSimpleActions}) => {
         const actions = getPageSimpleActions(id);
         const params = {
             // 0正序，1倒序
             sortType: 1,
             // 风机光伏切换，wtType或者proType都可以，0表示风机，4表示光伏
             wtType: energyTab === EnergyChartTab.Wind ? 0:4,
         };
         const {data} = await getFuulTaskGroupNumByRule(params);
         dispatch(actions.set({ 
             warningTopList: data || null,
         }));
     };

/**
 * 选择时间统计维度
 * @param id 页面id
 * @param value 统计维度
 * @returns
 */
export const handleTimeRadioGroupChange =
 (id: string, value: WarningTimeChartTab): AppThunk =>
     async (dispatch, _, {getPageSimpleActions}) => {
         const actions = getPageSimpleActions(id);
         dispatch(actions.set({
             warningTimeTab: value
         }));
     };

/**
 * 选择能源统计维度
 * @param id 页面id
 * @param value 统计维度
 * @returns
 */
export const handleEnergyRadioGroupChange =
 (id: string, value: EnergyChartTab): AppThunk =>
     async (dispatch, _, {getPageSimpleActions}) => {
         const actions = getPageSimpleActions(id);
         dispatch(actions.set({
             warningEnergyTab: value
         }));
     };