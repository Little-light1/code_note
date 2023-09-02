import { AppThunk } from "@/app/runtime";
import { getDataQualityCover, getDataQualityInfo } from "@/services/fusion_page";

/**
 * 获取数据质量评分数据
 * @param id 页面id
 * @returns
 */
export const getQualityInfoData =
 (id: string): AppThunk =>
     async (dispatch, getState, {getPageSimpleActions}) => {
         const actions = getPageSimpleActions(id);
         const {data} = await getDataQualityInfo();
         dispatch(actions.set({ 
             dataQualityInfoData: data || null,
         }));
     };

/**
 * 获取数据质量覆盖数据
 * @param id 页面id
 * @returns
 */
export const getQualityCoverData =
 (id: string): AppThunk =>
     async (dispatch, getState, {getPageSimpleActions}) => {
         const actions = getPageSimpleActions(id);
         const {data} = await getDataQualityCover();
         dispatch(actions.set({ 
             dataQualityCoverData: data || null,
         }));
     };

/**
 * 图表点击事件
 * @param id 页面属性id
 * @param value 统计维度
 * @returns
 */
export const handleChartClick =
 (id: string, value: number | undefined): AppThunk =>
     async (dispatch, _, {getPageSimpleActions}) => {
         const actions = getPageSimpleActions(id);
         if (typeof value === 'undefined') {
             return;
         }
         dispatch(actions.set({
             dataQualityChartIndex: value
         }));
     };