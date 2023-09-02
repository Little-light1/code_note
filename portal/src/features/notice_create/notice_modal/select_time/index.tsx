/*
 * @Author: zhangzhen
 * @Date: 2022-11-21 16:20:07
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-12-05 17:16:51
 *
 */
import React, {useRef} from 'react';
import {DatePicker, FormInstance, message} from 'antd';
import {shallowEqual} from 'react-redux';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {Modal, useModal, PageProps, useAction} from '@gwaapp/ease';
import {useTranslation} from 'react-i18next';
import {closeModal} from '@/components/modal';
import dayjs from 'dayjs';
import * as noticeService from '@services/notice_center';
import {RangePickerProps} from 'antd/lib/date-picker';
import {SELECT_TIME_MODAL_ID} from './constant';
import {UPDATE_MODAL_ID} from '../../constant';

interface IProps {
    addModalId: string;
    pageProps: PageProps;
}
const SelectTime = ({addModalId, pageProps}: IProps) => {
    const {id} = pageProps;
    const {state} = useModal();
    const {type: modalType} = state[addModalId] || {};
    const {t} = useTranslation();
    const {getPageSimpleActions} = useAction();
    const actions = getPageSimpleActions(id);
    const dispatch = useAppDispatch();
    const {sendTime, paramsTime} = useAppSelector(
        (state) => state[id],
        shallowEqual,
    );
    const actionI18n = modalType === 'add' ? t('新建') : t('编辑');
    const onChange = (value) => {
        dispatch(actions.set({sendTime: value.format('YYYY-MM-DD HH:mm:ss')}));
    };

    // eslint-disable-next-line arrow-body-style
    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Can not select days before today
        return current && current < dayjs().startOf('day');
    };

    const onOk = () => {
        if (!sendTime) {
            return;
        }
        if (dayjs(sendTime) <= dayjs()) {
            message.error(t('时间必须大于当前时间'));
            return;
        }
        noticeService
            .createSendBoxMsg({...paramsTime, msgSendTime: sendTime})
            .then((res) => {
                const {code} = res;

                if (code === '200') {
                    message.info(t('通知公告已定时发送'));
                    dispatch(closeModal(SELECT_TIME_MODAL_ID));
                    dispatch(closeModal(UPDATE_MODAL_ID));
                }
            });
    };

    return (
        <Modal
            id={SELECT_TIME_MODAL_ID}
            title={t('选择时间')}
            destroyOnClose
            width={300}
            isAutoClose={false}
            okText={`${t('确定')}`}
            cancelText={t('取消')}
            onOk={onOk}
        >
            <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                disabledDate={disabledDate}
                showNow={false}
                // disabledDate={disabledDate}
                // disabledTime={disabledDateTime}
                showTime={{defaultValue: dayjs('00:00:00', 'HH:mm:ss')}}
                onChange={(values) => {
                    onChange(values);
                }}
            />
        </Modal>
    );
};

export default SelectTime;
