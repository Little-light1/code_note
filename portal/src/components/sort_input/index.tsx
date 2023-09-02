/*
 * @Author: gxn
 * @Date: 2021-12-29 10:45:11
 * @LastEditors: zhangyu
 * @LastEditTime: 2022-11-03 19:11:48
 * @Description: file content
 */
import React from 'react';
import {InputNumber, InputNumberProps} from 'antd'; // import {debounce} from 'lodash';

// import styles from './styles.module.scss';

const SortInput = ({
    value,
    onChange,
    step = 10,
    min = 0,
    className = '',
    ...args
}: InputNumberProps) => (
    <InputNumber
        onChange={onChange}
        precision={0}
        step={step || 10}
        maxLength={6}
        max={999999}
        value={value}
        min={min}
        className={className}
        {...args}
    />
);

export default SortInput;
