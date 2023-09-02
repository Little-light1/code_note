import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {ModalContext} from './context';
import {GlobalMask} from './GlobalMask';
import {IsShowGlobalMask, ModalProviderProps, ModalState} from './types';

const ModalProvider: FC<ModalProviderProps> = ({
    children,
    // okText = "ok",
    // cancelText = "cancel",
    globalMaskID = 'ease-global-mask',
    // defaultGlobalMaskText = "Loading...",
    closeableDelay = 1000 * 60,
    state,
    updateState,
    isShowGlobalMask,
    updateIsShowGlobalMask,
}) => {
    const [internalState, setInternalState] = useState<ModalState>(state || {});

    const [configuration] = useState({globalMaskID, closeableDelay});

    const [internalIsShowGlobalMask, setInternalIsShowGlobalMask] = useState<IsShowGlobalMask>(false);

    // update 内部状态
    useEffect(() => {
        typeof state !== 'undefined' && setInternalState({...state});
    }, [state]);

    useEffect(() => {
        typeof isShowGlobalMask !== 'undefined' && setInternalIsShowGlobalMask(isShowGlobalMask);
    }, [isShowGlobalMask]);

    const openModal = useCallback(
        (id: string, extra: any = {}) => {
            if (internalState[id]) {
                return;
            }

            const temp = {...internalState, [id]: extra};

            if (updateState) {
                updateState(temp);
                return;
            }
            setInternalState(temp);
        },
        [internalState, updateState],
    );

    const closeModal = useCallback(
        async (id: string) => {
            if (!id) {
                throw new Error('modal id is required.');
            }

            delete internalState[id];

            if (updateState) {
                await updateState({...internalState});
                return;
            }

            setInternalState({...internalState});
        },
        [internalState, updateState],
    );

    const openGlobalMask = useCallback(
        (config: IsShowGlobalMask = true) => {
            if (updateIsShowGlobalMask) {
                updateIsShowGlobalMask(config);
                return;
            }
            setInternalIsShowGlobalMask(config);
        },
        [updateIsShowGlobalMask],
    );

    const closeGlobalMask = useCallback(() => {
        if (updateIsShowGlobalMask) {
            updateIsShowGlobalMask(false);
            return;
        }
        setInternalIsShowGlobalMask(false);
    }, [updateIsShowGlobalMask]);

    const value = useMemo(
        () => ({
            state: internalState,
            openModal,
            closeModal,
            configuration,
            isShowGlobalMask: internalIsShowGlobalMask,
            openGlobalMask,
            closeGlobalMask,
        }),
        [closeGlobalMask, closeModal, configuration, internalIsShowGlobalMask, internalState, openGlobalMask, openModal],
    );

    return (
        <ModalContext.Provider value={value}>
            <GlobalMask />
            {children}
        </ModalContext.Provider>
    );
};

export default ModalProvider;
