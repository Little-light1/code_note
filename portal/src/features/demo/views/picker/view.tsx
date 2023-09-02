import React from 'react';
import {Space, DatePicker} from 'antd';
import CustomRangePicker from '@components/range_picker/view';

const {RangePicker} = DatePicker;

const ComponentDemo = () => (
    <div>
        {/* 日期组件 */}
        <Space direction="vertical" size={12}>
            <RangePicker
                showTime={{
                    format: 'HH:mm', // onPanelChange: (value, mode) => {
                    //   console.log(value, mode);
                    // },
                    // onSelect: (value) => {
                    //   console.log(value);
                    // },
                }}
                format="YYYY-MM-DD HH:mm"
                onChange={(time) => console.log(time)}
                onOk={(time) => console.log(time)}
                onBlur={(e) => {
                    console.log(e.target.value); // let value = moment(elem.target.value, props.format)
                    // if (value && value.isValid() && props.onChange) {
                    // props.onChange(value, elem.target.value)
                    // }
                }}
                onPanelChange={(value, mode) => {
                    console.log(value, mode);
                }}
            />

            <CustomRangePicker />
        </Space>
    </div>
);

export default ComponentDemo;
