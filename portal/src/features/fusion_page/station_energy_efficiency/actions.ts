import { AppThunk } from "@/app/runtime";
import { getSiteEnergyChart } from "@/services/fusion_page";
import _ from "lodash";
import { ChartSortType, EnergyChartTab, StatisticsChartTab } from "../types";

/**
 * 图表排序变更
 * @param id 页面id
 * @param value
 * @returns
 */
export const handleChartSortChange =
 (id: string, value: ChartSortType): AppThunk =>
     async (dispatch, getState, {getPageSimpleActions, getPageState}) => {
         const {stationChartData} = getPageState(getState(), id);
         const actions = getPageSimpleActions(id);
         const tmpChartData = stationChartData?.map((item: any) => ({
             ...item,
             wtTheoryActivePower: item.wtTheoryActivePower && Number(item.wtTheoryActivePower),
         }))
         let data = tmpChartData;
         // 根据理论发电量排序
         const sortBy = 'wtTheoryActivePower';
         if (value === ChartSortType.asc) {
             data = _.orderBy(tmpChartData, [sortBy], ['asc']);
         } else if (value === ChartSortType.desc) {
             data = _.orderBy(tmpChartData, [sortBy], ['desc']);
         }
         dispatch(actions.set({
             stationChartSort: value,
             stationChartSortData: data
         }));
     };

/**
 * 获取图表数据
 * @param id 页面id
 * @returns
 */
export const getChartData =
 (id: string, timeTab: StatisticsChartTab, energyTab: EnergyChartTab): AppThunk =>
     async (dispatch, getState, {getPageSimpleActions, getPageState}) => {
         const {stationChartSort} = getPageState(getState(), id);
         const actions = getPageSimpleActions(id);
         dispatch(actions.set({ 
             stationChartData: null,
             stationChartSortData: null,
         }));
         const params = {
             // 汇总时间，1-本年，3-本月
             dimTime: timeTab === StatisticsChartTab.ThisMonth ? 3:1,
             // 能源类型,0-风电，1-光伏
             energyType: energyTab === EnergyChartTab.Wind ? 0:1,
         };
         const {data} = await getSiteEnergyChart(params);
         dispatch(actions.set({ 
             stationChartData: data || null,
         }));
         dispatch(handleChartSortChange(id, stationChartSort));
     };

/**
 * 选择时间统计维度
 * @param id 页面id
 * @param value 统计维度
 * @returns
 */
export const handleTimeRadioGroupChange =
 (id: string, value: StatisticsChartTab): AppThunk =>
     async (dispatch, getState, {getPageSimpleActions}) => {
         const actions = getPageSimpleActions(id);
         dispatch(actions.set({
             stationTimeTab: value
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
     async (dispatch, getState, {getPageSimpleActions}) => {
         const actions = getPageSimpleActions(id);
         dispatch(actions.set({
             stationEnergyTab: value
         }));
     };