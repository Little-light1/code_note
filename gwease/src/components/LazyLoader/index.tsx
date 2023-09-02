import React, { ComponentType, lazy, Suspense } from "react";
import { log } from "../../utils/log";

function retry(fn: (...rest: any[]) => Promise<any>, retriesTimes = 5, interval = 1000): Promise<any> {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error: any) => {
        log({ module: "LazyLoader", sketch: `${error.message}, retriesTimes:${retriesTimes}`, type: "error" });
        setTimeout(() => {
          if (retriesTimes === 0) {
            reject(error);
            return;
          }
          retry(fn, retriesTimes - 1, interval).then(resolve, reject);
        });
      });
  });
}

export default function LazyLoader<TProps = any>(
  loadFun: () => Promise<{ default: ComponentType<any> }>,
  retriesTimes = 5,
  interval = 1000
) {
  const LazyComponent = lazy(() => retry(loadFun, retriesTimes, interval));

  const component = (props: TProps) => (
    <Suspense fallback={null}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <LazyComponent {...props} />
    </Suspense>
  );

  return component;
}
