/*
 * @Author: sun.t
 * @Date: 2021-06-10 11:17:18
 * @Last Modified by: sds
 * @Last Modified time: 2022-01-13 19:22:27
 */
import React, {FC, useCallback, useMemo, useRef, useState} from 'react';
import {Modal as AntdModal, Button} from 'antd';
import {useMount} from 'ahooks';
import Draggable from 'react-draggable';
import {useModal} from './context';
import {ModalProps} from './types';
import './styles.scss';
import {log} from '../../utils/log';
import {useLocale} from '../Runtime/App/LocaleProvider';

const Modal: FC<ModalProps> = ({
    // outer props
    id,
    title,
    style,
    children,
    footer,
    maskClosable = false,
    destroyOnClose,
    className = '',
    centered = false,
    width,
    okButtonProps,
    cancelButtonProps,
    isAutoClose = true,
    // outer action
    onOk,
    onCancel,
    afterClose,
    ...props
}) => {
    const mounted = useRef(false);
    const {
        state,
        closeModal,
        // configuration: {okText, cancelText},
    } = useModal();
    // const isVisible = useMemo(() => state.hasOwnProperty(id), [state, id]);
    const isVisible = state.hasOwnProperty(id);

    const draggleRef = useRef<HTMLDivElement>(null);
    const [dragState, setDragState] = useState({disabled: true, bounds: {left: 0, top: 0, bottom: 0, right: 0}});

    const locale = useLocale('Modal');

    // useEffect(() => {
    //   if (!isVisible && mounted.current) {
    //     onCancel && onCancel();
    //   }
    //   // 外部onCancel往往直接写箭头函数, 这里如果添加onCancel会导致死循环
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [isVisible]);

    useMount(() => {
        mounted.current = true;
    });

    const onInternalCancel = useCallback(async () => {
        if (onCancel) {
            try {
                await onCancel();
                closeModal(id);
            } catch (error: any) {
                log({module: 'Modal', sketch: error.message, type: 'error'});
            }
        } else {
            closeModal(id);
        }

        // 如果主动点击cancel 会触发两次
        // onCancel && onCancel(e);
    }, [closeModal, id, onCancel]);

    const onInternalOk = useCallback(async () => {
        if (onOk) {
            try {
                const result = await onOk();
                if (result && isAutoClose) {
                    closeModal(id);
                }
            } catch (error: any) {
                log({module: 'Modal', sketch: error.message, type: 'error'});
            }
        } else {
            isAutoClose && closeModal(id);
        }
    }, [closeModal, id, onOk, isAutoClose]);

    // footer = null 不显示
    const internalFooter =
        typeof footer === 'undefined'
            ? [
                  // 自定义右下角按钮
                  <Button key="cancel" onClick={onInternalCancel} className="ease-modal-cancel">
                      {props.cancelText || locale.cancel}
                  </Button>,
                  <Button key="ok" type="primary" onClick={onInternalOk} className="ease-modal-ok">
                      <span className="ease-modal-ok-icon" />
                      {props.okText || locale.ok}
                  </Button>,
              ]
            : footer;

    const internalTitle = (
        <div
            style={{
                width: '100%',
                cursor: 'move',
            }}
            onMouseOver={() => {
                if (dragState.disabled) {
                    setDragState({...dragState, disabled: false});
                }
            }}
            onMouseOut={() => {
                setDragState({...dragState, disabled: true});
            }}
            onFocus={() => {}}
            onBlur={() => {}}>
            {title}
        </div>
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const onStart = useCallback((event, uiData) => {
        const {clientWidth, clientHeight} = window.document.documentElement;
        const targetRect = draggleRef.current?.getBoundingClientRect();
        if (!targetRect) {
            return;
        }
        setDragState((currentDragState) => ({
            ...currentDragState,
            bounds: {
                left: -targetRect.left + uiData.x,
                right: clientWidth - (targetRect.right - uiData.x),
                top: -targetRect.top + uiData.y,
                bottom: clientHeight - (targetRect.bottom - uiData.y),
            },
        }));
    }, []);

    const modalRender = useCallback(
        (modal) => (
            <Draggable disabled={dragState.disabled} bounds={dragState.bounds} onStart={onStart}>
                <div ref={draggleRef} className={`ease-modal ${className || ''}`}>
                    {modal}
                </div>
            </Draggable>
        ),
        [className, dragState.bounds, dragState.disabled, onStart],
    );

    if (typeof id === 'undefined') {
        return null;
    }

    return (
        <AntdModal
            centered={centered}
            width={width}
            style={style}
            title={internalTitle}
            visible={isVisible}
            footer={internalFooter}
            okButtonProps={okButtonProps}
            cancelButtonProps={cancelButtonProps}
            onOk={onInternalOk}
            onCancel={onInternalCancel}
            afterClose={afterClose}
            destroyOnClose={destroyOnClose}
            maskClosable={maskClosable}
            modalRender={modalRender}
            {...props}>
            {typeof children === 'function' ? children({extra: state[id]}) : children}
        </AntdModal>
    );
};

export default Modal;
