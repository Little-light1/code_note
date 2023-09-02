import React, { Key } from "react";
import { I18n } from "../types";

export interface TableContextValue {
  contextMenuId: string;
  i18n?: I18n;
  visibleKeys: string[];
  onContextMenu?: (e: any, data: any) => void;
  selectedRowKeys?: Key[]; // VirtualTable props
  // dataSourceMap: Record<string, any>;
}

export const TableContext = React.createContext<TableContextValue>({} as any);

export function useTable() {
  const context = React.useContext(TableContext);
  if (context === undefined) {
    throw new Error(`useEaseTableContext must be used within a Provider`);
  }
  return context;
}
