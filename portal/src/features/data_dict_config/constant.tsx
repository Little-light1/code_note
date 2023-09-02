import React from 'react';
import {ColumnsType} from 'antd/lib/table';
import {Switch} from 'antd';
import {DICT_TYPES} from '@/common/constant';
import {Events} from '@/common/events';
import PortalIcon from '@/components/icon';
import styles from './styles.module.scss';
import {LogActionID} from './types';

export const UPDATE_MODAL_ID = 'dataDictConfigModal';
export const dynamicColumns = ({
    dispatch,
    openModal,
    props,
    t,
    updateEnable,
    batchDelete,
    trigger,
}: any): ColumnsType<any> => [
    {
        title: t('字典编码'),
        // 字典编码
        dataIndex: 'dictdataCode',
        key: 'dictdataCode',
        ellipsis: true,
    },
    {
        title: t('字典项名称'),
        // 字典项名称
        dataIndex: 'dictdataName',
        key: 'dictdataName',
        ellipsis: true,
    },
    {
        title: t('字典项值'),
        // 字典项值
        dataIndex: 'dictdataValue',
        key: 'dictdataValue',
        ellipsis: true,
    },
    {
        title: t('所属分类'),
        // 所属分类
        dataIndex: 'dicttypeName',
        key: 'dicttypeName',
        ellipsis: true,
    },
    {
        title: t('字典项描述'),
        // 字典项描述
        dataIndex: 'dictdataDesc',
        key: 'dictdataDesc',
        ellipsis: true,
    },
    {
        title: t('顺序'),
        // 顺序
        dataIndex: 'dictdataSort',
        key: 'dictdataSort',
        ellipsis: true,
    },
    {
        title: t('标识'),
        // 标识
        dataIndex: 'dictdataMark',
        key: 'dictdataMark',
        ellipsis: true,
    },
    {
        title: t('状态'),
        // 状态
        dataIndex: 'dictdataIsenabled',
        key: 'dictdataIsenabled',
        align: 'center',
        width: 150,
        render: (text: 0 | 1 = 0, record: any) => (
            <Switch
                checked={!!text}
                checkedChildren={t('启用')}
                unCheckedChildren={t('禁用')}
                onChange={(value) =>
                    dispatch(updateEnable(props, record, value)).then(() =>
                        trigger(Events.update_data_dict),
                    )
                }
                action={{
                    id: 'modifyDictStatus',
                    module: props.id,
                    position: [props.menu?.menuName ?? '', t('状态')],
                    action: 'modify',
                    wait: true,
                }}
            />
        ),
    },
    {
        title: t('操作'),
        // 操作
        dataIndex: 'operations',
        key: 'operations',
        render: (text: string, record: any) => (
            <div className={styles.operations}>
                {/* 这里暂时隐藏, 100需求中不存在字典项下挂字典项情况 */}
                {/* <PlusOutlined
      onClick={() => {
      openModal(UPDATE_MODAL_ID, {
      type: 'add',
      node: record,
      targetType: DICT_TYPES.item.key,
      selectedNodeType: DICT_TYPES.item.key,
      });
      }}
      /> */}

                <PortalIcon
                    iconClass="icon-portal-edit"
                    className={styles.commonOperationIcon}
                    title={t('编辑')}
                    action={{
                        id: LogActionID.ModifyDict,
                        module: props.id,
                        position: [
                            props.menu?.menuName ?? '',
                            t('编辑'),
                            t('保存'),
                        ],
                        action: 'modify',
                        wait: true,
                    }}
                    onClick={() =>
                        openModal(UPDATE_MODAL_ID, {
                            type: 'edit',
                            node: record,
                            targetTypes: [DICT_TYPES.item.key],
                            selectedNodeType: DICT_TYPES.item.key,
                        })
                    }
                />

                <PortalIcon
                    iconClass="icon-portal-delete"
                    className={styles.commonOperationIcon}
                    disabled={record.dictdataIsenabled === 1}
                    title={
                        record.dictdataIsenabled === 1
                            ? t('启用状态下数据不可删除')
                            : t('删除')
                    }
                    action={{
                        id: LogActionID.DeleteDict,
                        module: props.id,
                        position: [
                            props.menu?.menuName ?? '',
                            t('删除'),
                            t('确定'),
                        ],
                        action: 'delete',
                        wait: true,
                    }}
                    onClick={() => {
                        dispatch(
                            batchDelete(props, record, DICT_TYPES.item.key),
                        ).then(() => trigger(Events.update_data_dict));
                    }}
                />
            </div>
        ),
    },
];
