import React, { FC, useRef, cloneElement, isValidElement, CSSProperties } from "react";
import { useSize } from "ahooks";

interface FlexContainerProps {
  defaultHeight?: number;
  defaultWidth?: number;
  offsetHeight?: number;
  offsetWidth?: number;
  style?: CSSProperties;
  direction?: "row" | "column";
}

const FlexContainer: FC<FlexContainerProps> = ({
  children,
  defaultHeight = 0,
  defaultWidth = 0,
  offsetHeight = 0,
  offsetWidth = 0,
  direction = "row",
  style,
  ...props
}) => {
  const containerRef = useRef(null);

  const containerSize = useSize(containerRef);

  const { height = defaultHeight, width = defaultWidth } = containerSize || {};

  let childrenElement = null;

  if (typeof children === "function") {
    childrenElement = children({ height: height + offsetHeight, width: width + offsetWidth });
  } else {
    if (isValidElement(children)) {
      const childrenStyle = children.props.style || {};
      const tableType = children.props.tableType
      // 判断有没有搜索框
      const scroll =children.props.showFilter? {y:height-81}: { y: height - 39 }
      
      childrenElement = cloneElement(children, tableType?{
        scroll,
        ...children.props,
        style: { ...childrenStyle, height: height + offsetHeight, width: width + offsetWidth },
      } : {
        ...children.props,
        style: { ...childrenStyle, height: height + offsetHeight, width: width + offsetWidth },
      });
    }
  }
  const mergeStyle = direction === "row" ? { ...style, flex: 1, width: 0 } : { ...style, flex: 1, height: 0 };
  return (
    <div ref={containerRef} style={mergeStyle} {...props}>
      {childrenElement}
    </div>
  );
};

export default FlexContainer;
