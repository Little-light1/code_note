import React, { FC } from "react";
import { useLocation, useParams, useNavigate } from "react-router";
import { RoutedProps } from "../types";

export function connectRouter<P = any>(Child: React.ComponentType<P | RoutedProps>) {
  const Component: FC<Omit<P, keyof RoutedProps>> = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const { pathname, search } = location;

    return <Child {...(props as P)} navigate={navigate} location={location} params={params} key={`${pathname}${search}`} />;
    // return <Child {...(props as P)} location={location} params={params} key={`${pathname}${search}`} />;
  };

  return Component;
}
