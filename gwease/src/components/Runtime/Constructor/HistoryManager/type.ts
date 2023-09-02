import { Route } from "../types";

export interface UrlOptions {
  openNewTab?: boolean;
}

export interface UrlParams {
  [key: string]: string;
}

export interface RichRoute extends Route {
  relativePath: string;
  basePath: string;
}
