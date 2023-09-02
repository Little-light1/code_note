/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import React, {FC, PureComponent, useEffect, useMemo, useRef, useState} from 'react';
import {Modal, ModalProps, Spin} from 'antd';
import ReactDOM from 'react-dom';
import {useModal, ModalContext} from './context';
import './styles.scss';
import {useLocale} from '../Runtime/App/LocaleProvider';

export const GlobalMask: FC<ModalProps> = () => {
    const [closable, setClosable] = useState(false);
    const delayTimer = useRef<null | NodeJS.Timeout>(null);
    const {
        isShowGlobalMask,
        closeGlobalMask,
        configuration: {globalMaskID, closeableDelay},
    } = useModal();

    const locale = useLocale('GlobalMask');

    const {_visible, _isPortal, _text} = useMemo(() => {
        let tempVisible = isShowGlobalMask;
        let tempIsPortal = false;
        let tempText = locale.loading || 'Loading...';
        if (typeof isShowGlobalMask === 'object') {
            const {visible, isPortal = false, text = locale.loading || 'Loading...'} = isShowGlobalMask;
            tempVisible = visible;
            tempIsPortal = isPortal;
            tempText = text;
        }

        return {
            _visible: tempVisible as boolean,
            _isPortal: tempIsPortal,
            _text: tempText,
        };
    }, [isShowGlobalMask, locale.loading]);

    useEffect(() => {
        if (_visible) {
            delayTimer.current = setTimeout(() => {
                setClosable(true);
            }, closeableDelay);
        } else {
            setClosable(false);
        }
        return () => {
            delayTimer.current && window.clearTimeout(delayTimer.current);
        };
    }, [_visible, closeableDelay]);

    return (
        <Modal
            footer={null}
            className="ease-modal"
            visible={_visible}
            maskClosable={closable}
            keyboard={false}
            closable={closable}
            zIndex={9999}
            onCancel={closeGlobalMask}>
            <div id={globalMaskID}>{!_isPortal ? <Spin tip={_text} style={{height: 80, width: '100%', padding: 15}} /> : null}</div>
        </Modal>
    );
};

export class GlobalPortal extends PureComponent {
    render() {
        const {children} = this.props;
        const {
            configuration: {globalMaskID},
        } = this.context;
        const el = document.getElementById(globalMaskID);
        return el ? ReactDOM.createPortal(children, el) : null;
    }
}

GlobalPortal.contextType = ModalContext;
