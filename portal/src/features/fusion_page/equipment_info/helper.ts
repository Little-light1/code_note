/* eslint-disable global-require */
import { SortType } from "./types";

// 获取排序图标
export const getSortIcon = (type: SortType) => type === SortType.Up ? require('../images/sort_up.png'):require('../images/sort_down.png') 