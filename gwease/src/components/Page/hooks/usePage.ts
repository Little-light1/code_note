import { useMount, useUnmount, useUpdateEffect } from "ahooks";
import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { useLocation, useParams } from "react-router";
import qs from "query-string";
import { useDispatch } from "react-redux";
// import { useWhatChanged } from "@simbathesailor/use-what-changed";
import { useAction } from "../../Runtime/App";
import { PageContainerContext, PageContext } from "../context";
import { PageLifeCycle, PageViewProps } from "../types";
import { log } from "../../../utils/log";

type UpdateTarget = { search: string; state: any };

interface UsePageProps extends PageViewProps, PageLifeCycle {
  isUpdate?: (prev: UpdateTarget, curr: UpdateTarget) => boolean;
  getUniquePath?: (basename: string, pathname: string, search: string) => string;
}

function shallowStateUpdate(prev: UpdateTarget, curr: UpdateTarget) {
  const { state: prevState } = prev;
  const { state: currState } = curr;

  if (toString.call(prevState) !== toString.call(currState)) {
    return true;
  }

  if (toString.call(currState) === "[object Object]") {
    if (Object.keys(prevState).length !== Object.keys(currState).length) {
      return true;
    }

    let isUpdate = false;
    for (const key of Object.keys(currState)) {
      const prevValue = prevState[key];
      const currValue = currState[key];
      if (prevValue !== currValue) {
        isUpdate = true;
        break;
      }
    }

    return isUpdate;
  }

  return prevState !== currState;
}

function combineAll(basename: string, pathname: string, search: string) {
  return `${basename}${pathname}${search}`;
}

/**
 * 页面生命周期，需要配合页面容器组件使用
 * 容器状态：容器状态会以pathname作为唯一值存储该页面的初始化时间，刷新时间，params，search
 *  通过pathname定义唯一页面，也就是说，当search发生变化，也会认为是相同页面（只是发生了变化）。
 * @param param.init 初始化逻辑，触发条件：容器状态中不存在打开记录
 * @param param.activate 激活逻辑，触发条件：容器状态中存在打开记录，并且UrlSearch没有发生变化 （相关分支：update）
 * @param param.inactivate 冻结逻辑，触发条件：容器状态中存在记录（pathname），（如果当前目标地址任然是本事，只是search发生变化，也会触发）
 * @param param.unMount 页面卸载：触发条件：页面发生切换即触发
 * @param param.beforeRefresh 刷新前拦截，触发条件：注册事件，外部触发
 * @param param.refresh 刷新逻辑，触发条件：注册事件，外部触发
 * @param param.close 关闭逻辑，触发条件：注册事件，外部触发
 * @param param.beforeClose 关闭前拦截，触发条件：注册事件，外部触发
 * @param param.beforeUpdate 更新前拦截，触发条件：容器状态中存在记录（pathname），search发生变化
 * @param param.update 更新，触发条件：容器状态中存在记录（pathname），search发生变化
 */
export default function usePage({
  init,
  activate,
  inactivate,
  willUnMount,
  unMount,
  mount,
  beforeRefresh,
  refresh,
  close,
  beforeClose,
  beforeUpdate,
  update,
  id,
  title,
  isUpdate = shallowStateUpdate,
  getUniquePath = combineAll,
}: UsePageProps) {
  const handlersRef = useRef({ willUnMount });
  const { state: contextState, forceRefresh, onInitSuccess, onUpdateSuccess, onRefreshSuccess, clear } = useContext(PageContainerContext);
  const { async = true } = useContext(PageContext);
  const props = useMemo(() => ({ id, title }), [id, title]);
  const location = useLocation();
  const params = useParams();
  const { pathname: routerPath, search, state } = location;
  const dispatch = useDispatch();
  const { getPageSimpleActions, handlers, basename = "" } = useAction();

  const { register, deregister, logError } = handlers || {};
  const pathname = getUniquePath(basename, routerPath, search);
  const searchParse = qs.parse(search);

  useEffect(() => {
    handlersRef.current = { ...handlersRef.current, willUnMount };
  });

  // refresh逻辑
  const internalRefresh = useCallback(() => {
    if (refresh) {
      return new Promise<void>((resolve, reject) => {
        const refreshResult = refresh({ ...props, params, search, searchParse, state });

        if (refreshResult instanceof Promise) {
          refreshResult
            .then(() => {
              onRefreshSuccess({ pathname });
              resolve();
            })
            .catch((error) => reject(error));
        } else {
          onRefreshSuccess({ pathname });
          resolve();
        }
      });
    }

    return new Promise<void>((resolve) => {
      // 清空页面状态
      const actions = getPageSimpleActions(props.id, async ? search : "");
      actions && dispatch(actions.reset());

      forceRefresh(pathname);

      onRefreshSuccess({ pathname });
      resolve();
    });
  }, [dispatch, forceRefresh, getPageSimpleActions, onRefreshSuccess, async, params, pathname, props, refresh, search, searchParse, state]);

  // update逻辑
  const internalUpdate = useCallback(
    ({ prevSearch, prevState }) => {
      if (beforeUpdate) {
        const result = beforeUpdate({ ...props, params, search: prevSearch, searchParse: qs.parse(prevSearch), state });
        Promise.resolve(result)
          .then(() => {
            if (update) {
              const updateResult = update(
                { ...props, params, search, searchParse, state },
                { ...props, params, search: prevSearch, searchParse: qs.parse(prevSearch), state: prevState }
              );

              // 确认更新结果
              Promise.resolve(updateResult)
                .then(() => onUpdateSuccess({ pathname, search, params, state }))
                .catch((error) => {
                  log({ module: "usePage", sketch: "Update is canceled", type: "error" });
                  if (logError) {
                    logError({ error });
                  }
                });
            }
          })
          .catch((error) => {
            log({ module: "usePage", sketch: "Update is canceled by BeforeUpdate", type: "error" });

            if (logError) {
              logError({ error });
            }
          });
      } else {
        if (update) {
          const updateResult = update(
            { ...props, params, search, searchParse, state },
            { ...props, params, search: prevSearch, searchParse: qs.parse(prevSearch), state: prevState }
          );

          // 确认更新结果
          Promise.resolve(updateResult)
            .then(() => onUpdateSuccess({ pathname, search, params, state }))
            .catch((error) => {
              log({ module: "usePage", sketch: "Update is canceled", type: "error" });
              if (logError) {
                logError({ error });
              }
            });
        }
      }
    },
    [beforeUpdate, logError, onUpdateSuccess, params, pathname, props, search, searchParse, state, update]
  );

  useMount(() => {
    if (register) {
      // 注册Tab关闭前事件
      beforeClose && register(pathname, () => beforeClose({ ...props, params, search, searchParse, state }), "beforeClose");

      // 注册Tab关闭事件
      register(
        pathname,
        () => {
          close && close({ ...props, params, search, searchParse, state });

          // 清空页面状态
          clear(pathname);

          // 清空页面状态树
          const actions = getPageSimpleActions(props.id, async ? search : "");
          actions && dispatch(actions.reset());

          // 取消注册
          deregister && deregister(pathname, "beforeClose");
          deregister && deregister(pathname, "afterClose");
          deregister && deregister(pathname, "beforeRefresh");
          deregister && deregister(pathname, "afterRefresh");
        },
        "afterClose"
      );

      // 注册页面刷新前事件
      beforeRefresh && register(pathname, () => beforeRefresh({ ...props, params, search, searchParse, state }), "beforeRefresh");

      // 注册页面刷新事件
      register(pathname, internalRefresh, "afterRefresh");
    }

    // 组件挂载
    mount && mount({ ...props, params, search, searchParse, state });

    // 初始化
    if (typeof contextState[pathname] === "undefined") {
      if (init) {
        const result = init({ ...props, params, search, searchParse, state });

        Promise.resolve(result)
          .then(() => onInitSuccess({ pathname, search, params, state }))
          .catch((error) => {
            log({ module: "usePage", sketch: `Init is canceled:${error.message}`, type: "error" });

            if (logError) {
              logError({ error });
            }
          });
      } else {
        onInitSuccess({ pathname, search, params, state });
      }
    }
    // 再次进入
    else {
      const { search: prevSearch, state: prevState } = contextState[pathname];

      // search发生变化触发更新
      if (isUpdate({ search: prevSearch, state: prevState }, { search, state })) {
        internalUpdate({ prevSearch, prevState, search, state });
      } else {
        // 重新激活
        activate && activate({ ...props, params, search, searchParse, state });
      }
    }
  });

  // 卸载
  useUnmount(() => {
    unMount && unMount({ ...props, params, search, searchParse, state });

    // 非活跃
    if (typeof contextState[pathname] !== "undefined") {
      inactivate && inactivate({ ...props, params, search, searchParse, state });
    }
  });

  // 将要卸载
  useEffect(
    () => () => {
      willUnMount && willUnMount();
    },
    [willUnMount]
  );

  // 更新(自身页面跳自身)
  useUpdateEffect(() => {
    const { search: prevSearch, state: prevState } = contextState[pathname];
    if (isUpdate({ search: prevSearch, state: prevState }, { search, state })) {
      internalUpdate({ prevSearch, prevState, search, state });
    }
  }, [search, state]);
}
