/*
 * @Author: sun.t
 * @Date: 2022-06-30 17:13:59
 * @Last Modified by: sun.t
 * @Last Modified time: 2022-07-04 00:22:01
 */
import React, { useEffect, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { VirtualTable } from "../components/Table";
import "antd/lib/table/style/index.css";
import data10000 from "./mock/data10000.json";

export default {
  title: "Example/VirtualTable",
  component: VirtualTable,
} as ComponentMeta<typeof VirtualTable>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof VirtualTable> = (args) => <VirtualTable {...args} />;

export const FullWidth = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
FullWidth.args = {
  rowKey: "name",
  showIndex: true,
  columns: [
    {
      title: "A",
      dataIndex: "A",
      key: "A",
      ellipsis: true,
      sorter: true,
      width: 200,
    },
    {
      title: "B",
      dataIndex: "B",
      key: "B",
      ellipsis: true,
      sorter: true,
      width: 200,
    },
    {
      title: "C",
      dataIndex: "C",
      key: "C",
      ellipsis: true,
      sorter: true,
      width: 200,
    },
    {
      title: "D",
      dataIndex: "D",
      key: "D",
      ellipsis: true,
      sorter: true,
      width: 200,
    },
    {
      title: "E",
      dataIndex: "E",
      key: "E",
      ellipsis: true,
      sorter: true,
      width: 200,
    },
  
    {
      title: "F",
      dataIndex: "F",
      key: "F",
      ellipsis: true,
      sorter: true,
      width: 200,
    },
    {
      title: "G",
      dataIndex: "G",
      key: "G",
      ellipsis: true,
      sorter: true,
      width: 200,
    },
    {
      title: "H",
      dataIndex: "H",
      key: "H",
      ellipsis: true,
      sorter: true,
      width: 200,
    },
    {
      title: "I",
      dataIndex: "I",
      key: "I",
      ellipsis: true,
      sorter: true,
      width: 200,
    },
    {
      title: "J",
      dataIndex: "J",
      key: "J",
      ellipsis: true,
      sorter: true,
      width: 200,
    },
    {
      title: "K",
      dataIndex: "K",
      key: "K",
      ellipsis: true,
      sorter: true,
      width: 200,
    },
  ],
  dataSource: new Array(100)
    .fill(0)
    .map((v, index) => ({ A: `A${index}`, B: `B${index}`, C: `C${index}`, D: `D${index}`, E: `E${index}`, F: `F${index}`, G: `G${index}`, H: `H${index}` })),
  onExtraChange: ({ columns }) => console.log(columns),
  scroll: { y: 300 },
};
FullWidth.storyName = "提供列宽";

export const EmptyWidth = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
EmptyWidth.args = {
  rowKey: "name",
  showIndex: true,
  columns: [
    {
      title: "A",
      dataIndex: "A",
      key: "A",
      ellipsis: true,
      sorter: true,
      width: 200,
    },
    {
      title: "B",
      dataIndex: "B",
      key: "B",
      ellipsis: true,
      sorter: true,
      width: 200,
    },
    {
      title: "C",
      dataIndex: "C",
      key: "C",
      ellipsis: true,
      sorter: true,
      width: 200,
    },
    {
      title: "D",
      dataIndex: "D",
      key: "D",
      ellipsis: true,
      sorter: true,
    },
    {
      title: "E",
      dataIndex: "E",
      key: "E",
      ellipsis: true,
      sorter: true,
    },
  ],
  dataSource: new Array(100)
    .fill(0)
    .map((v, index) => ({ A: `A${index}`, B: `B${index}`, C: `C${index}`, D: `D${index}`, E: `E${index}` })),
  onExtraChange: ({ columns }) => console.log(columns),
  scroll: { y: 300 },
};
EmptyWidth.storyName = "未提供列宽";

export const RowSelection = () => {
  const [dataSource, setDataSource] = useState<any>([]);
  const columns = [
    {
      dataIndex: "deviceId",
      title: "设备ID",
      name: "设备ID",
      align: "center",
      width: 120,
    },
    {
      dataIndex: "deviceName",
      title: "设备名称",
      name: "设备名称",
      align: "center",
      width: 150,
    },
    {
      dataIndex: "deviceModel",
      title: "型号",
      name: "型号",
      align: "center",
      width: 150,
    },
    {
      dataIndex: "farmName",
      title: "电场名称",
      name: "电场名称",
      align: "center",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setDataSource(data10000);
    }, 3000);
  }, []);

  return (
    <VirtualTable
      dataSource={dataSource}
      columns={columns}
      showIndex={true}
      // rowSelection={{ onChange: (selectedRowKeys, selectedRows, info) => console.log(selectedRowKeys, selectedRows, info) }}
      rowKey="key"
      scroll={{ y: 300 }}
      onExtraChange={({ columns }) => console.log(columns)}
    />
  );
};

RowSelection.storyName = "行选择";
