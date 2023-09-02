import React, { FC, useMemo } from "react";
import { PageContext } from "../../context";
import type { PageViewProps } from "../../types";

const PageContextProvider: FC<PageViewProps> = ({ children, id, title, location, search, navigate, params, state, async }) => {
  const memoValue = useMemo(
    () => ({ id, title, location, navigate, params, state, search, async }),
    [id, location, navigate, params, search, state, title, async]
  );

  return <PageContext.Provider value={memoValue}>{children}</PageContext.Provider>;
};

export default PageContextProvider;
