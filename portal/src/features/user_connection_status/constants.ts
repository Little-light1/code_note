import {i18nIns} from '@/app/i18n';
import {ConnectionStatus} from './types';

const {t} = i18nIns;

export const PageTitle = '用户连接状态监测';
export const PageKey = 'userConnectionStatus'; // 初始默认加载页码

export const InitialPageNum = 1; // 初始默认加载条数

export const InitialPageSize = 20;
/**
 * 空值转换为 --
 * @param value
 * @returns
 */

export const nullToDoubleBar = (value: any): any => value || '--';

/**
 * 获取连接状态值
 * @returns
 */

export const getConnectionStatusValues = () => [
    {
        // 全部
        title: t('全部'),
        key: ConnectionStatus.All,
    },
    {
        // 在线
        title: t('在线'),
        key: ConnectionStatus.Online,
    },
    {
        // 离线
        title: t('离线'),
        key: ConnectionStatus.Offline,
    },
];
