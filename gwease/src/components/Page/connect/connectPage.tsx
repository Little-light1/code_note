import React, { FC, useContext } from "react";
import { PageContext } from "../context";
import type { PageViewProps } from "../types";

// export function connectPage(Target: ComponentType): ComponentType {
//   class Wrapper extends PureComponent {
//     // 可以做很多自定义逻辑
//     render() {
//       return <Target {...this.context} {...this.props} />;
//     }
//   }
//   Wrapper.contextType = PageContext;

//   return Wrapper;
// }

export function connectPage<P = any>(Child: React.ComponentClass<P | PageViewProps>) {
  const Component: FC<Omit<P, keyof PageViewProps>> = (props) => {
    const context = useContext(PageContext);

    return <Child {...context} {...props} />;
  };

  return Component;
}
