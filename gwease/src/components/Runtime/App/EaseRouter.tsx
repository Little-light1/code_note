import { Action, History, Location } from "history";
import React, { FC, useLayoutEffect, useState } from "react";
import { Router } from "react-router-dom";

interface EaseRouterProps {
  history: History;
  basename?: string;
}

interface EaseRouterState {
  action: Action;
  location: Location;
}

const EaseRouter: FC<EaseRouterProps> = ({ basename, history, children }) => {
  const [routerState, setRouterState] = useState<EaseRouterState>({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => {
    history.listen(setRouterState);
  }, [history]);

  return (
    <Router basename={basename} location={routerState.location} navigationType={routerState.action} navigator={history}>
      {children}
    </Router>
  );
};

export default EaseRouter;
