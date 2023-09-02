import { History, Transition } from "history";
import { useContext, useEffect, useCallback } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

type ExtendNavigator = Navigator & Pick<History, "block">;
export function useBlocker(blocker: (tx: Transition) => void, when = true) {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!when) return;

    const unblock = (navigator as any as ExtendNavigator).block((tx) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    // eslint-disable-next-line consistent-return
    return unblock;
  }, [navigator, blocker, when]);
}

export function usePrompt(isContinue: (pathname: string) => boolean, when = true) {
  const { basename } = useContext(NavigationContext);

  const blocker = useCallback(
    (tx) => {
      if (typeof isContinue === "function") {
        let targetLocation = tx?.location?.pathname;
        if (targetLocation.startsWith(basename)) {
          targetLocation = targetLocation.substring(basename.length);
        }
        if (isContinue(targetLocation)) {
          tx.retry();
        }
      }
    },
    [isContinue, basename]
  );
  return useBlocker(blocker, when);
}
