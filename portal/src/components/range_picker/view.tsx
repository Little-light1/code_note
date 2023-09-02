/*
 * @Author: zhangzhen
 * @Date: 2022-09-07 09:37:01
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-09-19 14:49:10
 *
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {DatePicker} from 'antd';
import moment from 'moment'; // import styles from './styles.module.scss';

const {RangePicker} = DatePicker;

const CustomRangePicker = () => {
    const rangeRef = useRef(null);
    const containerRef = useRef(null);
    const [rangeDate, setRangeDate] = useState([]);
    const onChange = useCallback((value, mode) => {
        console.log(value, mode);
    }, []);
    const onClickHandler = useCallback(() => {
        setTimeout(() => {
            const rangePickerDomNode = ReactDOM.findDOMNode(rangeRef.current);
            if (!rangePickerDomNode) return;
            const [startInput, endInput] = rangePickerDomNode.querySelectorAll(
                '.portal-antd-picker-input input',
            );
            const startValue = moment(startInput?.value, 'YYYY-MM-DD HH:mm:ss'); // if (this.props.rangePicker) {

            const endValue = moment(endInput?.value, 'YYYY-MM-DD HH:mm:ss');

            if (startValue.isValid() && endValue.isValid()) {
                setRangeDate([startValue, endValue]);
            }
        });
    }, []);
    const onOpenChange = useCallback(
        (e) => {
            setTimeout(() => {
                if (e) {
                    const containers = document.getElementsByClassName(
                        'custom-range-picker',
                    );

                    if (containers.length) {
                        containerRef.current = containers[0];
                        if (containerRef.current)
                            containerRef.current.addEventListener(
                                'click',
                                onClickHandler,
                            );
                    }
                } else if (containerRef.current)
                    containerRef.current.removeEventListener(
                        'click',
                        onClickHandler,
                    );
            });
        },
        [onClickHandler],
    );
    useEffect(
        () => () => {
            if (containerRef.current)
                containerRef.current.removeEventListener(
                    'click',
                    onClickHandler,
                );
        },
        [],
    );
    return (
        <RangePicker
            value={rangeDate}
            ref={rangeRef}
            showTime={{
                format: 'HH:mm:ss',
            }}
            dropdownClassName="custom-range-picker"
            format="YYYY-MM-DD HH:mm:ss"
            onChange={onChange}
            onOpenChange={onOpenChange}
        />
    );
};

export default CustomRangePicker;
