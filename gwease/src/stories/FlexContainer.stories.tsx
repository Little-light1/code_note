import React from "react";
import { ComponentMeta } from "@storybook/react";
import FlexContainer from "../components/FlexContainer";

export default {
  title: "Example/AdaptiveContainer",
  component: FlexContainer,
} as ComponentMeta<typeof FlexContainer>;

const getRandomColor = () =>
  "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";

export const RowTemplate = ({ count = 3, width = 200 }) => {
  return (
    <div style={{ height: 200, display: "flex", flexDirection: "row" }}>
      {new Array(count).fill(null).map((v) => {
        return <div style={{ background: getRandomColor(), height: "100%", flex: `0 0 ${width}px` }}></div>;
      })}
      <FlexContainer>
        <div style={{ background: getRandomColor() }}>adaptive children</div>
      </FlexContainer>
    </div>
  );
};
RowTemplate.storyName = "自适应宽度";

export const ColumnTemplate = ({ count = 3, height = 150 }) => {
  return (
    <div style={{ height: 500, display: "flex", flexDirection: "column" }}>
      {new Array(count).fill(null).map((v) => {
        return <div style={{ background: getRandomColor(), width: "100%", flex: `0 0 ${height}px` }}></div>;
      })}
      <FlexContainer>
        <div style={{ background: getRandomColor() }}>adaptive children</div>
      </FlexContainer>
    </div>
  );
};
ColumnTemplate.storyName = "自适应高度";

export const ComplexTemplate = ({ count = 3, height = 60 }) => {
  return (
    <div style={{ height: 500, width: "100%", display: "flex" }}>
      <div style={{ height: "100%", background: getRandomColor(), width: "30%" }} />
      <div style={{ height: "100%", width: "70%", display: "flex" }}>
        {new Array(count).fill(null).map((v) => {
          return <div style={{ background: getRandomColor(), width: "100%", flex: `0 0 ${height}px` }}></div>;
        })}
        <FlexContainer>
          <div style={{ background: getRandomColor() }}>adaptive children</div>
        </FlexContainer>
      </div>
    </div>
  );
};
ComplexTemplate.storyName = "嵌套自适应";
