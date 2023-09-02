/*
 * @Author: zhangzhen
 * @Date: 2022-08-29 18:42:01
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-09-01 11:21:05
 * 
 */
import React, { useRef } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Button } from "antd";
import XlsxReader from "../components/Xlsx/XlsxReader/XlsxReader";
import "antd/lib/style/index.css";
import "antd/lib/modal/style/index.css";
import "antd/lib/form/style/index.css";
import "antd/lib/radio/style/index.css";
import "antd/lib/tabs/style/index.css";
import "antd/lib/empty/style/index.css";
import { XlsxReaderInstance } from "../components/Xlsx/XlsxReader/types";

export default {
  title: "Example/XlsxReader",
  component: XlsxReader,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof XlsxReader>;

const Template: ComponentStory<typeof XlsxReader> = (args) => (
  <Button style={{ position: "relative" }}>
    <XlsxReader {...args} />
    确定
  </Button>
);

export const DefaultTemplate = Template.bind({});
DefaultTemplate.args = {};

// 默认
export const DefaultRangeTemplate = Template.bind({});
DefaultRangeTemplate.args = {
  onSubmit: (data) => {
    console.log(data);
  },
  preview: false,
  onError: (type, error) => console.log(type, error),
};
DefaultRangeTemplate.storyName = "默认区域";

// 预制数据区域
export const PrecastRangeTemplate = Template.bind({});
PrecastRangeTemplate.args = {
  defaultRange: [{ header: { start: { i: 0, j: 0 }, end: { i: 0, j: 9 } }, data: { start: { i: 1, j: 0 }, end: { i: 9, j: 9 } } }],
  onSubmit: (data) => {
    console.log(data);
  },
  preview: false,
};
PrecastRangeTemplate.storyName = "预制区域";

// 预览
export const PreviewRangeTemplate = Template.bind({});
PreviewRangeTemplate.args = {
  defaultRange: [{ header: { start: { i: 0, j: 0 }, end: { i: 0, j: 9 } } }],
  modalWidth: 1000,
  onSubmit: (data) => {
    console.log(data);
  },
};
PreviewRangeTemplate.storyName = "预览模式";

// 手动触发
export const ManualTriggerTemplate = () => {
  const xlsx = useRef<XlsxReaderInstance>();
  return (
    <>
      <Button style={{ position: "relative" }}>
        <XlsxReader
          {...{
            defaultRange: [{ header: { start: { i: 0, j: 0 }, end: { i: 0, j: 9 } } }],
            modalWidth: 1000,
            onSubmit: (data) => {
              console.log(data);
            },
            xlsx,
          }}
        />
        确定
      </Button>

      <Button
        style={{ position: "relative" }}
        onClick={() => {
          xlsx.current && xlsx.current.openFile();
        }}
      >
        手动触发
      </Button>
    </>
  );
};

ManualTriggerTemplate.storyName = "手动触发";
