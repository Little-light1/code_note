import {i18nIns} from '@/app/i18n';

const {t} = i18nIns;

export const staticColumns = [
    {
        title: t('电场名称'),
        dataIndex: 'farmName',
        key: 'farmName',
        width: 300,
        canResize: false,
        canHide: false,
        canDrag: false,
        canDrop: false,
    },
    {
        title: t('设备ID'),
        dataIndex: 'deviceId',
        key: 'deviceId',
        width: 150,
        canResize: false,
        canHide: false,
        canDrag: false,
        canDrop: false,
    },
    {
        title: t('设备名称'),
        dataIndex: 'deviceName',
        key: 'deviceName',
        width: 200,
        canResize: false,
        canHide: false,
        canDrag: false,
        canDrop: false,
    },
    {
        title: t('设备类型'),
        dataIndex: 'deviceType',
        key: 'deviceType',
        width: 200,
        canResize: false,
        canHide: false,
        canDrag: false,
        canDrop: false,
    },
    {
        title: t('型号'),
        dataIndex: 'deviceModel',
        key: 'deviceModel',
        width: 200,
        canResize: false,
        canHide: false,
        canDrag: false,
        canDrop: false,
    },
];
