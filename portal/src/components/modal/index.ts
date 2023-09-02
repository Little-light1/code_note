import type {IsShowGlobalMask} from '@gwaapp/ease';

export {default as ModalWrapper} from './ModalWrapper';
export const openModal = (id: string, extra?: any) => ({
    type: '@app/openModal',
    payload: {
        [id]: extra,
    },
});
export const closeModal = (id: string) => ({
    type: '@app/closeModal',
    payload: id,
});
export const openGlobalMask = (config?: IsShowGlobalMask) => ({
    type: '@app/openGlobalMask',
    payload: config,
});
export const closeGlobalMask = () => ({
    type: '@app/closeGlobalMask',
});
