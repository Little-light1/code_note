import React from "react";
import { IModalContext } from "./types";

export const ModalContext = React.createContext<IModalContext>({} as any);

export function useModal() {
  const context = React.useContext(ModalContext);
  if (context === undefined) {
    throw new Error(`useModal must be used within a ModalProvider`);
  }
  return context;
}
