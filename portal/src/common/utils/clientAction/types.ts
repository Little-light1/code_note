/**
 * 行为记录类型
 * firstTiming: 第一次关键点客户端信息
 * performance: 内存信息
 * pageEnter: 页面进入
 * pageExit: 页面离开
 * pageStay: 页面停留
 * click: 用户点击
 * log: console.log
 * info: console.info
 * warn: console.warn
 * error: console.error
 */
// export type ActionType =
//     | 'firstTiming'
//     | 'performance'
//     | 'pageEnter'
//     | 'pageExit'
//     | 'pageStay'
//     | 'beforeLoadApp'
//     | 'afterLoadApp'
//     | 'beforeMountApp'
//     | 'afterMountApp'
//     | 'beforeUnMountApp'
//     | 'afterUnMountApp'
//     | 'beforeInitApolloRuntime'
//     | 'afterInitApolloRuntime'
//     | 'beforeInitApolloView'
//     | 'afterInitApolloView'
//     | 'click'
//     | 'log'
//     | 'error'
//     | 'warn'
//     | 'info';
export type ActionType = String; // 行为

export interface Action {
  system?: string; // 系统

  module?: string; // 模块

  id: string; // 行为唯一ID

  name?: string; // 行为名称

  desc?: string; // 行为描述

  action?: ActionType; // 行为类型

  extra?: any; // 附加信息

  result?: 'success' | 'fail'; // 行为结果

  wait?: boolean; // 是否等待

  waitingTime?: number; // 等待时长

  position?: string[] | string; // position: 位置描述

} // 用户行为

export interface UserAction extends Action {
  module: string;
} // 记录行为

export interface RecordAction extends Action {
  time: number;
  timeStr: string;
} // 等待行为

export interface WaitingAction extends Action {
  time: number;
  expirationTime?: number;
} // 上报策略 立即/间隔

export type ReportStrategy = 'immediately' | 'interval'; // type LogErrorProps = {msg?: string; error?: Error};
// type LogType = 'action' | 'error';
// type Error = {time: string};