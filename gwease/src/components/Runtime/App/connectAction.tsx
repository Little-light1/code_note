import React, { FC, useContext } from "react";
import { Context } from "./ActionProvider";
import type { ActionContext } from "./types";

// export function connectAction<P = any>(Target: ComponentType): ComponentType {
//   class Wrapper extends PureComponent {
//     render() {
//       return <Target {...this.context} {...this.props} />;
//     }
//   }
//   Wrapper.contextType = Context;

//   return Wrapper;
// }

export function connectAction<P = any>(Child: React.ComponentType<P | ActionContext>) {
  const Component: FC<Omit<P, keyof ActionContext>> = (props) => {
    const context = useContext(Context);

    return <Child {...context} {...props} />;
  };
  return Component;
}
