/*
 * @Author: sun.t
 * @Date: 2021-08-30 15:57:32
 * @Last Modified by: sun.t
 * @Last Modified time: 2022-04-24 18:44:18
 */
import React, { FC, useMemo } from "react";
import type { RuntimeInstance, Handlers, ActionContext, Tab } from "../types";

export const Context = React.createContext<ActionContext>({} as any);

export const ActionProvider: FC<{
  tab: Tab;
  runtime: RuntimeInstance;
  handlers: Handlers;
  callback?: { [key: string]: (...args: any[]) => void };
  state: any;
}> = ({ children, runtime, handlers, callback, state, tab }) => {
  const { actions, historyManager, getPageSimpleActions, getPageState, basename, injectAsyncReducer } = runtime;

  const value = useMemo(
    () => ({
      tab,
      state,
      basename,
      handlers,
      callback,
      actions,
      historyManager,
      getPageState,
      getPageSimpleActions: getPageSimpleActions.bind(runtime),
      injectAsyncReducer: injectAsyncReducer.bind(runtime),
    }),
    [tab, state, basename, handlers, callback, actions, historyManager, getPageState, getPageSimpleActions, runtime, injectAsyncReducer]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export function useAction() {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error(`useAction must be used within a ActionProvider`);
  }
  return context;
}

ActionProvider.propTypes = {
  // children: PropTypes.node,
  // eslint-disable-next-line react/forbid-prop-types
};

// ActionProvider.defaultProps = {
//   children: null,
// };
