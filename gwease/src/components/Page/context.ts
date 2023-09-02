import { createContext } from "react";
import { PageViewProps, PageContainer } from "./types";

const DefaultPageProps: PageViewProps = {} as PageViewProps;

export const DefaultPageContainer = { state: {}, currentPageKey: `${new Date().getTime()}` } as any;

export const PageContext = createContext<PageViewProps>(DefaultPageProps);

export const PageContainerContext = createContext<PageContainer>(DefaultPageContainer);
