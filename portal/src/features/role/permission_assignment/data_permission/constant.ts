import {ColumnsType} from 'antd/lib/table';
import {i18nIns} from '@/app/i18n';

const {t} = i18nIns;

export const CUSTOM_SCOPE = {
    title: t('自定义'),
    value: 3,
};
export const SCOPES = [
    {
        title: t('全部'),
        value: 0,
    }, // {
    //   title: '本级',
    //   value: 1,
    // },
    // {
    //   title: '本级及子级',
    //   value: 2,
    // },
    CUSTOM_SCOPE,
];
export const columns: ColumnsType<any> = [
    {
        title: t('设备类型'),
        dataIndex: 'leafTypeName',
        // 在数据中对应的属性
        key: 'leafTypeName',
        align: 'left',
        ellipsis: true,
    },
    {
        title: t('设备名称'),
        dataIndex: 'name',
        // 在数据中对应的属性
        key: 'name',
        align: 'left',
        ellipsis: true,
    },
    {
        title: t('设备型号'),
        dataIndex: 'deviceModel',
        // 在数据中对应的属性
        key: 'deviceModel',
        align: 'left',
        ellipsis: true,
    },
    {
        title: t('所属组织机构'),
        dataIndex: 'orgName',
        // 在数据中对应的属性
        key: 'orgName',
        align: 'left',
        ellipsis: true,
    },
];
export const SEPARATOR = '-$-';
export const ALL_SYSTEM = {
    code: 'all',
    id: 'all',
    name: t('全部'),
};
export const generateUniqueId = (systemCode: string, orgId: React.Key) =>
    `${systemCode}${SEPARATOR}${orgId}`;
