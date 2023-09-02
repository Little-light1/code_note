import {Tab} from '@/features/index/header/tabs/types';

export interface BootstrapMicroProps {
    routes?: Record<
        string,
        {
            path: string;
            title?: string;
            basePath?: string;
        }
    >;
    runtime: any;
    app: string;
}
export interface OnLocationChangeProps {
    tab: Tab | null;
    prevTab?: Tab | null;
}
export interface EventsCache<T = void | Promise<void>> {
    [key: string]: {
        [key: string]: (props: any) => T;
    };
}
