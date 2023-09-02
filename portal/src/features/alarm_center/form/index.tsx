/*
 * @Author: shimmer
 * @Date: 2022-05-30 10:38:20
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-08-24 18:56:38
 *
 */
import React, {FC, useMemo, useEffect, useRef} from 'react';
import {
    FormAttr,
    FieldItem,
    ActionItem,
    FormItemType,
    FormActionItemType,
} from '@components/FormConfig/types';
import moment from 'moment';
import FormConfig from '@/components/FormConfig/index';
import {useAppDispatch} from '@/app/runtime';
import {PageProps} from '@gwaapp/ease';
import {FormInstance} from 'antd';
import {useTranslation} from 'react-i18next';
import styles from '../styles.module.scss';
import {thisMonth} from '../constant';
import {getAlarmCenterList, saveFormValue} from '../actions';

const FormPage: FC<{
    props: PageProps;
    alarmType: {
        text: string;
        value: any;
    }[];
    alarmLevel: {
        text: string;
        value: any;
    }[];
    formValue: any;
    isFirstLoad: boolean;
}> = ({props, alarmType, alarmLevel, formValue, isFirstLoad}) => {
    const dispatch = useAppDispatch();
    const {id} = props;
    const {t} = useTranslation();
    const ref = useRef<{
        formRef: FormInstance;
    } | null>(null);
    const formRef = ref.current?.formRef;
    useEffect(() => {
        if (isFirstLoad && formRef) {
            formRef.submit();
        }
    }, [formRef, isFirstLoad]); // 表单配置项

    const items = useMemo(
        (): FieldItem[] => [
            {
                key: 'noticeContent',
                type: FormItemType.Input,
                label: t('告警内容'),
                width: '180px',
                defaultValue: '',
                placeholder: t('请输入'),
            },
            {
                key: 'noticeType',
                type: FormItemType.Select,
                label: t('告警类型'),
                width: '160px',
                defaultValue: '',
                option: alarmType,
            },
            {
                key: 'rangeDate',
                type: FormItemType.RangePicker,
                label: t('告警产生时间'),
                rules: [
                    {
                        required: true,
                        message: t('请选择日期范围'),
                    },
                ],
                defaultValue: thisMonth,
                disabledDate: (currentDate: any) => currentDate >= moment(),
            },
            {
                key: 'noticeLevel',
                type: FormItemType.Select,
                label: t('告警等级'),
                width: '120px',
                defaultValue: '',
                option: alarmLevel,
            },
        ],
        [alarmLevel, alarmType, t],
    ); // 表单操作项

    const actionItems = useMemo(
        (): ActionItem[] => [
            {
                key: 'submit',
                actionType: FormActionItemType.Submit,
                text: t('查询'),
            },
        ],
        [t],
    ); // 表单设置

    const config: FormAttr = {
        key: 'key',
        formItem: items,
        actionItem: actionItems,
        layout: 'inline',
        requiredMark: false,
        initialValues: {...formValue},
        onValuesChange: (_, allValues) => {
            dispatch(saveFormValue(props, allValues));
        },
        onFinish: (values) => {
            if (isFirstLoad) {
                dispatch(getAlarmCenterList(props, values, false, false));
            } else {
                dispatch(getAlarmCenterList(props, values, false, true));
            }
        },
    };
    return (
        <div className={styles.searchBar}>
            <FormConfig config={config} ref={ref} />
        </div>
    );
};

export default FormPage;
