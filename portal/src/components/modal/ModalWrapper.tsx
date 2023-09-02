import React, {FC, useCallback} from 'react';
import {ModalProvider, useAction} from '@gwaapp/ease';
import {shallowEqual} from 'react-redux';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useTranslation} from 'react-i18next';

const ModalWrapper: FC = ({children}) => {
    const {modalState, isShowGlobalMask} = useAppSelector(
        (state) => state.app,
        shallowEqual,
    );
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const {getPageSimpleActions} = useAction();
    const actions = getPageSimpleActions('app');
    const updateState = useCallback(
        (state) => {
            dispatch(
                actions.set({
                    modalState: state,
                }),
            );
        },
        [actions, dispatch],
    );
    const updateIsShowGlobalMask = useCallback(
        (isShowMask) => {
            dispatch(
                actions.set({
                    isShowGlobalMask: isShowMask,
                }),
            );
        },
        [actions, dispatch],
    );
    return (
        <ModalProvider
            state={modalState}
            okText={t('确定')}
            cancelText={t('取消')}
            isShowGlobalMask={isShowGlobalMask}
            updateState={updateState}
            updateIsShowGlobalMask={updateIsShowGlobalMask}
        >
            {children}
        </ModalProvider>
    );
};

export default ModalWrapper;
