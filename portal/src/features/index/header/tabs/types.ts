export interface Tab {
  path: string;
  pathname: string;
  title?: string;
  key: string;
  params?: Record<string, any>;
  search?: string; // search?: Record<string,any>;

  code?: string;
  menuId?: number;
  options?: Record<string, any>;
}
export interface SessionTabs {
  tabs: Tab[];
  activeTab: Tab;
}
export interface TabInterface {
  closeTab: (path?: string) => void;
  modifyTabTitle: (path: string, title: string) => void;
}
export interface UseTabsProps {
  flatMenuMapById: {
    [key: string]: any;
  };
  localRoutes: {
    [key: string]: any;
  };
  onLocationChangeCallback?: (tab: Tab | null, prevTab?: Tab | null) => void;
  tab: React.MutableRefObject<null | TabInterface>;
  getTabUniqueKey: GetTabUniqueKey;
}
export type GetTabUniqueKey = {
  [key: string]: ({
    pathname,
    search
  }: {
    pathname: string;
    search: string;
  }) => string;
};