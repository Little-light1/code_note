import React from 'react';
import {ColumnsType} from 'antd/lib/table';
import {Button, Checkbox} from 'antd';
import {i18nIns} from '@/app/i18n';
import styles from './styles.module.scss';

const {t} = i18nIns;

const RESOURCE_TYPE = {
    card: t('卡片'),
    ST_BUTTON: t('按钮'),
};
export const dynamicColumns = ({resourceTypes}: any): ColumnsType<any> => [
    {
        title: t('资源名称'),
        dataIndex: 'name',
        // 在数据中对应的属性
        key: 'name',
        width: 100,
        align: 'center',
        ellipsis: true,
    },
    {
        title: t('权限标识'),
        dataIndex: 'code',
        key: 'code',
        width: 150,
        align: 'center',
        ellipsis: true,
    },
    {
        title: t('资源类型'),
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        ellipsis: true,
        render: (text: 'card' | 'ST_BUTTON') => RESOURCE_TYPE[text] || '',
        // filters: resourceTypes
        //   .filter(({type}: {type: 'card' | 'ST_BUTTON'}) => typeof RESOURCE_TYPE[type] !== 'undefined')
        //   .map(({type}: {type: 'card' | 'ST_BUTTON'}) => ({
        //     text: RESOURCE_TYPE[type],
        //     value: type,
        //   })),
        onFilter: (value, record) => record.type === value,
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => {
            const options = resourceTypes
                .filter(
                    ({type}: {type: 'card' | 'ST_BUTTON'}) =>
                        typeof RESOURCE_TYPE[type] !== 'undefined',
                )
                .map(({type}: {type: 'card' | 'ST_BUTTON'}) => ({
                    label: RESOURCE_TYPE[type],
                    value: type,
                }));
            return (
                <div className={styles.filter}>
                    <Checkbox.Group
                        className={styles.filterCheckbox}
                        options={options}
                        value={selectedKeys}
                        onChange={(keys: any[]) => {
                            setSelectedKeys(keys);
                        }}
                    />

                    <div className={styles.footer}>
                        <Button
                            size="small"
                            className={styles.commonButtonReset}
                            onClick={() => clearFilters && clearFilters()}
                        >
                            {t('重置')}
                        </Button>
                        <Button
                            size="small"
                            type="primary"
                            onClick={() =>
                                confirm({
                                    closeDropdown: true,
                                })
                            }
                        >
                            {t('确定')}
                        </Button>
                    </div>
                </div>
            );
        }, // filterDropdownVisible: filterVisible,
    },
];
