/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
  }
}
declare module '*.avif' {
  const src: string;
  export default src;
}
declare module '*.bmp' {
  const src: string;
  export default src;
}
declare module '*.gif' {
  const src: string;
  export default src;
}
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module '*.jpeg' {
  const src: string;
  export default src;
}
declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.webp' {
  const src: string;
  export default src;
} // declare module '*.svg' {
//   import * as React from 'react';
//   export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & {title?: string}>;
//   const src: string;
//   export default src;
// }

declare module '*.svg' {
  const content: SvgrComponent;
  export default content;
}
declare module '*.module.css' {
  const classes: {
    readonly [key: string]: string;
  };
  export default classes;
}
declare module '*.module.scss' {
  const content: {
    readonly [key: string]: string;
  };
  export default content;
}
declare module '*.module.sass' {
  const classes: {
    readonly [key: string]: string;
  };
  export default classes;
}
declare module '*.scss' {
  const classes: {
    [key: string]: string;
  };
  export default classes;
}
declare module '*.css';
declare interface Window {
  portalHandlers: any;
  linkProcessByName: any;
  systemPictures: any;
  aappAmbariConfigs: any;
  getTabUniqueKey: any;
  __STARTED_BY_QIANKUN__: boolean;
  runtime: Record<string, any>;
  portalConfigs: {
    [key: string]: any;
  };
  console: NodeJS.cons;
} // declare module 'axios' {
//   export interface AxiosInstance {
//     <T = any>(config: AxiosRequestConfig): Promise<T>;
//     request<T = any>(config: AxiosRequestConfig): Promise<T>;
//     get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
//     delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
//     head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
//     post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
//     put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
//     patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
//   }
// }