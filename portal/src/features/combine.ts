/*
 * @Author: gxn
 * @Date: 2021-11-12 10:18:12
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-08-01 16:11:02
 * @Description: file content
 */
import {PageConfig} from '@gwaapp/ease';
import * as overview from './overview';
import * as role from './role';
import * as dataDictConfig from './data_dict_config';
import * as user from './user';
import * as organizationManagement from './organization_management'; // 组织机构管理

import * as demo from './demo';
import * as pages from './pages';
import * as frameConfig from './frame_config';
import * as account from './account'; // 企业账户管理

import * as productMaintenance from './product_maintenance'; // 应用维护

import * as userLabel from './user_label'; // 用户标签管理

import * as menuManagement from './menu_management'; // 菜单管理

import * as help from './help'; //  帮助文档

import * as noticeCenter from './notice_center'; //  信息中心
import * as waitDealIndex from './wait_deal/wait_deal_index'; //  待办任务
import * as waitDealHistory from './wait_deal/deal_index'; //  已办任务

import * as noticeCreate from './notice_create'; //  创建消息

import * as organizationTypeConfiguration from './organization_type_attribute_configuration'; // 菜单管理

import * as loginLogsView from './login_logs_view'; // 登录日志查看

import * as operationLogsView from './operation_logs_view'; // 操作日志查看

import * as abnormalLogsView from './abnormal_logs_view'; // 异常日志查看

import * as deviceRegister from './thing_connection/device_center/device_register'; // 物联接-设备中心-电场设备注册

import * as connectionManage from './thing_connection/device_center/connection_manage'; // 物联接-设备中心-连接管理

import * as connectorRegister from './thing_connection/device_center/connector_register'; // 物联接-设备中心-接入器注册

import * as infoModelConfig from './thing_connection/information_model_center/info_model_config'; // 物联接-设备中心-接入器注册

import * as infoModelConfig2 from './thing_connection/information_model_center/info_model_config_2'; // 物联接-设备中心-接入器注册

import * as infoModelEntry from './thing_connection/information_model_center/info_model_entry'; // 物联接-设备中心-接入器注册

import * as infoModelMapping from './thing_connection/information_model_center/info_model_mapping'; // 物联接-设备中心-接入器注册
import * as setQrcode from './set_qrcode'; // 二维码配置

import * as alarmExtension from './alarm_extension'; // 告警扩展配置

import * as alarmCenter from './alarm_center'; // 告警中心

import * as userConnectionStatus from './user_connection_status'; // 用户连接状态监测

import * as userAccessControl from './user_access_control'; // 用户访问控制
import * as fusionPage from './fusion_page'; // 融合页面呈现

import * as iframeOpen from './iframe_open'; // iframe内部打开页面
// 物联接-设备中心-接入器注册

export * as login from './login';
export * as notFound from './404';
export * as index from './index';
const combiner: PageConfig[] = [
    overview,
    role,
    dataDictConfig,
    demo,
    pages,
    user,
    organizationManagement,
    frameConfig,
    account,
    productMaintenance,
    userLabel,
    menuManagement,
    help,
    organizationTypeConfiguration,
    deviceRegister,
    connectionManage,
    connectorRegister,
    infoModelConfig,
    infoModelConfig2,
    infoModelEntry,
    infoModelMapping,
    noticeCenter,
    waitDealIndex,
    waitDealHistory,
    noticeCreate,
    loginLogsView,
    operationLogsView,
    abnormalLogsView, // setQrcode,
    setQrcode,
    alarmExtension,
    alarmCenter,
    userConnectionStatus,
    userAccessControl,
    fusionPage,
    iframeOpen,
];
export default combiner;
