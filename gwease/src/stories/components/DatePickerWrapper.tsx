import { DatePicker } from "antd";
import moment from "moment";
import React from "react";

const DatePickerWrapper = ({ value, onChange, format, ...props }) => {
  const onInternalChange = (value, str) => {
    onChange(str);
  };

  const internalValue = moment(value);

  return <DatePicker value={internalValue} onChange={onInternalChange} format={format} {...props} />;
};

export default DatePickerWrapper;
