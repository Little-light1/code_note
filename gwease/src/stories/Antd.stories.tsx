import React from "react";
import { ConfigProvider, Button, Pagination, InputNumber, Input, Select, DatePicker } from "antd";
// import "antd/lib/button/style/index.less";
// import "antd/lib/table/style/index.css";
// import "antd/lib/pagination/style/index.less";
// import "antd/lib/select/style/index.less";
// import "antd/lib/input/style/index.css";
// import "antd/lib/date-picker/style/index.css";
// import "antd/lib/input-number/style/index.css";
// import "antd/lib/tooltip/style/index.css";
import "../antd";

const { Option } = Select;

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/Antd",
  component: null,
};

ConfigProvider.config({
  prefixCls: "portal-antd", // 4.13.0+
});

export const Template = () => {
  return (
    <ConfigProvider prefixCls="portal-antd">
      <div className="ease-app antd-demo" style={{ background: "rgba(0,0,0,0.5)", height: "100%" }}>
        {/* 按钮 */}
        <div>
          <Button type="primary">primary</Button>
        </div>
        {/* 分页 */}
        <div>
          <Pagination defaultCurrent={6} total={500} />
        </div>
      </div>
    </ConfigProvider>
  );
};

Template.storyName = "Antd样式覆盖";
