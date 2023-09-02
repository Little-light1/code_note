import { AppThunk } from "@/app/runtime";
import { getOverRateByCond, getRightRateByCond, getWtHealthNumByCond } from "@/services/fusion_page";
import { EnergyChartTab } from "../types";
import { SortType } from "./types";


/**
 * 获取健康度数据
 * @param id 页面id
 * @param energyTab 能源类型
 * @param sortType 排序类型
 * @returns
 */
export const getHealthData =
 (id: string, energyTab: EnergyChartTab, sortType: SortType): AppThunk =>
     async (dispatch, getState, {getPageSimpleActions}) => {
         const actions = getPageSimpleActions(id);
         const params = {
             // 0正序，1倒序
             sortType: sortType === SortType.Down ? 1:0,
             // 风机光伏切换，wtType或者proType都可以，0表示风机，4表示光伏
             proType: energyTab === EnergyChartTab.Wind ? 0:4,
         };
         const {data} = await getWtHealthNumByCond(params);
         dispatch(actions.set({ 
             deviceHealthyData: data || null,
         }));
     };

/**
 * 切换健康度排序
 * @param id 页面id
 * @param value 排序类型
 * @returns
 */
export const handleHealthySortChange =
 (id: string, value: SortType): AppThunk =>
     async (dispatch, _, {getPageSimpleActions}) => {
         const actions = getPageSimpleActions(id);
         dispatch(actions.set({
             deviceHealthySort: value
         }));
     };

/**
 * 获取完结率数据
 * @param id 页面id
 * @param energyTab 能源类型
 * @param sortType 排序类型
 * @returns
 */
export const getCompletionRateData =
 (id: string, energyTab: EnergyChartTab, sortType: SortType): AppThunk =>
     async (dispatch, getState, {getPageSimpleActions}) => {
         const actions = getPageSimpleActions(id);
         const params = {
             // 0正序，1倒序
             sortType: sortType === SortType.Down ? 1:0,
             // 风机光伏切换，wtType或者proType都可以，0表示风机，4表示光伏
             proType: energyTab === EnergyChartTab.Wind ? 0:4,
         };
         const {data} = await getOverRateByCond(params);
         dispatch(actions.set({ 
             deviceCompletionRateData: data || null,
         }));
     };

/**
 * 切换完结率排序
 * @param id 页面id
 * @param value 排序类型
 * @returns
 */
export const handleCompletionRateSortChange =
 (id: string, value: SortType): AppThunk =>
     async (dispatch, _, {getPageSimpleActions}) => {
         const actions = getPageSimpleActions(id);
         dispatch(actions.set({
             deviceCompletionRateSort: value
         }));
     };

/**
 * 获取准确率数据
 * @param id 页面id
 * @param energyTab 能源类型
 * @param sortType 排序类型
 * @returns
 */
export const getAccuracyData =
 (id: string, energyTab: EnergyChartTab, sortType: SortType): AppThunk =>
     async (dispatch, getState, {getPageSimpleActions}) => {
         const actions = getPageSimpleActions(id);
         const params = {
             // 0正序，1倒序
             sortType: sortType === SortType.Down ? 1:0,
             // 风机光伏切换，wtType或者proType都可以，0表示风机，4表示光伏
             proType: energyTab === EnergyChartTab.Wind ? 0:4,
         };
         const {data} = await getRightRateByCond(params);
         dispatch(actions.set({ 
             deviceAccuracyData: data || null,
         }));
     };

/**
 * 切换准确率率排序
 * @param id 页面id
 * @param value 排序类型
 * @returns
 */
export const handleAccuracySortChange =
 (id: string, value: SortType): AppThunk =>
     async (dispatch, _, {getPageSimpleActions}) => {
         const actions = getPageSimpleActions(id);
         dispatch(actions.set({
             deviceAccuracySort: value
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
             deviceEnergyTab: value
         }));
     };