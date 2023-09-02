import { ErrorInfo, ReactNode } from "react";
import { Params, Location } from "react-router";
// import { NavigateFunction } from "react-router";
import { ActionContext } from "../Runtime";
import { Reducers } from "../Runtime/Constructor/types";
// import { ParsedQuery } from "query-string";

export interface PageProps extends RouterParams {
  id: string;
  title: string;
}

export interface PageViewProps {
  id: string;
  title: string;
  async?: boolean;
  [key: string]: any;
}

export type RouterParams = {
  params: { [key: string]: string | undefined };
  search: string;
  searchParse: { [key: string]: string | (string | null)[] | null };
  state: any;
};

export interface PageLifeCycle {
  init?: (props: PageProps) => void | Promise<any>;
  mount?: (props: PageProps) => void;
  unMount?: (props: PageProps) => void;
  willUnMount?: () => void;
  activate?: (props: PageProps) => void;
  inactivate?: (props: PageProps) => void;
  beforeClose?: (props: PageProps) => Promise<void>;
  close?: (props: PageProps) => void;
  beforeRefresh?: (props: PageProps) => void | Promise<void>;
  refresh?: (props: PageProps) => void | Promise<void>;
  beforeUpdate?: (props: PageProps) => void | Promise<void>;
  update?: (props: PageProps, previewProps: PageProps) => void | Promise<void>;
}

export type State = {
  [key: string]: { initializeTime: number; updateTime: number; search: string; params: Record<string, any>; state: any };
};

export interface PageContainerProps {
  defaultState?: State | (() => State);
  onChange?: (state: State, path?: string) => void;
}

export interface PageContainer {
  state: State;
  currentPageKey: string;
  forceRefresh: (id: string) => void;
  clear: (key: string) => void;
  onRefreshSuccess: ({ pathname }: { pathname: string }) => void;
  onInitSuccess: ({
    pathname,
    search,
    params,
    state,
  }: {
    pathname: string;
    search: string;
    params: Record<string, any>;
    state: any;
  }) => void;
  onUpdateSuccess: ({
    pathname,
    search,
    params,
    state,
  }: {
    pathname: string;
    search: string;
    params: Record<string, any>;
    state: any;
  }) => void;
}

export interface RoutedProps {
  location: Location;
  // navigate: NavigateFunction;
  params: Readonly<Params<string>>;
}

export interface PageWrapperProps extends PageViewProps, RoutedProps, ActionContext {
  logError?: (error: Error, errorInfo: ErrorInfo) => void;
  errorRender?: (error: Error) => ReactNode;
  reducers?: Reducers;
  loadingTime?: number;
}
