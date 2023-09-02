import { Button, Input, Radio } from "antd";
import React, { FC, useCallback } from "react";
import { DEFAULT_I18N } from "./constant";
import { XLSXUploaderFooterProps } from "./types";
import { range2str } from "./utils";

const Footer: FC<XLSXUploaderFooterProps> = ({ i18n = DEFAULT_I18N, range, rangeType, onRangeTypeSelected, submit }) => {
  // const layout: any = {
  //   wrapperCol: { span: 14 },
  // };

  const onSubmit = useCallback(() => {
    submit();
  }, [submit]);

  // const disabled = !range || !range.header || !range.data;

  return (
    <div className="ease-xlsx-footer">
      <Radio.Group onChange={(e) => onRangeTypeSelected(e.target.value)} value={rangeType} className="ease-xlsx-choose">
        <Radio value="header" className="ease-xlsx-choose-item">
          <Input
            disabled
            value={range ? range2str(range.header) : ""}
            placeholder={i18n.headerPlaceholder}
            className="ease-xlsx-footer-choose-input"
          />
        </Radio>
        <Radio value="data" className="ease-xlsx-choose-item">
          <Input
            disabled
            value={range ? range2str(range.data) : ""}
            placeholder={i18n.dataPlaceHolder}
            className="ease-xlsx-footer-choose-input"
          />
        </Radio>
      </Radio.Group>

      <Button onClick={onSubmit}>{i18n.ok}</Button>
    </div>
  );
};

export default Footer;
