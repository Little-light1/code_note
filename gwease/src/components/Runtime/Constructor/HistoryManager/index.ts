/*
 * @Author: sun.t
 * @Date: 2021-11-01 17:25:45
 * @Last Modified by: sun.t
 * @Last Modified time: 2022-04-25 11:16:48
 */
import { generatePath } from "react-router";
import { createBrowserHistory, History, State, parsePath } from "history";
import qs from "query-string";
import merge from "lodash/merge";
import { trimStart } from "lodash";
import { RichRoute, UrlOptions, UrlParams } from "./type";
import { Route } from "../types";

class HistoryManager {
  history: History;

  routeDict: { [key: string]: RichRoute };

  routeDictByPath: { [key: string]: RichRoute };

  routeTree: Route[];

  routeList: RichRoute[];

  basename: string;

  constructor({ featuresRoutes = [], basename = "" }: { featuresRoutes: Route[]; basename?: string }) {
    this.basename = basename;
    this.routeTree = featuresRoutes;
    this.history = createBrowserHistory();
    this.routeList = this.constructRoutes(featuresRoutes);
    this.routeDict = this.routeList.reduce((acc, curr) => {
      acc[curr.key] = curr;
      return acc;
    }, {} as typeof this.routeDict);
    this.routeDictByPath = this.routeList.reduce((acc, curr) => {
      acc[curr.path] = curr;
      return acc;
    }, {} as typeof this.routeDict);
  }

  back = () => {
    this.history.back();
  };

  forward = () => {
    this.history.forward();
  };

  // 解决push不会清空search&hash问题
  // https://github.com/remix-run/history/issues/859
  pushSafe = (to: string, state?: State) => {
    this.history.push(
      {
        hash: "",
        search: "",
        ...(typeof to === "string" ? parsePath(to) : to),
      },
      state
    );
  };

  pushPath = ({
    key,
    params = {},
    search = {},
    options = {},
    path,
    basename,
    state,
  }: {
    key?: string;
    params?: UrlParams;
    search?: UrlParams | string;
    options?: UrlOptions;
    path?: string;
    basename?: string;
    state?: State;
  }) => {
    const mergeOptions = merge(
      {
        openNewTab: false,
      },
      options
    );

    const searchParamsStr = typeof search === "string" ? trimStart(search, "?") : qs.stringify(search);

    if (typeof key !== "undefined") {
      const routeConfig = this.routeDict[key];

      if (!routeConfig) {
        throw Error(`No path found for key ${JSON.stringify(key)}`);
      }

      let matchPath = generatePath(routeConfig.path, params);

      if (searchParamsStr) {
        matchPath = `${matchPath}?${searchParamsStr}`;
      }

      if (mergeOptions.openNewTab) {
        window.open(path, "_blank");
        return;
      }

      this.pushSafe(`${typeof basename !== "undefined" ? basename : this.basename}${matchPath}`, state);
      return;
    }

    if (typeof path !== "undefined") {
      let matchPath = generatePath(path, params);
      if (searchParamsStr) {
        matchPath = `${matchPath}?${searchParamsStr}`;
      }
      this.pushSafe(`${typeof basename !== "undefined" ? basename : this.basename}${matchPath}`, state);
      return;
    }

    throw Error(`There must be at least one path or key.`);
  };

  static trimPath = (path: string) => {
    const chars = path.split("");
    if (chars[0] === "/") {
      chars.unshift();
    }
    if (chars[chars.length - 1] === "/") {
      chars.pop();
    }
    return chars.join("");
  };

  constructRoutes = (routes: Route[], parentPath = "", routeArr: RichRoute[] = []) => {
    routes.forEach((route) => {
      const { key, path, subRoutes } = route;

      if (key) {
        if (!routeArr.some((r) => r.key === key)) {
          routeArr.push({
            ...route,
            relativePath: path.slice(),
            basePath: path,
            path: parentPath.slice() + path.slice(),
          });
          route.path = parentPath.slice() + path.slice();
          if (subRoutes) {
            routeArr = routeArr.concat(this.constructRoutes(subRoutes, path, []));
          }
        } else {
          throw Error(`Duplicate route key name ${key}`);
        }
      }
    });
    return routeArr;
  };
}

export default HistoryManager;
